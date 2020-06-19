import path from 'path'

import Config from 'webpack-chain'

// @ts-ignore
// No types available for @neutrino/*
import copy from '@neutrinojs/copy'

import { StaticAssetsOpts } from './staticAssets.d'

/**
 * Neutrino assets preset
 * - add support for app static folder with microsite prefix for ALB
 *   eg https://shop.dx-int1-blue.internal.vodafoneaws.co.uk/${prefix}/static/images.....
 * - add support for custom assets throug `patterns` ( see weback-copy-plugin )
 * @param opts
 * @param opts.patterns
 */
export default ({ patterns }: StaticAssetsOpts): Config => {
  return copy({
    patterns: [...patterns],
  })
}
