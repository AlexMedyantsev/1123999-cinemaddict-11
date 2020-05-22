import Movie from "./models/movie.js";
import Comment from "./models/comment.js";

const SERVER_URL = `https://11.ecmascript.pages.academy/cinemaddict`;


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

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


// import Movie from "./models/movie.js";
// import Comment from "./models/comment.js";

// const METHODS = {
//   GET: `GET`,
//   PUT: `PUT`,
//   POST: `POST`,
//   DELETE: `DELETE`,
// };

// const checkStatus = (response) => {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   } else {
//     throw new Error(`${response.status}: ${response.statusText}`);
//   }
// };

// const SERVER_URL = `https://11.ecmascript.pages.academy/cinemaddict`;
// export default class API {
//   constructor(authorization) {
//     this._authorization = authorization;
//   }

//   getMovies() {
//     const headers = new Headers();
//     headers.append(`Authorization`, this._authorization);
//     return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
//       .then(checkStatus)
//       .then((response) => response.json())
//       .then(Movie.parseMovies);
//   }

//   getComments(id) {
//     return this._load({url: `comments/${id}`})
//       .then((response) => response.json())
//       .then((response) => response.map((element) => Comment.parseComment(element)));
//   }

//   updateMovie(id, data) {
//     const headers = new Headers();
//     headers.append({'Content-Type': `application/json`});

//     return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/${id}`, {
//       method: `PUT`,
//       body: JSON.stringify(data.toRAW),
//       headers,
//     })
//       .then(checkStatus)
//       .then((response) => response.json())
//       .then(Movie.parseMovie(data));
//   }

//   _load({url, method = METHODS.GET, data = null, headers = new Headers()}) {
//     headers.append(`Authorization`, this._authorization);
//     return fetch(`${SERVER_URL}/${url}`, {headers})
//       .then(checkStatus)
//       .catch((error) => {
//         throw error;
//       });
//   }
// };
