const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// function srcPath(subdir) {
//   return path.join(__dirname, subdir);
// }

const config = {
  mode: 'development',
  entry: './src/app/index.ts',
  target: 'node',
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    // alias: {
    //   'models': srcPath('src/models')
    // },
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFileName: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    }),
  ],
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'awesome-typescript-loader'
    }]
  },
  externals: [nodeExternals()]
};

module.exports = (env, argv) => {
  // console.log(argv.prod);

  // config.mode = argv.prod ? 'production' : 'development';

  if (!argv.prod) {
    config.devtool = 'source-map';
  }
  return config;
};
