// @ts-ignore
import { Noise } from 'noisejs'
import { worldConfig } from '@game/config'
import getTreeCube from '@game/system/modules/world-chunks-generator/generate-chunk-data/chunk-vegetation/get-tree-cube'
import getLeavesCube from '@game/system/modules/world-chunks-generator/generate-chunk-data/chunk-vegetation/get-leaves-cube'
import drawCubeCircle from '@game/system/modules/world-chunks-generator/generate-chunk-data/chunk-vegetation/draw-cube-circle'
import { Cubes3D } from '@game/system/modules/world-chunks-generator/world-chunks-generator.types'
import getCubesAround from '@game/system/modules/world-chunks-generator/generate-chunk-data/chunk-vegetation/get-cubes-around'

export default function drawTree(noise: Noise, noiseValue: number, cubes3D: Cubes3D, location: { x: number; y: number; z: number }) {
  var currHeight
  const cubes = []

  // how much space left?
  let heightLeft = worldConfig.chunkSize - location.z

  // won't be able to draw soo tiny tree
  if (heightLeft < 6) {
    return []
  }

  // tree needs at least x blocks around space
  let anyCubesAround = false
  getCubesAround(1, { x: location.x, y: location.y, z: location.z + 1 }, (x: number, y: number, z: number) => {
    if (cubes3D[`${x}:${y}:${z}`]) {
      anyCubesAround = true
    }
  })

  if (anyCubesAround) return []

  // lets draw base, base is always min 4 - 6
  let mod = 150
  let height = Math.round((3 * (Math.round(Math.abs(noise.simplex3(location.x / mod, location.y / mod, location.z / mod) * 100)) / 10)) / 2)

  if (height < 3) height = 3

  for (currHeight = location.z; currHeight <= location.z + height; currHeight++) {
    cubes.push(getTreeCube(location.x, location.y, currHeight))
  }

  cubes.push(getLeavesCube(location.x, location.y, currHeight))
  cubes.push(...drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 1 }, 1))
  cubes.push(...drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 2 }, 1))
  cubes.push(...drawCubeCircle({ x: location.x, y: location.y, z: currHeight - 2 }, 2))
  return cubes
}
