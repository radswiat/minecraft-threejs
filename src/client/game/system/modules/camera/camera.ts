// @ts-ignore
import { FirstPersonControls, PerspectiveCamera, Clock, Object3D } from 'three'

import renderer from '@game/system/engine/renderer'
import { toRad } from '@game/utils/_to-rad'

import '@libraries/trackball'
import { PointerLockControls } from '@libraries/pointer-lock-controls'
import '@libraries/first-person-controls'
import gameEvents from '@game/system/modules/game-events'
import controlsMove from './controls'

const defaults = {
  rotation: {
    x: toRad(180),
    y: 0,
    z: 0,
  },
  position: {
    x: -1100.2243563049192,
    y: 196.94912220775572,
    z: -165,
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
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600000)
    // this.app.registerUpdate(this.update.bind(this));
    renderer.onUpdate(this.update.bind(this))
  }

  createControls() {
    // TODO: new controls
    // const controls = new PointerLockControls(this.camera, document.body)
    // this.controls = controls
    // controlsMove(controls)
    // document.getElementsByTagName('body')[0].addEventListener(
    //   'click',
    //   function () {
    //     controls.lock()
    //   },
    //   false,
    // )

    this.controls = new FirstPersonControls(this.camera)
    this.controls.movementSpeed = 320
    this.controls.lookSpeed = 0.18
    // initial camera rotation using lon and lat
    // this.camera.rotate wont work!
    this.controls.lon = -115
    this.controls.lat = -30
    this.controls.enabled = true
    gameEvents.addArgs('render', [{ controls: this.controls }])
  }

  setDefaults() {
    this.camera.position.x = defaults.position.x
    this.camera.position.y = defaults.position.y
    this.camera.position.z = defaults.position.z
  }

  update() {
    this.controls.update(this.clock.getDelta())
  }
}
