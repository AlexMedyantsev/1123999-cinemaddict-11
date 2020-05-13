import SortingComponent, {SortType} from "../components/sorting.js";
import NoMoviesComponent from "../components/no-movies.js";
import MovieController from "./movie.js";
import CardComponent from "../components/movie.js";
// import FilterComponent from "../components/filter.js";
import FilterController from "../controllers/filter.js";
import FilmsExtraComponent from "../components/films-extra.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getTopRated, getTopCommented} from "../utils/common.js";

const siteMainElement = document.querySelector(`.main`);

let SHOWING_CARDS_COUNT_ON_START = 5;
let SHOWING_CARDS_COUNT_BY_BUTTON = 5;

const renderExtraMovies = (container, sortedMovies, title, onDataChange, onViewChange) => {
  let filmsExtraComponent = new FilmsExtraComponent(title);
  render(container, filmsExtraComponent, RenderPosition.BEFOREEND);
  const filmsListContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);

  return renderMovies(filmsListContainer, sortedMovies, onDataChange, onViewChange);
};

const renderMovies = (movieListElement, movies, commentModel, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(movieListElement, commentModel, onDataChange, onViewChange);

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
      sortedMovies = showingMovies.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DATE:
      sortedMovies = showingMovies.sort((a, b) => b.year - a.year);
      break;
  }

  return sortedMovies;
};

export default class PageController {
  constructor(container, moviesModel, commentModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._commentModel = commentModel;

    this._showedMovieControllers = [];
    this._movieController = [];
    this._showingMoviesCount = SHOWING_CARDS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onViewChange = this._onViewChange.bind(this);


    this._noMoviesComponent = new NoMoviesComponent();
    this._movieComponent = new CardComponent();
    this._sortingComponent = new SortingComponent();
    this._filterComponent = null;
    this._filterController = new FilterController(siteMainElement, this._moviesModel);
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    // this._moviesModel.setDataChangeHandler(this._onDataChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterTypeChange);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const movies = this._moviesModel.getMovies();
    render(siteMainElement, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._filterController.render();

    this._sortedMovies = movies.slice();


    this._renderMovies(movies.slice(0, this._showingMoviesCount));
    this._renderExtraMovies(movies.slice());

    this._renderLoadMoreButton();

    // renderExtraMovies(container, getTopRated(movies), `Top Rated`, this._onDataChange, this._onViewChange);
    // renderExtraMovies(container, getTopCommented(movies), `Most Commented`, this._onDataChange, this._onViewChange);
  }

  _renderMovies(movies) {
    const container = this._container.getElement();
    const movieListElement = container.querySelector(`.films-list__container`);

    const newMovies = renderMovies(movieListElement, movies, this._commentModel, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
    // this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _renderExtraMovies(movies) {
    const container = this._container.getElement();

    const newExtraMovies = renderExtraMovies(container, getTopRated(movies), `Top Rated`, this._onDataChange, this._onViewChange);
    const newExtraMovies1 = renderExtraMovies(container, getTopCommented(movies), `Most Commented`, this._onDataChange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newExtraMovies, newExtraMovies1);
  }

  _renderLoadMoreButton() {
    // remove(this._loadMoreButtonComponent);

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

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._moviesModel.updateMovie(oldData.id, newData);

    if (isSuccess) {
      movieController.render(newData);
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

  _onSortTypeChange(sortType) {
    this._showingMoviesCount = SHOWING_CARDS_COUNT_ON_START;
    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), sortType);

    this._removeMovies();
    this._renderLoadMoreButton();

    const newMovies = this._renderMovies(this._sortedMovies.slice(0, 5));
    this._showedTaskControllers = newMovies;
  }
}
