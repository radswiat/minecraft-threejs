// @ts-ignore
import { FirstPersonControls, PerspectiveCamera, Clock, Vector3, Object3D } from 'three'

import renderer from '@game/system/engine/renderer'
import { toRad } from '@game/utils/_to-rad'

import '@libraries/trackball'
import '@libraries/pointer-lock-controls'
import '@libraries/first-person-controls'
import * as THREE from 'three'

const defaults = {
  rotation: {
    x: toRad(180),
    y: 0,
    z: 0,
  },
  position: {
    x: 2600,
    y: 2300,
    z: 1500,
  },
}

export default class Plane {
  public camera: PerspectiveCamera = null

  constructor(app, gui, params) {
    this.app = app
    this.gui = gui
    this.params = params
    this.clock = new Clock()
    Object3D.DefaultUp.set(0, 0, 1)
    this.createCamera()
    this.createControls()
    this.setDefaults()
    this.update()
    return this.camera
  }

  createCamera() {
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 600000)
    // this.app.registerUpdate(this.update.bind(this));
    renderer.onUpdate(this.update.bind(this))
  }

  createControls() {
    this.controls = new FirstPersonControls(this.camera)
    this.controls.movementSpeed = 320
    this.controls.lookSpeed = 0.18
    // initial camera rotation using lon and lat
    // this.camera.rotate wont work!
    this.controls.lon = -35
    this.controls.lat = -30
    this.controls.enabled = true
  }

  setDefaults() {
    this.camera.position.x = defaults.position.x
    this.camera.position.y = defaults.position.y
    this.camera.position.z = defaults.position.z
    setTimeout(() => {
      this.camera.lookAt(0, 0, 0)
      console.log('looooook!!!')
    }, 3000)
    // this.camera.lookAt(0, 0, 0)
    // this.camera.rotateX(defaults.rotation.x)
    // this.camera.up = new Vector3(0, 0, 1)
    // this.camera.rotation = { x: toRad(180), y: 0, z: 0 }
    // this.camera.rotateZ(toRad(180))
    // this.camera.rotation(toRad(180), 0, 0)
  }

  update() {
    this.controls.update(this.clock.getDelta())
  }
}
