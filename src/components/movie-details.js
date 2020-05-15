import AbstractSmartComponent from "./abstract-smart-component.js";
import {KeyCode} from "../const.js";
import {encode} from "he";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const getFilmDetails = ({title, rating, year, duration, poster, description, isFavorite, isInHistory, isInWatchlist}, {emoji, comments, commentText}) => {
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">18+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: The Great Flamarion</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">Anthony Mann</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${year}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">USA</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">Drama</span>
                    <span class="film-details__genre">Film-Noir</span>
                    <span class="film-details__genre">Mystery</span></td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" ${isInWatchlist ? `checked` : ``} name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" ${isInHistory ? `checked` : ``} name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" ${isFavorite ? `checked` : ``} name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">

            <ul class="film-details__comments-list">
              ${createCommentTemplate(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">${renderEmoji(emoji)}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText ? commentText : ``}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${emoji === `smile` ? `checked` : ``} type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${emoji === `sleeping` ? `checked` : ``} type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${emoji === `puke` ? `checked` : ``} type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${emoji === `angry` ? `checked` : ``} type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

const renderEmoji = (emoji) => {
  return emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji"></img>` : ``;
};

const createCommentTemplate = (comments) => {
  return comments.map((item) => {
    return (`<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${item.emoji}.png" width="55" height="55" alt="emoji-${item.emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${item.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${item.author}</span>
        <span class="film-details__comment-day">${new Date(item.date)}</span>
        <button class="film-details__comment-delete" id=${item.id}>Delete</button>
      </p>
    </div>
  </li>`);
  }).join(`\n`);
};

export default class Popup extends AbstractSmartComponent {
  constructor(filmDetails) {
    super();
    this._filmDetails = filmDetails;
    this._comments = this._filmDetails.comments;

    this.emoji = null;
    this._mode = Mode.DEFAULT;
    this._subscribeOnEvents();
  }

  updateLocalState(comments) {
    this._comments = comments;
    this.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setCloseButtonClickHandler(this.closeButtonClickHandler);
    this.setDeleteCommentClickHandler(this._deleteCommentClickHandler);
    this.setSubmitCommentOnEnterHandler(this._submitCommentOnEnterHandler);
  }

  setWatchlistInPopupClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).
      addEventListener(`click`, handler);
  }

  setWatchedInPopupClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).
      addEventListener(`click`, handler);
  }

  setFavoriteInPopupClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).
      addEventListener(`click`, handler);
  }

  setDeleteCommentClickHandler(handler) {
    this._deleteCommentClickHandler = handler;
    this.getElement().querySelector(`.film-details__comments-list`).
      addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler(evt.target.id);
      });
  }

  setSubmitCommentOnEnterHandler(handler) {
    this._submitCommentOnEnterHandler = handler;
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    commentInput.addEventListener(`keydown`, (evt) => {
      if (evt.keyCode === KeyCode.ENTER && (evt.metaKey || KeyboardEvent.ctrlKey) && this.emoji && this.commentText) {
        const id = (Date.now() + Math.random() + ``);
        const newComment = {
          id,
          text: encode(this.commentText),
          author: `Me`,
          emoji: this.emoji,
          date: Date.now(),
        };
        this.commentText = ``;
        handler(newComment);
      }
    });
  }

  _subscribeOnEvents() {
    const setEmojiClickHandler = (event) => {
      this.emoji = event.target.value;
      this.rerender();
    };

    const setCommentChangeHandler = (event) => {
      this.commentText = event.target.value;
    };

    this.getElement().querySelector(`.film-details__emoji-list`).
      addEventListener(`change`, setEmojiClickHandler);

    this.getElement().querySelector(`.film-details__comment-input`).
      addEventListener(`keyup`, setCommentChangeHandler);
  }

  getTemplate() {
    return getFilmDetails(this._filmDetails, {emoji: this.emoji, comments: this._comments, commentText: this.commentText});
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
    this.closeButtonClickHandler = handler;
  }

  removeCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, handler);
  }
}
