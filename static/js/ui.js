define(() => {
  const arrow = document.createElement('div');


  const button = document.createElement('button');


  const message = document.createElement('div');


  const endMessage = document.createElement('div');

  button.id = 'play-button';
  message.id = 'game-message';
  arrow.innerHTML = '&larr;';
  arrow.id = 'pass-arrow';
  endMessage.id = 'end-message';

  document.body.appendChild(arrow);
  document.body.appendChild(button);
  document.body.appendChild(message);
  document.body.appendChild(endMessage);

  return {
    clearEvents() {
      $(button).off('click');
      $(arrow).off('click');
    },
    showArrow() {
      arrow.classList.add('show');
    },
    hideArrow() {
      arrow.classList.remove('show');
    },
    showButton(text) {
      button.innerHTML = text;
      button.classList.add('show');
    },
    hideButton(text) {
      button.classList.remove('show');
    },
    arrowClickOnce(cb) {
      $(arrow).on('click', function () {
        cb();
        $(this).off('click');
      });
    },
    buttonClickOnce(cb) {
      $(button).on('click', function () {
        cb();
        $(this).off('click');
      });
    },
    showWin(won) {
      endMessage.innerHTML = won ? 'YOU WON!' : 'YOU LOST!';
      endMessage.classList.add('show');
    },
    hideWin() {
      endMessage.classList.remove('show');
    },
    showMessage(msg) {
      message.innerHTML = msg;
      message.style.display = 'block';
    },
    showPassingScreen(dir) {
      const directions = ['left', 'right', 'opposite'];
      this.showMessage(`Pass three cards to the ${directions[dir]}`);
      [function () {
        $(arrow).css('transform', 'rotate(0)');
      }, function () {
        $(arrow).css('transform', 'rotate(180deg)');
      }, function () {
        $(arrow).css('transform', 'rotate(90deg)');
      }][dir]();
    },
    hideMessage() {
      message.style.display = '';
    },
  };
});
