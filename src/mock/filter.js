const filterNames = [`Watchlist`, `History`, `Favorites`];

const generateFilters = (filterCount) => {
  return filterNames.map((name) => {
    return {
      name,
      count: filterCount,
    };
  });
};

export {generateFilters};

