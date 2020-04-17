import {createElement} from "./utils.js";

const createSortingMarkup = (name) => {
  return (
    `<li><a href="#" class="sort__button">${name}</a></li>`
  );
};

export const createSortingTemplate = (sortElements) => {
  const sortingMarkup = sortElements.map((item) => createSortingMarkup(item.name)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortingMarkup}
    </ul>`
  );
};

export default class Sorting {
  constructor(sortings) {
    this._sortings = sortings;
    this._element = null;
  }

  getTemplate() {
    return createSortingTemplate(this._sortings);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

