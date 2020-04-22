import FilterComponent from "./components/filter.js";
import MovieDetailsPopupComponent from "./components/movie-details.js";
import CardComponent from "./components/card.js";
import NoCardComponent from "./components/no-cards.js";
import FilmsExtraComponent from "./components/films-extra.js";
import BoardComponent from "./components/board.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import SortingComponent from "./components/sorting.js";
import UserRankComponent from "./components/user-rank.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import {generateFilters} from "./mock/filter.js";
import {generateSortings} from "./mock/sorting.js";
import {generateCards} from "./mock/card.js";
import {render, replace, remove, RenderPosition} from "./utils/render.js";

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

  const filmPoster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const filmCardComment = cardComponent.getElement().querySelector(`.film-card__comments`);
  const closePopupButton = movieDetailsPopupComponent.getElement().querySelector(`.film-details__close-btn`);

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

  filmPoster.addEventListener(`click`, () => {
    document.addEventListener(`keydown`, onEscKeyDown);
    openPopup();
  });

  filmCardComment.addEventListener(`click`, () => {
    document.addEventListener(`keydown`, onEscKeyDown);
    openPopup();
  });


  closePopupButton.addEventListener(`click`, () => {
    closePopup();
  });

  closePopupButton.addEventListener(`keydown`, onEscKeyDown);

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

    loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
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

// BODY
const bodyElement = document.querySelector(`body`);
// HEADER
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserRankComponent(), RenderPosition.BEFOREEND);

// MAIN
const siteMainElement = document.querySelector(`.main`);

const cards = generateCards(CARDS_COUNT);
const filters = generateFilters(cards);
const sortings = generateSortings();

render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingComponent(sortings), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
renderBoard(boardComponent, cards);

// FOOTER
const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, new FooterMoviesComponent(CARDS_COUNT), RenderPosition.BEFOREEND);
