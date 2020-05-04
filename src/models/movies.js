export default class Movies {
  constructor() {
    this._cards = [];

    this._dataChangeHandlers = [];
  }

  getMovies() {
    return this._cards;
  }

  setMovies(cards) {
    this._cards = Array.from(cards);
  }

  updateMovies(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index) + card + this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this.dataChangeHandler.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
