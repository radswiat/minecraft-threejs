import { Cubes3D } from '@game/system/modules/world-chunks-generator/world-chunks-generator.types'

export default function isCubeAtLocation(cubes: Cubes3D, x: number, y: number, z: number) {
  const cube = cubes[`${x}:${y}:${z}`]
  if (cube && cube.isTransparent) return false
  return !!cubes[`${x}:${y}:${z}`]
}
