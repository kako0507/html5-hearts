import domBinding from './domBinding';

const suits = ['spade', 'heart', 'club', 'diamond'];

class Card {
  constructor(id) {
    this.id = id;
    this.num = (id % 13) + 1;
    this.suit = id % 4;
    this.flipped = true;

    const acutualNum = this.num + 1;
    let numtext = `${acutualNum}`;
    if (acutualNum > 10) {
      numtext = ({
        11: 'J',
        12: 'Q',
        13: 'K',
        14: 'A',
      })[acutualNum];
    }
    this.display = domBinding.createCardDisplay(numtext, this.suit);
    this.display.onClick = this.shift.bind(this);
  }

  adjustPos = (noUpdate) => {
    if (!noUpdate) this.pos = this.parent.getPosFor(this.index);
    this.display.adjustPos(this.pos);
  }

  shift = () => {
    if (!this.display.isSelectable()) return;
    if (!this.parent.curShifted) return;
    if (this.parent.curShifted.indexOf(this) !== -1) {
      this.parent.removeShift(this);
    } else {
      this.parent.addShift(this);
    }
  }

  out = () => {
    this.display.out();
  };
}

Card.suits = suits;

export default Card;
