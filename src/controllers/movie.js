import MovieDetailsPopupComponent from "../components/movie-details.js";
import CardComponent from "../components/card.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const bodyElement = document.querySelector(`body`);


export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._cardComponent = null;
    this._movieDetailsPopupComponent = null;

    // this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    this._cardComponent = new CardComponent(card);

    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);

    const openPopup = () => {
      bodyElement.appendChild(this._movieDetailsPopupComponent.getElement());
    };

    const closePopup = () => {
      bodyElement.removeChild(this._movieDetailsPopupComponent.getElement());
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        closePopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._cardComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isInHistory: !card.isInHistory,
      }));
    });

    this._cardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isInWatchlist: !card.isInWatchlist,
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
      openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
      this._movieDetailsPopupComponent.setCloseButtonClickHandler(() => {
        closePopup();
        this._movieDetailsPopupComponent.removeElement();
        this._movieDetailsPopupComponent = null;
      });
    });

    if (oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }
}
