import AbstractComponent from "./abstract-component.js";

export const getShowMoreFilmsButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return getShowMoreFilmsButton();
  }
}
