// @ts-ignore
import { Noise } from 'noisejs'
import { Perf } from '@game/utils'
import { random } from '@game/utils'

import getNoiseForLocation from './utils/getNoiseForLocation'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  ({ data }) => {
    const seedId = data.seed
    const chunkId = data.chunkId
    const chunkSize = data.chunkSize
    const noise = new Noise(seedId)
    let noiseChunks = {}
    let noiseChunksArr = []
    const chunkLocation = data.chunkLocation

    Perf.get(`⚙ noise worker: ${chunkId}`)

    for (let x = Math.floor(chunkSize / 2) * -1; x < Math.ceil(chunkSize / 2); x++) {
      for (let y = Math.floor(chunkSize / 2) * -1; y < Math.ceil(chunkSize / 2); y++) {
        for (let z = Math.floor(chunkSize / 2) * -1; z < Math.ceil(chunkSize / 2); z++) {
          const lx = chunkLocation.x
          const ly = chunkLocation.y
          let [tx, ty, tz] = [lx * chunkSize + x, ly * chunkSize + y, z]
          tx += 14
          ty += 14
          // main noise value
          let noiseValue = getNoiseForLocation(noise, noiseChunks, tx, ty, z, 20)

          noiseChunksArr.push({
            objKey: `${tx}_${ty}_${tz}`,
            location: {
              x: tx,
              y: ty,
              z: tz,
            },
            absLocation: {
              x,
              y,
              z,
            },
            noiseValue,
          })
        }
      }
    }

    // normalize noise to fit range 0-1
    const max = Math.max(...noiseChunksArr.map(({ noiseValue }) => noiseValue))
    const min = Math.min(...noiseChunksArr.map(({ noiseValue }) => noiseValue))

    noiseChunksArr.forEach((chunk) => {
      noiseChunks[chunk.objKey] = chunk
    })

    // let noiseValue = data.noise.perlin3(data.x, data.y, data.z);
    // console.log('noise: ======================')
    ctx.postMessage({
      done: true,
      data: JSON.stringify({
        chunkId,
        noiseMax: max,
        noiseMin: min,
        data: Object.values(noiseChunks),
      }),
    })
    Perf.get(`⚙ noise worker: ${chunkId}`).end()
  },
  false,
)
