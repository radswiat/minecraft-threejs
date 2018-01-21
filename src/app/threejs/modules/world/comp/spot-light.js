import { SpotLight, SpotLightHelper } from 'three';

import dat from 'helpers/dat-gui';

export default function spotLight(scene) {
  const light = new SpotLight(0xffffe5);

  // light.target.position.set(0, 0, 0);
  light.position.set(-611, 1289, -3863);
  light.angle = Math.PI / 4;
  light.penumbra = 0.00;
  light.decay = 1;
  light.distance = 10000;
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 10;
  light.shadow.camera.far = 200;

  // const lightHelper = new SpotLightHelper(light);
  // scene.add(lightHelper);

  dat.onChange('spot:light:color', (value) => {
    light.color.setHex(value);
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

  return light;
}
