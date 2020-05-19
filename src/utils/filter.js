import {FilterType, FilterChartType} from "../const.js";
import moment from "moment";

export const getMoviesByFilter = (movies, filter) => {
  switch (filter) {
    case FilterType.WATCHLIST:
      return movies.filter((movie) => movie.isInWatchlist);
    case FilterType.HISTORY:
      return movies.filter((movie) => movie.isInHistory);
    case FilterType.FAVORITES:
      return movies.filter((movie) => movie.isFavorite);
    default: return movies;
  }
};

export const getMoviesByChartFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterChartType.ALL:
      return movies;
    case FilterChartType.TODAY:
      return movies.filter((movie) => moment().diff(movie.watchingDate, `days`) === 0);
    case FilterChartType.WEEK:
      return movies.filter((movie) => moment().diff(movie.watchingDate, `days`) <= 0);
    case FilterChartType.MONTH:
      return movies.filter((movie) => moment().diff(movie.watchingDate, `days`) <= 31);
    case FilterChartType.YEAR:
      return movies.filter((movie) => moment().diff(movie.watchingDate, `days`) <= 364);
  }

  return movies;
};
