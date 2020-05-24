import moment from "moment";
import momentDurationFormatSetup from 'moment-duration-format';
import {TimeToken} from "../const";
import {MoviesNumberWatched, ProfileRank} from "../const.js";
momentDurationFormatSetup(moment);

export const getProfileRating = (countWatched) => {
  if (countWatched <= MoviesNumberWatched.NOVICE) {
    return ProfileRank.NOVICE;
  } else if (countWatched <= MoviesNumberWatched.FAN) {
    return ProfileRank.FAN;
  } else if (countWatched > MoviesNumberWatched.FAN) {
    return ProfileRank.MOVIE_BUFF;
  }
  return ``;
};

export const getFormattedTime = (date, timeToken) => {
  return moment(date).format(timeToken);
};

export const getFilmDuration = (movieDuration) => {
  return moment.duration(movieDuration, `minutes`).format(TimeToken.TIME);
};

export const getLimitString = (string, maxLength, lastSymbol = `...`) => {
  return string.length > maxLength
    ? string.substr(0, maxLength - lastSymbol.length) + lastSymbol
    : string;
};

const topRatedFilmsShowed = 2;

export const getTopRated = (array) => {

  const topRatedFilms = (array.slice().sort((a, b) => {
    return b.rate - a.rate;
  }).slice(0, topRatedFilmsShowed));

  return topRatedFilms;
};

export const topCommentedFilmsShowed = 2;
export const getTopCommented = (array) => {

  const topCommentedFilms = ((array.slice().sort((a, b) => {
    return b.comments.length - a.comments.length;
  }).slice(0, topCommentedFilmsShowed)));

  return topCommentedFilms;
};

export const getPropertyCount = (array, property) => array.filter((element) => element[property]).length;
