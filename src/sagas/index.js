import _ from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import viewActionTypes from '../constants/viewActionTypes';
import { game } from '../actions';
import { delay, fetchEntity } from './utils';

// TODO: replace promise function with server API
export const joinGame = fetchEntity.bind(null, game, () => new Promise((resolve) => {
  const suits = ['D', 'C', 'H', 'S'];
  const numbers = _.range(13).map((value) => {
    const num = value + 1;
    switch (num) {
      case 1:
        return 'A';
      case 10:
        return 'T';
      case 11:
        return 'J';
      case 12:
        return 'Q';
      case 13:
        return 'K';
      default:
        return num.toString();
    }
  });
  setTimeout(() => {
    resolve({
      response: _.sampleSize(_.range(52), 13)
        .map(value => `${numbers[Math.floor(value / 4)]}${suits[value % 4]}`),
    });
  }, 1000);
}));

export function* initCardPos() {
  yield call(joinGame);
  for (let count = 1; count <= 52; count += 1) {
    yield delay(20);
    yield put({ type: viewActionTypes.INIT_CARDS_POS, count });
  }
}

export default function* rootSaga() {
  yield takeLatest(viewActionTypes.INIT_CARDS, initCardPos);
}
