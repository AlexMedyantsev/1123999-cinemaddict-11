import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getMoviesByFilter} from "../utils/filter.js";
import {MenuMode} from "../const.js";

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._menuItemActive = MenuMode.FILTERS;

    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allMovies, filterType).length,
        checked: filterType === this._filterComponent
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._menuItemActive = filterType;
    this.setOnMenuChange(this._handler);
  }

  _onDataChange() {
    this.render();
  }

  setOnMenuChange(handler) {
    this._handler = handler;
    if (this._menuItemActive === MenuMode.STATISTICS) {
      handler(MenuMode.STATISTICS);
    } else {
      handler(MenuMode.FILTERS);
    }
  }
}
