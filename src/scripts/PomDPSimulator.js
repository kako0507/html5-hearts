import { cardsInfo, removeFromUnorderedArray } from './prematureOptimization';

class PomDPSimulator {
  constructor(id) {
    this.observationBuffer = [];
    this.playerId = id;
    this.tmpVc = [];
  }

  _playCard = (card) => {
    const playerCard = (this.curPlayer + 1) * 100 + card;

    const { board } = this.state;
    this.state.board.push(playerCard);
    this.observationBuffer.push(playerCard);

    removeFromUnorderedArray(this.state.players[this.curPlayer], card);

    let boardScore = 0;
    let curSuit;
    let maxPlayer;
    let maxNum = 0;

    if (this.state.board.length === 4) {
      curSuit = cardsInfo[board[0] % 100].suit;
      for (let i = 0; i < 4; i += 1) {
        const player = ((board[i] / 100) | 0) - 1;


        const c = cardsInfo[board[i] % 100];
        if (c.suit === 1) {
          boardScore += 1;
        } else if (c.num === 11 && c.suit === 0) {
          boardScore += 13;
        }
        if (c.suit === curSuit && c.num > maxNum) {
          maxNum = c.num;
          maxPlayer = player;
        }
      }
      this.state.scores[maxPlayer] += boardScore;
      this.curPlayer = maxPlayer;
      this.state.board.length = 0;
    } else {
      this.curPlayer = (this.curPlayer + 1) % 4;
    }
  }

  _getValidCards = (cards) => {
    const vc = this.tmpVc;
    this.tmpVc.length = 0;
    if (this.state.board.length === 0) {
      if (cards.length === 13) {
        this.tmpVc.push(26);
      } else if (this.state.heartBroken) {
        [].push.apply(this.tmpVc, cards);
      } else {
        cards.forEach((c) => {
          if (cardsInfo[c].suit !== 1) {
            vc.push(c);
          }
        });
      }
    } else {
      const { suit } = cardsInfo[this.state.board[0] % 100];
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

  _decide = (player) => {
    const cards = this.state.players[player];

    if (!cards.length) return null;

    const vc = this._getValidCards(cards);
    let suit = -1;
    let maxNum = -1;
    const { board } = this.state;

    if (board.length) {
      ({ suit } = cardsInfo[board[0] % 100]);
      maxNum = board.reduce((prev, curc) => {
        const cur = cardsInfo[curc % 100];
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

  step = (s, a) => {
    const oriScore = s.scores[this.playerId];
    this.state = s;
    this.curPlayer = this.playerId;

    this._playCard(a);

    while (this.curPlayer !== this.playerId) {
      const toPlay = this._decide(this.curPlayer);
      if (toPlay === null) break;
      this._playCard(toPlay);
    }
    let moonShooter = -1;
    let outputScore = oriScore - this.state.scores[this.playerId];
    this.state.scores.forEach((score, index) => {
      if (score === 26) {
        moonShooter = index;
      }
    });
    if (moonShooter !== -1) {
      if (moonShooter === this.playerId) {
        outputScore = oriScore + 26;
      } else {
        outputScore = oriScore - 26;
      }
    }
    const result = {
      state: s,
      observation: this.observationBuffer.concat([]),
      score: outputScore,
    };

    this.observationBuffer.length = 0;

    return result;
  }

  run = (s) => {
    const oriScore = s.scores[this.playerId];
    this.state = s;
    this.curPlayer = this.playerId;

    while (1) {
      const toPlay = this._decide(this.curPlayer);
      if (toPlay === null) break;
      this._playCard(toPlay);
    }

    let moonShooter = -1;
    let outputScore = oriScore - this.state.scores[this.playerId];

    this.state.scores.forEach((s, index) => {
      if (s === 26) moonShooter = index;
    });

    if (moonShooter !== -1) {
      if (moonShooter === this.playerId) {
        outputScore = oriScore + 26;
      } else {
        outputScore = oriScore - 26;
      }
    }

    this.observationBuffer.length = 0;

    return outputScore;
  };
}

export default PomDPSimulator;
