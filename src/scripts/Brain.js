class Brain {
  constructor(user) {
    this.user = user;
    this.playerInfo = [[], [], [], []];
  }

  confirmCards = () => { }

  init = () => Promise.resolve();

  watch = () => {}

  terminate = () => {}
}

export default Brain;
