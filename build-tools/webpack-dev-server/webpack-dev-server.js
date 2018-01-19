/* eslint "filenames/match-exported": "off" */
const path = require('path');

const chalk = require('chalk');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const WebpackDevServer = require('webpack-dev-server');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');

export default class CustomWebpackDevServer {

  constructor({ compiler, devServerConfig, publicPath }) {
    this.compiler = compiler;
    this.config = devServerConfig;
    this.publicPath = publicPath;
    this._createWebpackDevServer();
  }

  /**
   * Create webpack dev server
   * - create server using webpack compiler and config
   * @private
   */
  _createWebpackDevServer() {
    this.server = new WebpackDevServer(this.compiler, {
      // Enable gzip compression of generated files.
      compress: true,
      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      clientLogLevel: 'none',
      // By default WebpackDevServer serves physical files from current directory
      // in addition to all the virtual build products that it serves from memory.
      contentBase: path.resolve(this.config.paths.contentBase),
      // By default files from `contentBase` will not trigger a page reload.
      watchContentBase: true,
      // Enable hot reloading server.
      hot: true,
      // It is important to tell WebpackDevServer to use the same "root" path
      // as we specified in the config. In development, we always serve from /.
      publicPath: this.publicPath,
      // WebpackDevServer is noisy by default so we emit custom message instead
      // by listening to the compiler events with `compiler.plugin` calls above.
      quiet: this.config.quiet,
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/,
      },
      host: this.config.host,
      overlay: false,
      historyApiFallback: {
        // Paths with dots should still use the history fallback.
        // See https://github.com/facebookincubator/create-react-app/issues/387.
        disableDotRule: true,
      },
      setup(app) {
        // Dev api middleware
        // api(app);
        // Include extra pages into the webpack dev server
        // extraPages(app);
        // This lets us open files from the runtime error overlay.
        // app.use(errorOverlayMiddleware());
        // This service worker file is effectively a 'no-op' that will reset any
        // previous service worker registered for the same host:port combination.
        app.use(noopServiceWorkerMiddleware());
      },
    });
  }

  /**
   * Launch webpack dev server
   * - clear console
   * - console log info
   * - open browser
   */
  launch() {
    this.server.listen(this.config.port, this.config.host, err => {
      if (err) {
        return console.log(err);
      }
      clearConsole();
      console.log(chalk.cyan('Starting the development server...\n'));
      if (this.config.openBrowser) {
        console.log(`${this.config.protocol}://${this.config.host}:${this.config.port}`);
        openBrowser(`${this.config.protocol}://${this.config.host}:${this.config.port}`);
      }
    });
  }
}
