const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackDefinePlugin = require('webpack').DefinePlugin;

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
    new CopyPlugin({
      patterns: [{ from: 'app/icons', to: 'icons' }],
    }),
  ],
  node: {
    __dirname: false,
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

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';

  mainConfig.mode = mode;
  mainConfig.plugins.push(
    new WebpackDefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    })
  );

  rendererConfig.mode = mode;

  if (mode !== 'production') {
    mainConfig.externals = {
      'electron-reload': 'commonjs2 electron-reload',
    };

    rendererConfig.devtool = 'source-map';
  }

  return [mainConfig, rendererConfig];
};
