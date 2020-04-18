import FilterComponent from "./components/filter.js";
import MovieDetailsPopupComponent from "./components/movie-details.js";
import CardComponent from "./components/card.js";
import FilmsExtraComponent from "./components/films-extra.js";
import BoardComponent from "./components/board.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import SortingComponent from "./components/sorting.js";
import UserRankComponent from "./components/user-rank.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import {generateFilters} from "./mock/filter.js";
import {generateSortings} from "./mock/sorting.js";
import {generateCards} from "./mock/card.js";
import {render, RenderPosition} from "./components/utils.js";

let showingCardsCount = 5;
const CARDS_COUNT = 15;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

const cards = generateCards(CARDS_COUNT);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, getUserRank());

const filters = generateFilters(cards);
const sortings = generateSortings();

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createSortingTemplate(sortings));
render(siteMainElement, createBoardTemplate());
const siteFilmsElement = siteMainElement.querySelector(`.films`);
const siteFilmsRegularList = siteMainElement.querySelector(`.films-list`);
const siteFilmsRegularListContainer = siteFilmsRegularList.querySelector(`.films-list__container`);


// Рендерит карточки в главный блок
cards.slice(0, showingCardsCount)
  .forEach((card) => render(siteFilmsRegularListContainer, createCardTemplate(card), `beforeend`));

// renderCards();


if (cards.length > showingCardsCount) {
  render(siteFilmsRegularList, getShowMoreFilmsButton());
  const loadMoreFilmsButton = siteMainElement.querySelector(`.films-list__show-more`);

  loadMoreFilmsButton.addEventListener(`click`, () => {

    let previousCardsCount = showingCardsCount;
    showingCardsCount += SHOWING_TASKS_COUNT_BY_BUTTON;

    cards.slice(previousCardsCount, showingCardsCount)
      .forEach((card) => render(siteFilmsRegularListContainer, createCardTemplate(card), `beforeend`));

    if (showingCardsCount >= cards.length) {
      loadMoreFilmsButton.remove();
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

const topRatedFilms = getTopRated(cards).map((item) => {
  return createCardTemplate(item);
}).join(`\n`);

const topCommentedFilms = getTopCommented(cards).map((item) => {
  return createCardTemplate(item);
}).join(`\n`);

render(siteFilmsElement, getFilmsExtraElement(`Top Rated`, topRatedFilms, `beforeend`));
render(siteFilmsElement, getFilmsExtraElement(`Most Commented`, topCommentedFilms, `beforeend`));


const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, getFooterMoviesAmount(CARDS_COUNT));

render(document.body, getMovieDetails(cards[0]));
