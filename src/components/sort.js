import AbstractSmartComponent from "./abstract-smart-component.js";
import {SortType} from "../const.js";

const createSortingTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#"  data-sort-type="${SortType.DEFAULT}" class="sort__button sort__default sort__button--active">Sort by default</a></li>
      <li><a href="#"  data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#"  data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();
    this._sortChangeHandler = null;
    this._activeFilter = null;

    this._currentSortType = SortType.DEFAULT;
    this.setDefaultSortType = this.setDefaultSortType.bind(this);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setDefaultSortType() {
    this._currentSortType = SortType.DEFAULT;
    this._activeFilter = this.getElement().querySelector(`.sort__default`);
    this.rerender();
    this.recoveryListeners();
  }

  recoveryListeners() {
    this.setSortChangeHandler(this._sortChangeHandler);
  }


  setSortChangeHandler(handler) {
    this._sortChangeHandler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._activeFilter = this.getElement().querySelector(`.sort__button--active`);
      this._activeFilter.classList.remove(`sort__button--active`);
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
