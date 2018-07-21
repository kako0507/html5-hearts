import _ from 'lodash';
import PomDPSimulator from './PomDPSimulator';
import Brain from './Brain';
import { cardsInfo, removeFromUnorderedArray } from './prematureOptimization';

const defaultOptions = {
  time: 1000,
  c: 10,
};

class PomDPBrain extends Brain {
  constructor(user, options = defaultOptions) {
    super(user);
    this.playerInfo = undefined;

    this.c = options.c || 10;
    this.maxTime = options.time || 1000;

    this.user = user;
    this.index = user;
    this.simulator = new PomDPSimulator(user);
    const remainingCards = _.range(52);
    this.root = {
      count: 0,
      value: 0,
      observations: {},
      info: {
        playersInfo: [
          {
            hasCards: [],
            lackCard: {},
            numCards: 13,
            score: 0,
          },
          {
            hasCards: [],
            lackCard: {},
            numCards: 13,
            score: 0,
          },
          {
            hasCards: [],
            lackCard: {},
            numCards: 13,
            score: 0,
          },
          {
            hasCards: [],
            lackCard: {},
            numCards: 13,
            score: 0,
          },
        ],
        remainingCards,
        curBoard: [],
        heartBroken: false,
        cardLackCount: remainingCards.map(() => 0),
      },
    };
    this.observationBuffer = [];
  }

  search = (vc) => {
    const endTime = Date.now() + this.maxTime;
    while (Date.now() < endTime) {
      const state = this.genSample(this.root);
      this.simulate(state, this.root, 0);
    }
    const actions = Object.keys(this.root.actions).map(a => parseInt(a, 10));


    const gameactions = vc.map(v => v.id);
    actions.forEach((a) => {
      if (gameactions.indexOf(a) === -1) {
        throw new Error(`mismatch ${a}`);
      }
      removeFromUnorderedArray(gameactions, a);
    });
    if (gameactions.length) throw new Error(`mismatch ${gameactions.join(' ')}`);

    let best = -1 / 0;


    let bestAction = 0;
    for (const a in this.root.actions) {
      if (this.root.actions[a].value > best) {
        best = this.root.actions[a].value;
        bestAction = a;
      }
    }
    this.root = this.root.actions[bestAction];
    return bestAction;
  }

  rollout = s => this.simulator.run(s)

  simulate = (s, h, depth) => {
    if (h.terminate) return 0;
    if (!h.actions) {
      const as = {};
      h.actions = as;
      this.getAllActions(h).forEach((a) => {
        if (a === 'undefined' || (!a && a !== 0)) throw a;
        as[a] = this.initAction(h, a);
      });
      return this.rollout(s, h, depth);
    }
    let best;


    let bestScore = -1 / 0;
    for (const a in h.actions) {
      const score = this.getScore(h.actions[a]);
      if (score > bestScore) {
        bestScore = score;
        best = a;
      }
    }
    if (!best) {
      throw new Error('eh');
    }

    const simulateResult = this.simulator.step(s, parseInt(best, 10));
    const ha = h.actions[best];
    const ohash = simulateResult.observation.join('');
    if (!(ohash in ha.observations)) {
      ha.observations[ohash] = this.initObservation(ha, simulateResult.observation);
    }

    const r = (
      simulateResult.score
    + this.simulate(simulateResult.state, ha.observations[ohash], depth + 1)
    );

    h.count += 1;
    ha.count += 1;
    ha.value = (ha.value * (ha.count - 1) + r) / ha.count;
    return r;
  };

  getScore = (action) => {
    if (!action.count) return 1 / 0;
    return action.value + this.c * Math.sqrt(Math.log(action.parent.count) / action.count);
  };

  getAllActions = ({ info }) => {
    if (info.curBoard.length) {
      const { suit } = cardsInfo[info.curBoard[0] % 100];
      const r = info.playersInfo[this.index].hasCards.filter(c => cardsInfo[c].suit === suit);
      if (!r.length) {
        return [].concat(info.playersInfo[this.index].hasCards);
      }
      return r;
    } if (info.playersInfo[this.index].hasCards.length === 13) {
      return [26];
    } if (info.heartBroken) {
      return [].concat(info.playersInfo[this.index].hasCards);
    }
    const possible = info.playersInfo[this.index].hasCards.filter(c => cardsInfo[c].suit !== 1);
    if (possible.length) return possible;
    return [].concat(info.playersInfo[this.index].hasCards);
  };

