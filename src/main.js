import BoardComponent from "./components/board.js";
import PageController from "./controllers/page.js";
import MoviesModel from "./models/movies.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import UserRankComponent from "./components/user-rank.js";
import {generateCards} from "./mock/card.js";
import {render, RenderPosition} from "./utils/render.js";

let CARDS_COUNT = 25;

const cards = generateCards(CARDS_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setMovies(cards);

// HEADER
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserRankComponent(), RenderPosition.BEFOREEND);

// MAIN
const siteMainElement = document.querySelector(`.main`);

const boardComponent = new BoardComponent();
const pageController = new PageController(boardComponent, moviesModel);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
pageController.render(cards);

// FOOTER
const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, new FooterMoviesComponent(CARDS_COUNT), RenderPosition.BEFOREEND);
