import { Perf } from '@game/utils'

import { ChunkData, ChunkCoordinated, ChunkDataCoordinated } from '../../../world-chunks-generator.types'

const ctx: Worker = self as any

function getChunkFromLocation(chunks: ChunkDataCoordinated, x: number, y: number, z: number) {
  return !!chunks[`${x}:${y}:${z}`]
}

function isAboveThreshold(noise, threshold, thresholdMod, z) {
  // console.log(`y: ${threshold - (z + 13) / 100}`)
  return noise < threshold - Math.pow(z + 13, (z + 13) / thresholdMod) / 100
}

ctx.addEventListener(
  'message',
  ({ data }) => {
    Perf.get(`⚙ surroundings worker`)
    const chunks = JSON.parse(data.chunks) as ChunkCoordinated
    const noiseRenderThreshold = data.noiseRenderThreshold as number
    const thresholdMod = data.thresholdMod
    const waterLevel = -12

    // convert to 3D
    // we need to find particular blocks by x,y,z coords so we need to convert them into [x,y,z] notation
    const blocks: ChunkDataCoordinated = {}
    Object.entries(chunks).forEach(([key, value]) => {
      value.data.forEach((chunk) => {
        if (
          chunk.location.z === waterLevel ||
          isAboveThreshold(chunk.noiseValue, noiseRenderThreshold, thresholdMod, chunk.absLocation.z)
        ) {
          blocks[`${chunk.location.x}:${chunk.location.y}:${chunk.location.z}`] = chunk
        }
      })
    })

    Object.entries(chunks).forEach(([key, value]) => {
      const chunk = chunks[key]
      chunk.data = chunk.data.filter((chunkData: ChunkData) => {
        return (
          chunkData.location.z === waterLevel ||
          isAboveThreshold(chunkData.noiseValue, noiseRenderThreshold, thresholdMod, chunkData.absLocation.z)
        )
      })
      chunk.data = chunk.data.map((data) => {
        const { x, y, z } = data.location
        data.surrounding = {
          px: !!getChunkFromLocation(blocks, x + 1, y, z),
          nx: !!getChunkFromLocation(blocks, x - 1, y, z),
          py: !!getChunkFromLocation(blocks, x, y + 1, z),
          pz: !!getChunkFromLocation(blocks, x, y, z + 1),
          nz: !!getChunkFromLocation(blocks, x, y, z - 1),
          ny: !!getChunkFromLocation(blocks, x, y - 1, z),
        }
        return data
      })
      // filter ones that has no sides!
      // increases the performance
      chunk.data = chunk.data.filter((data) => {
        return !(
          data.surrounding.px &&
          data.surrounding.nx &&
          data.surrounding.py &&
          data.surrounding.pz &&
          data.surrounding.nz &&
          data.surrounding.ny
        )
      })
      ctx.postMessage({ done: false })
    })

    ctx.postMessage({ done: true, data: JSON.stringify(chunks) })
    Perf.get(`⚙ surroundings worker`).end()
  },
  false,
)
