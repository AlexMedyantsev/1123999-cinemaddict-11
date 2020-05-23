import API from "./api.js";
import CommentsModel from "./models/comments.js";
import MoviesModel from "./models/movies.js";
import BoardComponent from "./components/board.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import FilterController from "./controllers/filter.js";
import SortController from "./controllers/sort.js";
import StatisticController from "./controllers/statistics.js";
import PageController from "./controllers/page.js";
import {render, RenderPosition} from "./utils/render.js";

const siteMainElement = document.querySelector(`.main`);
// let CARDS_COUNT = 30;
const AUTHORIZATION = `Basic SoFRcEgm30s3v`;
const api = new API(AUTHORIZATION);

// const cards = generateCards(CARDS_COUNT);
const moviesModel = new MoviesModel();
// moviesModel.setMovies(cards[0]);

const commentsModel = new CommentsModel();
// commentsModel.setComments(cards[1]);


// HEADER
const siteHeaderElement = document.querySelector(`.header`);

// MAIN
const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
const filterController = new FilterController(siteMainElement, moviesModel);
const statisticController = new StatisticController(siteMainElement, moviesModel);
const sortController = new SortController(siteMainElement, moviesModel);
const pageController = new PageController(boardComponent, moviesModel, commentsModel, api);

// FOOTER
// const siteFooterElement = document.querySelector(`.footer`);
// render(siteFooterElement, new FooterMoviesComponent(CARDS_COUNT), RenderPosition.BEFOREEND);


// api.getMovies()
//   .then((movies) => {
//     moviesModel.setMovies(movies);
//     pageController.render(movies);
//     filterController.render();
//     filterController.setOnMenuChange((menuItem) => {
//       switch (menuItem) {
//         case MenuMode.STATISTICS:
//           pageController.hide();
//           statisticController.show();
//           break;
//         case MenuMode.FILTERS:
//           pageController.show();
//           statisticController.hide();
//           break;
//       }
//     });
//   });

const menuChangeHandler = (filter) => {
  if (!filter) {
    pageController.hide();
    sortController.hide();
    statisticController.show();
  } else {
    pageController.show();
    sortController.show();
    statisticController.hide();
  }
};

const renderPage = () => {
  sortController.render();
  filterController.render();
  pageController.render();
  statisticController.render();
  filterController.setOnMenuChange(menuChangeHandler);
};

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    renderPage();
  });
