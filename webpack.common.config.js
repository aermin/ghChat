const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  output: {
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  /* src文件夹下面的以.js结尾的文件，要使用babel解析 */
  /* cacheDirectory是用来缓存编译结果，下次编译加速 */
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader?cacheDirectory=true'],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 小于等于8K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求。
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 每次自动把js插入到模板index.html里面去
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
};
