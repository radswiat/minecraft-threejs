import * as THREE from '../../lib/three';
import '../../lib/trackball';
import '../../lib/PointerLockControls';
import Utils from '../utils';

const defaults = {
  rotation: {
    x: 0, y: 0, z: 0
  },
  position: {
    x: 0, y: 15, z: 120
  }
}


export default class Plane {


  constructor(app, gui, params) {
    this.app = app;
    this.gui = gui;
    this.params = params;
    this.createObject();
    this.setDefaults();
    this.bindKeys();

    this.mousePosition = {
      start: new THREE.Vector2(),
      current: new THREE.Vector2()
    }
    this.drag = false;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.canJump = false;
    this.velocity = new THREE.Vector3();
    this.velocityR = new THREE.Vector3();
    this.update();
    return this.camera;
  }

  createObject() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.app.registerUpdate(this.update.bind(this));
  }

  setDefaults() {
    this.camera.position.x = defaults.position.x;
    this.camera.position.y = defaults.position.y;
    this.camera.position.z = defaults.position.z;
    this.camera.rotation.x = defaults.rotation.x;
    this.camera.rotation.z = 0;
    this.camera.rotation.x = 0;
    this.camera.rotation.y = 0;
    this.camera.rotation.y = Utils.toRad(360);
  }

  update() {
    // this.camera.controls.update();
    // this.camera.rotation.z = Math.PI * 1;
    // console.log(`x: ${this.camera.position.z} y: ${this.camera.position.z} z: ${this.camera.position.z}`);
    // console.log(`x: ${this.camera.rotation.z} y: ${this.camera.rotation.z} z: ${this.camera.rotation.z}`);
    // this.camera.rotation.x = Math.PI * 180;
    // x = red stop

    var delta = 1000;
    if (this.moveForward) this.velocity.z -= 400.0 / delta;
    if (this.moveBackward) this.velocity.z += 400.0 / delta;
    if (this.moveLeft) this.velocity.x -= 400.0 / delta;
    if (this.moveRight) this.velocity.x += 400.0 / delta;

    var delta = 1000;
    if (this.drag) {
      let modX = ( this.mousePosition.start.y - this.mousePosition.current.y ) / 20000.00;
      this.camera.rotation.x += modX;
      let modY = ( this.mousePosition.start.x - this.mousePosition.current.x ) / 20000.00;
      this.camera.rotation.y += modY;
      console.log('PI: ' + Utils.degAbs(Utils.toDeg(this.camera.rotation.y)));
    }

    // this.controls.getObject().translateX(this.velocity.x / delta);
    // this.controls.getObject().translateY(this.velocity.y / delta);
    // this.controls.getObject().translateZ(this.velocity.z / delta);

    // this.camera.position.x = this.controls.getObject().position.x;
    // this.camera.position.y = this.controls.getObject().position.y;
    // this.camera.position.z = this.controls.getObject().position.z;

    // this.velocity.applyAxisAngle( new THREE.Vector3( 0, 5, 0 ), this.camera.rotation.y );
    var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
    this.velocity.applyEuler( rotation );

    this.camera.position.x += this.velocity.x;
    this.camera.position.y += this.velocity.y;
    this.camera.position.z += this.velocity.z;


    // this.camera.rotation.x += this.velocityR.x;
    // this.camera.rotation.y += this.velocityR.y;
    // this.camera.rotation.z += this.velocityR.z;

    // we need to translate movement,
    // by the face that camera is looking at
    // - cal on Y axis ?
    // this.velocity.z = this.velocity.z
    // this.velocity.y = this.velocity.y * Utils.degAbs(Utils.toDeg(this.camera.rotation.y));
    // this.camera.rotation.projectOnVector(this.velocity);

    // slow down!
    for( let vel in this.velocity ) {
      let doFor = ['x', 'y', 'z'];
      if(doFor.indexOf(vel) >= 0) {
        if( this.velocity[vel] )
          this.velocity[vel] = this.velocity[vel] / 1.1;
        if(Math.abs(this.velocity[vel]) < 0.25){
          this.velocity[vel] = 0;
        }
      }
    }

    // slow down rotation
    for( let vel in this.velocity ) {
      let doFor = ['x', 'y', 'z'];
      if(doFor.indexOf(vel) >= 0) {
        if( this.velocityR[vel] )
          this.velocityR[vel] = this.velocityR[vel] / 1.1;
        if(Math.abs(this.velocityR[vel]) < 0.25){
          this.velocityR[vel] = 0;
        }
      }
    }

  }




  bindKeys() {

    var onMouseDown = (event) => {
      this.mousePosition.start.x = event.screenX;
      this.mousePosition.start.y = event.screenY;
      this.mousePosition.current.x = event.screenX;
      this.mousePosition.current.y = event.screenY;
      this.drag = true;
    }

    var onMouseUp = (event) => {
      this.drag = false;
    }

    var onMouseMove = (event) => {
      if(this.drag) {
        this.mousePosition.current.x = event.screenX;
        this.mousePosition.current.y = event.screenY;
      }
    }

    var onKeyDown = (event) => {

      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          this.moveForward = true;
          break;

        case 37: // left
        case 65: // a
          this.moveLeft = true;
          break;

        case 40: // down
        case 83: // s
          this.moveBackward = true;
          break;

        case 39: // right
        case 68: // d
          this.moveRight = true;
          break;

        case 32: // space
          if (this.canJump === true) this.velocity.y += 350;
          this.canJump = false;
          break;
      }

    };

    var onKeyUp = (event) => {

      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          this.moveForward = false;
          break;

        case 37: // left
        case 65: // a
          this.moveLeft = false;
          break;

        case 40: // down
        case 83: // s
          this.moveBackward = false;
          break;

        case 39: // right
        case 68: // d
          this.moveRight = false;
          break;

      }

    };

    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
  }

}