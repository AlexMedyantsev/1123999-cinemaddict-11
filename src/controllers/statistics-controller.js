import StatisticComponent from '../components/statistics.js';
import {render, replace, RenderPosition} from '../utils/render';
import {getMoviesByChartFilter} from '../utils/filter.js';
import {SITE_MAIN_ELEMENT} from "../const.js";
export default class StatisticsController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._movies = [];

    this._statisticComponent = null;
    this._activeFilterType = `all-time`;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._statisticInputHandler = this._statisticInputHandler.bind(this);
  }

  render() {
    const container = this._container;
    this._movies = this._moviesModel.getMovies();

    const oldComponent = this._statisticComponent;

    this._statisticComponent = new StatisticComponent(this._movies);
    render(SITE_MAIN_ELEMENT, this._statisticComponent, RenderPosition.BEFOREEND);
    this.hide();
    this._statisticComponent.renderChart();

    this._statisticComponent.setFilterInputHandler(this._statisticInputHandler);

    if (oldComponent) {
      replace(oldComponent, this._statisticComponent);
    } else {
      render(container, this._statisticComponent);
    }

  }

  hide() {
    this._statisticComponent.hide();
  }

  show() {
    this._statisticComponent.show();
  }

  _statisticInputHandler(filterValue) {
    const movies = getMoviesByChartFilter(this._movies, filterValue);
    this._statisticComponent.updateState(movies);
    this._statisticComponent.renderChart();
  }

  _dataChangeHandler() {
    this.render();
  }
}
