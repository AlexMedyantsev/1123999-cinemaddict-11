import API from "./api.js";
import CommentsModel from "./models/comments.js";
import MoviesModel from "./models/movies.js";
import BoardComponent from "./components/board.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import FilterController from "./controllers/filter.js";
import SortController from "./controllers/sort.js";
import StatisticController from "./controllers/statistics.js";
import {SiteMainElement, SiteFooterElement, AUTHORIZATION} from "./const.js";
import PageController from "./controllers/page.js";
import {render, RenderPosition} from "./utils/render.js";
import {MenuMode} from "./const.js";

const api = new API(AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const boardComponent = new BoardComponent();
render(SiteMainElement, boardComponent, RenderPosition.BEFOREEND);
const filterController = new FilterController(SiteMainElement, moviesModel);
const statisticController = new StatisticController(SiteMainElement, moviesModel);
const sortController = new SortController(SiteMainElement, moviesModel);
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
  render(SiteFooterElement, new FooterMoviesComponent(moviesModel.getMoviesAll().length, RenderPosition.BEFOREEND));
  filterController.setOnMenuChange(menuChangeHandler);
};

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    renderPage();
  });
