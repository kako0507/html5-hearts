define(['Brain'],
  (Brain) => {
    const SimpleBrain = function (user) {
      Brain.call(this, user);
    };

    SimpleBrain.prototype = Object.create(Brain.prototype);

    SimpleBrain.prototype.decide = function (vc, board) {
      const len = vc.length;


      let suit = -1; let
        maxNum = -1;

      return $.Deferred().resolve((function () {
        if (board.length) {
          suit = board[0].suit;
          maxNum = board.reduce((prev, cur) => {
            if (cur.suit === suit && cur.num > prev) {
              return cur.num;
            }
            return prev;
          }, 0);
          return vc.reduce((prev, cur) => {
                    if(prev.suit === cur.suit){
                        if(cur.suit === suit){
                            if(cur.num < maxNum){
                                if(prev.num > maxNum || prev.num < cur.num) return cur;
                                else return prev;
                            }if(cur.num > maxNum && prev.num > maxNum && board.length === 3){
                                if(cur.num > prev.num) return cur;
                                return prev;
                            }if(cur.num < prev.num){
                                return cur;
                            }
                                return prev;
                            
                        }
                            if(cur.num > prev.num) return cur;
                            return prev;
                        
                    }
                        if(cur.suit === 0 && cur.num === 11) return cur;
                        if(prev.suit === 0 && prev.num === 11) return prev;
                        if(cur.suit === 1) return cur;
                        if(prev.suit === 1) return prev;
                        if(cur.num > prev.num) return cur;
                        return prev;
                    
                }).ind;
        }
        return vc.reduce((prev, cur) => {
          if (prev.num > cur.num) return cur;
          return prev;
        }).ind;
      })());
    };

    return SimpleBrain;
  });
