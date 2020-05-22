import API from "./api.js";
import CommentsModel from "./models/comments.js";
import MoviesModel from "./models/movies.js";

import BoardComponent from "./components/board.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import UserRankComponent from "./components/user-rank.js";

import FilterController from "./controllers/filter.js";
import StatisticController from "./controllers/statistics.js";
import PageController from "./controllers/page.js";

import {MenuMode} from "./const.js";
// import {generateCards} from "./mock/card.js";
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
render(siteHeaderElement, new UserRankComponent(), RenderPosition.BEFOREEND);

// MAIN
const boardComponent = new BoardComponent();
const filterController = new FilterController(siteMainElement, moviesModel);


const statisticController = new StatisticController(siteMainElement, moviesModel);


const pageController = new PageController(boardComponent, moviesModel, commentsModel, api);
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

// FOOTER
// const siteFooterElement = document.querySelector(`.footer`);
// render(siteFooterElement, new FooterMoviesComponent(CARDS_COUNT), RenderPosition.BEFOREEND);


api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    pageController.render(movies);
    filterController.render();
    filterController.setOnMenuChange((menuItem) => {
      switch (menuItem) {
        case MenuMode.STATISTICS:
          pageController.hide();
          statisticController.show();
          break;
        case MenuMode.FILTERS:
          pageController.show();
          statisticController.hide();
          break;
      }
    });
    statisticController.hide();
  });
