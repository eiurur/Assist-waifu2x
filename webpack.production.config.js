const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: `${__dirname}/src/js`,
  entry: {
    background: './background.js',
    contents: './contents.js',
    popup: './popup.js',
    utils: './utils.js',
  },
  output: {
    path: path.resolve(__dirname, './build/js'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     presets: [['es2015', { modules: false }], 'stage-3'],
          //   },
          // },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
