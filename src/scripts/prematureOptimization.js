import _ from 'lodash';

const cardsInfo = _.range(52).map(i => ({
  num: (i % 13) + 1,
  suit: i % 4,
}));

function infoToCardId(num, suit) {
  let r = num - 1;
  while (r % 4 !== suit) {
    r += 13;
  }
  return r;
}

function removeFromUnorderedArray(arr, item) {
  // console.trace();
  if (!arr.length) return;
  const index = arr.indexOf(item);
  if (index === -1) return;
  arr[index] = arr[arr.length - 1];
  arr.pop();
}

export {
  cardsInfo,
  infoToCardId,
  removeFromUnorderedArray,
};
