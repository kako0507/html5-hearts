import $ from 'jquery';

const suits = ['spade', 'heart', 'club', 'diamond'];
let frag;

class CardDisplay {
  constructor(dom) {
    this.dom = $(dom);
    this.dom.on('click', () => {
      if (this.onClick) this.onClick();
    });
  }

  adjustPos = (pos) => {
    if (!pos.rotation) {
      pos.rotation = 0;
    }
    if (!pos.rotateY) {
      pos.rotateY = 0;
    }
    this.dom.css({
      zIndex: 10 + pos.z,
      transform: `rotate(${pos.rotation}deg) translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) rotateY(${pos.rotateY}deg)`,
    });
  }

  setSelectable = (yes) => {
    if (yes) {
      this.dom.addClass('movable');
    } else {
      this.dom.removeClass('movable');
    }
  }

  isSelectable = () => this.dom.is('.movable')
}

class PlayerDisplay {
  constructor(id, name) {
    this.id = id;
    this.display = document.createElement('div');
    this.display.className = `info-board board-${id}`;
    this.nametext = document.createElement('div');
    this.nametext.className = 'player-name';
    this.nametext.innerHTML = name;
    this.scoretext = document.createElement('div');
    this.scoretext.className = 'player-score';
    this.scoretext.innerHTML = 0;
    this.finaltext = document.createElement('div');
    this.finaltext.className = 'final-score';
    this.finaltext.innerHTML = 0;

    this.display.appendChild(this.nametext);
    this.display.appendChild(this.scoretext);
    this.display.appendChild(this.finaltext);

    frag.appendChild(this.display);

    this.rank = null;
  }

  setName = (name) => {
    this.nametext.innerHTML = name;
  }


  setHuman = (yes) => {
    if (yes) {
      this.display.className += ' human';
    }
  }

  setHighlight = (yes) => {
    if (yes) {
      $(this.display).addClass('highlight');
    } else {
      $(this.display).removeClass('highlight');
    }
  }

  adjustPos = () => {
    const d = $(this.display);
    if (this.rank === null) {
      const adjust = this.finaltext.classList.contains('show') ? 55 : 0;
      this.finaltext.classList.remove('show');
      d.css({
        marginLeft: -d.width() / 2 + adjust,
        marginTop: -d.height() / 2,
        transform: '',
        top: '',
        left: '',
      }).removeClass('table');
    } else {
      this.finaltext.classList.add('show');
      d.css({
        top: this.moveUp ? '20%' : '50%',
        left: '50%',
        marginLeft: -d.width() / 2 - 55,
        marginTop: -d.height() / 2,
        transform: `translateY(${(1.2 * d.height()) * (this.rank - 2)}px)`,
      }).addClass('table');
    }
  }

  setScoreText = (text) => {
    this.scoretext.innerHTML = text;
  }

  setFinalText = (text) => {
    this.finaltext.innerHTML = text;
  }

  highlight = () => {
    const b = this.scoretext.classList;
    b.add('highlight');
    setTimeout(() => {
      b.remove('highlight');
    }, 100);
  }
}

export default {
  fragmentToDom(dom) {
    if (frag) {
      dom.appendChild(frag);
      frag = null;
    }
  },
  createPlayerDisplay(id, name) {
    return new PlayerDisplay(id, name);
  },
  createCardDisplay(numtext, suit) {
    if (!frag) {
      frag = document.createDocumentFragment();
    }
    const display = document.createElement('div');
    display.className = 'card flipped';
    $(display).css({
      transform: 'rotateY(180deg)',
    });

    const numText = document.createElement('div');
    numText.className = 'num';
    numText.innerHTML = numtext;

    const front = document.createElement('div');
    front.className = 'front';
    front.appendChild(numText);
    display.classList.add(suits[suit]);

    const icon = document.createElement('div');
    icon.className = 'icon';
    front.appendChild(icon);

    display.appendChild(front);

    const back = document.createElement('div');
    back.className = 'back';

    display.appendChild(back);

    frag.appendChild(display);

    return new CardDisplay(display);
  },
};
