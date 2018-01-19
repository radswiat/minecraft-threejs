/* eslint-disable global-require */
import webpack from 'webpack';
import { createCompiler, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';

/**
 * Webpack debug build runner
 * - run webpack in debug mode,
 * - no dev server
 * - will give you the webpack output in /build
 */
export default new class WebpackDebug {

  // require webpack config
  webpackConfig = require('../webpack-config/webpack-dev');
  devServerConfig = require('../config/dev-server').default;
  WebpackDevServer = require('../webpack-dev-server/webpack-dev-server').default;

  /**
   * Prepare dev configuration
   * - prepare config
   * - create dev server
   */
  constructor() {

    // extract from devServerConfig
    const { port, host, protocol, appName } = this.devServerConfig;

    // prepare urls
    const urls = prepareUrls(protocol, host, port);

    // prepare webpack compiler & webpack dev server
    const compiler = createCompiler(webpack, this.webpackConfig, appName, urls);

    this.createDevServer(compiler, host);
  }

  /**
   * Create dev server
   */
  createDevServer(compiler, host) {
    // create web-dev server
    const customWebpackDevServer = new this.WebpackDevServer({
      compiler,
      devServerConfig: this.devServerConfig,
      publicPath: this.webpackConfig.output.publicPath,
      host,
    });

    // start webpack dev server
    customWebpackDevServer.launch();
  }
};

