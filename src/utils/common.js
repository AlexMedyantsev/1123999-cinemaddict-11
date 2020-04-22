const getRandomIntegerNumber = (min, max, afterCommaNumbers = 0) => {
  return (Math.random() * (max - min) + min).toFixed(afterCommaNumbers);
};

const getZeroOrOne = () => {
  return Math.random() > 0.5;
};

const getRandomArrayItem = (array) => {
  const randomIndex = (getRandomIntegerNumber(0, array.length - 1));

  return array[randomIndex];
};

const getMockTime = () => {
  const hours = getRandomIntegerNumber(1, 3);
  const minutes = getRandomIntegerNumber(1, 59);

  return (`${hours}h ${minutes}m`);
};

const getRandomDate = () => {
  return Date.now() - getRandomIntegerNumber(1000000, 1000000000000);
};

export {getRandomIntegerNumber, getZeroOrOne, getRandomArrayItem, getMockTime, getRandomDate};
