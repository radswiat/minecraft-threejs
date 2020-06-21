import { Noise } from 'noisejs'
import { Perf } from '@game/utils'
import { ChunkCoordinated, Chunk, ChunkData } from '@game/system/modules/world-chunks-generator/world-chunks-generator.types'
import getNoiseForLocation from './utils/getNoiseForLocation'
import toRange from '@game/utils/toRange'

const ctx: Worker = self as any

const chunkSize = 25

var drawLeavesCube = (x, y, z) => {
  return {
    location: {
      x,
      y,
      z,
    },
    absLocation: {
      x,
      y,
      z,
    },
    surrounding: {
      px: false,
      nx: false,
      py: false,
      pz: false,
      nz: false,
      ny: false,
    },
    material: 4,
  }
}

var drawTreeCube = (x, y, z) => {
  return {
    location: {
      x,
      y,
      z,
    },
    absLocation: {
      x,
      y,
      z,
    },
    surrounding: {
      px: false,
      nx: false,
      py: false,
      pz: false,
      nz: false,
      ny: false,
    },
    material: 3,
  }
}

var drawCubeCircle = (location, r) => {
  const cubes = []
  var x0 = location.x
  var y0 = location.y
  var z0 = location.z
  // lest make leaves around
  var y = 0
  var decisionOver2 = 1 - r
  while (r >= y) {
    cubes.push(drawLeavesCube(r + x0, y + y0, z0))
    cubes.push(drawLeavesCube(y + x0, r + y0, z0))
    cubes.push(drawLeavesCube(-r + x0, y + y0, z0))
    cubes.push(drawLeavesCube(-y + x0, r + y0, z0))
    cubes.push(drawLeavesCube(-r + x0, -y + y0, z0))
    cubes.push(drawLeavesCube(-y + x0, -r + y0, z0))
    cubes.push(drawLeavesCube(r + x0, -y + y0, z0))
    cubes.push(drawLeavesCube(y + x0, -r + y0, z0))
    y++
    if (decisionOver2 <= 0) {
      decisionOver2 += 2 * z0 + 1 // Change in decision criterion for y -> y+1
    } else {
      r--
      decisionOver2 += 2 * (z0 - r) + 1
    }
  }
  return cubes
}

var generateTree = (noise, location) => {
  var currHeight
  const cubes = []

  // how much space left?
  let heightLeft = chunkSize - location.z

  // won't be able to draw soo tiny tree
  if (heightLeft < 6) {
    return []
  }

  // lets draw base, base is always min 4 - 6
  let mod = 150
  let height = Math.round((3 * (Math.round(Math.abs(noise.simplex3(location.x / mod, location.y / mod, location.z / mod) * 100)) / 10)) / 2)

  if (height < 3) height = 3

  for (currHeight = location.z; currHeight <= location.z + height; currHeight++) {
    cubes.push(drawTreeCube(location.x, location.y, currHeight))
  }

  cubes.push(drawLeavesCube(location.x, location.y, currHeight))
  cubes.push(...drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 1 }, 1))
  cubes.push(...drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 2 }, 1))
  cubes.push(...drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 2 }, 2))
  return cubes
}

let mlog = 10
ctx.addEventListener(
  'message',
  async ({ data }) => {
    Perf.get(`⚙ vegetation worker`)
    const chunks: ChunkCoordinated = JSON.parse(data.chunks)
    const noise = new Noise(1)
    const blocks = {}

    Object.entries(chunks).forEach(([key, value]) => {
      value.data.forEach((chunk) => {
        blocks[`${chunk.location.x}:${chunk.location.y}:${chunk.location.z}`] = chunk
      })
    })

    console.log('v: ------------- VEGETATION ------------')
    console.log('v: ', chunks)
    Object.values(chunks).forEach((chunk: Chunk) => {
      chunk.data = chunk.data.map((data: ChunkData) => {
        data.vegetation = {
          treeNoise: getNoiseForLocation(noise, data.location),
        }
        return data
      })
    })

    // max and min
    const spreadNoise = Object.values(chunks).map((chunk) => chunk.data.map((data) => data.vegetation.treeNoise))[0]
    const max = Math.max(...spreadNoise)
    const min = Math.min(...spreadNoise)
    console.log(`v: ${max} : ${min}`)

    // toRange(data.noiseValue, maxNoise, minNoise, 1, 0)
    Object.values(chunks).forEach((chunk: Chunk) => {
      const newChunks = []
      chunk.data = chunk.data.map((data: ChunkData) => {
        data.vegetation.treeNoise = toRange(data.vegetation.treeNoise, max, min, 1, 0)
        if (data.vegetation.treeNoise < 0.2 && data.absLocation.z >= -10) {
          newChunks.push(...generateTree(noise, data.location))
        }
        return data
      })
      chunk.data.push(...newChunks)
    })

    ctx.postMessage({ done: true, data: JSON.stringify(chunks) })
    Perf.get(`⚙ vegetation worker`).end()
  },
  false,
)

// import getNoiseForLocation from '@game/system/modules/world-chunks-generator/generate-chunk-noise/workers/noise/utils/getNoiseForLocation'
// import {random} from '@game/utils'
//
// /***
//  *
//  *
//  *
//  *
//  * All below for tree generation,
//  * it will be moved somewhere else ...later :)
//  *
//  *
//  *
//  * =====================================================
//  */

//

// /**
//  *
//  * @param location
//  */
// var generateTree = (location) => {
//   var currHeight
//
//   // how much space left?
//   let heightLeft = chunkSize - location.z
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
//   for (currHeight = location.z; currHeight <= location.z + height; currHeight++) {
//     drawTreeCube(location.x, location.y, currHeight)
//   }
//
//   drawLeavesCube(location.x, location.y, currHeight)
//   drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 1 }, 1)
//   drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 2 }, 1)
//   drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 2 }, 2)
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
//
// generateTree({ x: 0, y: 0, z: 5 })
