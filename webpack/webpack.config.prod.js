/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { ProgressPlugin, BannerPlugin } = require('webpack');
const merge = require('webpack-merge');
const ViaProfitPlugin = require('@via-profit-services/core/dist/webpack');

const packageInfo = require('../package.json');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  entry: {
    index: path.resolve(__dirname, '../src/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  mode: 'production',
  plugins: [
    new ViaProfitPlugin(),
    new ProgressPlugin(),
    new BannerPlugin({
      banner: `
Via Profit Services / Geography

Repository ${packageInfo.repository.url}
Contact    ${packageInfo.support}
      `,
    }),
    new FileManagerPlugin({
      onStart: {
        delete: ['./dist'],
      },
      onEnd: {
        copy: [
          {
            source: './src/database/migrations/*',
            destination: './dist/database/migrations/',
          },
          {
            source: './src/database/seeds/*',
            destination: './dist/database/seeds/',
          },
          {
            source: './src/countries/**/*.*',
            destination: './dist/countries/',
          },
        ],
        delete: [
          './dist/playground',
          './dist/database/migrations/!(+([0-9])_geography-*@(.ts|.d.ts))',
        ],
      },
    }),
  ],

  externals: {
    '@via-profit-services/core': {
      commonjs2: '@via-profit-services/core',
    },
  },
});
