const sortingNames = [`Sort by default`, `Sort by date`, `Sort by rating`];

const generateSortings = () => {
  return sortingNames.map((it) => {
    return {
      name: it,
    };
  });
};

export {generateSortings};

