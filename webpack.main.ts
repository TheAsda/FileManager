import { CliConfigOptions, Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { baseConfiguration } from './webpack.base';

export default (_: unknown, args: CliConfigOptions): Configuration =>
  merge(baseConfiguration(_, args), {
    entry: './src/main/main.ts',
    output: {
      filename: 'main.js',
    },
    target: 'electron-main',
    node: {
      __dirname: false,
    },
    externals: {
      'electron-reload': 'commonjs2 electron-reload',
    },
  });
