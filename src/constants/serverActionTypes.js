import _ from 'lodash';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const createRequestTypes = base => [REQUEST, SUCCESS, FAILURE]
  .reduce((acc, type) => {
    acc[type] = `S_${base}_${type}`;
    return acc;
  }, {});

export default _.mapValues(
  _.mapKeys([
    'JOIN_GAME',
  ]),
  v => createRequestTypes(v),
);
