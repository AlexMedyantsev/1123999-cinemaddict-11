const sortingNames = [`Sort by default`, `Sort by date`, `Sort by rating`];

const generateSortings = () => {
  return sortingNames.map((item) => {
    return {
      name: item,
    };
  });
};

export {generateSortings};

