import MovieDetailsPopupComponent from "../components/movie-details.js";
import Movie from "../models/movie.js";
import MovieComponent from "../components/movie.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";

const bodyElement = document.querySelector(`body`);
const mode = {
  DEFAULT: `default`,
  OPENED: `opened`,
};

export default class MovieController {
  constructor(container, commentmodel, onDataChange, onViewChange, api) {
    this._container = container;
    this._commentModel = commentmodel;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = mode.DEFAULT;
    this._api = api;

    this._movie = null;
    this._movieComponent = null;
    this._movieDetailsPopupComponent = null;
  }

  setDefaultView() {
    if (this._mode === mode.OPENED) {
      this.closePopup();
    }
  }

  closePopup() {
    bodyElement.removeChild(this._movieDetailsPopupComponent.getElement());
    this._movieDetailsPopupComponent.removeElement();
    this._movieDetailsPopupComponent = null;
    this._mode = mode.DEFAULT;
  }

  getMovieComments(movie) {
    return movie.comments.map((id) => {
      return this._commentModel.getCommentById(id);
    });
  }

  render(movie) {
    this._movie = movie;
    const oldMovieComponent = this._movieComponent;
    this._movieComponent = new MovieComponent(movie);

    const openPopup = () => {
      bodyElement.appendChild(this._movieDetailsPopupComponent.getElement());
      this._mode = mode.OPENED;
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        this.closePopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._movieComponent.setWatchlistButtonClickHandler(() => {
      const newMovie = Movie.cloneData(this._movie);
      newMovie.isInWatchlist = !newMovie.isInWatchlist;
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setWatchedButtonClickHandler(() => {
      const newMovie = Movie.cloneData(this._movie);
      newMovie.isWatched = !newMovie.isWatched;
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setFavoriteButtonClickHandler(() => {
      const newMovie = Movie.cloneData(this._movie);
      newMovie.isFavorite = !newMovie.isFavorite;
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setClickHandler(() => {
      document.addEventListener(`keydown`, onEscKeyDown);
      // const comments = this.getMovieComments(this._movie);
      this._api.getComments(this._movie.id)
        .then((comments) => {
          this._movieDetailsPopupComponent = new MovieDetailsPopupComponent(Object.assign({}, this._movie, {comments}));
          this._movieDetailsPopupComponent.setDeleteCommentClickHandler((commentId) => {
            const updatedCommentsList = this._movie.comments.filter((id) => id !== commentId);
            this._onDataChange(this, this._movie, Object.assign({}, this._movie, {comments: updatedCommentsList}));
            this._commentModel.deleteComment(commentId);
            this._movieDetailsPopupComponent.updateLocalState(this.getMovieComments({comments: updatedCommentsList}));
          });

          this._movieDetailsPopupComponent.setSubmitCommentOnEnterHandler((newComment) => {
            const updatedCommentsList = this._movie.comments;
            updatedCommentsList.push(newComment.id);
            this._commentModel.addComment(newComment);
            this._onDataChange(this, this._movie, Object.assign({}, this._movie, {comments: updatedCommentsList}));
            this._movieDetailsPopupComponent.updateLocalState(this.getMovieComments({comments: updatedCommentsList}));
          });

          this._movieDetailsPopupComponent.setWatchedInPopupClickHandler(() => {
            this._onDataChange(this, this._movie, Object.assign({}, this._movie, {
              isWatched: !this._movie.isWatched,
            }));
          });

          this._movieDetailsPopupComponent.setWatchlistInPopupClickHandler(() => {
            this._onDataChange(this, this._movie, Object.assign({}, this._movie, {
              isInWatchlist: !this._movie.isInWatchlist,
            }));
          });

          this._movieDetailsPopupComponent.setFavoriteInPopupClickHandler(() => {
            this._onDataChange(this, this._movie, Object.assign({}, this._movie, {
              isFavorite: !this._movie.isFavorite,
            }));
          });

          this._onViewChange();
          openPopup();
          document.addEventListener(`keydown`, onEscKeyDown);
          this._movieDetailsPopupComponent.setCloseButtonClickHandler(() => {
            this.closePopup();
          });
        });
    });

    if (oldMovieComponent) {
      replace(oldMovieComponent, this._movieComponent);
    } else {
      render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._movieComponent);
  }
}
