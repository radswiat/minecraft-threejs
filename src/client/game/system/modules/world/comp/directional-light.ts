import { DirectionalLight, CameraHelper } from 'three'

import dat from '@game/helpers/dat'

export default function directionalLight(scene) {
  const light = new DirectionalLight(0x6e6e6e, 1, 1000)
  light.position.set(0, 1, 0)
  light.castShadow = true

  light.shadow.mapSize.width = 512
  light.shadow.mapSize.height = 512
  light.shadow.camera.near = 55.5
  light.shadow.camera.far = 50000

  const datHelper = dat.createSpace('DirectionalLight', light)
  datHelper.addColor('color')
  datHelper.add('position.x', { range: 10000, opts: [1] })
  datHelper.add('position.y', { range: 10000, opts: [1] })
  datHelper.add('position.z', { range: 10000, opts: [1] })

  return [light, new CameraHelper(light.shadow.camera)]
}
