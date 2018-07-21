import $ from 'jquery';
import layout from './layout';
import domBinding from './domBinding';
import game from './game';
import config from './config';

import '../styles/style.css';

[layout.region] = $('#game-region');
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
  config.names.forEach((n, index) => {
    config.levels[index] = $(`.player-diff.${nums[index]} input`).val();
    config.names[index] = $(`.player-set-name.${nums[index]}`).text();
  });
  config.sync();
});
$('.newgame-but').on('click', () => {
  if (window.confirm('This will end the current game. Are you sure?')) {
    game.newGame();
  }
});
$('#settings-but').on('click', () => {
  $('#settings-dialog')[0].hidden = false;
  config.names.forEach((n, index) => {
    $(`.player-set-name.${nums[index]}`)[0].innerHTML = n;
    $(`.player-diff.${nums[index]} input`).val(Number(config.levels[index]));
    console.log(Number(config.levels[index]));
  });
  $('#control-region')[0].hidden = false;
});
game.newGame();
