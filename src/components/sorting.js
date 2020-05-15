import AbstractSmartComponent from "./abstract-smart-component.js";

export const SortType = {
  RATING: `rating`,
  DATE: `date`,
  DEFAULT: `default`,
};

export const createSortingTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#"  data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#"  data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#"  data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sorting extends AbstractSmartComponent {
  constructor() {
    super();
    this._sortTypeChangeHandler = null;

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setDefaultSortType() {
    this._currentSortType = SortType.DEFAULT;
    this.rerender();
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }


  setSortTypeChangeHandler(handler) {
    this._sortTypeChangeHandler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();


      const activeFilter = this.getElement().querySelector(`.sort__button--active`);
      activeFilter.classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
