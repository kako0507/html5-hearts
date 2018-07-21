import _ from 'lodash';
import Card from './Card';
import layout from './layout';

let carddeck = _.range(52);
const cards = carddeck.map(i => new Card(i));

export default {
  cards,
  init() {
    this.desk.cards.length = 0;
    this.desk.players.length = 0;
    this.cards.forEach((c) => {
      c.parent = this;
      c.display.setSelectable(false);
    });
  },
  shuffleDeck() {
    carddeck = _.shuffle(carddeck);
    _.rangeRight(52).forEach((i) => {
      this.cards[carddeck[i]].index = carddeck[i];
      this.cards[carddeck[i]].adjustPos();
    });
  },
  distribute(players) {
    let curI = 0;
    return new Promise((resolve) => {
      function move() {
        if (curI === cards.length) {
          setTimeout(() => {
            resolve();
          }, 200);
          return;
        }
        players[curI % 4].row.addCard(cards[carddeck[curI]]);
        players[curI % 4].row.adjustPos();
        curI += 1;
        setTimeout(move, 10);
      }
      setTimeout(move, 300);
    });
  },
  getPosFor(index) {
    return {
      x: (52 - index) / 4,
      y: (52 - index) / 4,
      z: -52,
      rotateY: 180,
    };
  },
  desk: {
    cards: [],
    players: [],
    curScore: 0,
    getPosFor(index) {
      const pos = {
        x: 0,
        y: layout.cardHeight / 2 + layout.cardWidth / 2,
        z: index + 52,
        rotateY: 0,
      };
      pos.rotation = this.cards[index].pos.rotation;
      return pos;
    },
    addCard(card, player) {
      card.index = this.cards.length;
      card.parent = this;
      this.cards.push(card);
      this.players.push(player);
    },
    adjustPos() {
      this.cards.forEach((c) => {
        c.adjustPos();
      });
    },
    score() {
      let max = 0;
      for (let i = 1; i < 4; i += 1) {
        if (
          this.cards[i].suit === this.cards[max].suit
       && (this.cards[i].num > this.cards[max].num)
        ) {
          max = i;
        }
      }

      const info = [this.players[max], [].concat(this.cards)];
      this.players.length = 0;
      this.cards.length = 0;

      return info;
    },
  },
};
