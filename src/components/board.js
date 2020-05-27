import AbstractComponent from "./abstract-component.js";
import {HIDDEN_CLASS} from "../const.js";

export const createBoardTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">Loading...</h2>
        <div class="films-list__container"></div>
      </section>
    </section>`
  );
};


export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate(this._movieLoadStatus);
  }

  hideLoadMessage() {
    this.getElement().querySelector(`.films-list__title`).classList.add(HIDDEN_CLASS);
  }
}
