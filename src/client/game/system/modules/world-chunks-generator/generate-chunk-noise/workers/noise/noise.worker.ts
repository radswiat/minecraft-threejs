// @ts-ignore
import { Noise } from 'noisejs'
import { Perf } from '@game/utils'

import getNoiseForLocation from './utils/getNoiseForLocation'
import { ChunkData2D, ChunkDataArr } from '../../../world-chunks-generator.types'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  ({ data }) => {
    const seedId = data.seed
    const chunkId = data.chunkId
    const chunkSize = data.chunkSize
    const noise = new Noise(seedId)

    let chunkDataNoiseArr: ChunkDataArr = []
    let chunkDataNoise2D: ChunkData2D = {}

    const chunkDataLocation = data.chunkLocation

    Perf.get(`⚙ noise worker: ${chunkId}`)

    for (let x = Math.floor(chunkSize / 2) * -1; x < Math.ceil(chunkSize / 2); x++) {
      for (let y = Math.floor(chunkSize / 2) * -1; y < Math.ceil(chunkSize / 2); y++) {
        for (let z = Math.floor(chunkSize / 2) * -1; z < Math.ceil(chunkSize / 2); z++) {
          // combine chunk location with the x,y,z loop
          let [tx, ty, tz] = [chunkDataLocation.x * chunkSize + x, chunkDataLocation.y * chunkSize + y, z]

          tx += 14
          ty += 14
          // main noise value
          let noiseValue = getNoiseForLocation(noise, tx, ty, z)

          chunkDataNoiseArr.push({
            chunkDataId: `${tx}_${ty}_${tz}`,
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
    const max = Math.max(...chunkDataNoiseArr.map(({ noiseValue }) => noiseValue))
    const min = Math.min(...chunkDataNoiseArr.map(({ noiseValue }) => noiseValue))

    chunkDataNoiseArr.forEach((chunkData) => {
      chunkDataNoise2D[chunkData.chunkDataId] = chunkData
    })

    // let noiseValue = data.noise.perlin3(data.x, data.y, data.z);
    // console.log('noise: ======================')
    ctx.postMessage({
      done: true,
      data: JSON.stringify({
        chunkId,
        noiseMax: max,
        noiseMin: min,
        data: Object.values(chunkDataNoise2D),
      }),
    })
    Perf.get(`⚙ noise worker: ${chunkId}`).end()
  },
  false,
)
