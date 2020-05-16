import BoardComponent from "./components/board.js";
import PageController from "./controllers/page.js";
import MoviesModel from "./models/movies.js";
import CommentsModel from "./models/comments.js";
import FooterMoviesComponent from "./components/footer-movies-amount.js";
import {MenuMode} from "./const.js";
import FilterController from "./controllers/filter.js";
import StatisticsComponent from "./components/statistics.js";
import UserRankComponent from "./components/user-rank.js";
import {generateCards} from "./mock/card.js";
import {render, RenderPosition} from "./utils/render.js";

let CARDS_COUNT = 3;

const cards = generateCards(CARDS_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setMovies(cards[0]);

const commentsModel = new CommentsModel();
commentsModel.setComments(cards[1]);


// HEADER
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserRankComponent(), RenderPosition.BEFOREEND);

// MAIN
const siteMainElement = document.querySelector(`.main`);

const boardComponent = new BoardComponent();
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();
const statisticsComponent = new StatisticsComponent();
const pageController = new PageController(boardComponent, moviesModel, commentsModel);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

filterController.setOnMenuChange((menuItem) => {
  switch (menuItem) {
    case MenuMode.STATISTICS:
      pageController.hide();
      statisticsComponent.show();
      break;
    case MenuMode.FILTERS:
      pageController.show();
      statisticsComponent.hide();
      break;
  }
});

pageController.render(cards);

// FOOTER
const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, new FooterMoviesComponent(CARDS_COUNT), RenderPosition.BEFOREEND);
