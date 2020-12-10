import NodemonPlugin from 'nodemon-webpack-plugin';
import { resolve, join } from 'path';
import { WebpackPluginInstance } from 'webpack';
import { merge } from 'webpack-merge';

import baseConfig from './webpack-config-base';

export default merge(baseConfig, {
  entry: {
    index: resolve(__dirname, '../src/playground/index.ts'),
  },
  output: {
    path: join(__dirname, '../build/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new NodemonPlugin({
      exec: process.env.DEBUG
        ? 'yarn node --inspect-brk=9229 ./build/index.js'
        : 'yarn node ./build/index.js',
      watch: ['./build'],
    }) as WebpackPluginInstance,
  ],
});
