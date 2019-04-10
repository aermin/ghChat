import { join } from 'path';
import { LoaderOptionsPlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';

// function srcPath(subdir) {
//   return path.join(__dirname, subdir);
// }

const config = {
  mode: 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    // Puts the output at the root of the dist folder
    path: join(__dirname, 'dist'),
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
    new LoaderOptionsPlugin({
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

export default (env, argv) => {
  if (!argv.prod) {
    config.devtool = 'source-map';
  }
  return config;
};
