import _ from 'lodash';

export const suits = {
  D: 'diamond',
  C: 'club',
  H: 'heart',
  S: 'spade',
};

export const numbers = _.mapKeys(
  _.range(13).map((value) => {
    const num = value + 1;
    switch (num) {
      case 1:
        return 'A';
      case 10:
        return '10';
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      default:
        return num.toString();
    }
  }),
  value => (value === '10' ? 'T' : value),
);
