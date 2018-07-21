import $ from 'jquery';
import ui from './ui';
import Human from './Human';
import Ai from './Ai';
import board from './board';
import config from './config';
import rules from './rules';
import AsyncBrain from './AsyncBrain';
import SimpleBrain from './SimpleBrain';

let rounds = 0;
const players = [
  new Human(0, config.names[0]),
  new Ai(1, config.names[1]),
  new Ai(2, config.names[2]),
  new Ai(3, config.names[3]),
];

let status = 'prepare';
let currentPlay = 0;
let played = 0;
let heartBroken = false;
let nextTimer = 0;

const waitDefer = (time) => {
  const d = $.Deferred();
  setTimeout(() => {
    d.resolve();
  }, time);
  return d;
};

const initBrains = () => {
  if (players[1].brain) {
    players[1].brain.terminate();
    players[2].brain.terminate();
    players[3].brain.terminate();
  }

  for (let i = 1; i < 4; i += 1) {
    if (config.levels[i] == 1) {
      players[i].brain = new SimpleBrain(players[i]);
    } else if (config.levels[i] == 2) {
      players[i].brain = new AsyncBrain(players[i], 'McBrain');
    } else if (config.levels[i] == 3) {
      players[i].brain = new AsyncBrain(players[i], 'PomDPBrain');
    } else if (config.levels[i] == 4) {
      players[i].brain = new AsyncBrain(players[i], 'PomDPBrain', { time: 2000 });
    }
  }

  return $.when(
    players[1].brain.init(),
    players[2].brain.init(),
    players[3].brain.init(),
  );
};

const informCardOut = (player, card) => {
  if (card.suit === 1) {
    heartBroken = true;
  }
  players.forEach((p) => {
    p.watch({
      type: 'out',
      player,
      card,
      curSuit: board.desk.cards[0].suit,
    });
  });
};

const adds = [1, 3, 2];
const getPlayerForTransfer = id => (id + adds[rounds % 3]) % 4;

export default {
  adjustLayout() {
    players.forEach((r) => {
      r.adjustPos();
    });
    board.desk.adjustPos();
  },
  newGame() {
    clearTimeout(nextTimer);
    ui.hideWin();
    players.forEach((p, i) => {
      p.clearScore();
      p.setActive(false);
      p.setName(config.names[i]);
    });
    rounds = 0;
    ui.clearEvents();
    status = 'prepare';
    this.proceed();
  },
  next() {
    console.log(status, 'next');
    if (status == 'confirming') {
      currentPlay = board.cards[26].parent.playedBy.id;
      played = 0;
    } else if (status == 'playing') {
      currentPlay = (currentPlay + 1) % 4;
      played += 1;
    }
    if (played == 4) {
      status = 'endRound';
      played = 0;
    } else if (status == 'endRound' && players[0].row.cards.length === 0) {
      status = 'end';
    } else {
      status = ({
        prepare: 'distribute',
        distribute: 'start',
        start: 'passing',
        passing: 'confirming',
        confirming: 'playing',
        playing: 'playing',
        endRound: 'playing',
        end: 'prepare',
      })[status];
    }
    const waitTime = {
      playing: 100,
      endRound: 900,
      distribute: 300,
      end: 900,
    };
    const wait = waitTime[status] || 0;
    nextTimer = setTimeout(this.proceed.bind(this), wait);
  },
  proceed() {
    ({
      prepare() {
        ui.hideMessage();
        ui.hideButton();
        players.forEach((p) => {
          p.initForNewRound();
        });
        board.init();
        heartBroken = false;
        board.shuffleDeck();
        initBrains().done(this.next.bind(this));
      },
      distribute() {
        const self = this;
        board.distribute(players).done(() => {
          players.forEach((p) => {
            p.row.sort();
          });
          self.next();
        });
      },
      start() {
        rounds += 1;
        $.when(...players.map(p => p.prepareTransfer(rounds % 3))).done(this.next.bind(this));
      },
      passing() {
        for (let i = 0; i < 4; i += 1) {
          players[i].transferTo(players[getPlayerForTransfer(i)]);
        }
        this.next();
      },
      confirming() {
        players.forEach((r) => {
          r.row.sort();
        });
        $.when(...players.map(p => p.confirmTransfer())).done(this.next.bind(this));
      },
      playing() {
        players[currentPlay].setActive(true);
        $.when(players[currentPlay].decide(
          rules.getValidCards(players[currentPlay].row.cards,
            board.desk.cards[0] ? board.desk.cards[0].suit : -1,
            heartBroken),
          board.desk.cards,
          board.desk.players,
          players.map(p => p.getScore()),
        ), waitDefer(200))
          .done((card) => {
            players[currentPlay].setActive(false);
            card.parent.out(card);
            board.desk.addCard(card, players[currentPlay]);
            card.adjustPos();
            informCardOut(players[currentPlay], card);
            this.next();
          });
      },
      endRound() {
        const info = board.desk.score();
        currentPlay = info[0].id;
        info[0].waste.addCards(info[1]);
        this.next();
      },
      end() {
        if (players.some(p => p.getScore() === 26)) {
          players.forEach((p) => {
            if (p.getScore() !== 26) {
              p.setScore(26);
            } else {
              p.setScore(0);
            }
          });
        }
        players.forEach((p) => {
          p.finalizeScore();
        });
        const rank = players.map(c => c);
        rank.sort((a, b) => a.oldScore - b.oldScore);
        rank.forEach((r, index) => {
          r.display.rank = index;
        });
        players.forEach((p) => {
          p.adjustPos();
        });
        if (players.some(p => p.oldScore >= 100)) {
          players.forEach((p) => {
            p.display.moveUp = true;
            p.display.adjustPos();
          });
          ui.showWin(players[0] === rank[0]);
          ui.showButton('Restart');
          ui.buttonClickOnce(this.newGame.bind(this));
        } else {
          ui.showButton('Continue');
          ui.buttonClickOnce(this.next.bind(this));
        }
      },
    })[status].bind(this)();
  },
};
