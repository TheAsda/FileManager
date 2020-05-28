const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const { resolve } = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@fm/common': resolve(__dirname, 'src/common'),
      '@fm/hooks': resolve(__dirname, 'src/hooks'),
    },
  },
};
