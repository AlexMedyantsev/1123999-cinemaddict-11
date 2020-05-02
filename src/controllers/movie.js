import MovieDetailsPopupComponent from "../components/movie-details.js";
import CardComponent from "../components/card.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const bodyElement = document.querySelector(`body`);
const mode = {
  DEFAULT: `default`,
  OPENED: `opened`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = mode.DEFAULT;

    this._cardComponent = null;
    this._movieDetailsPopupComponent = null;
  }

  setDefaultView() {
    if (this._mode === mode.OPENED) {
      this.closePopup();
    }
  }

  closePopup() {
    bodyElement.removeChild(this._movieDetailsPopupComponent.getElement());
    this._movieDetailsPopupComponent.removeElement();
    this._movieDetailsPopupComponent = null;
    this._mode = mode.DEFAULT;
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    this._cardComponent = new CardComponent(card);

    const openPopup = () => {
      bodyElement.appendChild(this._movieDetailsPopupComponent.getElement());
      this._mode = mode.OPENED;
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        this.closePopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._cardComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
      }));
    });

    this._cardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isInHistory: !card.isInHistory,
      }));
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    this._cardComponent.setClickHandler(() => {
      document.addEventListener(`keydown`, onEscKeyDown);
      this._movieDetailsPopupComponent = new MovieDetailsPopupComponent(card);
      this._movieDetailsPopupComponent.setWatchedInPopupClickHandler(() => {
        this._onDataChange(this, card, Object.assign({}, card, {
          isInHistory: !card.isInHistory,
        }));
      });

      this._movieDetailsPopupComponent.setWatchlistInPopupClickHandler(() => {
        this._onDataChange(this, card, Object.assign({}, card, {
          isInWatchlist: !card.isInWatchlist,
        }));
      });

      this._movieDetailsPopupComponent.setFavoriteInPopupClickHandler(() => {
        this._onDataChange(this, card, Object.assign({}, card, {
          isFavorite: !card.isFavorite,
        }));
      });

      this._onViewChange();
      openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
      this._movieDetailsPopupComponent.setCloseButtonClickHandler(() => {
        this.closePopup();
      });
    });

    if (oldCardComponent) {
      replace(oldCardComponent, this._cardComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }
}
