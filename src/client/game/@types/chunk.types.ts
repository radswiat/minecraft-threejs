import { BufferGeometry, Material, BoxHelper } from 'THREE'

export interface WorldChunk {
  geometry: BufferGeometry
  helperGeometries: BufferGeometry[] | BoxHelper[]
  params?: Material[]
}
