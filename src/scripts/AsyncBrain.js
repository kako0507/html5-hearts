import $ from 'jquery';
import Brain from './Brain';
import Worker from './brain.worker';

class AsyncBrain extends Brain {
  constructor(user, brainName, options) {
    super(user);
    this.worker = new Worker();
    this.initDefer = $.Deferred();
    this.worker.onmessage = (e) => {
      if (e.data.type === 'decision') {
        this.curDefer.resolve(e.data.result);
        this.curDefer = null;
      } else if (e.data.type === 'loaded') {
        this.worker.postMessage({
          type: 'ini',
          userId: user.id,
          brain: brainName,
          options,
        });
      } else if (e.data.type === 'ini-ed') {
        this.initDefer.resolve();
      } else if (e.data.type === 'confirmed') {
        this.confirmDefer.resolve();
      }
    };
  }

  terminate = () => {
    if (this.initDefer) this.initDefer.reject();
    if (this.curDefer) this.curDefer.reject();
    if (this.confirmDefer) this.confirmDefer.reject();
  }

  init = () => this.initDefer

  watch = (info) => {
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
  }

  confirmCards = () => {
    this.worker.postMessage({
      type: 'confirm',
      cards: this.user.row.cards.map(c => c.id),
    });
    this.confirmDefer = $.Deferred();
    return this.confirmDefer;
  }

  decide = (validCards, boardCards, boardPlayers, scores) => {
    this.worker.postMessage({
      type: 'decide',
      params: {
        validCards: validCards.map(c => ({ id: c.id, index: c.index })),
        boardCards: boardCards.map(c => c.id),
        boardPlayers: boardPlayers.map(c => c.id),
        scores,
      },
    });
    this.curDefer = $.Deferred();
    return this.curDefer;
  }
}

export default AsyncBrain;
