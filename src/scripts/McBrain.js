import Simulator from './Simulator';
import Brain from './Brain';
import { cardsInfo, removeFromUnorderedArray } from './prematureOptimization';

const defaultOptions = {
  time: 1000,
};

class McBrain extends Brain {
  constructor(userid, options = defaultOptions) {
    super(userid);

    this.maxTime = options.time;
    this.samplePlayers = [[], [], [], []];
    this.tmpSample = [[], [], [], []];
    this.heartBroken = false;

    this.playersInfo = [
      {
        hasCard: [],
        lackCard: {},
        numCards: 13,
        score: 0,
      },
      {
        hasCard: [],
        lackCard: {},
        numCards: 13,
        score: 0,
      },
      {
        hasCard: [],
        lackCard: {},
        numCards: 13,
        score: 0,
      },
      {
        hasCard: [],
        lackCard: {},
        numCards: 13,
        score: 0,
      },
    ];

    this.remainingCards = [];
    for (let i = 0; i < 52; i += 1) {
      this.remainingCards.push(i);
    }

    this.cardLackCount = cardsInfo.map(() => 0);

    this.simulator = new Simulator();
  }

  removeRemainingCard = (id) => {
    removeFromUnorderedArray(this.remainingCards, id);
    this.playersInfo.forEach((p) => {
      removeFromUnorderedArray(p.hasCard, id);
    });
  };

  markLackCard = (c, player) => {
    if (!player.lackCard[c]) {
      player.lackCard[c] = true;
      this.cardLackCount[c] += 1;
    }
  }

  watch = (info) => {
    if (info.type === 'in') {
      info.cards.forEach((c) => {
        this.removeRemainingCard(c);
      });
      [].push.apply(this.playersInfo[info.player].hasCard, info.cards);
    } else {
      this.playersInfo[info.player].numCards -= 1;
      this.removeRemainingCard(info.card);
      if (cardsInfo[info.card].suit === 1) this.heartBroken = true;

      const lackCardPlayer = this.playersInfo[info.player];
      if (info.curSuit !== cardsInfo[info.card].suit) {
        this.remainingCards.forEach((c) => {
          if (cardsInfo[c].suit === info.curSuit) {
            this.markLackCard(c, lackCardPlayer);
          }
        });
      }
    }
  }

  confirmCards = (cards) => {
    cards.forEach((c) => {
      this.removeRemainingCard(c);
      this.samplePlayers[this.user].push(c);
    });
  }

  decide = (vc, cids, pids, pscores) => {
    let r;

    if (vc.length === 1) {
      [r] = vc;
    } else {
      const endTime = Date.now() + this.maxTime;
      const scores = vc.map(() => 0);
      let i;
      this.preGenSample();
      while (Date.now() < endTime) {
        this.genSample();
        for (i = 0; i < vc.length; i += 1) {
          scores[i] += this.simulator.run(
            pids,
            cids,
            this.heartBroken,
            this.samplePlayers,
            vc[i].id,
            this.user,
            [].concat(pscores),
          );
        }
      }

      let minScore = 1 / 0;
      let bestC;
      for (i = 0; i < scores.length; i += 1) {
        if (minScore > scores[i]) {
          minScore = scores[i];
          bestC = i;
        }
      }
      r = vc[bestC];
    }

    removeFromUnorderedArray(this.samplePlayers[this.user], r.id);

    return r.index;
  }

  preGenSample = () => {
    this.remainingCards.sort((a, b) => this.cardLackCount[b] - this.cardLackCount[a]);
  }

  genSample = () => {
    const id = this.user;
    const sample = this.samplePlayers;

    let tryT = 1000000;
    let index;
    while (tryT) {
      sample.forEach((p, i) => {
        if (i !== id) {
          p.length = 0;
        }
        p.id = i;
      });
      this.playersInfo.forEach((p, i) => {
        [].push.apply(sample[i], p.hasCard);
      });
      const toAdd = sample.filter((s, i) => s.length < this.playersInfo[i].numCards);
      index = 0;

      while (index < this.remainingCards.length) {
        const c = this.remainingCards[index];
        let allPossible = toAdd.length;
        let aid = 0;
        while (aid < allPossible) {
          if (this.playersInfo[toAdd[aid].id].lackCard[c]) {
            allPossible -= 1;
            const tmp = toAdd[allPossible];
            toAdd[allPossible] = toAdd[aid];
            toAdd[aid] = tmp;
          } else {
            aid += 1;
          }
        }
        if (allPossible === 0) {
          break;
        }
        const pToAdd = Math.floor(Math.random() * allPossible);
        toAdd[pToAdd].push(c);
        index += 1;
        if (toAdd[pToAdd].length === this.playersInfo[toAdd[pToAdd].id].numCards) {
          removeFromUnorderedArray(toAdd, toAdd[pToAdd]);
          if (toAdd.length === 0) {
            break;
          }
        }
      }
      if (index === this.remainingCards.length) {
        break;
      }
    }

    if (sample.some((s, i) => s.length !== this.playersInfo[i].numCards)) {
      console.log(this.remainingCards.length, sample, this.playersInfo, tryT);
      throw new Error('eh');
    }

    tryT -= 1;
  }
}

export default McBrain;
