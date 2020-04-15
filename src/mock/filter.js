const filterNames = [`Watchlist`, `History`, `Favorites`];

const generateFilters = (cards) => {
  return filterNames.map((name) => {
    return {
      name,
      count: getFilterCount(name, cards),
    };
  });
};

const getFilterCount = (name, cards) => {
  switch (name) {
    case `Favorites`:
      return cards.filter((card) => card.isFavorite).length;
    case `History`:
      return cards.filter((card) => card.isInHistory).length;
    case `Watchlist`:
      return cards.filter((card) => card.isInWatchlist).length;
    default: return 0;
  }
};

export {generateFilters};
