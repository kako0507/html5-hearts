import $ from 'jquery';

class Brain {
  constructor(user) {
    this.user = user;
    this.playerInfo = [[], [], [], []];
  }

  confirmCards = () => ({
    done(cb) {
      cb();
    },
  })

  init = () => $.Deferred().resolve();

  watch = () => {}

  terminate = () => {}
}

export default Brain;
