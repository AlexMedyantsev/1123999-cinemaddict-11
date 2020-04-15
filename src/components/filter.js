const createFilterMarkup = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) =>
    createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
       <div class="main-navigation__items">
       <a href="#All" class="main-navigation__item">All Movies</a>

         ${filtersMarkup}
       </div>
       <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
