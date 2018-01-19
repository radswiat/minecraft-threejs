import path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const appBuildPath = path.resolve(process.cwd(), 'build/');
const appMainJS = path.resolve(process.cwd(), 'src/app/main.js');
const typedArrayJS = path.resolve(process.cwd(), 'src/lib/typedarray.js');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    // index: [path.resolve(BASE_PATH, 'src/lib/typedarray.js'), path.resolve(BASE_PATH, 'src/app/main.js'), 'webpack-hot-middleware/client', 'webpack/hot/dev-server']
    // Include an alternative client for WebpackDevServer
    // require.resolve('react-dev-utils/webpackHotDevClient'),
    // Include babel-polyfills
    'babel-polyfill',
    // Errors should be considered fatal in development
    // Finally, this is your app's code:
    appMainJS,
    typedArrayJS,
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: appBuildPath,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // virtual path to file that is served by WebpackDevServer in development.
    filename: 'static/js/bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'static/js/[name].chunk.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: '/',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    // devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    // // This allows you to set a fallback for where Webpack should look for modules.
    // // We placed these paths second because we want `node_modules` to "win"
    // // if there are any conflicts. This matches Node resolution mechanism.
    // // https://github.com/facebookincubator/create-react-app/issues/253
    // modules: ['node_modules', paths.appNodeModules].concat(
    //   // It is guaranteed to exist because we tweak it in `env.js`
    //   process.env.NODE_PATH.split(path.delimiter).filter(Boolean),
    // ),
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
    // we can't clean due to src/content/api running simultaneously
    new CleanWebpackPlugin(appBuildPath, { allowExternal: true }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // // Copy over public folder
    // new CopyWebpackPlugin([{
    //   context: path.resolve('./', 'src/public'),
    //   from: '**/*.{ico,json,png,jpg,jpeg,svg,js}',
    //   to: 'public',
    // }]),
    // new ExtractTextPlugin({
    //   filename: 'style.css?v=[contenthash]',
    //   allChunks: true,
    //   ignoreOrder: true,
    // }),
    // Generates an `index.html` file with the <script> injected.
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   template: `${paths.appHtmlDir}/index.html`,
    //   filename: 'index.html',
    // }),
    new CopyWebpackPlugin([
      // {context: path.resolve(process.cwd(), 'src/seemore'), from: '**/*', to: 'seemore'},
      {context: path.resolve(process.cwd(), 'src/assets'), from: '**/*', to: 'assets'},
      // {context: path.resolve(process.cwd(), 'src/'), from: 'seemore.html', to: ''}
    ]),
    new HtmlWebpackPlugin({
      title: 'ThreeJS',
      filename: 'index.html',
      template: path.resolve(process.cwd(), 'src/index.html')
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
