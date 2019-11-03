const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

commonConfig = {
  /* 入口 */
  entry: {
    app: [
      'babel-polyfill',
      path.join(__dirname, 'src/index.js')
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux'] // 把react等库生成打包到vendor.hash.js里面去。
  },
  /* 输出到build文件夹，输出文件名字为[name].[chunkhash].js */
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  /* src文件夹下面的以.js结尾的文件，要使用babel解析 */
  /* cacheDirectory是用来缓存编译结果，下次编译加速 */
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: ['babel-loader?cacheDirectory=true'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.(js|jsx)$/,
      use: 'react-hot-loader/webpack',
      include: /node_modules/
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192 // 小于等于8K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求。
        }
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({// 每次自动把js插入到模板index.html里面去
      filename: 'index.html',
      template: path.join(__dirname, 'src/index.html')
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ // 提取并缓存公共库
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  ]
};

module.exports = commonConfig;
