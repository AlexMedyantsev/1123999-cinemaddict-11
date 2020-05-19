import moment from "moment";

const getRandomIntegerNumber = (min, max) => {
  return Math.floor((Math.random() * (max - min) + min));
};

const getZeroOrOne = () => {
  return Math.random() > 0.5;
};

const getRandomArrayItem = (array) => {
  const randomIndex = (getRandomIntegerNumber(0, array.length - 1));

  return array[randomIndex];
};

const getMockTime = () => {
  return 10;
};

const getRandomDate = () => {
  // return Date.now() - getRandomIntegerNumber(1000000, 1000000000000);
  return moment();
};

const generateRandomDate = () => {
  return Math.random() * moment().format(`LL`);
};

const topRatedFilmsShowed = 2;
const getTopRated = (array) => {

  const topRatedFilms = (array.slice().sort((a, b) => {
    return b.rating - a.rating;
  }).slice(0, topRatedFilmsShowed));

  return topRatedFilms;
};

const topCommentedFilmsShowed = 2;
const getTopCommented = (array) => {

  const topCommentedFilms = ((array.slice().sort((a, b) => {
    return b.comments.length - a.comments.length;
  }).slice(0, topCommentedFilmsShowed)));

  return topCommentedFilms;
};

const getPropertyCount = (array, property) => array.filter((element) => element[property]).length;

export {getRandomIntegerNumber, generateRandomDate, getPropertyCount, getZeroOrOne, getRandomArrayItem, getMockTime, getRandomDate, getTopRated, getTopCommented};
