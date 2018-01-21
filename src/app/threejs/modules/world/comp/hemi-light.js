import { HemisphereLight } from 'three';

import dat from 'helpers/dat-gui';

export default function hemiLight(scene) {
  const light = new HemisphereLight(0x6a777d, 0x848484, 0.6);

  dat.onChange('hemi:light:color1', (value) => {
    light.color.setHex(value);
  });

  dat.onChange('hemi:light:color2', (value) => {
    light.groundColor.setHex(value);
  });

  dat.onChange('hemi:light:intensity', (value) => {
    light.intensity = value;
  });

  return light;
}
