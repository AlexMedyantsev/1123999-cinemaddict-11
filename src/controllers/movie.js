import MovieDetailsPopupComponent from "../components/movie-details.js";
import MovieComponent from "../components/movie.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";

const bodyElement = document.querySelector(`body`);
const mode = {
  DEFAULT: `default`,
  OPENED: `opened`,
};

export default class MovieController {
  constructor(container, commentmodel, onDataChange, onViewChange) {
    this._container = container;
    this._commentModel = commentmodel;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = mode.DEFAULT;

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
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isInWatchlist: !movie.isInWatchlist,
      }));
    });

    this._movieComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isInHistory: !movie.isInHistory,
      }));
    });

    this._movieComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite,
      }));
    });

    this._movieComponent.setClickHandler(() => {
      document.addEventListener(`keydown`, onEscKeyDown);
      const comments = this.getMovieComments(movie);
      this._movieDetailsPopupComponent = new MovieDetailsPopupComponent(Object.assign({}, movie, {comments}));
      this._movieDetailsPopupComponent.setDeleteCommentClickHandler((commentId) => {
        const updatedCommentsList = movie.comments.filter((id) => id !== commentId);
        this._onDataChange(this, movie, Object.assign({}, movie, {comments: updatedCommentsList}));
        this._commentModel.deleteComment(commentId);
        this._movieDetailsPopupComponent.updateLocalState(this.getMovieComments({comments: updatedCommentsList}));
      });

      this._movieDetailsPopupComponent.setSubmitCommentOnEnterHandler((newComment) => {
        const updatedCommentsList = movie.comments;
        updatedCommentsList.push(newComment.id);
        this._commentModel.addComment(newComment);
        this._onDataChange(this, movie, Object.assign({}, movie, {comments: updatedCommentsList}));
        this._movieDetailsPopupComponent.updateLocalState(this.getMovieComments({comments: updatedCommentsList}));
      });

      this._movieDetailsPopupComponent.setWatchedInPopupClickHandler(() => {
        this._onDataChange(this, movie, Object.assign({}, movie, {
          isInHistory: !movie.isInHistory,
        }));
      });

      this._movieDetailsPopupComponent.setWatchlistInPopupClickHandler(() => {
        this._onDataChange(this, movie, Object.assign({}, movie, {
          isInWatchlist: !movie.isInWatchlist,
        }));
      });

      this._movieDetailsPopupComponent.setFavoriteInPopupClickHandler(() => {
        this._onDataChange(this, movie, Object.assign({}, movie, {
          isFavorite: !movie.isFavorite,
        }));
      });

      this._onViewChange();
      openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
      this._movieDetailsPopupComponent.setCloseButtonClickHandler(() => {
        this.closePopup();
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
