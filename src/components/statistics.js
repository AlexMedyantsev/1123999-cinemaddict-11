import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getProfileRating, getPropertyCount} from '../utils/common';
import {FilterChartType} from "../const.js";
import moment from "moment";


const getAllGenres = (movies) => movies.reduce((acc, movie) => acc.concat(movie.genres), []);

const getWatchedGenres = (movies) => movies.filter((card) => card[`isWatched`]);

const getUniqueGenres = (movies) => {
  const set = new Set();
  const genres = getAllGenres(movies);
  genres.forEach((genre) => set.add(genre));
  return [...set];
};

const getTotalDuration = (movies) => {
  const watchedMovies = getWatchedMovies(movies);
  return moment.duration(watchedMovies.reduce((acc, movie) => acc + movie.duration, 0), `minutes`);
};

const getWatchedMovies = (movies) => movies.filter((movie) => movie.isWatched);

const getTopGenre = (movies) => {
  const uniqueGenres = getUniqueGenres(movies); // уникальные жанры
  const genresCount = getElementCount(movies); // количество каждого жанра
  const maxCount = Math.max(...genresCount);
  const index = genresCount.findIndex((num) => maxCount === num);

  return uniqueGenres[index];
};

const getElementCount = (movies) => {
  const uniqueGenres = getUniqueGenres(movies);
  const getConcatMovies = movies.reduce((acc, movie) => acc.concat(movie.genres), []);

  return uniqueGenres.map((genres) => {
    return getConcatMovies.filter((element) => element === genres).length;
  });
};

const getStatisticsTemplate = (movies, filterType) => {
  const totalDuration = getTotalDuration(movies);
  const countWatched = getPropertyCount(movies, `isWatched`);
  const rating = getProfileRating(countWatched);
  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rating}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${filterType === FilterChartType.ALL ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${filterType === FilterChartType.TODAY ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${filterType === FilterChartType.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${filterType === FilterChartType.MONTH ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${filterType === FilterChartType.YEAR ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${getPropertyCount(movies, `isWatched`) || `0`}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration.hours() + totalDuration.days() * 24} <span class="statistic__item-description">h</span> ${totalDuration.minutes() || `0`} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(movies) || ``}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Statictics extends AbstractSmartComponent {
  constructor(movies) {
    super();
    this._movies = movies;
    this._activeFilterType = `all-time`;

    this.filterInputhandler = null;
  }

  getTemplate() {
    return getStatisticsTemplate(this._movies, this._activeFilterType);
  }

  recoveryListeners() {
    this.setFilterInputHandler(this.filterInputhandler);
  }

  setFilterInputHandler(handler) {
    this.filterInputhandler = handler;

    this.getElement()
      .querySelector(`.statistic__filters`)
      .addEventListener(`input`, (evt) => {
        this._activeFilterType = evt.target.value;
        handler(this._activeFilterType);
      });
  }

  updateState(movies) {
    this._movies = movies;
    this.rerender();
  }

  renderChart() {
    const ctx = this.getElement().querySelector(`.statistic__chart`);

    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: getUniqueGenres(getWatchedMovies(this._movies)),
        datasets: [
          {
            data: getElementCount(getWatchedGenres(this._movies)),
            backgroundColor: `#ffe800`,
            borderWidth: 0,
            barThickness: 30,
          }
        ]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 16
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            padding: 30
          }
        },
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true,
            }
          }],
          yAxes: [{
            ticks: {
              fontSize: 18,
              fontColor: `#ffffff`,
              padding: 60,
            }
          }]
        }
      }
    });
  }
}
