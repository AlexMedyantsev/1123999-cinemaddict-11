export const FilterType = {
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

export const FilterChartType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const TimeToken = {
  TIME: `H[h] m[m]`,
  DATE: `DD MMMM YYYY`,
  COMMENT: `YYYY/MM/DD HH:MM`,
  YEAR: `YYYY`
};

export const MenuMode = {
  STATISTICS: `stats`,
  FILTERS: `filter`,
};

export const KeyCode = {
  ENTER: 13,
};

export const MovieMode = {
  DEFAULT: `default`,
  OPENED: `opened`,
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const bodyElement = document.querySelector(`body`);
export const siteHeaderElement = document.querySelector(`.header`);
export const siteMainElement = document.querySelector(`.main`);
export const siteFooterElement = document.querySelector(`.footer`);

export const AUTHORIZATION = `Basic SoFRcEgm30s3v`;
export const HIDDEN_CLASS = `visually-hidden`;
export const BLOCK_ATTRIBUTE = `disabled`;
export const SERVER_URL = `https://11.ecmascript.pages.academy/cinemaddict`;
export const SHOWING_CARDS_COUNT_ON_START = 5;
export const SHOWING_CARDS_COUNT_BY_BUTTON = 5;
