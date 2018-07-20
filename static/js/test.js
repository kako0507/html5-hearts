(function () {
  const allScores = [];


  let games = 0;


  const maxGames = 1000;


  const scoreSums = [0, 0, 0, 0];
  const showStats = function () {
    console.log(allScores);
    const sums = [0, 0, 0, 0];
    allScores.forEach((ss) => {
      ss.forEach((s, ind) => {
        sums[ind] += s;
      });
    });
    console.log('sums: ', sums);
  };
  const test = window.tester = {
    log(msg, players, cards) {
      if (!window.isDebug) return;
      if (!(players instanceof Array)) {
        players = [players];
      }

      if (!(cards instanceof Array)) {
        cards = [cards];
      }

      const text = `[log] ${msg}: players [${
        players.map(p => p.id).join(', ')
      }] cards [${
        cards.map(c => `{${c.num + 1}, ${Card.suits[c.suit]}}`).join(', ')}`;

      // console.log(text + "<br>");
    },
    informNewGame() {
      if (!window.isDebug) return;
      console.log(`Current game: ${games}`);
      games++;
      if (games > maxGames) {
        showStats();
        process.exit();
      }
    },
    recordScore(scores) {
      if (!window.isDebug) return;
      allScores.push(scores);
      scores.forEach((s, ind) => {
        scoreSums[ind] += s;
      });
      console.log(scoreSums);
    },
  };
}());
