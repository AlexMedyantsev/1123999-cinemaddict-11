import moment from "moment";
import momentDurationFormatSetup from 'moment-duration-format';
import {TimeToken} from "../const";
momentDurationFormatSetup(moment);

export const getRandomIntegerNumber = (min, max) => {
  return Math.floor((Math.random() * (max - min) + min));
};

export const getZeroOrOne = () => {
  return Math.random() > 0.5;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = (getRandomIntegerNumber(0, array.length - 1));

  return array[randomIndex];
};

export const getMockTime = () => {
  return 10;
};

export const getRandomDate = () => {
  // return Date.now() - getRandomIntegerNumber(1000000, 1000000000000);
  return moment();
};

export const generateRandomDate = () => {
  return Math.random() * moment().format(`LL`);
};

const NumberMoviesWatched = {
  NOVICE: 10,
  FAN: 20
};

const ProfileRank = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export const getProfileRating = (countWatched) => {
  if (countWatched <= NumberMoviesWatched.NOVICE) {
    return ProfileRank.NOVICE;
  } else if (countWatched <= NumberMoviesWatched.FAN) {
    return ProfileRank.FAN;
  } else if (countWatched > NumberMoviesWatched.FAN) {
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
