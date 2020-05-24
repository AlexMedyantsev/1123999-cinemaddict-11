import AbstractComponent from "./abstract-component.js";

export const getFooterMoviesCountTemplate = (count) => {
  return (
    `<section class="footer__statistics">
      <p>${count} movies inside</p>
    </section>`
  );
};

export default class FooterMoviesAmount extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return getFooterMoviesCountTemplate(this._count);
  }
}
