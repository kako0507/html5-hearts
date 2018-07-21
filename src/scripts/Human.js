import Player from './Player';
import ui from './ui';

class Human extends Player {
  constructor(id, name) {
    super(id, name);
    this.row.flipped = false;
    this.display.setHuman(true);
  }

  takeIn(cards) {
    super.takeIn(cards);
    this.row.setSelected(cards);
  }

  initForNewRound() {
    super.initForNewRound();
    this.row.curShifted = [];
  }

  decide = (validCards) => {
    validCards.forEach((c) => {
      c.display.setSelectable(true);
    });
    if (validCards.length === 1 && validCards[0].id === 26) {
      ui.showMessage('Please start with 2 of Clubs.');
    }
    return new Promise((resolve) => {
      ui.buttonClickOnce(() => {
        ui.hideMessage();
        ui.hideButton();
        validCards.forEach((c) => {
          c.display.setSelectable(false);
        });
        resolve(this.row.getSelected()[0]);
      });
    });
  }

  confirmTransfer = () => {
    ui.showButton('Confirm');
    ui.hideArrow();
    ui.hideMessage();
    return new Promise((resolve) => {
      ui.buttonClickOnce(() => {
        this.doneTransfer();
        resolve();
      });
    });
  }

  doneTransfer = () => {
    this.row.curShifted = [];
    this.row.adjustPos();
    ui.hideButton();
  }

  prepareTransfer = (dir) => {
    ui.showPassingScreen(dir);
    this.row.cards.forEach((c) => {
      c.display.setSelectable(true);
    });
    this.row.maxShift = 3;

    return new Promise((resolve) => {
      ui.arrowClickOnce(() => {
        this.selected = this.row.getSelected();
        this.row.maxShift = 1;
        this.row.cards.forEach((c) => {
          c.display.setSelectable(false);
        });
        resolve();
      });
    });
  }

  rowSelected = () => {
    if (this.row.maxShift === 3) {
      ui.showArrow();
    } else {
      ui.showButton('Go!');
    }
  }

  rowDeselected = () => {
    if (this.row.maxShift === 3) {
      ui.hideArrow();
    } else {
      ui.hideButton();
    }
  }
}

export default Human;
