import viewActionTypes from '../constants/viewActionTypes';
import serverActionTypes from '../constants/serverActionTypes';
import layout from '../constants/layout';
import cardsModel from './cardsModel';

// get the postion of the card
function getCardPosition(playerIndex, handCardCount, handCardIndex) {
  const isVertical = playerIndex % 2;
  const left = -((handCardIndex + 0.5) * layout.cardSep);
  let distance;
  if (isVertical) {
    distance = window.innerWidth / 2 - layout.rowMargin - layout.cardHeight / 2;
  } else {
    distance = window.innerHeight / 2 - layout.rowMargin - layout.cardHeight / 2;
  }

  return {
    x: left + handCardCount * layout.cardSep / 2,
    y: distance,
    rotation: playerIndex < 2
      ? playerIndex * 90
      : playerIndex * 90 - 360,
    rotateY: playerIndex === 0 ? 0 : 180, // show player's card
    z: 0,
  };
}

export default function cards(state = cardsModel, action) {
  switch (action.type) {
    case viewActionTypes.INIT_CARDS:
      return cardsModel;
    case viewActionTypes.INIT_CARDS_POS: {
      const cardList = state.cardList.map((card) => {
        const { id, playerIndex, handCardIndex } = card;
        if ((id + 1) > action.count) {
          // if card's not
          return card;
        }
        const handCardCount = Math.ceil(action.count / 4);

        return {
          ...card,
          pos: getCardPosition(playerIndex, handCardCount, handCardIndex),
        };
      });

      return {
        ...state,
        cardList,
      };
    }
    case serverActionTypes.JOIN_GAME.SUCCESS:
      return {
        ...state,
        cardList: state.cardList.map((card) => {
          const { playerIndex, handCardIndex } = card;
          if (playerIndex === 0) {
            const cardInfo = action.response[handCardIndex];
            return {
              ...card,
              num: cardInfo[0],
              suit: cardInfo[1],
            };
          }
          return card;
        }),
      };
    default:
      return state;
  }
}
