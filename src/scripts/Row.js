import layout from './layout';

class Row {
  constructor(id, player) {
    this.id = id;
    this.cards = [];
    this.isVertical = id % 2;
    this.rotation = 90 * ((id + 1) % 4) - 90;
    this.curShifted = [];
    this.flipped = true;
    this.playedBy = player;
  }

  addCard = (card) => {
    card.parent = this;
    card.index = this.cards.length;
    this.cards.push(card);
  }

  getSelected = () => [].concat(this.curShifted)

  setSelected = (cards) => {
    this.curShifted = [].concat(cards);
  }

  adjustPos = () => {
    if (this.isVertical) {
      this.distance = layout.width / 2 - layout.rowMargin - layout.cardHeight / 2;
    } else {
      this.distance = layout.height / 2 - layout.rowMargin - layout.cardHeight / 2;
    }
    this.left = -((this.cards.length - 1) * layout.cardSep) / 2;
    this.cards.forEach((c) => {
      c.adjustPos();
    });
  }

  getPosFor = (index) => {
    const pos = {
      x: this.left + index * layout.cardSep,
      y: this.distance,
      rotation: this.rotation,
      rotateY: this.flipped ? 180 : 0,
      z: index,
    };
    if (this.curShifted.indexOf(this.cards[index]) > -1) {
      pos.y -= 30;
    }
    return pos;
  }

  sort = () => {
    this.cards.sort((a, b) => {
      if (a.suit !== b.suit) return b.suit - a.suit;
      return a.num - b.num;
    }).forEach((v, index) => {
      v.index = index;
    });
    this.adjustPos();
  }

  addShift = (nc) => {
    if (this.curShifted.length === this.maxShift) {
      this.curShifted.shift();
    }
    this.curShifted.push(nc);
    if (this.curShifted.length === this.maxShift) {
      this.playedBy.rowSelected(this.maxShift);
    }
    this.adjustPos();
  }

  out = (card) => {
    card.parent = null;
    const index = this.cards.indexOf(card);
    this.curShifted = [];
    this.cards.splice(index, 1);
    for (let i = index; i < this.cards.length; i += 1) {
      this.cards[i].index = i;
    }
    this.adjustPos();
  }

  removeShift = (nc) => {
    this.curShifted = this.curShifted.filter(v => v !== nc);
    this.playedBy.rowDeselected();
    this.adjustPos();
  }
}

export default Row;
