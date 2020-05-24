import Movie from "./models/movie.js";
import Comment from "./models/comment.js";
import {Method, SERVER_URL} from "./const.js";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor(token) {
    this._token = token;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(movie.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})})
        .then((response) => response.json())
        .then(Movie.parseMovie);
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
    .then((response) => response.json())
    .then(Comment.parseComments);
  }

  createComment(filmId, data) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})})
        .then((response) => response.json());
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._token);

    return fetch(`${SERVER_URL}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
