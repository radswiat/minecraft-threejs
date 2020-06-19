import { BoxGeometry, BoxHelper, Mesh, MeshBasicMaterial } from 'three'

import { worldConfig } from '@game/config/world'
import { Location2D } from '@game/@types/locations.types'

export default function createChunkBoxHelper(location: Location2D, cubeSize: number) {
  const chunkDimension = worldConfig.chunkSize * cubeSize
  const boxGeometry = new BoxGeometry(chunkDimension, chunkDimension, chunkDimension)
  boxGeometry.translate(location.x * chunkDimension, location.y * chunkDimension, 0)
  const object = new Mesh(boxGeometry, new MeshBasicMaterial())
  return new BoxHelper(object, 0xffff00)
}
