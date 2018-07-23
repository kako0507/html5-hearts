/* initialize card data */
import _ from 'lodash';

const cardIndexs = _.range(52);
const cardList = cardIndexs.map((index) => {
  const id = 51 - index;
  const p = (id + 1) / 4;
  const handCardIndex = Math.ceil(p) - 1;
  return {
    id,
    playerIndex: id % 4,
    handCardIndex,
    pos: {
      x: p,
      y: p,
      rotateY: 180, // flip card by default
    },
  };
});

export default {
  cardIndexs,
  cardList,
  dealed: false,
  dealedCardsCount: 0,
};
