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

const renderExtraCards = (container, sortedCards, title, onDataChange, onViewChange) => {
  let filmsExtraComponent = new FilmsExtraComponent(title);
  render(container, filmsExtraComponent, RenderPosition.BEFOREEND);
  const filmsListContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);

  return renderCards(filmsListContainer, sortedCards, onDataChange, onViewChange);
};

const renderCards = (cardListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(cardListElement, onDataChange, onViewChange);

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
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._showedMovieControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
    this._onViewChange = this._onViewChange.bind(this);


    this._movieController = [];
    this._noCardsComponent = new NoCardsComponent();
    this._cardComponent = new CardComponent();
    this._sortingComponent = new SortingComponent();
    this._filterComponent = null;
    this._sortedCards = [];
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const cards = this._moviesModel.getMovies();
    this._sortedCards = cards.slice();

    const filters = generateFilters(cards);
    this._filterComponent = new FilterComponent(filters);

    render(siteMainElement, this._sortingComponent, RenderPosition.AFTERBEGIN);
    render(siteMainElement, this._filterComponent, RenderPosition.AFTERBEGIN);

    this._renderCards(cards.slice(0, this._showingCardsCount));
    this._renderExtraCards(cards.slice());

    this._renderLoadMoreButton();

    // renderExtraCards(container, getTopRated(cards), `Top Rated`, this._onDataChange, this._onViewChange);
    // renderExtraCards(container, getTopCommented(cards), `Most Commented`, this._onDataChange, this._onViewChange);
  }

  _renderCards(cards) {
    const container = this._container.getElement();
    const cardListElement = container.querySelector(`.films-list__container`);

    const newCards = renderCards(cardListElement, cards, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newCards);
  }

  _renderExtraCards(cards) {
    const container = this._container.getElement();

    const newExtraCards = renderExtraCards(container, getTopRated(cards), `Top Rated`, this._onDataChange, this._onViewChange);
    const newExtraCards1 = renderExtraCards(container, getTopCommented(cards), `Most Commented`, this._onDataChange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newExtraCards, newExtraCards1);
  }

  _renderLoadMoreButton() {
    // remove(this._loadMoreButtonComponent);

    const container = this._container.getElement();
    const cardListElement = container.querySelector(`.films-list__container`);
    const loadMoreButtonContainer = container.querySelector(`.films-list`);

    if (this._moviesModel.getMovies().length === 0) {
      render(cardListElement, this._noCardsComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._moviesModel.getMovies().length > this._showingCardsCount) {
      render(loadMoreButtonContainer, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const previousCardsCount = this._showingCardsCount;
        this._showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

        const sortedCards = this._sortedCards.slice(previousCardsCount, this._showingCardsCount);

        renderCards(cardListElement, sortedCards, this._onDataChange, this._onViewChange);

        if (this._showingCardsCount >= this._moviesModel.getMovies().length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }

  _onDataChange(cardController, oldData, newData) {
    const isSuccess = this._moviesModel.updateMovies(oldData.id, newData);

    if (isSuccess) {
      cardController.render(newData);
    }
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((movie) => {
      movie.setDefaultView();
    });
  }

  _onSortTypeChange(sortType) {
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    this._sortedCards = getSortedCards(this._moviesModel.getMovies(), sortType);
    const container = this._container.getElement();
    const cardListElement = container.querySelector(`.films-list__container`);

    cardListElement.innerHTML = ``;

    if (!this._container.getElement().querySelector(`.films-list__show-more`)) {
      this._renderLoadMoreButton();
    }

    const newCards = renderCards(cardListElement, this._sortedCards.slice(0, 5), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newCards;
  }
}
