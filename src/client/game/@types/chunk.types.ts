import { Geometry, Material } from 'THREE'

export interface WorldChunk {
  geometry: Geometry
  helperGeometries: Geometry[]
  params: Material[]
}
