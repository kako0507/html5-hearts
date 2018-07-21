import $ from 'jquery';
import Brain from './Brain';

class RandomBrain extends Brain {
  decide = validCards => $.Deferred()
    .resolve(validCards[Math.floor(Math.random() * validCards.length)].index);
}

export default RandomBrain;
