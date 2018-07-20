define(['Brain'],
  (Brain) => {
    const AsyncBrain = function (user, brainName, options) {
      Brain.call(this, user);
      const worker = this.worker = new Worker('/js/BrainWorker.js');
      this.initDefer = $.Deferred();
      const self = this;
      this.worker.onmessage = function (e) {
        if (e.data.type === 'decision') {
          self.curDefer.resolve(e.data.result);
          self.curDefer = null;
        } else if (e.data.type === 'loaded') {
          worker.postMessage({
            type: 'ini',
            userId: user.id,
            brain: brainName,
            options,
          });
        } else if (e.data.type === 'ini-ed') {
          self.initDefer.resolve();
        } else if (e.data.type === 'confirmed') {
          self.confirmDefer.resolve();
        }
      };
    };

    AsyncBrain.prototype = Object.create(Brain.prototype);

    AsyncBrain.prototype.terminate = function () {
      this.initDefer && this.initDefer.reject();
      this.curDefer && this.curDefer.reject();
      this.confirmDefer && this.confirmDefer.reject();
    };

    AsyncBrain.prototype.init = function () {
      return this.initDefer;
    };

    AsyncBrain.prototype.watch = function (info) {
      const tinfo = {
        type: info.type,
        player: info.player.id,
      };
      if (info.cards) {
        tinfo.cards = info.cards.map(c => c.id);
      }
      if (info.card) {
        tinfo.card = info.card.id;
      }
      if (info.curSuit) {
        tinfo.curSuit = info.curSuit;
      }
      this.worker.postMessage({
        type: 'watch',
        params: tinfo,
      });
    };

    AsyncBrain.prototype.confirmCards = function () {
      this.worker.postMessage({
        type: 'confirm',
        cards: this.user.row.cards.map(c => c.id),
      });
      this.confirmDefer = $.Deferred();
      return this.confirmDefer;
    };

    AsyncBrain.prototype.decide = function (validCards, boardCards, boardPlayers, scores) {
      this.worker.postMessage({
        type: 'decide',
        params: {
          validCards: validCards.map(c => ({ id: c.id, ind: c.ind })),
          boardCards: boardCards.map(c => c.id),
          boardPlayers: boardPlayers.map(c => c.id),
          scores,
        },
      });
      this.curDefer = $.Deferred();
      return this.curDefer;
    };

    return AsyncBrain;
  });
