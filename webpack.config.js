const path = require('path');

module.exports = (env, argv) => {
  let modeRelativeConfig = {};
  if (argv.mode === 'development') {
    modeRelativeConfig = { devtool: '#source-map' };
  }
  return {
    entry: './src/scripts',
    output: {
      path: path.join(__dirname, 'static/js'),
      filename: 'bundle.js',
      publicPath: 'js/',
    },
    resolve: {
      modules: ['node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: /js/,
          use: 'babel-loader',
        },
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
        },
        {
          test: /\.css$/,
          include: /css/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /.(png|gif|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
            },
          },
        },
      ],
    },
    ...modeRelativeConfig,
  };
};
