import { BufferGeometry, Geometry, Matrix4 } from 'three'

import { CubePlanes, ChunkCubesData } from '@game/@types/cube.types'
import { worldConfig } from '@game/config'

import { Chunk } from '../../world-chunks-generator.types'

/**
 * Create optimized cube geometry
 * Creates geometry for the chunk with optimized cubes - eg no invisible sides would have a geometry
 * @param chunk
 * @param cubePlanes
 */
export default function createOptimizedCubeGeometry(chunk: Chunk, cubePlanes: CubePlanes) {
  const cubeSize = worldConfig.cubeSize
  const matrix = new Matrix4()
  const tmpGeometry = new Geometry()
  // For each cube data
  chunk.data.forEach((chunk) => {
    if (chunk.location.z === -12) chunk.material = 5
    if (chunk.location.z === -11) chunk.material = 6
    if (chunk.location.z === -10) chunk.material = 6
    // if (chunk.location.z === -9) chunk.material = 6
    // Apply chunk location to the matrix
    matrix.makeTranslation(chunk.location.x * cubeSize, chunk.location.y * cubeSize, chunk.location.z * cubeSize)
    // Check what chunk geometry should be drawn
    if (!chunk.surrounding.px) tmpGeometry.merge(cubePlanes.px, matrix, chunk.material)
    if (!chunk.surrounding.nx) tmpGeometry.merge(cubePlanes.nx, matrix, chunk.material)
    if (!chunk.surrounding.py) tmpGeometry.merge(cubePlanes.py, matrix, chunk.material)
    if (!chunk.surrounding.pz) tmpGeometry.merge(cubePlanes.pz, matrix, chunk.material)
    if (!chunk.surrounding.nz) tmpGeometry.merge(cubePlanes.nz, matrix, chunk.material)
    if (!chunk.surrounding.ny) tmpGeometry.merge(cubePlanes.ny, matrix, chunk.material)
  })

  return new BufferGeometry().fromGeometry(tmpGeometry)
}
