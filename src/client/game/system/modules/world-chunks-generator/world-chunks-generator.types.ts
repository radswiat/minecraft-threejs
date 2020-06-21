import { BufferGeometry, BoxHelper } from 'three'

type Location2D = {
  x: number
  y: number
}

type Location = {
  x: number
  y: number
  z: number
}

export interface ChunkData {
  location: Location
  absLocation: Location
  material: number
  noiseValue: number
  surrounding: {
    nx: boolean
    ny: boolean
    nz: boolean
    px: boolean
    py: boolean
    pz: boolean
  }
}

export interface Chunk {
  chunkId: string
  noiseMax: number
  noiseMin: number
  data: ChunkData[]
}

export type ChunkCoordinated = { [key: string]: Chunk }

export type ChunkDataCoordinated = { [key: string]: ChunkData }

export interface ChunkNoiseOpts {
  location: Location2D
  chunkMod: number
  chunkId: string
}

export interface ChunkGeometries {
  geometry: BufferGeometry
  helperGeometries: BufferGeometry[] | BoxHelper[]
}
