import AbstractComponent from "./abstract-component.js";
import {MenuMode} from "../const.js";

export const MenuItem = {
  STATISTICS: `control__statistic`,
  MOVIES: `control__task`,
};

const createFilterMarkup = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item" id="filter__${name}">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

export const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) =>
    createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<nav class="main-navigation">
       <div class="main-navigation__items">
       <a href="#All" class="main-navigation__item main-navigation__item--active" id="filter__All">All Movies</a>
         ${filtersMarkup}
       </div>
       <a href="#stats" class="main-navigation__additional" id="filter__${MenuMode.STATISTICS}">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const activeFilter = this.getElement().querySelector(`.main-navigation__item--active`);
      activeFilter.classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);
      const clickedFilter = evt.target;
      const clickedFilterLink = clickedFilter.id;
      handler(clickedFilterLink.slice(8));
    });
  }
}
