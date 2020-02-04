const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const commonConfig = require('./webpack.common.config.js');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: ['babel-polyfill', 'react-hot-loader/patch', path.join(__dirname, 'src/index.js')],
  },
  output: {
    /* 这里本来应该是[chunkhash]的，但是由于[chunkhash]和react-hot-loader不兼容。只能妥协 */
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './src'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style!css',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, './src'), // 让WEB服务器运行静态资源（index.html）
    historyApiFallback: true,
    host: '127.0.0.1',
    compress: true,
    stats: 'errors-only', // 只在发生错误时输出
  },
  plugins: [new ProgressBarPlugin()],
};

module.exports = merge({
  customizeArray(a, b, key) {
    /* entry.app不合并，全替换 */
    if (key === 'entry.app') {
      return b;
    }
    return undefined;
  },
})(commonConfig, devConfig);
