import { ChunkData } from '@game/system/modules/world-chunks-generator/world-chunks-generator.types'

export default function getLeavesCube(x: number, y: number, z: number): ChunkData {
  return {
    chunkDataId: `${x}:${y}:${z}`,
    noiseValue: 1,
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
    isTransparent: true,
  }
}
