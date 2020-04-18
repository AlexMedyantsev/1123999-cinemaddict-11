import {createElement} from "../utils.js";

export const getShowMoreFilmsButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getShowMoreFilmsButton();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._element));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
