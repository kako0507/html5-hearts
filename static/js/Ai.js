define(['Player', 'jquery'],
  (Player, $) => {
    const Ai = function (id, name) {
      Player.call(this, id, name);
    };

    Ai.prototype = Object.create(Player.prototype);

    Ai.prototype.prepareTransfer = function () {
      const selected = []; const
        cards = [];
      while (selected.length < 3) {
        const s = Math.floor(Math.random() * this.row.cards.length);
        if (selected.indexOf(s) === -1) {
          selected.push(s);
        }
      }
      for (let i = 0; i < 3; i++) {
        cards.push(this.row.cards[selected[i]]);
      }
      this.selected = cards;
      return $.Deferred().resolve();
    };

    Ai.prototype.confirmTransfer = function () {
      return this.brain.confirmCards();
    };

    Ai.prototype.transferTo = function (other) {
      const selected = this.selected;
      Player.prototype.transferTo.call(this, other);
      this.brain.watch({
        type: 'in',
        player: other,
        cards: selected,
      });
    };

    Ai.prototype.watch = function (info) {
      this.brain.watch(info);
    };

    Ai.prototype.decide = function (validCards, boardCards, boardPlayers, scores) {
      return this.brain.decide(validCards, boardCards, boardPlayers, scores).then(c => this.row.cards[c]);
    };

    return Ai;
  });
