import { Geometry } from 'three'

export interface ChunkCubesData {
  material: number
  location: {
    x: number
    y: number
    z: number
  }
  noiseValue: number
  surrounding: {
    px: boolean
    nz: boolean
    nx: boolean
    pz: boolean
    py: boolean
    ny: boolean
  }
}

// Cube planes
export interface CubePlanes {
  px: Geometry
  nz: Geometry
  nx: Geometry
  pz: Geometry
  py: Geometry
  ny: Geometry
}
