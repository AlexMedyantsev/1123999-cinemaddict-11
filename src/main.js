import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {getMovieDetails} from "./components/movie-details.js";
import {createCardTemplate} from "./components/card.js";
import {generateCards} from "./mock/card.js";
import {getFilmsExtraElement} from "./components/films-extra.js";
import {createBoardTemplate} from "./components/board.js";
import {getFooterMoviesAmount} from "./components/footer-movies-amount.js";
import {generateFilters} from "./mock/filter.js";
import {generateSortings} from "./mock/sorting.js";
import {getUserRank} from "./components/user-rank.js";
import {getShowMoreFilmsButton} from "./components/load-more-button.js";


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, getUserRank());

const filters = generateFilters();
const sortings = generateSortings();

let showingCardsCount = 5;
const CARDS_COUNT = 15;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

const cards = generateCards(CARDS_COUNT);

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

if (cards.length > 5) {
  render(siteFilmsRegularList, getShowMoreFilmsButton());
}

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
