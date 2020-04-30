import SortingComponent, {SortType} from "../components/sorting.js";
import NoCardsComponent from "../components/no-cards.js";
import MovieController from "./movie.js";
import CardComponent from "../components/card.js";
import {generateFilters} from "../mock/filter.js";
import FilterComponent from "../components/filter.js";
import FilmsExtraComponent from "../components/films-extra.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getTopRated, getTopCommented} from "../utils/common.js";

const siteMainElement = document.querySelector(`.main`);

let SHOWING_CARDS_COUNT_ON_START = 5;
let SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const renderExtraCards = (container, sortedCards, title) => {
  const filmsExtraComponent = new FilmsExtraComponent(title);
  render(container, filmsExtraComponent, RenderPosition.BEFOREEND);
  const filmsListContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);

  sortedCards.forEach((card) => {
    renderCards(filmsListContainer, card);
  });
};

const renderCards = (cardListElement, cards, onDataChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(cardListElement, onDataChange);

    movieController.render(card);

    return movieController;
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

    this._cards = [];
    this._showedMovieControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    this._noCardsComponent = new NoCardsComponent();
    this._cardComponent = new CardComponent();
    this._sortingComponent = new SortingComponent();
    this._filterComponent = null;
    this._sortedCards = [];
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;
    this._sortedCards = cards.slice();

    const container = this._container.getElement();
    const cardListElement = container.querySelector(`.films-list__container`);

    const filters = generateFilters(cards);
    this._filterComponent = new FilterComponent(filters);

    render(siteMainElement, this._sortingComponent, RenderPosition.AFTERBEGIN);
    render(siteMainElement, this._filterComponent, RenderPosition.AFTERBEGIN);


    const newCards = renderCards(cardListElement, cards.slice(0, this._showingCardsCount), this._onDataChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
    this._renderLoadMoreButton();

    renderExtraCards(container, getTopRated(cards), `Top Rated`);
    renderExtraCards(container, getTopCommented(cards), `Most Commented`);
  }

  _renderLoadMoreButton() {
    const container = this._container.getElement();
    const cardListElement = container.querySelector(`.films-list__container`);
    const loadMoreButtonContainer = container.querySelector(`.films-list`);

    if (this._cards.length === 0) {
      render(cardListElement, this._noCardsComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._cards.length > this._showingCardsCount) {
      render(loadMoreButtonContainer, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const previousCardsCount = this._showingCardsCount;
        this._showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

        const sortedCards = this._sortedCards.slice(previousCardsCount, this._showingCardsCount);

        renderCards(cardListElement, sortedCards, this._onDataChange);

        if (this._showingCardsCount >= this._cards.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }

  _onDataChange(cardController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    cardController.render(this._cards[index]);
  }

  _onSortTypeChange(sortType) {
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    const sortedCards = getSortedCards(this._cards, sortType);
    const container = this._container.getElement();
    const cardListElement = container.querySelector(`.films-list__container`);

    cardListElement.innerHTML = ``;

    if (this._loadMoreButtonComponent) {
      this._renderLoadMoreButton();
    }

    const newCards = renderCards(cardListElement, sortedCards.slice(0, 5), this._onDataChange);
    this._showedTaskControllers = newCards;
    // this._renderLoadMoreButton();
  }
}
