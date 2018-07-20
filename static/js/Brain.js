define(() => {
  const Brain = function (user) {
    this.user = user;
    this.playerInfo = [[], [], [], []];
  };

  Brain.prototype.watch = function (info) {};

  Brain.prototype.confirmCards = function () {
    return {
      done(cb) {
        cb();
      },
    };
  };

  Brain.prototype.init = function () {
    return $.Deferred().resolve();
  };

  Brain.prototype.terminate = function () {

  };

  return Brain;
});
