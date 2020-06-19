import { Perf } from '@game/utils'

import { Chunk, ChunkData, ChunkCoordinated, ChunkDataCoordinated } from '../../../world-chunks-generator.types'

const ctx: Worker = self as any

function getChunkFromLocation(chunks: ChunkDataCoordinated, x: number, y: number, z: number) {
  return !!chunks[`${x}:${y}:${z}`]
}

ctx.addEventListener(
  'message',
  ({ data }) => {
    Perf.get(`⚙ surroundings worker`)

    const chunks = data.chunks as ChunkCoordinated
    const noiseRenderThreshold = data.noiseRenderThreshold as number

    // convert to 3D
    // we need to find particular blocks by x,y,z coords so we need to convert them into [x,y,z] notation
    const blocks: ChunkDataCoordinated = {}
    Object.entries(chunks).forEach(([key, value]) => {
      value.data.forEach((chunk) => {
        if (chunk.noiseValue < noiseRenderThreshold) {
          blocks[`${chunk.location.x}:${chunk.location.y}:${chunk.location.z}`] = chunk
        }
      })
    })

    Object.entries(chunks).forEach(([key, value]) => {
      const chunk = chunks[key]
      chunk.data = chunk.data.filter((chunkData: ChunkData) => {
        return chunkData.noiseValue < noiseRenderThreshold
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
    })

    ctx.postMessage(chunks)
    Perf.get(`⚙ surroundings worker`).end()
  },
  false,
)
