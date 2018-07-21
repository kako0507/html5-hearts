import Brain from './Brain';
import Worker from './brain.worker';

class AsyncBrain extends Brain {
  constructor(user, brainName, options) {
    super(user);
    this.worker = new Worker();
    this.initPromise = new Promise((resolve, reject) => {
      this.initPromiseResolve = resolve;
      this.initPromiseReject = reject;
    });
    this.worker.onmessage = (e) => {
      if (e.data.type === 'decision') {
        this.curPromiseResolve(e.data.result);
        this.curPromise = null;
      } else if (e.data.type === 'loaded') {
        this.worker.postMessage({
          type: 'ini',
          userId: user.id,
          brain: brainName,
          options,
        });
      } else if (e.data.type === 'ini-ed') {
        this.initPromiseResolve();
      } else if (e.data.type === 'confirmed') {
        this.confirmPromiseResolve();
      }
    };
  }

  terminate = () => {
    if (this.initPromise) this.initPromiseReject();
    if (this.curPromise) this.curPromiseReject();
    if (this.confirmPromise) this.confirmPromiseReject();
  }

  init = () => this.initPromise

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
    this.confirmPromise = new Promise((resolve, reject) => {
      this.confirmPromiseResolve = resolve;
      this.confirmPromiseReject = reject;
    });
    return this.confirmPromise;
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
    this.curPromise = new Promise((resolve, reject) => {
      this.curPromiseResolve = resolve;
      this.curPromiseReject = reject;
    });
    return this.curPromise;
  }
}

export default AsyncBrain;
