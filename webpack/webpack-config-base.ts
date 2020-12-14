import { knexExternals } from '@via-profit-services/knex/dist/webpack-utils';
import { Configuration } from 'webpack';

const webpackBaseConfig: Configuration = {
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.graphql$/,
        use: 'raw-loader',
      },
    ],
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  resolve: {
    // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
    extensions: ['.ts', '.mjs', '.js', '.json', '.graphql'],
  },
  externals: [
    ...knexExternals,
    /^@via-profit-services\/core/,
    /^@via-profit-services\/knex/,
    /^moment$/,
    /^moment-timezone$/,
    /^graphql$/,
    /^dataloader$/,
    /^winston$/,
    /^winston-daily-rotate-file$/,

  ],
}

export default webpackBaseConfig;
