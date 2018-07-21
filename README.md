# Hearts with HTML5

You can try the game at http://hearts.yjyao.com/

# Install 3rd party libraries

  ```
  yarn/npm install
  ```

# Build bundle files

  ```
  # Minimizing the bundle files for production
  yarn/npm run build
  # Generating source map for develoment
  yarn/npm run build-dev
  ```

# Start Koa web server

  ```
  # Using another HTTP server (e.g. Nginx) to serve static file
  yarn/npm run start
  # Using Koa to serve static file
  yarn/npm run start-dev
  ```

# AI

The `Ai.js` class can use various `Brains` to make decision.

* `Brain.js`: Base class for all brains
* `AsyncBrain.js`: A wrapper to call the more time-consuming brains via web-worker
* `SimpleBrain.js`: Simple greedy heuristics
* `McBrain.js`: One-step look-ahead with sample generation and deterministic rollouts based on the assumption that all players use the simple greedy strategy
* `PomDPBrain.js`: assuming all other players to be playing using the greedy strategy, the game can then be formulated as a [POMDP](http://en.wikipedia.org/wiki/Partially_observable_Markov_decision_process) and can thus be solved with the [POMCP Algorithm](http://machinelearning.wustl.edu/mlpapers/paper_files/NIPS2010_0740.pdf). This `brain` implements the POMCP algorithm.

# TODO

1. Use WebSocket to support Multi-player
2. Move control logic from client to server
