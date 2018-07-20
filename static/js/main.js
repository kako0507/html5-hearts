require({
  baseUrl: '/js',
  paths: {
    jquery: 'lib/jquery.min',
  },
},
['game', 'jquery', 'domBinding', 'layout', 'config'],
(game, $, domBinding, layout, config) => {
  layout.region = $('#game-region')[0];
  layout.adjust();

  domBinding.fragmentToDom(layout.region);
  game.adjustLayout();

  $(window).resize(() => {
    layout.adjust();
    game.adjustLayout();
  });

  const nums = ['one', 'two', 'three', 'four'];
  $('#control-region>button').on('click', () => {
    $('#control-region')[0].hidden = true;
  });
  $('#control-region>.newgame-but').on('click', () => {
    config.names.forEach((n, ind) => {
      config.levels[ind] = $(`.player-diff.${nums[ind]} input`).val();
      config.names[ind] = $(`.player-set-name.${nums[ind]}`).text();
    });
    config.sync();
  });
  $('.newgame-but').on('click', () => {
    if (confirm('This will end the current game. Are you sure?')) {
      game.newGame();
    }
  });
  $('#settings-but').on('click', () => {
    $('#settings-dialog')[0].hidden = false;
    config.names.forEach((n, ind) => {
      $(`.player-set-name.${nums[ind]}`)[0].innerHTML = n;
      $(`.player-diff.${nums[ind]} input`).val(parseInt(config.levels[ind]));
      console.log(parseInt(config.levels[ind]));
    });
    $('#control-region')[0].hidden = false;
  });
  game.newGame();
});
