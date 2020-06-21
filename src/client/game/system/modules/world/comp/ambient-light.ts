import { AmbientLight } from 'three'

import dat from '@game/helpers/dat'

export default function ambientLight(scene) {
  const light = new AmbientLight(0x6e6e6e)
  const datHelper = dat.createSpace('AmbientLight', light)
  datHelper.addColor('color')
  return light
}
