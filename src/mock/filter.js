import {FilterChartType} from '../const';
import moment from 'moment';

export const getCardsByChartFilter = (cards, filter) => {
  switch (filter) {
    case FilterChartType.ALL:
      return cards;
    case FilterChartType.TODAY:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) === 0);
    case FilterChartType.WEEK:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) <= 0);
    case FilterChartType.MONTH:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) <= 31);
    case FilterChartType.YEAR:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) <= 364);
  }

  return cards;
};
