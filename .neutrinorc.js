// Add support for typescript in neutrino config
require('@babel/register')({
  extensions: ['.es6', '.es', '.jsx', '.js', '.ts'],
  presets: [
    '@babel/preset-env',
    '@babel/typescript',
  ],
  plugins: [],
})

module.exports = require('./tools/webpack/neutrino.config').default()
