// @ts-ignore
import { Noise } from 'noisejs'
import biome from '@game/system/modules/biomes/biome-grass'
import { Perf } from '@game/utils'

// import isCubeFilled from './utils/isCubeFilled'
import getNoiseForLocation from './utils/getNoiseForLocation'
// import toRange from '@game/utils/toRange'

const ctx: Worker = self as any

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

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
    const mod = data.mod

    Perf.get(`⚙ noise worker: ${chunkId}`)

    for (let x = Math.floor(chunkSize / 2) * -1; x < Math.ceil(chunkSize / 2); x++) {
      for (let y = Math.floor(chunkSize / 2) * -1; y < Math.ceil(chunkSize / 2); y++) {
        for (let z = Math.floor(chunkSize / 2) * -1; z < Math.ceil(chunkSize / 2); z++) {
          const lx = chunkLocation.x
          const ly = chunkLocation.y
          let [tx, ty, tz] = [ly * chunkSize + x, lx * chunkSize + y, z]
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

    /***
     *
     *
     *
     *
     * All below for tree generation,
     * it will be moved somewhere else ...later :)
     *
     *
     *
     * =====================================================
     */
    //
    // var drawTreeCube = (x, y, z) => {
    //   noiseChunks[`${x}_${y}_${z}`] = {
    //     location: {
    //       x,
    //       y,
    //       z,
    //     },
    //     surrounding: {
    //       px: false,
    //       nx: false,
    //       py: false,
    //       pz: false,
    //       nz: false,
    //       ny: false,
    //     },
    //     noiseValue: getNoiseForLocation(noise, noiseChunks, x, y, z, mod),
    //     material: 3,
    //   }
    // }
    //
    // var drawLeavesCube = (x, y, z) => {
    //   noiseChunks[`${x}_${y}_${z}`] = {
    //     location: {
    //       x,
    //       y,
    //       z,
    //     },
    //     surrounding: {
    //       px: false,
    //       nx: false,
    //       py: false,
    //       pz: false,
    //       nz: false,
    //       ny: false,
    //     },
    //     noiseValue: getNoiseForLocation(noise, noiseChunks, x, y, z, mod),
    //     material: 4,
    //   }
    // }
    //
    // var drawCubeCircle = (location, r) => {
    //   var x0 = location.x
    //   var z0 = location.z
    //   var y = location.y
    //   // lest make leaves around
    //   var z = 0
    //   var decisionOver2 = 1 - r
    //   while (r >= z) {
    //     drawLeavesCube(r + x0, y, z + z0)
    //     drawLeavesCube(z + x0, y, r + z0)
    //     drawLeavesCube(-r + x0, y, z + z0)
    //     drawLeavesCube(-z + x0, y, r + z0)
    //     drawLeavesCube(-r + x0, y, -z + z0)
    //     drawLeavesCube(-z + x0, y, -r + z0)
    //     drawLeavesCube(r + x0, y, -z + z0)
    //     drawLeavesCube(z + x0, y, -r + z0)
    //     z++
    //     if (decisionOver2 <= 0) {
    //       decisionOver2 += 2 * y + 1 // Change in decision criterion for y -> y+1
    //     } else {
    //       r--
    //       decisionOver2 += 2 * (y - r) + 1
    //     }
    //   }
    // }
    //
    // /**
    //  *
    //  * @param location
    //  */
    // var generateTree = (location) => {
    //   var currHeight
    //
    //   // how much space left?
    //   let heightLeft = chunkSize - location.y
    //
    //   // won't be able to draw soo tiny tree
    //   if (heightLeft < 6) {
    //     return
    //   }
    //
    //   // lets draw base, base is always min 4 - 6
    //   let mod = 150
    //   let height = Math.round(
    //     (3 * (Math.round(Math.abs(noise.simplex3(location.x / mod, location.y / mod, location.z / mod) * 100)) / 10)) / 2,
    //   )
    //
    //   if (height < 3) height = 3
    //
    //   for (currHeight = location.y; currHeight <= location.y + height; currHeight++) {
    //     drawTreeCube(location.x, currHeight, location.z)
    //   }
    //
    //   drawLeavesCube(location.x, currHeight, location.z)
    //   drawCubeCircle({ x: location.x, y: currHeight - 1, z: location.z }, 1)
    //   drawCubeCircle({ x: location.x, y: currHeight - 2, z: location.z }, 1)
    //   drawCubeCircle({ x: location.x, y: currHeight - 2, z: location.z }, 2)
    // }
    //
    // let chunkTreeChance = Math.round(random(5, 10))
    // for (let i = 0; i < Math.round(Math.abs(noise.perlin2(Math.abs(chunkLocation.x) / 22, Math.abs(chunkLocation.y) / 22)) * 100); i++) {
    //   // generate trees when we got whole chunk
    //   let x = chunkLocation.y * chunkSize + Math.round(random(-10, 10))
    //   let z = chunkLocation.x * chunkSize + Math.round(random(-10, 10))
    //   var found = null
    //   // lets find out where it ends in y ( up/down axis )
    //   for (let y = -13; y <= 13; y++) {
    //     if (typeof noiseChunks[`${x}_${y}_${z}`] !== 'undefined') {
    //       found = y + 1
    //     }
    //   }
    //
    //   if (found) {
    //     generateTree({ x: x, y: found, z: z })
    //   }
    // }

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
