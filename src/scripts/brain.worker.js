import McBrain from './McBrain';
import PomDPBrain from './PomDPBrain';

const brains = {
  McBrain,
  PomDPBrain,
};

let brain;

postMessage({
  type: 'loaded',
});

self.addEventListener('message', (e) => {
  const { params } = e.data;
  switch (e.data.type) {
    case 'decide':
      postMessage({
        type: 'decision',
        result: brain.decide(
          params.validCards,
          params.boardCards,
          params.boardPlayers,
          params.scores,
        ),
      });
      break;
    case 'watch':
      brain.watch(e.data.params);
      break;
    case 'ini':
      brain = new brains[e.data.brain](e.data.userId, e.data.options);
      postMessage({
        type: 'ini-ed',
      });
      break;
    case 'confirm':
      brain.confirmCards(e.data.cards);
      postMessage({
        type: 'confirmed',
      });
      break;
    default:
  }
});
