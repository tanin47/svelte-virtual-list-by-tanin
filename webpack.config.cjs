"use strict";

const webpack = require('webpack');
const sveltePreprocess = require("svelte-preprocess");
const path = require('path');

const config = {
  mode: 'development',
  cache: false,
  stats: 'minimal',
  entry:  './test/main.ts',
  resolve: {
    extensions: ['.mjs', '.js', '.svelte', '.ts'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    conditionNames: ['svelte', 'browser']
  },
  module: {
    rules: [
      {
        test: /\.svelte(\.ts)?$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: false,
            preprocess: sveltePreprocess({}),
            compilerOptions: {
              dev: false,
            },
            hotReload: false
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
  ],
  output: {
    path: path.resolve(__dirname, './test/dist'),
    filename: 'main-webpack.js',
  },
  devtool: 'eval-cheap-source-map',
};

module.exports = (env, argv) => {
  return config;
}
