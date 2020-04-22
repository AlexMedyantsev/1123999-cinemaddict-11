import MovieDetailsPopupComponent from "../components/movie-details.js";
import CardComponent from "../components/card.js";
import NoCardComponent from "../components/no-cards.js";
import FilmsExtraComponent from "../components/films-extra.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {render, remove, RenderPosition} from "../utils/render.js";

const bodyElement = document.querySelector(`body`);

const siteMainElement = document.querySelector(`.main`);

let SHOWING_CARDS_COUNT_ON_START = 5;
let CARDS_COUNT = 15;
let SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const renderExtraCards = (container, cards, title) => {
  const filmsExtraComponent = new FilmsExtraComponent(title);
  render(container, filmsExtraComponent, RenderPosition.BEFOREEND);
  const filmsListContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);
  cards.forEach((card) => {
    renderCard(filmsListContainer, card);
  });
};

const renderCard = (cardListElement, card) => {
  const cardComponent = new CardComponent(card);
  const movieDetailsPopupComponent = new MovieDetailsPopupComponent(card);

  const openPopup = () => {
    bodyElement.appendChild(movieDetailsPopupComponent.getElement());
  };

  const closePopup = () => {
    bodyElement.removeChild(movieDetailsPopupComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      closePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  cardComponent.setClickHandler(`.film-card__poster`, () => {
    document.addEventListener(`keydown`, onEscKeyDown);
    openPopup();
  });

  cardComponent.setClickHandler(`.film-card__comments`, () => {
    document.addEventListener(`keydown`, onEscKeyDown);
    openPopup();
  });


  movieDetailsPopupComponent.setCloseButtonClickHandler(() => {
    closePopup();
  });

  movieDetailsPopupComponent.setKeydownHandler(onEscKeyDown);

  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, cards) => {
  const cardFilmsMainElement = siteMainElement.querySelector(`.films`);
  const cardListElement = boardComponent.getElement().querySelector(`.films-list`);
  const cardListContainerElement = boardComponent.getElement().querySelector(`.films-list__container`);

  if (CARDS_COUNT === 0) {
    render(cardListElement, new NoCardComponent(), RenderPosition.BEFOREEND);
    return;
  }

  let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
  cards.slice(0, showingCardsCount)
    .forEach((card) => {
      renderCard(cardListContainerElement, card);
    });

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  if (cards.length > showingCardsCount) {
    render(cardListElement, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      const previousCardCount = showingCardsCount;
      showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

      cards.slice(previousCardCount, showingCardsCount)
        .forEach((card) => renderCard(cardListContainerElement, card));

      if (showingCardsCount >= cards.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }

  const getTopRated = (array) => {
    return (array.sort((a, b) => {
      return b.rating - a.rating;
    }).slice(0, 2));
  };

  const getTopCommented = (array) => {
    return (array.sort((a, b) => {
      return b.comments.length - a.comments.length;
    }).slice(0, 2));
  };

  renderExtraCards(cardFilmsMainElement, getTopRated(cards), `Top Rated`);
  renderExtraCards(cardFilmsMainElement, getTopCommented(cards), `Most Commented`);
};

export default class BoardComponent {
  constructor(container) {
    this._container = container;
  }

  render(cards) {
    renderBoard(this._container, cards);
  }
}
