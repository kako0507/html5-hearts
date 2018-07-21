import Row from './Row';
import Waste from './Waste';
import domBinding from './domBinding';

class Player {
  constructor(id, name) {
    this.row = new Row(id, this);
    this.waste = new Waste(id, this);
    this.id = id;
    this.score = 0;
    this.oldScore = 0;
    this.display = domBinding.createPlayerDisplay(id, name);
    this.brain = null;
    this.selected = null;
  }

  setName = (name) => {
    this.display.setName(name);
  }

  adjustPos = () => {
    this.row.adjustPos();
    this.waste.adjustPos();
    this.display.adjustPos();
  }

  initForNewRound = () => {
    this.score = 0;
    this.row.cards = [];
    this.waste.cards = [];
    this.display.rank = null;
    this.display.moveUp = false;
    this.display.adjustPos();
    this.display.setScoreText(this.oldScore);

    // if(this.id % 2 === 1) this.brain = new McBrain(this);
    // if(this.id === 2) this.brain = new McBrain(this);
    // else if(this.id === 1) this.brain = new PomDPBrain(this);
    // else if(this.id === 2) this.brain = new randomBrain(this);
    // else this.brain = new SimpleBrain(this);
    // this.brain = new RandomBrain();
  }

  out = (outCards) => {
    const self = this;
    outCards.forEach((c) => {
      self.row.out(c);
    });
  }

  takeIn = (inCards) => {
    const self = this;
    inCards.forEach((c) => {
      self.row.addCard(c);
    });
  }

  clearScore = () => {
    this.score = 0;
    this.oldScore = 0;
  }

  setScore = (val) => {
    this.score = val;
    this.display.setScoreText(`${this.oldScore} + ${this.score}`);
  }

  finalizeScore = () => {
    this.oldScore += this.score;
    this.score = 0;
    this.display.setFinalText(this.oldScore);
  }

  incrementScore = (val) => {
    this.setScore(this.score + val);
    if (val > 0) this.display.highlight();
  }

  getScore = () => this.score

  setActive = (yes) => {
    this.display.setHighlight(yes);
  }

  watch = () => {}

  transferTo = (other) => {
    const cards = this.selected;
    this.selected = null;
    this.out(cards);
    other.takeIn(cards);
  }
}

export default Player;
