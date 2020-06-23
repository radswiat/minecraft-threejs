import { SphereGeometry, Mesh, ShaderMaterial, RepeatWrapping, TextureLoader, BackSide, MeshPhongMaterial, MeshBasicMaterial } from 'three'
import { toRad } from '@game/utils'

export default function skybox(scene) {
  const skyboxSize = 20000
  const geometry = new SphereGeometry(skyboxSize, 60, 40)
  geometry.scale(-1, 1, 1)
  geometry.rotateX(toRad(90))
  const texture = new TextureLoader().load('../resources/textures/skydome/sky.jpg')
  var material = new MeshBasicMaterial({ map: texture })
  material.fog = false
  return new Mesh(geometry, material)
}
