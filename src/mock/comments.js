import {getRandomArrayItem, getRandomDate} from "../utils/common.js";


const textItems = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, ` Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`, ` Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];
const authorItems = [`authorX`, `authorY`, `authorZ`, `authorA`];
const emojiItems = [`smile`, `sleeping`, `puke`, `angry`];

const generateComment = (commentsArray) => {
  const id = (Date.now() + Math.random()) + ``;
  commentsArray.push({
    id,
    text: getRandomArrayItem(textItems),
    author: getRandomArrayItem(authorItems),
    emoji: getRandomArrayItem(emojiItems),
    date: getRandomDate(),
  });

  return id;
};

export const generateCommentList = (count, commentsArray) => {
  return new Array(parseInt(count, 10))
    .fill(``)
    .map(() => {
      return generateComment(commentsArray);
    });
};
