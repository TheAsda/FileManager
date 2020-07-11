const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    mode: 'development',
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
      new CopyPlugin({
        patterns: [{ from: 'app/icons', to: 'icons' }],
      }),
    ],
    node: {
      __dirname: false,
    },
  },
  {
    mode: 'development',
    entry: './src/renderer/index.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    externals: {
      trash: 'commonjs2 trash',
      'node-pty': 'commonjs2 node-pty',
      bunyan: 'commonjs2 bunyan',
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
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // include specific files based on a RegExp
        include: /src/,
        // add errors to webpack instead of warnings
        failOnError: false,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
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
  },
];
