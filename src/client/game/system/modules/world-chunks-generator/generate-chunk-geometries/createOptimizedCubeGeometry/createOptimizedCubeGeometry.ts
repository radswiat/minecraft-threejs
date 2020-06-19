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
  chunk.data.forEach((cube) => {
    // Apply cube location to the matrix
    matrix.makeTranslation(cube.location.x * cubeSize, cube.location.y * cubeSize, cube.location.z * cubeSize)
    // Check what cube geometry should be drawn
    if (!cube.surrounding.px) tmpGeometry.merge(cubePlanes.px, matrix, cube.material)
    if (!cube.surrounding.nx) tmpGeometry.merge(cubePlanes.nx, matrix, cube.material)
    if (!cube.surrounding.py) tmpGeometry.merge(cubePlanes.py, matrix, cube.material)
    if (!cube.surrounding.pz) tmpGeometry.merge(cubePlanes.pz, matrix, cube.material)
    if (!cube.surrounding.nz) tmpGeometry.merge(cubePlanes.nz, matrix, cube.material)
    if (!cube.surrounding.ny) tmpGeometry.merge(cubePlanes.ny, matrix, cube.material)
  })
  return new BufferGeometry().fromGeometry(tmpGeometry)
}
