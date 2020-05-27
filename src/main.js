import API from "./api.js";
import CommentsModel from "./models/comments.js";
import MoviesModel from "./models/movies.js";
import BoardComponent from "./components/board.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import FilterController from "./controllers/filter-controller.js";
import SortController from "./controllers/sort-controller.js";
import StatisticController from "./controllers/statistics-controller.js";
import {SITE_MAIN_ELEMENT, SITE_FOOTER_ELEMENT, AUTHORIZATION} from "./const.js";
import PageController from "./controllers/page-controller.js";
import {render, RenderPosition} from "./utils/render.js";
import {MenuMode} from "./const.js";

const api = new API(AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const boardComponent = new BoardComponent();
render(SITE_MAIN_ELEMENT, boardComponent, RenderPosition.BEFOREEND);
const filterController = new FilterController(SITE_MAIN_ELEMENT, moviesModel);
const statisticController = new StatisticController(SITE_MAIN_ELEMENT, moviesModel);
const sortController = new SortController(SITE_MAIN_ELEMENT, moviesModel);
const pageController = new PageController(boardComponent, moviesModel, commentsModel, api);


const menuChangeHandler = (menuItem) => {
  switch (menuItem) {
    case MenuMode.STATISTICS:
      pageController.hide();
      sortController.hide();
      statisticController.show();
      break;
    case MenuMode.FILTERS:
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
  render(SITE_FOOTER_ELEMENT, new FooterMoviesComponent(moviesModel.getMoviesAll().length, RenderPosition.BEFOREEND));
  filterController.setOnMenuChange(menuChangeHandler);
};

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    boardComponent.hideLoadMessage();
    renderPage();
  });
