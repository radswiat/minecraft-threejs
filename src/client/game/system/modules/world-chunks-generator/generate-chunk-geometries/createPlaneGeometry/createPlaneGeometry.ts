import { Geometry, PlaneBufferGeometry } from 'three'

import { CreatePlaneGeometryOpts } from './createPlaneGeometry.d'

export default function createPlaneGeometry(
  cubeSize: number,
  { rotateY = 0, rotateX = 0, translateX, translateY, translateZ }: CreatePlaneGeometryOpts,
): Geometry {
  const geometry = new PlaneBufferGeometry(cubeSize, cubeSize)
  geometry.rotateY(rotateY)
  geometry.rotateX(rotateX)
  geometry.translate(translateX, translateY, translateZ)
  return new Geometry().fromBufferGeometry(geometry)
}
