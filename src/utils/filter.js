import {FilterType} from "../const.js";

export const getMoviesByFilter = (movies, filter) => {
  switch (filter) {
    case FilterType.WATCHLIST:
      return movies.filter((movie) => movie.isInWatchlist);
    case FilterType.HISTORY:
      return movies.filter((movie) => movie.isInHistory);
    case FilterType.FAVORITE:
      return movies.filter((movie) => movie.isFavorite);
    default: return movies;
  }
};
