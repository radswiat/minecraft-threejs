/* eslint-disable global-require */
import webpack from 'webpack';
import chalk from 'chalk';

/**
 * Webpack debug build runner
 * - run webpack in debug mode,
 * - no dev server
 * - will give you the webpack output in /build
 */
export default new class WebpackDebug {

  // require webpack config
  webpackConfig = require('../webpack-config/webpack-live');

  /**
   * Prepare dev configuration
   * - prepare config
   * - create dev server
   */
  constructor() {

    // prepare webpack compiler & webpack dev server
    const compiler = webpack(this.webpackConfig);

    console.log(chalk.bgYellow.black(' webpack live starting ... '));

    compiler.run((err, stats) => {
      console.log('[webpack:build]', stats.toString({
        colors: true,
      }));
    });
  }

};

