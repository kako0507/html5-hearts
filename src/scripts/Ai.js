import Player from './Player';

class Ai extends Player {
  transferTo(other) {
    super.transferTo(other);
    this.brain.watch({
      type: 'in',
      player: other,
      cards: this.selected,
    });
  }

  prepareTransfer = () => {
    const selected = [];
    const cards = [];
    while (selected.length < 3) {
      const s = Math.floor(Math.random() * this.row.cards.length);
      if (selected.indexOf(s) === -1) {
        selected.push(s);
      }
    }
    for (let i = 0; i < 3; i += 1) {
      cards.push(this.row.cards[selected[i]]);
    }
    this.selected = cards;
    return Promise.resolve();
  }

  confirmTransfer = () => this.brain.confirmCards()

  watch = (info) => {
    this.brain.watch(info);
  }

  decide = (validCards, boardCards, boardPlayers, scores) => (
    this.brain
      .decide(validCards, boardCards, boardPlayers, scores)
      .then(c => this.row.cards[c])
  )
}

export default Ai;
