import {createElement} from "../utils.js";

const createNoTasksTemplate = () => {
  return (
    `<h2 class="films-list__title">
      There are no movies in our database
    </h2>`
  );
};

export default class NoTasks {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoTasksTemplate();
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
