define(() => ({
  getValidCards(cards, firstSuit, isHeartBroken) {
    if (firstSuit == -1) {
      if (isHeartBroken) {
        return cards;
      } if (cards.length === 13) {
        for (let i = 0; i < cards.length; i++) {
          if (cards[i].suit == 2 && cards[i].num == 1) {
            return [cards[i]];
          }
        }
        return null;
      }
      var vcards = cards.filter((c) => c.suit !== 1);
      if (vcards.length === 0) {
        return vcards.concat(cards);
      }
      return vcards;
    }
    var vcards = cards.filter((c) => c.suit === firstSuit);
    if (vcards.length === 0) {
      return vcards.concat(cards);
    }
    return vcards;
  },
}));
