const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const commonConfig = require('./webpack.common.config.js');

module.exports = merge(commonConfig, {
  mode: 'development',
  optimization: {
    usedExports: true,
  },
  devtool: 'inline-source-map',
  entry: {
    app: ['babel-polyfill', 'react-hot-loader/patch', path.resolve(__dirname, 'src/index.js')],
  },
  output: {
    /* 这里本来应该是[chunkhash]的，但是由于[chunkhash]和react-hot-loader不兼容。只能妥协 */
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './src'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'react-hot-loader/webpack',
        include: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'), // 让WEB服务器运行静态资源（index.html）
    hot: true,
    historyApiFallback: true,
    compress: true,
    stats: 'errors-only', // 只在发生错误时输出
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ProgressBarPlugin()],
});
