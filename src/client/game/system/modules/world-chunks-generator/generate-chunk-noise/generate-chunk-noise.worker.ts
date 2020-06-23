// @ts-ignore
import { Noise } from 'noisejs'
import { Perf } from '@game/utils'

import getCubeNoise from './utils/get-cube-noise'
import getTreeNoise from './utils/get-tree-noise'

import { ChunkDataArr } from '../world-chunks-generator.types'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  ({ data }) => {
    const seedId = data.seedId
    const chunkId = data.chunkId
    const chunkSize = data.chunkSize
    const noise = new Noise(seedId)
    const chunkDataLocation = data.chunkLocation
    Perf.get(`   ⚙ noise worker: ${chunkId}`)

    let chunkDataNoiseArr: ChunkDataArr = []

    for (let x = Math.floor(chunkSize / 2) * -1; x < Math.ceil(chunkSize / 2); x++) {
      for (let y = Math.floor(chunkSize / 2) * -1; y < Math.ceil(chunkSize / 2); y++) {
        for (let z = Math.floor(chunkSize / 2) * -1; z < Math.ceil(chunkSize / 2); z++) {
          // combine chunk location with the x,y,z loop
          let [tx, ty, tz] = [chunkDataLocation.x * chunkSize + x, chunkDataLocation.y * chunkSize + y, z]

          tx += 14
          ty += 14

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
            noiseValue: getCubeNoise(noise, tx, ty, z),
            vegetation: {
              treeNoise: getTreeNoise(noise, tx, ty, z),
            },
          })
        }
      }
    }

    // normalize noises to fit range 0-1
    const cubeNoiseMap = chunkDataNoiseArr.map(({ noiseValue }) => noiseValue)
    const treeNoiseMap = chunkDataNoiseArr.map((chunkData) => chunkData.vegetation.treeNoise)
    const cubeMax = Math.max(...cubeNoiseMap)
    const cubeMin = Math.min(...cubeNoiseMap)
    const treeMax = Math.max(...treeNoiseMap)
    const treeMin = Math.min(...treeNoiseMap)

    Perf.get(`   ⚙ noise worker: ${chunkId}`).end()

    Perf.get(`   ⚙ postMessage worker`)
    ctx.postMessage({
      done: true,
      data: JSON.stringify({
        chunkId,
        noiseMaps: {
          treeMax: treeMax,
          treeMin: treeMin,
          cubeMax,
          cubeMin,
        },
        data: Object.values(chunkDataNoiseArr),
      }),
    })
    Perf.get(`   ⚙ postMessage worker`).end()
  },
  false,
)
