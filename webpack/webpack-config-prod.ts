import fs from 'fs-extra';
import path from 'path';
import { BannerPlugin, Configuration, Compiler } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import packageInfo from '../package.json';
import webpackBaseConfig from './webpack-config-base';


const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
  entry: {
    index: path.resolve(__dirname, '../src/index.ts'),
    schema: path.resolve(__dirname, '../src/schema.graphql'),
  },
  optimization: {
    minimize: false,
  },
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
      openAnalyzer: true,
    }),
    new BannerPlugin({
      banner: `
Via Profit services / Geography

Repository ${packageInfo.repository.url}
Contact    ${packageInfo.support}
      `,
    }),
    {
      apply: (compiler: Compiler) => {
        compiler.hooks.beforeRun.tapAsync('WebpackBeforeBuild', (_, callback) => {

          if (fs.existsSync(path.join(__dirname, '../dist/'))) {
            fs.rmdirSync(path.join(__dirname, '../dist/'), { recursive: true })
          }

          callback();
        });

        compiler.hooks.afterEmit.tapAsync('WebpackAfterBuild', (_, callback) => {
          fs.copyFileSync(
            path.resolve(__dirname, '../src/@types/index.d.ts'),
            path.resolve(__dirname, '../dist/index.d.ts'),
          );

          fs.copySync(
            path.resolve(__dirname, '../src/countries'),
            path.resolve(__dirname, '../dist/countries'),
          );

          fs.copySync(
            path.resolve(__dirname, '../src/schema.d.ts'),
            path.resolve(__dirname, '../dist/schema.d.ts'),
          );
          callback();
        });

      },
    },
  ],
});

export default webpackProdConfig;