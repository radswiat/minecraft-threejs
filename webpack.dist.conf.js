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
    index: [path.resolve(BASE_PATH, 'src/lib/typedarray.js'), path.resolve(BASE_PATH, 'src/app/main.js'), 'webpack-hot-middleware/client', 'webpack/hot/dev-server']
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new CopyWebpackPlugin([
      {context: path.resolve(BASE_PATH, 'src/assets'), from: '**/*', to: 'assets'},
      {context: path.resolve(BASE_PATH, 'src/seemore.html'), from: 'seemore.html', to: '/'}
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


/**
 * Webpack dev server
 */
class DevWebpackDevServer {

  webpackConfig = null;
  express = null;

  constructor(config) {
    this.webpackConfig = config;
    this.express = require('express');
    this.compiler = webpack(this.webpackConfig);
    this.app = this.express();
    this.setMiddleware();
    this.createServer();
  }

  setMiddleware() {
    // midleware to simulate server long responses
    this.app.use(function (req, res, next) {
      if (/(\.json)$/.test(req.url)) {
        setTimeout(next, 2000);
        return;
      }
      next();
    });
    this.app.use(webpackDevMiddleware(this.compiler, {
      noInfo: false, publicPath: this.webpackConfig.output.publicPath, hot: true, stats: {colors: true}
    }));
    this.app.use(webpackHotMiddleware(this.compiler));
  }

  createServer() {
    this.app.get("/", function (req, res) {
      res.sendFile(__dirname + '/index.html');
    });
    this.app.listen(3000);
  }

}


new DevWebpackDevServer(webpackConfig);