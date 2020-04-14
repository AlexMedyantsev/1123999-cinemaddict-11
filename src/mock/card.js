import {getRandomArrayItem, getRandomIntegerNumber, getMockTime} from "../components/utils.js";
import {generateCommentList} from "./comments.js";

const titleItems = [`Interstellar`, `Inception`, `Prestige`, `Forrest Gump`, `Godfather`, `Once in America`, `The Shawshank Redemption`];
const genreItems = [`Musical`, `Comedy`, `Drama`, `Sci-fi`, `Horror`, `Adventure`];
const posterItems = [`./images/posters/the-dance-of-life.jpg`, `./images/posters/made-for-each-other.png`, `./images/posters/popeye-meets-sinbad.png`, `./images/posters/sagebrush-trail.jpg`, `./images/posters/the-great-flamarion.jpg`];
const descriptionItems = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, ` Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`, ` Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];

const generateCard = () => {
  return {
    title: getRandomArrayItem(titleItems),
    rating: getRandomIntegerNumber(5, 10, 1),
    year: getRandomIntegerNumber(1900, 2019),
    duration: getMockTime(),
    genre: getRandomArrayItem(genreItems),
    poster: getRandomArrayItem(posterItems),
    description: getRandomArrayItem(descriptionItems),
    comments: generateCommentList(getRandomIntegerNumber(0, 10)),
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCard, generateCards};
