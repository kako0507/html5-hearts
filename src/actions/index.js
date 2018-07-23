import viewActionTypes from '../constants/viewActionTypes';
import serverActionTypes from '../constants/serverActionTypes';

const action = (type, payload = {}) => ({ type, ...payload });

export const initCards = () => action(viewActionTypes.INIT_CARDS);

export const game = {
  request: login => action(serverActionTypes.JOIN_GAME.REQUEST, { login }),
  success: (login, response) => action(serverActionTypes.JOIN_GAME.SUCCESS, { login, response }),
  failure: (login, error) => action(serverActionTypes.JOIN_GAME.FAILURE, { login, error }),
};
