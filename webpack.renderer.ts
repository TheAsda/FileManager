import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CliConfigOptions, Configuration } from 'webpack';
import merge from 'webpack-merge';
import { baseConfiguration } from './webpack.base';
import { resolve } from 'path';

export default (_: unknown, args: CliConfigOptions): Configuration =>
  merge(baseConfiguration(_, args), {
    entry: './src/renderer/index.tsx',
    output: {
      filename: 'renderer.js',
    },
    target: 'electron-renderer',
    externals: {
      trash: 'commonjs2 trash',
      'node-pty': 'commonjs2 node-pty',
      bunyan: 'commonjs2 bunyan',
      filemancore: 'commonjs2 filemancore',
    },
    plugins: [new HtmlWebpackPlugin()],
    module: {
      rules: [
        {
          test: /\.node$/,
          use: 'node-loader',
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
      ],
    },
    resolve: {
      alias: {
        '@fm/common': resolve(__dirname, 'src/common'),
        '@fm/hooks': resolve(__dirname, 'src/renderer/hooks'),
        '@fm/components': resolve(__dirname, 'src/renderer/components'),
        '@fm/store': resolve(__dirname, 'src/renderer/store'),
      },
    },
  });
