import AbstractComponent from "./abstract-component.js";


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

export default class Sorting extends AbstractComponent {
  constructor(sortings) {
    super();
    this._sortings = sortings;
  }

  getTemplate() {
    return createSortingTemplate(this._sortings);
  }
}
