import { worldConfig } from '@game/config'
import { Location2D } from '@game/@types/locations.types'

import createCubePlanes from './createCubePlanes'
import createOptimizedCubeGeometry from './createOptimizedCubeGeometry'
import createChunkBoxHelper from './createChunkBoxHelper'

import { Chunk, ChunkGeometries } from '../world-chunks-generator.types'

/**
 * Generate single chunk
 * @param chunk
 * @param chunkNoise
 */
export default async function generateChunkGeometries(chunk: Chunk, { location }): Promise<ChunkGeometries> {
  return new Promise(async (resolve) => {
    // Create cube planes
    // all sides of the cube as separate plane geometries
    const cubePlanes = createCubePlanes()

    // Create optimized cube geometry
    // Contains only the cube size that are visible
    const geometry = createOptimizedCubeGeometry(chunk, cubePlanes)
    geometry.computeBoundingSphere()

    resolve({
      geometry,
      helperGeometries: [],
      // helperGeometries: [createChunkBoxHelper(location)],
    })
  })
}
