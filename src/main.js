import {getMoviesFilters} from "./components/filter.js";
import {getMoviesSorting} from "./components/sorting.js";
import {getMovieDetails} from "./components/movie-details.js";
export {getMoviesCards} from "./components/card.js";
import {getMoviesBoardTemplate} from "./components/board.js";
import {getFooterMoviesAmount} from "./components/footer-movies-amount.js";
// import {getUserRank} from "./components/footer-movies-amount.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
// render(siteHeaderElement, getUserRank());

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, getMoviesSorting());
render(siteMainElement, getMoviesFilters());
render(siteMainElement, getMoviesBoardTemplate());


const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, getFooterMoviesAmount());

render(document.body, getMovieDetails());
