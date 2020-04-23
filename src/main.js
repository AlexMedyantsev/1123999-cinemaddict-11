import FilterComponent from "./components/filter.js";
import BoardComponent from "./components/board.js";
import PageController from "./controllers/page.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import SortingComponent from "./components/sorting.js";
import UserRankComponent from "./components/user-rank.js";
import {generateFilters} from "./mock/filter.js";
import {generateSortings} from "./mock/sorting.js";
import {generateCards} from "./mock/card.js";
import {render, RenderPosition} from "./utils/render.js";

let CARDS_COUNT = 15;

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
const pageController = new PageController(boardComponent);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
pageController.render(cards);

// FOOTER
const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, new FooterMoviesComponent(CARDS_COUNT), RenderPosition.BEFOREEND);
