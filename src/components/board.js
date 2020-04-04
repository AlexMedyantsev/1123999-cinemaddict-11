import {getMoviesCards} from "../components/card.js";
import {getShowMoreFilmsButton} from "../components/load-more-button.js";

export const getMoviesBoardTemplate = () => {
  const cardsUpcomingMarkup = getMoviesCards();
  const topRatedMovies = getMoviesCards(2);
  const topCommentedMovies = getMoviesCards(2);
  const showMoreButton = getShowMoreFilmsButton();

  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

        <div class="films-list__container">
          ${cardsUpcomingMarkup}
        </div>

        ${showMoreButton}
      </section>

      <section class="films-list--extra">
        <h2 class="films-list__title">Top rated</h2>

        <div class="films-list__container">
          ${topRatedMovies}
        </div>
      </section>

      <section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>

        <div class="films-list__container">
          ${topCommentedMovies};
        </div>
      </section>
    </section>`
  );
};
