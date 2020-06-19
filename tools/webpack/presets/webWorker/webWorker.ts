import path from 'path'

import Config from 'webpack-chain'

export default (): unknown => {
  return ({ config }: { config: Config }): void => {
    config.module
      .rule('compile-worker')
      .test(/\.worker.ts$/)
      .use('worker-loader')
      .loader(require.resolve('worker-loader'))
      .loader(require.resolve('babel-loader'))
  }
}