  initObservation = (history, observation) => {
    const pinfo = history.info;
    const curBoard = [].concat(pinfo.curBoard);

    let { heartBroken } = pinfo;

    const playersInfo = pinfo.playersInfo.map(info => ({
      hasCards: [].concat(info.hasCards),
      lackCard: Object.create(info.lackCard),
      numCards: info.numCards,
      score: info.score,
    }));

    const remainingCards = [].concat(pinfo.remainingCards);
    const cardLackCount = [].concat(pinfo.cardLackCount);
    const info = {
      curBoard,
      heartBroken,
      playersInfo,
      hash: observation.join(''),
      cardLackCount,
      remainingCards,
    };
    observation.forEach((ob) => {
      const pid = ((ob / 100) | 0) - 1;
      playersInfo[pid].numCards -= 1;
      this.removeRemainingCard(ob % 100, info);
      heartBroken = heartBroken || (cardsInfo[ob % 100].suit === 1);
      let curSuit;
      if (curBoard.length) {
        curSuit = cardsInfo[curBoard[0] % 100].suit;
        if (curSuit) {
          if (curSuit !== cardsInfo[ob % 100].suit) {
            const lackCardPlayer = playersInfo[pid];
            remainingCards.forEach((c) => {
              if (cardsInfo[c].suit === curSuit) {
                lackCardPlayer.lackCard[c] = true;
                cardLackCount[c] += 1;
              }
            });
          }
        }
      }
      curBoard.push(ob);
      if (curBoard.length === 4) {
        let maxNum = -1; let maxPlayer = 0; let
          boardScore = 0;
        for (let i = 0; i < 4; i += 1) {
          const bcard = cardsInfo[curBoard[i] % 100];
          if (bcard.suit === curSuit && bcard.num > maxNum) {
            maxPlayer = ((curBoard[i] / 100) | 0) - 1;
            maxNum = bcard.num;
          }
          if (bcard.suit === 1) boardScore += 1;
          else if (bcard.suit === 0 && bcard.num === 11) boardScore += 13;
        }
        playersInfo[maxPlayer].score += boardScore;
        curBoard.length = 0;
      }
    });
    info.heartBroken = heartBroken;
    remainingCards.sort((a, b) => cardLackCount[b] - cardLackCount[a]);

    const terminate = !playersInfo.some(p => p.numCards > 0);

    return {
      info,
      count: 0,
      value: 0,
      terminate,
    };
  }

  initAction = (history, action) => {
    const { info } = history;
    const curBoard = [].concat(info.curBoard);

    const { heartBroken } = info;
    const playersInfo = info.playersInfo.map(i => ({
      hasCards: [].concat(i.hasCards),
      lackCard: Object.create(i.lackCard),
      numCards: i.numCards,
      score: i.score,
    }));

    const remainingCards = [].concat(info.remainingCards);
    const cardLackCount = [].concat(info.cardLackCount);
    return {
      value: 0,
      count: 0,
      parent: history,
      action,
      observations: {},
      info: {
        curBoard,
        heartBroken,
        playersInfo,
        cardLackCount,
        remainingCards,
      },
    };
  };

  removeRemainingCard = (id, info) => {
    removeFromUnorderedArray(info.remainingCards, id);
    info.playersInfo.forEach((p) => {
      removeFromUnorderedArray(p.hasCards, id);
    });
  }

  watch = (info) => {
    if (info.type === 'in') {
      info.cards.forEach((c) => {
        this.removeRemainingCard(c, this.root.info);
      });
      [].push.apply(this.root.info.playersInfo[info.player].hasCards, info.cards);
    } else {
      this.observationBuffer.push(info.card + (info.player + 1) * 100);
    }
  }

  confirmCards = (cards) => {
    cards.forEach((c) => {
      this.removeRemainingCard(c, this.root.info);
      this.root.info.playersInfo[this.index].hasCards.push(c);
    });
  }

  decide = (vc) => {
    if (this.observationBuffer.join('') in this.root) {
      this.root = this.root[this.observationBuffer.join('')];
    } else {
      this.root = this.initObservation(this.root, this.observationBuffer);
    }
    this.observationBuffer = [];

    const action = parseInt(this.search(vc, this.root), 10);

    for (let i = 0; i < vc.length; i += 1) {
      if (vc[i].id === action) {
        return vc[i].index;
      }
    }
    throw new Error('failed to find card, something must be of wrongness');
  };

  genSample = (node) => {
    const sample = [[], [], [], []];
    const { playersInfo, remainingCards } = node.info;

    let tryT = 1000;
    let index;
    while (tryT) {
      sample.forEach((p, i) => {
        p.length = 0;
        p.id = i;
      });
      playersInfo.forEach((p, i) => {
        [].push.apply(sample[i], p.hasCards);
      });
      const toAdd = sample.filter((s, i) => s.length < playersInfo[i].numCards);
      index = 0;

      while (index < remainingCards.length) {
        const c = remainingCards[index];
        let allPossible = toAdd.length;
        let aid = 0;
        while (aid < allPossible) {
          if (playersInfo[toAdd[aid].id].lackCard[c]) {
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
        if (toAdd[pToAdd].length === playersInfo[toAdd[pToAdd].id].numCards) {
          removeFromUnorderedArray(toAdd, toAdd[pToAdd]);
          if (toAdd.length === 0) {
            break;
          }
        }
      }
      if (index === remainingCards.length) {
        break;
      }
      tryT -= 1;
    }

    if (sample.some((s, i) => s.length !== playersInfo[i].numCards)) {
      throw new Error('eh');
    }
    return {
      players: sample,
      scores: node.info.playersInfo.map(info => info.score),
      board: node.info.curBoard.concat([]),
      heartBroken: node.info.heartBroken,
    };
  }
}

export default PomDPBrain;
