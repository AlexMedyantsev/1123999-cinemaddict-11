import SortingComponent, {SortType} from "../components/sort.js";
import NoMoviesComponent from "../components/no-movies.js";
import MovieController from "./movie.js";
import UserRankComponent from '../components/user-rank.js';
import CardComponent from "../components/movie.js";
import FilterController from "../controllers/filter.js";
import FilmsExtraComponent from "../components/films-extra.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getTopRated, getTopCommented} from "../utils/common.js";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

let SHOWING_CARDS_COUNT_ON_START = 5;
let SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const renderExtraMovies = (container, sortedMovies, commentModel, title, onDataChange, onViewChange, api) => {
  let filmsExtraComponent = new FilmsExtraComponent(title);
  render(container, filmsExtraComponent, RenderPosition.BEFOREEND);
  const filmsListContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);

  return renderMovies(filmsListContainer, sortedMovies, commentModel, onDataChange, onViewChange, api);
};

const renderMovies = (movieListElement, movies, commentModel, _dataChangeHandler, onViewChange, api) => {
  return movies.map((movie) => {
    const movieController = new MovieController(movieListElement, _dataChangeHandler, onViewChange, api);

    movieController.render(movie, commentModel);

    return movieController;
  });
};

const getSortedMovies = (movies, sortType) => {
  let sortedMovies = [];
  const showingMovies = movies.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
    case SortType.RATING:
      sortedMovies = showingMovies.sort((a, b) => b.rate - a.rate);
      break;
    case SortType.DATE:
      sortedMovies = showingMovies.sort((a, b) => b.releaseDate - a.releaseDate);
      break;
  }

  return sortedMovies;
};

export default class PageController {
  constructor(container, moviesModel, commentModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._commentModel = commentModel;
    this._api = api;

    this._showedMovieControllers = [];
    this._movieController = [];
    this._showingMoviesCount = SHOWING_CARDS_COUNT_ON_START;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortChangeHandler = this._sortChangeHandler.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._noMoviesComponent = new NoMoviesComponent();
    this._movieComponent = new CardComponent();
    this._sortingComponent = new SortingComponent();
    this._filterComponent = null;
    this._filterController = new FilterController(siteMainElement, this._moviesModel);
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._moviesModel.setFilterChangeHandler(this._onFilterTypeChange);
    this._moviesModel.setSortChangeHandler(this._sortChangeHandler);
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  render() {
    const movies = this._moviesModel.getMovies();

    this._sortedMovies = movies.slice();
    this._userRankComponent = new UserRankComponent(movies);
    render(siteHeaderElement, this._userRankComponent);

    this._renderMovies(movies.slice(0, this._showingMoviesCount));
    this._renderExtraMovies(movies.slice());

    this._renderLoadMoreButton();

  }

  _renderMovies(movies) {
    const container = this._container.getElement();
    const movieListElement = container.querySelector(`.films-list__container`);

    const newMovies = renderMovies(movieListElement, movies, this._commentModel, this._dataChangeHandler, this._onViewChange, this._api);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
  }

  _renderExtraMovies(movies) {
    const container = this._container.getElement();

    renderExtraMovies(container, getTopRated(movies), this._commentModel, `Top Rated`, this._dataChangeHandler, this._onViewChange, this._api);
    renderExtraMovies(container, getTopCommented(movies), this._commentModel, `Most Commented`, this._dataChangeHandler, this._onViewChange, this._api);
  }

  _renderLoadMoreButton() {
    const container = this._container.getElement();
    const movieListElement = container.querySelector(`.films-list__container`);
    const loadMoreButtonContainer = container.querySelector(`.films-list`);

    if (this._moviesModel.getMovies().length === 0) {
      render(movieListElement, this._noMoviesComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._moviesModel.getMovies().length > this._showingMoviesCount) {
      render(loadMoreButtonContainer, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
      this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
    }
  }

  _onLoadMoreButtonClick() {
    const previousMoviesCount = this._showingMoviesCount;
    this._showingMoviesCount += SHOWING_CARDS_COUNT_BY_BUTTON;

    const sortedMovies = this._moviesModel.getMovies().slice(previousMoviesCount, this._showingMoviesCount);

    this._renderMovies(sortedMovies);

    if (this._showingMoviesCount >= this._moviesModel.getMovies().length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onFilterTypeChange() {
    this._showingMoviesCount = SHOWING_CARDS_COUNT_ON_START;

    this._sortingComponent.setDefaultSortType();
    const container = this._container.getElement();
    const movieListElement = container.querySelector(`.films-list__container`);

    movieListElement.innerHTML = ``;

    this._renderMovies(this._moviesModel.getMovies().slice(0, this._showingMoviesCount));

    if (!this._container.getElement().querySelector(`.films-list__show-more`)) {
      this._renderLoadMoreButton();
    }

    if (this._showingMoviesCount >= this._moviesModel.getMovies().length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _dataChangeHandler(movieController, oldData, newData) {
    this._api.updateMovie(newData)
      .then((movieModel) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, movieModel);

        if (isSuccess) {
          movieController.render(newData);
        }
      });
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((movie) => {
      movie.setDefaultView();
    });
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _sortChangeHandler(sortType) {
    this._showingMoviesCount = SHOWING_CARDS_COUNT_ON_START;
    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), sortType);

    this._removeMovies();
    this._renderLoadMoreButton();

    const newMovies = this._renderMovies(this._sortedMovies.slice(0, 5));
    this._showedTaskControllers = newMovies;
  }
}
