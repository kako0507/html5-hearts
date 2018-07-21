import { cardsInfo, removeFromUnorderedArray } from './prematureOptimization';

class Simulator {
  constructor() {
    this.curCards = [[], [], [], []];
    this.curPlayers = [];
    this.curBoard = [];
    this.heartBroken = false;
    this.curP = 0;

    this.tmpVc = [];
  }

  run = (curPlayers, curBoard, heartBroken, curCards, cardToPlay, myID, scores) => {
    this.curCards.forEach((t, index) => {
      t.length = 0;
      [].push.apply(t, curCards[index]);
    });

    this.curPlayers.length = 0;
    [].push.apply(this.curPlayers, curPlayers);

    this.curBoard.length = 0;
    [].push.apply(this.curBoard, curBoard);

    this.heartBroken = heartBroken;

    this.curP = myID;

    this.scores = scores;
    this._play(myID, cardToPlay);
    this._rollout();

    let moonShooter = -1;
    this.scores.forEach((s, index) => {
      if (s === 26) moonShooter = index;
    });

    if (moonShooter !== -1) {
      if (moonShooter === this.curP) return -26;
      return 26;
    }

    return this.scores[this.curP];
  }

  _play = (player, card) => {
    this.curPlayers.push(player);
    this.curBoard.push(card);

    if (cardsInfo[card].suit === 1) {
      this.heartBroken = true;
    }

    removeFromUnorderedArray(this.curCards[player], card);
  }

  _getValidCards = (cards) => {
    this.tmpVc.length = 0;
    const vc = this.tmpVc;
    if (this.curBoard.length === 0) {
      if (this.heartBroken) {
        [].push.apply(this.tmpVc, cards);
      } else {
        cards.forEach((c) => {
          if (cardsInfo[c].suit !== 1) {
            vc.push(c);
          }
        });
      }
    } else {
      const { suit } = cardsInfo[this.curBoard[0]];
      cards.forEach((c) => {
        if (cardsInfo[c].suit === suit) {
          vc.push(c);
        }
      });
    }
    if (!vc.length) {
      [].push.apply(vc, cards);
    }

    return this.tmpVc;
  }

  _rollout = () => {
    let curPlayer = this.curP;
    curPlayer += 1;
    curPlayer %= 4;

    while (this.curBoard.length < 4) {
      this._play(curPlayer, this._othersDecide(this.curCards[curPlayer]));
      curPlayer += 1;
      curPlayer %= 4;
    }

    // end the first round
    this._endRound();

    while (this.curCards[this.nextFirst].length) {
      curPlayer = this.nextFirst;
      while (this.curBoard.length < 4) {
        this._play(curPlayer, this._othersDecide(this.curCards[curPlayer]));
        curPlayer += 1;
        curPlayer %= 4;
      }
      this._endRound();
    }
  }

  _endRound = () => {
    const len = this.curCards[0].length;
    for (let i = 1; i < 4; i += 1) {
      if (len !== this.curCards[i].length) {
        console.log(this.curCards);
        throw new Error('what!');
      }
    }

    const curSuit = cardsInfo[this.curBoard[0]].suit;
    let maxCard = 0;
    let maxNum = cardsInfo[this.curBoard[0]].num;
    let i;
    let score = 0;

    for (i = 0; i < 4; i += 1) {
      const c = cardsInfo[this.curBoard[i]];
      if (c.suit === curSuit && c.num > maxNum) {
        maxNum = c.num;
        maxCard = i;
      }

      if (c.suit === 1) score += 1;
      if (c.suit === 0 && c.num === 11) score += 13;
    }

    this.scores[this.curPlayers[maxCard]] += score;

    this.nextFirst = this.curPlayers[maxCard];
    this.curBoard.length = 0;
    this.curPlayers.length = 0;
  }

  _othersDecide = (cards) => {
    const vc = this._getValidCards(cards);
    let suit = -1;
    let maxNum = -1;
    const board = this.curBoard;
    // return vc[Math.floor(vc.length * Math.random())];

    if (board.length) {
      ({ suit } = cardsInfo[board[0]]);
      maxNum = board.reduce((prev, curc) => {
        const cur = cardsInfo[curc];
        if (cur.suit === suit && cur.num > prev) {
          return cur.num;
        }
        return prev;
      }, 0);
      return vc.reduce((prevc, curc) => {
        const cur = cardsInfo[curc];
        const prev = cardsInfo[prevc];
        if (prev.suit === cur.suit) {
          if (cur.suit === suit) {
            if (cur.num < maxNum) {
              if (prev.num > maxNum || prev.num < cur.num) return curc;
              return prevc;
            } if (cur.num > maxNum && prev.num > maxNum && board.length === 3) {
              if (cur.num > prev.num) return curc;
              return prevc;
            } if (cur.num < prev.num) {
              return curc;
            }
            return prevc;
          }
          if (cur.num > prev.num) return curc;
          return prevc;
        }
        if (cur.suit === 0 && cur.num === 11) return curc;
        if (prev.suit === 0 && prev.num === 11) return prevc;
        if (cur.suit === 1) return curc;
        if (prev.suit === 1) return prevc;
        if (cur.num > prev.num) return curc;
        return prevc;
      });
    }
    return vc.reduce((prev, cur) => {
      if (cardsInfo[prev].num > cardsInfo[cur].num) return cur;
      return prev;
    });
  };
}

export default Simulator;
