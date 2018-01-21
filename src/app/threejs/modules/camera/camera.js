import * as THREE from 'three';

import 'lib/trackball';
import 'lib/pointer-lock-controls';
import 'lib/first-person-controls';

const defaults = {
  rotation: {
    x: 0, y: 0, z: 0,
  },
  position: {
    x: 600, y: 300, z: -200,
  },
};

export default class Plane {

  constructor(app, gui, params) {
    this.app = app;
    this.gui = gui;
    this.params = params;
    this.clock = new THREE.Clock();
    this.createCamera();
    this.setDefaults();
    this.createControls();
    this.update();
    return this.camera;
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 600000);
    this.app.registerUpdate(this.update.bind(this));
  }

  createControls() {
    this.controls = new THREE.FirstPersonControls( this.camera );
    this.controls.movementSpeed = 320;
    this.controls.lookSpeed = 0.18;
    this.controls.lon = -210;
    this.controls.lat = -20;
    this.controls.enabled = true;
  }

  setDefaults() {
    this.camera.position.x = defaults.position.x;
    this.camera.position.y = defaults.position.y;
    this.camera.position.z = defaults.position.z;
  }

  update() {
    this.controls.update( this.clock.getDelta() );
  }

}
