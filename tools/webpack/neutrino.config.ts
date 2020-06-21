import path from 'path'

import react from './presets/react'
import typescript from './presets/typescript'
import babel from './presets/babel'
import staticAssets from './presets/staticAssets'
import webWorker from './presets/webWorker'

export default (): unknown => ({
  // options,
  options: {
    root: process.cwd(),
    source: path.resolve(process.cwd(), 'src/client'),
    output: path.resolve(process.cwd(), 'build'),
  },
  use: [
    react({ indexHtml: path.resolve(process.cwd(), 'src/client/index.html') }),
    typescript(),
    babel(),
    webWorker(),
    staticAssets({
      patterns: [
        { from: path.resolve(process.cwd(), 'src/client/game/resources'), to: './resources' },
        { from: path.resolve(process.cwd(), 'src/client/web/static'), to: './static' },
      ],
    }),
  ],
})
