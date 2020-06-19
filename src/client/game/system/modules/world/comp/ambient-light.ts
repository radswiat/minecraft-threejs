import { AmbientLight } from 'three'

import dat from '@game/helpers/dat-gui'

export default function ambientLight(scene) {
  const light = new AmbientLight(0x919191) // soft white light
  dat.onChange('ambient:light:color', (value) => {
    light.color.setHex(value)
  })
  return light
}
