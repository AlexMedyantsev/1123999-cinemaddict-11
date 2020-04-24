import MovieDetailsPopupComponent from "../components/movie-details.js";
import CardsComponent from "../components/card.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import NoCardsComponent from "../components/no-cards.js";
import {generateFilters} from "../mock/filter.js";
import FilterComponent from "../components/filter.js";
import FilmsExtraComponent from "../components/films-extra.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getTopRated, getTopCommented} from "../utils/common.js";

const bodyElement = document.querySelector(`body`);

const siteMainElement = document.querySelector(`.main`);

let SHOWING_CARDS_COUNT_ON_START = 5;
let SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const renderExtraCards = (container, sortedCards, title) => {
  const filmsExtraComponent = new FilmsExtraComponent(title);
  render(container, filmsExtraComponent, RenderPosition.BEFOREEND);
  const filmsListContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);

  sortedCards.forEach((card) => {
    renderCard(filmsListContainer, card);
  });
};

const renderCard = (cardListElement, card) => {
  const cardComponent = new CardsComponent(card);
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

  cardComponent.setClickHandler(() => {
    document.addEventListener(`keydown`, onEscKeyDown);
    openPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
    movieDetailsPopupComponent.setCloseButtonClickHandler(() => {
      closePopup();
    });
  });

  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

const renderCards = (cardListElement, cards) => {
  cards.forEach((card) => {
    renderCard(cardListElement, card);
  });
};

const getSortedCards = (cards, sortType) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedCards = showingCards;
      break;
    case SortType.RATING:
      sortedCards = showingCards.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DATE:
      sortedCards = showingCards.sort((a, b) => b.year - a.year);
      break;
  }

  return sortedCards;
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noCardsComponent = new NoCardsComponent();
    this._sortingComponent = new SortingComponent();
    this._filterComponent = null;
    this._sortedCards = [];
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(cards) {
    this._sortedCards = cards;
    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    const cardListElement = siteMainElement.querySelector(`.films-list`);
    const cardListContainerElement = siteMainElement.querySelector(`.films-list__container`);

    const renderLoadMoreButton = () => {
      if (cards.length === 0) {
        render(cardListElement, this._noCardsComponent, RenderPosition.BEFOREEND);
        return;
      }

      if (cards.length > showingCardsCount) {
        render(cardListElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

        this._loadMoreButtonComponent.setClickHandler(() => {
          const previousCardsCount = showingCardsCount;
          showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

          const sortedCards = this._sortedCards.slice(previousCardsCount, showingCardsCount);

          renderCards(cardListContainerElement, sortedCards);

          if (showingCardsCount >= cards.length) {
            remove(this._loadMoreButtonComponent);
          }
        });
      }
    };

    const container = this._container.getElement();

    const filters = generateFilters(cards);
    this._filterComponent = new FilterComponent(filters);

    render(siteMainElement, this._sortingComponent, RenderPosition.AFTERBEGIN);
    render(siteMainElement, this._filterComponent, RenderPosition.AFTERBEGIN);

    renderCards(cardListContainerElement, cards.slice(0, showingCardsCount));
    renderLoadMoreButton();

    renderExtraCards(container, getTopRated(cards), `Top Rated`);
    renderExtraCards(this._container.getElement(), getTopCommented(cards), `Most Commented`);

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      showingCardsCount = SHOWING_CARDS_COUNT_BY_BUTTON;

      this._sortedCards = getSortedCards(cards, sortType);
      cardListContainerElement.innerHTML = ``;

      renderCards(cardListContainerElement, this._sortedCards.slice(0, showingCardsCount));
    });
  }
}
