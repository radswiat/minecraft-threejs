import path from 'path'

import * as Config from 'webpack-chain'

export default function babelPreset(): unknown {
  return ({ config }: { config: Config }): void => {
    // require babel config
    const babelConfig = require(path.resolve(process.cwd(), 'babel.config.js'))
    const { presets, plugins } = babelConfig({ cache: () => {} })
    // extend neutrino babel config
    config.module.rule('compile').use('babel').tap((options) => {
      return {
        ...options,
        presets,
        plugins,
      }
    })
  }
}
