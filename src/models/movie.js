import moment from "moment";

export default class Movie {
  constructor(data) {
    this.id = data.id;
    this.title = data.film_info.title;
    this.alternativeTitle = data.film_info.alternative_title;
    this.rate = data.film_info.total_rating;
    this.poster = data.film_info.poster;
    this.description = data.film_info.description;
    this.genres = data.film_info.genre;
    this.isInWatchlist = data.user_details.watchlist;
    this.isWatched = data.user_details.already_watched;
    this.isFavorite = data.user_details.favorite;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.releaseDate = new Date(data.film_info.release.date);
    this.country = data.film_info.release.release_country;
    this.duration = data.film_info.runtime;
    this.age = data.film_info.age_rating;
    this.comments = data.comments;
    this.watchingDate = data.user_details.watching_date;
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.alternativeTitle,
        "total_rating": this.rate,
        "poster": this.poster,
        "age_rating": this.age,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate.toISOString(),
          "release_country": this.country,
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.isInWatchlist,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate,
        "favorite": this.isFavorite
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static cloneData(data) {
    return new Movie(data.toRAW());
  }
}
