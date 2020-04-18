import {createElement} from './utils.js';

const getFilmsExtraElement = (title, films) => {
  return (
    `<section class="films-list--extra">
    <h2 class="films-list__title">${title}</h2>

    <div class="films-list__container">
      ${films}
    </div>
  </section>`
  );
};

export default class extraFilm {
  constructor(title, films) {
    this._element = null;
    this._title = title;
    this._films = films;
  }

  getTemplate() {
    return getFilmsExtraElement(this._title, this._films);
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
