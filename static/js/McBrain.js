define(['Simulator', 'Brain', 'prematureOptimization'],
  (Simulator, Brain, op) => {
    const cardsInfo = op.cardsInfo;
    const removeFromUnorderedArray = op.removeFromUnorderedArray;
    const defaultOptions = {
      time: 1000,
    };

    const McBrain = function (userid, options) {
      Brain.call(this, userid);

      if (!options) {
        options = defaultOptions;
      }

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
      for (let i = 0; i < 52; i++) {
        this.remainingCards.push(i);
      }

      this.cardLackCount = cardsInfo.map(() => 0);

      this.simulator = new Simulator();
    };

    McBrain.prototype = Object.create(Brain.prototype);

    McBrain.prototype.removeRemainingCard = function (id) {
      removeFromUnorderedArray(this.remainingCards, id);
      this.playersInfo.forEach((p) => {
        removeFromUnorderedArray(p.hasCard, id);
      });
    };

    McBrain.prototype.markLackCard = function (c, player) {
      if (!player.lackCard[c]) {
        player.lackCard[c] = true;
        this.cardLackCount[c]++;
      }
    };

    McBrain.prototype.watch = function (info) {
      if (info.type === 'in') {
        info.cards.forEach((c) => {
          this.removeRemainingCard(c);
        });
        [].push.apply(this.playersInfo[info.player].hasCard, info.cards);
      } else {
        this.playersInfo[info.player].numCards--;
        this.removeRemainingCard(info.card);
        if (cardsInfo[info.card].suit === 1) this.heartBroken = true;
        const markLackCard = this.markLackCard.bind(this);


        const lackCardPlayer = this.playersInfo[info.player];
        if (info.curSuit !== cardsInfo[info.card].suit) {
          this.remainingCards.forEach((c) => {
            if (cardsInfo[c].suit === info.curSuit) {
              markLackCard(c, lackCardPlayer);
            }
          });
        }
      }
    };

    McBrain.prototype.confirmCards = function (cards) {
      cards.forEach((c) => {
        this.removeRemainingCard(c);
        this.samplePlayers[this.user].push(c);
      });
    };

    McBrain.prototype.decide = function (vc, cids, pids, pscores) {
      let r;

      if (vc.length === 1) {
        r = vc[0];
      } else {
        let samples = 0;


        const endTime = Date.now() + this.maxTime;
        const scores = vc.map(c => 0);
        let i;
        this.preGenSample();
        while (Date.now() < endTime) {
          samples++;
          this.genSample();
          for (i = 0; i < vc.length; i++) {
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
          // alert(samples);
        }

        let minScore = 1 / 0; let
          bestC;
        for (i = 0; i < scores.length; i++) {
          if (minScore > scores[i]) {
            minScore = scores[i];
            bestC = i;
          }
        }
        r = vc[bestC];

        // console.log(minScore, bestC, scores, vc);
      }

      removeFromUnorderedArray(this.samplePlayers[this.user], r.id);

      return r.ind;
    };

    McBrain.prototype.preGenSample = function () {
      const cardLackCount = this.cardLackCount;
      this.remainingCards.sort((a, b) => cardLackCount[b] - cardLackCount[a]);
    };

    McBrain.prototype.genSample = function () {
      const id = this.user;


      const sample = this.samplePlayers;


      const playersInfo = this.playersInfo;

      let tryT = 1000000; let
        ind;
      while (tryT--) {
        sample.forEach((p, ind) => {
          if (ind !== id) {
            p.length = 0;
          }
          p.id = ind;
        });
        this.playersInfo.forEach((p, ind) => {
          [].push.apply(sample[ind], p.hasCard);
        });
        const toAdd = sample.filter((s, ind) => s.length < playersInfo[ind].numCards);
        ind = 0;
        var sum = 0;
        var summ = 0;
        toAdd.forEach((to) => {
          sum += to.length;
          summ += playersInfo[to.id].numCards;
        });
        while (ind < this.remainingCards.length) {
          const c = this.remainingCards[ind];
          let allPossible = toAdd.length;
          let aid = 0;
          while (aid < allPossible) {
            if (this.playersInfo[toAdd[aid].id].lackCard[c]) {
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
        if (ind === this.remainingCards.length) {
          break;
        }
      }
      if (tryT === -1) {
        console.log(this.remainingCards, this.playersInfo);
        alert('fail to gen sample');
      }
      if (sample.some((s, ind) => s.length !== playersInfo[ind].numCards)) {
        console.log(this.remainingCards.length, sample, playersInfo, tryT);
        throw 'eh';
      }
    };

    return McBrain;
  });
