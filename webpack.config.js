const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { readFileSync } = require('fs');
const WebpackDefinePlugin = require('webpack').DefinePlugin;

const env = readFileSync('./.env', { encoding: 'utf8' })
  .split('\n')
  .reduce((acc, cur) => {
    const pair = cur.split('=');
    acc[`process.env.${pair[0]}`] = JSON.stringify(pair[1]);
    return acc;
  }, {});

const mainConfig = {
  entry: './src/main/main.ts',
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'main.js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],
  node: {
    __dirname: false,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
};

const rendererConfig = {
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  externals: {
    trash: 'commonjs2 trash',
    'node-pty': 'commonjs2 node-pty',
    bunyan: 'commonjs2 bunyan',
    filemancore: 'commonjs2 filemancore',
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|.webpack)/,
        loaders: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'react.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@fm/common': resolve(__dirname, 'src/common'),
      '@fm/hooks': resolve(__dirname, 'src/hooks'),
    },
    modules: ['src', 'node_modules'],
  },
};

module.exports = (_, argv) => {
  const mode = argv.mode || 'development';

  mainConfig.mode = mode;
  mainConfig.plugins.push(
    new WebpackDefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      ...env,
    })
  );

  rendererConfig.mode = mode;
  rendererConfig.plugins.push(
    new WebpackDefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      ...env,
    })
  );

  if (mode !== 'production') {
    mainConfig.externals = {
      'electron-reload': 'commonjs2 electron-reload',
    };

    rendererConfig.devtool = 'source-map';
  }

  return [mainConfig, rendererConfig];
};
