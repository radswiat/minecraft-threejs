import path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import vars from './webpack.live-vars';

import paths from '../config/paths';
import babelrc from '../config/babel';
import getClientEnvironment from '../config/env';
import cssModulesConfig from '../config/css-modules';
import packageInfo from '../modules/package-info/package-info';

const env = getClientEnvironment(vars.publicUrl);

module.exports = {
  context: cssModulesConfig.context,
  devtool: 'cheap-module-source-map',
  entry: [
    // Include babel-polyfills
    'babel-polyfill',
    // Finally, this is your app's code:
    paths.appIndexJs,
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // virtual path to file that is served by WebpackDevServer in development.
    filename: 'static/js/bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'static/js/[name].chunk.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: vars.publicPath,
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean),
    ),
    extensions: [
      '.web.js', '.js', '.json', '.web.jsx', '.jsx', '.eot',
      '.svg', '.woff2', '.woff', '.tff', '.css', '.scss', '.png',
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will match
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // Process JS with Babel.
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: babelrc,
          },
          // "scss/css" loader for src/ ONLY!
          // node_modules loader won't be handled here due to localModules
          {
            test: /\.(scss|css)$/,
            include: paths.appSrc,
            exclude: /node_modules/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 2,
                    sourceMap: true,
                    modules: true,
                    localIdentName: cssModulesConfig.generateScopedName,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: true,
                    config: {
                      path: './build-tools/config',
                    },
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            })),
          },
          // "scss/css" loader for nodue_modules/ ONLY!
          // localModules are disabled, import as global css rules
          {
            test: /\.(scss|css)$/,
            exclude: paths.appSrc,
            include: /node_modules/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 2,
                    sourceMap: true,
                    modules: false,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: true,
                    config: {
                      path: './build-tools/config',
                    },
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            })),
          },
          {
            test: /\.svg$/,
            loader: 'svg-inline-loader',
          },
          {
            // Fallback file loader
            // it will match all not matched files!
            // ANY loader below this point WILL BE IGNORED!
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[ext]',
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "Fallback file loader" loader.
    ],
  },
  plugins: [
    // define plugin
    new webpack.DefinePlugin(vars.globals),
    // include some stuff at the top of the bundle file
    new webpack.BannerPlugin(`${packageInfo.name}: ${packageInfo.version}`),
    // clean build folder
    // we can't clean due to src/content/api running simultaneously
    new CleanWebpackPlugin(paths.appBuild, { allowExternal: true }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ExtractTextPlugin({
      filename: 'style.css?v=[contenthash]',
      allChunks: true,
      ignoreOrder: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed.
  performance: {
    hints: false,
  },
};
