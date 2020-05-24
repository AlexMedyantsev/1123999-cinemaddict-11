import Comment from "../models/comment.js";
import CommentModel from "../models/comments.js";
import MovieDetailsPopupComponent from "../components/movie-details.js";
import Movie from "../models/movie.js";
import MovieComponent from "../components/movie.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {BodyElement, MovieMode} from "../const.js";

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._commentModel = new CommentModel();
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = MovieMode.DEFAULT;
    this._api = api;

    this._movie = null;
    this._movieComponent = null;
    this._movieDetailsPopupComponent = null;
  }

  setDefaultView() {
    if (this._mode === MovieMode.OPENED) {
      this.closePopup();
    }
  }

  closePopup() {
    BodyElement.removeChild(this._movieDetailsPopupComponent.getElement());
    this._movieDetailsPopupComponent.removeElement();
    this._movieDetailsPopupComponent = null;
    this._mode = MovieMode.DEFAULT;
  }

  render(movie) {
    this._movie = movie;
    const oldMovieComponent = this._movieComponent;
    this._movieComponent = new MovieComponent(movie);

    const openPopup = () => {
      BodyElement.appendChild(this._movieDetailsPopupComponent.getElement());
      this._mode = MovieMode.OPENED;
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
      this._api.getComments(this._movie.id)
        .then((comments) => {
          this._commentModel.setComments(comments);
          this._movieDetailsPopupComponent = new MovieDetailsPopupComponent(Object.assign({}, this._movie, {comments}));
          this._movieDetailsPopupComponent.setDeleteCommentClickHandler((commentId) => {
            this._api.deleteComment(commentId)
              // eslint-disable-next-line max-nested-callbacks
              .then(() => {
                this._commentModel.deleteComment(commentId);
                this._movieDetailsPopupComponent.updateLocalState(this._commentModel.getComments());
              });
          });

          this._movieDetailsPopupComponent.setSubmitCommentOnEnterHandler((newComment) => {
            this._movieDetailsPopupComponent.blockForm();
            this._api.createComment(this._movie.id, Comment.cloneData(newComment))
              // eslint-disable-next-line max-nested-callbacks
              .then((response) => {
                const newComments = Comment.parseComments(response.comments);
                this._commentModel.setComments(newComments);
                this._movieDetailsPopupComponent.updateLocalState(newComments);
                this._movieDetailsPopupComponent.unBlockForm();
              });
          });

          this._movieDetailsPopupComponent.setWatchedInPopupClickHandler(() => {
            const newMovie = Movie.cloneData(this._movie);
            newMovie.isWatched = !newMovie.isWatched;
            this._onDataChange(this, this._movie, newMovie);
          });

          this._movieDetailsPopupComponent.setWatchlistInPopupClickHandler(() => {
            const newMovie = Movie.cloneData(this._movie);
            newMovie.isInWatchlist = !newMovie.isInWatchlist;
            this._onDataChange(this, this._movie, newMovie);
          });

          this._movieDetailsPopupComponent.setFavoriteInPopupClickHandler(() => {
            const newMovie = Movie.cloneData(this._movie);
            newMovie.isFavorite = !newMovie.isFavorite;
            this._onDataChange(this, this._movie, newMovie);
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
