import AbstractSmartComponent from "./abstract-smart-component.js";
import {TimeToken} from "../const.js";
import {getFormattedTime, getFilmDuration, getLimitString} from "../utils/common.js";

const MAX_LENGTH_DESCRIPTION = 139;
const createFilmGenre = (genre) => `<span class="film-card__genre">${genre}</span>`;

const createCardTemplate = (card) => {
  const {title, rate, releaseDate, duration, genres, poster, description, comments, isFavorite, isWatched, isInWatchlist} = card;
  const getLimitDescription = getLimitString(description, MAX_LENGTH_DESCRIPTION);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rate}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getFormattedTime(releaseDate, TimeToken.YEAR)}</span>
        <span class="film-card__duration">${getFilmDuration(duration)}</span>
        <span class="film-card__genre">${genres.map(createFilmGenre).join(` `)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getLimitDescription}</p>
      <a class="film-card__comments">${comments.length} comment(s)</a> 
      <form class="film-card__controls">
        <button type="button" class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isInWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
        <button type="button" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
        <button type="button" class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Movie extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`)
      .addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`)
      .addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}

