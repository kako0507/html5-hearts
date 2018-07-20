define(['Card', 'jquery', 'layout'],
  (Card, $, layout) => {
    const cards = [];

    for (var i = 0; i < 52; i++) {
      cards.push(new Card(i));
    }

    const carddeck = [];
    for (i = 0; i < 52; i++) {
      carddeck.push(i);
    }
    return {
      cards,
      init() {
        this.desk.cards.length = 0;
        this.desk.players.length = 0;
        const self = this;
        this.cards.forEach((c) => {
          c.parent = self;
          c.display.setSelectable(false);
        });
      },
      shuffleDeck() {
        let i;

        for (i = 0; i < 52; i++) {
          const ran = Math.floor(Math.random() * (52 - i));
          const tmp = carddeck[ran];
          carddeck[ran] = carddeck[51 - i];
          carddeck[51 - i] = tmp;
        }

        for (i = 51; i >= 0; i--) {
          this.cards[carddeck[i]].ind = carddeck[i];
          this.cards[carddeck[i]].adjustPos();
        }
      },
      distribute(players) {
        let curI = 0;
        const d = $.Deferred();
        function move() {
          if (curI === cards.length) {
            setTimeout(() => {
              d.resolve();
            }, 200);
            return;
          }
          players[curI % 4].row.addCard(cards[carddeck[curI]]);
          players[curI % 4].row.adjustPos();
          curI++;
          setTimeout(move, 10);
        }
        setTimeout(() => { move(); }, 300);
        return d;
      },
      getPosFor(ind) {
        return {
          x: (52 - ind) / 4,
          y: (52 - ind) / 4,
          z: -i,
          rotateY: 180,
        };
      },
      desk: {
        cards: [],
        players: [],
        curScore: 0,
        getPosFor(ind) {
          const pos = {
            x: 0,
            y: layout.cardHeight / 2 + layout.cardWidth / 2,
            z: ind + 52,
            rotateY: 0,
          };
          pos.rotation = this.cards[ind].pos.rotation;
          return pos;
        },
        addCard(card, player) {
          card.ind = this.cards.length;
          this.cards.push(card);
          this.players.push(player);
          card.parent = this;
        },
        adjustPos() {
          this.cards.forEach((c) => {
            c.adjustPos();
          });
        },
        score() {
          let max = 0;
          for (let i = 1; i < 4; i++) {
            if (this.cards[i].suit === this.cards[max].suit && (this.cards[i].num > this.cards[max].num)) {
              max = i;
            }
          }
          const p = this.players[max];


          const self = this;
          let nextTime = 600;


          let time = 800;
          if (window.isDebug) {
            nextTime = 0;
            time = 0;
          }
          const info = [this.players[max], [].concat(this.cards)];
          this.players.length = 0;
          this.cards.length = 0;

          return info;
        },
      },
    };
  });
