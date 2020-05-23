import StatisticComponent from '../components/statistics.js';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {getMoviesByChartFilter} from '../utils/filter.js';
const siteMainElement = document.querySelector(`.main`);

export default class Statistic {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._movies = [];

    this._statisticComponent = null;
    this._activeFilterType = `all-time`;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._statisticInputHandler = this._statisticInputHandler.bind(this);
    this._moviesModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    this._movies = this._moviesModel.getMovies();

    const oldComponent = this._statisticComponent;

    this._statisticComponent = new StatisticComponent(this._movies);
    render(siteMainElement, this._statisticComponent, RenderPosition.BEFOREEND);
    this._statisticComponent.renderChart();

    this._statisticComponent.setFilterInputHandler(this._statisticInputHandler);

    if (oldComponent) {
      replace(oldComponent, this._statisticComponent);
    } else {
      render(container, this._statisticComponent);
    }
  }

  _statisticInputHandler(filterValue) {
    const movies = getMoviesByChartFilter(this._movies, filterValue);
    // const oldComponent = this._statisticComponent;
    this._statisticComponent.updateState(movies);
    this._statisticComponent.renderChart();
  }

  _dataChangeHandler() {
    this.render();
  }

  hide() {
    this._statisticComponent.hide();
  }

  show() {
    this._statisticComponent.show();
  }
}
