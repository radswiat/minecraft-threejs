module.exports = function babelConfig(api) {
  api.cache(true)

  /**
   * Babel presets
   */
  const presets = ['@babel/preset-env', '@babel/preset-react', '@babel/typescript']

  /**
   * Babel plugins
   */
  const plugins = [
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-proposal-optional-chaining',
    'babel-plugin-styled-components',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-regenerator',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    'jsx-control-statements',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        useESModules: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@web': './src/client/web/',
          '@game': './src/client/game/',
          '@shared': './src/client/shared/',
          '@libraries': './src/libraries/',
        },
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
