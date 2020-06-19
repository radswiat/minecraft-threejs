import { CubePlanes } from '@game/@types/cube.types'

import createPlaneGeometry from '../createPlaneGeometry'
import { worldConfig } from '@game/config'

/**
 * Create array of cube planes for each side
 */
export default function createCubePlanes(): CubePlanes {
  const cubeSize = worldConfig.cubeSize
  //   o
  // o o o
  //   x
  const px = createPlaneGeometry(cubeSize, { rotateY: Math.PI / 2, translateX: cubeSize / 2, translateY: 0, translateZ: 0 })
  //   o
  // o o x
  //   o
  const nz = createPlaneGeometry(cubeSize, { rotateY: Math.PI, translateX: 0, translateY: 0, translateZ: -cubeSize / 2 })
  //   x
  // o o o
  //   o
  const nx = createPlaneGeometry(cubeSize, { rotateY: -Math.PI / 2, translateX: -cubeSize / 2, translateY: 0, translateZ: 0 })
  //   o
  // x o o
  //   o
  const pz = createPlaneGeometry(cubeSize, { translateX: 0, translateY: 0, translateZ: cubeSize / 2 })
  //   o
  // o x o // top
  //   o
  const py = createPlaneGeometry(cubeSize, { rotateX: -Math.PI / 2, translateX: 0, translateY: cubeSize / 2, translateZ: 0 })
  //   o
  // o x o // bottom
  //   o
  const ny = createPlaneGeometry(cubeSize, { rotateX: Math.PI / 2, translateX: 0, translateY: -cubeSize / 2, translateZ: 0 })

  return {
    px,
    nz,
    nx,
    pz,
    py,
    ny,
  }
}
