import { SpotLight, SpotLightHelper } from 'three';

import dat from 'helpers/dat-gui';

export default function spotLight() {
  const light = new SpotLight(0x8c8c8c);

  // light.target.position.set(0, 0, 0);
  light.position.set(-441, 889, -1563);
  light.angle = Math.PI / 2.2;
  light.penumbra = 0.00;
  light.decay = 1;
  light.distance = 10000;
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 2000;

  const lightHelper = new SpotLightHelper(light);

  dat.onChange('spot:light:color', (value) => {
    light.color.setHex(value);
    lightHelper.update();
  });
  dat.onChange('spot:light:bias', (value) => {
    light.shadow.bias = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:position:x', (value) => {
    light.position.x = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:position:y', (value) => {
    light.position.y = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:position:z', (value) => {
    light.position.z = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:target:x', (value) => {
    light.target.position.set(value, 0, 0);
    lightHelper.update();
  });
  dat.onChange('spot:light:target:y', (value) => {
    light.target.position.y = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:target:z', (value) => {
    light.target.position.z = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:angle', (value) => {
    light.angle = Math.PI / value;
    lightHelper.update();
  });
  dat.onChange('spot:light:penumbra', (value) => {
    light.penumbra = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:decay', (value) => {
    light.decay = value;
    lightHelper.update();
  });
  dat.onChange('spot:light:distance', (value) => {
    light.distance = value;
    lightHelper.update();
  });

  return [light, lightHelper];
}
