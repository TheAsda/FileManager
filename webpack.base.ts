import { CliConfigOptions, Configuration } from 'webpack';
import { resolve } from 'path';

const baseConfiguration = (_: unknown, args: CliConfigOptions): Configuration => ({
  output: {
    path: resolve(__dirname, 'dist'),
  },
  devtool: args.mode === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
});

export { baseConfiguration };
