import path from 'path'

import Config from 'webpack-chain'

/**
 * Typescript preset
 */
export default function typescriptPreset(): unknown {
  return ({ config }: { config: Config }): void => {
    // Add typescript and eslint validation during webpack run
    // config.plugin('fork-ts-checker').use(require('fork-ts-checker-webpack-plugin'), [
    //   {
    //     typescript: {
    //       enabled: true,
    //       configFile: path.resolve(process.cwd(), 'tsconfig.json'),
    //     },
    //   },
    // ])

    // Add webpack TS extensions support
    const ext = config.resolve.extensions
    ext.prepend('.ts')
    ext.prepend('.tsx')

    // extend neutrino compile rule ( babel rule ) to include TS extensions
    config.module.rule('compile').test(/\.(js|jsx|ts|tsx)$/)

    // extend neutrino babel config
    // config.module.rule('compile').use('babel').tap((options) => {
    //   return {
    //     ...options,
    //     presets: babelPresets,
    //     plugins: babelPlugins({ conditionalCompileFlags }),
    //   }
    // })
  }
}
