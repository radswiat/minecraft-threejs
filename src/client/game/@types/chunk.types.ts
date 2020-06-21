import { BufferGeometry, Material, BoxHelper } from 'three'

export interface WorldChunk {
  geometry: BufferGeometry
  helperGeometries: BufferGeometry[] | BoxHelper[]
  params?: Material[]
}
