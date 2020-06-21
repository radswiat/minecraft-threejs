import { BoxGeometry, BoxHelper, Mesh, MeshBasicMaterial } from 'three'

import { worldConfig } from '@game/config/world'
import { Location2D } from '@game/@types/locations.types'

export default function createChunkBoxHelper(location: Location2D) {
  const chunkDimension = worldConfig.chunkSize * worldConfig.cubeSize
  const boxGeometry = new BoxGeometry(chunkDimension, chunkDimension, chunkDimension)
  boxGeometry.translate(location.x * chunkDimension + chunkDimension / 2, location.y * chunkDimension + chunkDimension / 2, 0)
  const object = new Mesh(boxGeometry, new MeshBasicMaterial())
  return new BoxHelper(object, 0xffff00)
}
