import { HemisphereLight } from 'three'

import dat from '@game/helpers/dat'

export default function hemiLight(scene) {
  const light = new HemisphereLight(0x6a777d, 0x848484, 0.6)

  const datHelper = dat.createSpace('HemiLight', light)

  datHelper.addColor('color')
  datHelper.addColor('groundColor')
  datHelper.add('intensity', { range: 10000, opts: [1] })

  return light
}
