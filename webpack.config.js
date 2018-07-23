const path = require('path');
const webpack = require('webpack');
const stylusLoader = require('stylus-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nib = require('nib');

const extractStylus = new ExtractTextPlugin('../css/main.css');

module.exports = (env, argv) => {
  let modeRelativeConfig = {};
  if (argv.mode === 'development') {
    modeRelativeConfig = {
      devtool: '#source-map',
    };
  }
  return {
    entry: [
      'babel-polyfill',
      './src',
    ],
    output: {
      path: path.join(__dirname, 'static/js'),
      filename: 'bundle.js',
      publicPath: 'js/',
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: /src/,
          use: 'babel-loader',
        },
        {
          test: /\.styl$/,
          use: extractStylus.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  camelCase: true,
                  modules: true,
                  importLoaders: 1,
                  localIdentName: 'hearts-[local]-[hash:base64:5]',
                },
              },
              'stylus-loader',
            ],
          }),
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
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          NODE_ENV: JSON.stringify(argv.mode),
        },
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new stylusLoader.OptionsPlugin({
        default: {
          // nib - CSS3 extensions for Stylus
          use: [nib()],
          // no need to have a '@import "nib"' in the stylesheet
          import: ['~nib/lib/nib/index.styl'],
        },
      }),
      extractStylus,
    ],
    ...modeRelativeConfig,
  };
};
