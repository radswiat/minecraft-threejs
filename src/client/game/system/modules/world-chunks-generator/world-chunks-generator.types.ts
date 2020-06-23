import { BufferGeometry, BoxHelper } from 'three'

export interface WorldChunksGeneratorOpts {
  startChunkLocation?: [number, number]
}

type Location2D = {
  x: number
  y: number
}

type Location = {
  x: number
  y: number
  z: number
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

// -------------- FIXED
export interface Chunk {
  chunkId: string
  noiseMaps: {
    treeMax: number
    treeMin: number
    cubeMax: number
    cubeMin: number
  }
  data: ChunkData[]
}

export interface ChunkData {
  chunkDataId: string
  noiseValue: number
  location: Location
  absLocation: Location
  vegetation: Vegetation
  material?: number
  surrounding?: Surroundings
  isTransparent?: boolean
}

export interface Surroundings {
  nx: boolean
  ny: boolean
  nz: boolean
  px: boolean
  py: boolean
  pz: boolean
}

export interface Vegetation {
  treeNoise: number
}

export type Chunks2D = { [key: string]: Chunk }
export type ChunksArr = Chunk[]
export type ChunkData2D = { [key: string]: ChunkData }
export type ChunkDataArr = ChunkData[]
export type Cubes3D = { [key: string]: ChunkData }
