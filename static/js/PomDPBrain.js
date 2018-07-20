define(['Brain', 'prematureOptimization', 'PomDPSimulator'],
  (Brain, op, PomDPSimulator) => {
    const removeFromUnorderedArray = op.removeFromUnorderedArray;
    const cardsInfo = op.cardsInfo;

    const defaultOptions = {
      time: 1000,
      c: 10,
    };

    const PomDPBrain = function (user, options) {
      if (!options) {
        options = defaultOptions;
      }

      this.c = options.c || 10;
      this.maxTime = options.time || 1000;

      this.user = user;
      this.ind = user;
      this.simulator = new PomDPSimulator(user);
      const remainingCards = [];
      for (let i = 0; i < 52; i++) {
        remainingCards.push(i);
      }
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
    };

    PomDPBrain.prototype = Object.create(Brain.prototype);

    PomDPBrain.prototype.search = function (vc) {
      const endTime = Date.now() + this.maxTime;
      let times = 0;
      while (Date.now() < endTime) {
        const state = this.genSample(this.root);
        this.simulate(state, this.root, 0);
        times++;
      }
      const actions = Object.keys(this.root.actions).map(a => parseInt(a, 10));


      const gameactions = vc.map(v => v.id);
      actions.forEach((a) => {
        if (gameactions.indexOf(a) === -1) {
          throw `mismatch ${a}`;
        }
        removeFromUnorderedArray(gameactions, a);
      });
      if (gameactions.length) throw `mismatch ${gameactions.join(' ')}`;

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
    };

    PomDPBrain.prototype.rollout = function (s, h, depth) {
      // h.count++;
      const val = this.simulator.run(s);
      // h.value = ((h.count - 1) * h.value + val) / h.count;
      return val;
    };

    PomDPBrain.prototype.simulate = function (s, h, depth) {
      if (h.terminate) return 0;
      if (!h.actions) {
        const as = h.actions = {};
        this.getAllActions(h).forEach((a) => {
          if (a == 'undefined' || (!a && a !== 0)) throw a;
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
        throw 'eh';
      }

      const simulateResult = this.simulator.step(s, parseInt(best, 10));

      const ha = h.actions[best];


      const ohash = simulateResult.observation.join('');
      if (!(ohash in ha.observations)) {
        ha.observations[ohash] = this.initObservation(ha, simulateResult.observation);
      }

      const r = simulateResult.score + this.simulate(simulateResult.state, ha.observations[ohash], depth + 1);
      h.count++;
      ha.count++;
      ha.value = (ha.value * (ha.count - 1) + r) / ha.count;
      return r;
    };

    PomDPBrain.prototype.getScore = function (action) {
      if (!action.count) return 1 / 0;
      return action.value + this.c * Math.sqrt(Math.log(action.parent.count) / action.count);
    };

    PomDPBrain.prototype.getAllActions = function (history) {
      const info = history.info;
      if (info.curBoard.length) {
        const suit = cardsInfo[info.curBoard[0] % 100].suit;
        const r = info.playersInfo[this.ind].hasCards.filter(c => cardsInfo[c].suit === suit);
        if (!r.length) {
          return [].concat(info.playersInfo[this.ind].hasCards);
        }
        return r;
      } if (info.playersInfo[this.ind].hasCards.length === 13) {
        return [26];
      } if (info.heartBroken) {
        return [].concat(info.playersInfo[this.ind].hasCards);
      }
      const possible = info.playersInfo[this.ind].hasCards.filter(c => cardsInfo[c].suit !== 1);
      if (possible.length) return possible;
      return [].concat(info.playersInfo[this.ind].hasCards);
    };

    PomDPBrain.prototype.initObservation = function (history, observation) {
      const pinfo = history.info;
      const curBoard = [].concat(pinfo.curBoard);


      let heartBroken = pinfo.heartBroken;


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
        playersInfo[pid].numCards--;
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
                  cardLackCount[c]++;
                }
              });
            }
          }
        }
        curBoard.push(ob);
        if (curBoard.length === 4) {
          let maxNum = -1; let maxPlayer = 0; let
            boardScore = 0;
          for (let i = 0; i < 4; i++) {
            const bcard = cardsInfo[curBoard[i] % 100];
            if (bcard.suit === curSuit && bcard.num > maxNum) {
              maxPlayer = ((curBoard[i] / 100) | 0) - 1;
              maxNum = bcard.num;
            }
            if (bcard.suit === 1) boardScore++;
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
    };

    PomDPBrain.prototype.initAction = function (history, action) {
      const info = history.info;
      const curBoard = [].concat(info.curBoard);


      const heartBroken = info.heartBroken;


      const playersInfo = info.playersInfo.map(info => ({
        hasCards: [].concat(info.hasCards),
        lackCard: Object.create(info.lackCard),
        numCards: info.numCards,
        score: info.score,
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

    PomDPBrain.prototype.removeRemainingCard = function (id, info) {
      removeFromUnorderedArray(info.remainingCards, id);
      info.playersInfo.forEach((p, ind) => {
        removeFromUnorderedArray(p.hasCards, id);
      });
    };

    PomDPBrain.prototype.watch = function (info) {
      if (info.type === 'in') {
        info.cards.forEach((c) => {
          this.removeRemainingCard(c, this.root.info);
        });
        [].push.apply(this.root.info.playersInfo[info.player].hasCards, info.cards);
      } else {
        this.observationBuffer.push(info.card + (info.player + 1) * 100);
      }
    };

    PomDPBrain.prototype.confirmCards = function (cards) {
      cards.forEach((c) => {
        this.removeRemainingCard(c, this.root.info);
        this.root.info.playersInfo[this.ind].hasCards.push(c);
      });
    };

    PomDPBrain.prototype.decide = function (vc) {
      if (this.observationBuffer.join('') in this.root) {
        this.root = this.root[this.observationBuffer.join('')];
      } else {
        this.root = this.initObservation(this.root, this.observationBuffer);
      }
      this.observationBuffer = [];

      const action = parseInt(this.search(vc, this.root), 10);

      for (let i = 0; i < vc.length; i++) {
        if (vc[i].id === action) {
          return vc[i].ind;
        }
      }
      throw 'failed to find card, something must be of wrongness';
    };

    PomDPBrain.prototype.genSample = function (node) {
      const id = this.ind;


      const sample = [[], [], [], []];


      const playersInfo = node.info.playersInfo;


      const remainingCards = node.info.remainingCards;

      let tryT = 1000; let
        ind;
      while (tryT--) {
        sample.forEach((p, ind) => {
          p.length = 0;
          p.id = ind;
        });
        playersInfo.forEach((p, ind) => {
          [].push.apply(sample[ind], p.hasCards);
        });
        const toAdd = sample.filter((s, ind) => s.length < playersInfo[ind].numCards);
        ind = 0;
        var sum = 0;
        var summ = 0;
        toAdd.forEach((to) => {
          sum += to.length;
          summ += playersInfo[to.id].numCards;
        });
        while (ind < remainingCards.length) {
          const c = remainingCards[ind];
          let allPossible = toAdd.length;
          let aid = 0;
          while (aid < allPossible) {
            if (playersInfo[toAdd[aid].id].lackCard[c]) {
              allPossible--;
              const tmp = toAdd[allPossible];
              toAdd[allPossible] = toAdd[aid];
              toAdd[aid] = tmp;
            } else {
              aid++;
            }
          }
          if (allPossible === 0) {
            break;
          }
          const pToAdd = Math.floor(Math.random() * allPossible);
          toAdd[pToAdd].push(c);
          ind++;
          if (toAdd[pToAdd].length === playersInfo[toAdd[pToAdd].id].numCards) {
            removeFromUnorderedArray(toAdd, toAdd[pToAdd]);
            if (toAdd.length === 0) {
              break;
            }
          }
        }
        if (ind === remainingCards.length) {
          break;
        }
      }
      if (tryT === -1) {
        alert('fail to gen sample');
      }
      if (sample.some((s, ind) => s.length !== playersInfo[ind].numCards)) {
        throw 'eh';
      }
      return {
        players: sample,
        scores: node.info.playersInfo.map(info => info.score),
        board: node.info.curBoard.concat([]),
        heartBroken: node.info.heartBroken,
      };
    };

    return PomDPBrain;
  });
