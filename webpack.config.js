const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
    ],
  },
  {
    mode: 'development',
    entry: './src/renderer/index.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
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
  },
];
