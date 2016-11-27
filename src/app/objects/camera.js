import THREE from '../../lib/three';
import '../../lib/trackball';

const defaults = {
  rotation: {
    x: 2.1, y: 10.1, z: 2.3
  },
  position: {
    x: -180, y: 160, z: 60
  }
}


export default class Plane {


  constructor(app, gui, params) {
    this.app = app;
    this.gui = gui;
    this.params = params;
    this.createObject();
    this.setDefaults();
    this.camera.controls = new THREE.TrackballControls(this.camera);
    this.camera.controls.rotateSpeed = 1.0;
    this.camera.controls.zoomSpeed = 1.2;
    this.camera.controls.panSpeed = 0.8;
    this.camera.controls.noZoom = false;
    this.camera.controls.noPan = false;
    this.camera.controls.staticMoving = true;
    this.update();
    return this.camera;
  }

  createObject() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.app.registerUpdate(this.update.bind(this));
    this.camera.lookAt(this.app.scene.position);
    this.app.scene.add(this.camera);
  }

  setDefaults() {
    this.camera.position.x = defaults.position.x;
    this.camera.position.y = defaults.position.y;
    this.camera.position.z = defaults.position.z;
    this.camera.rotation.x = defaults.rotation.x;
    this.camera.rotation.y = defaults.rotation.y;
    this.camera.rotation.z = defaults.rotation.z;
  }

  update() {
    this.camera.controls.update();
  }

}