import Config from 'webpack-chain'

// @ts-ignore
import react from '@neutrinojs/react'

import { ReactOpts } from './react.types'

export default ({ indexHtml, htmlTemplateParams = {} }: ReactOpts): Config => {
  return react({
    html: {
      template: indexHtml,
      templateParameters: htmlTemplateParams,
    },
    style: {
      test: /\.(css|scss)$/,
      loaders: [
        { loader: require.resolve('sass-loader'), useId: 'sass' },
      ],
    },
  })
}
