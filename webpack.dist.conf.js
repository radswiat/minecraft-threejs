/*eslint-disable */
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');

// public path static resources
// like bundle.js etc
const PUBLIC_PATH = '';
const BASE_PATH = '';
const PUBLIC_PATH_RES = '../../../';

var webpackConfig = {
  context: __dirname,
  entry: {
    index: [path.resolve(BASE_PATH, 'src/lib/typedarray.js'), path.resolve(BASE_PATH, 'src/app/main.js')]
  },
  output: {
    filename: 'main.js',
    publicPath: `/${PUBLIC_PATH}`,
    path: path.resolve(BASE_PATH, 'dist/')
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.html', '.png', '.svg', '.jpg', '.jpeg', '.png']
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {context: path.resolve(BASE_PATH, 'src/seemore'), from: '**/*', to: 'seemore'},
      {context: path.resolve(BASE_PATH, 'src/assets'), from: '**/*', to: 'assets'},
      {context: path.resolve(BASE_PATH, 'src/'), from: 'seemore.html', to: ''}
    ]),
    // new ExtendedDefinePlugin({
    //     WEBPACK_CONFIG: {
    //         PUBLIC_PATH: `${PUBLIC_PATH_RES}`
    //     },
    // }),
    new HtmlWebpackPlugin({
      title: 'ThreeJS',
      filename: 'index.html',
      template: path.resolve(BASE_PATH, 'src/index.html')
    })
  ]
};

let compiler = webpack(webpackConfig);
compiler.run((err, stats) => {
  console.log('[webpack:build]', stats.toString({
    chunks: false, // Makes the build much quieter
    colors: true
  }));
});