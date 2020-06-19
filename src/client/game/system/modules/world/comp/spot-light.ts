import { SpotLight as _SpotLight, SpotLightHelper } from 'three'

import dat from '@game/helpers/dat-gui'
import renderer from '@game/system/engine/renderer'

export default class SpotLight {
  constructor(scene) {
    this.scene = scene
    this._createLight()
    this._createLightHelper()
    this._bindDat()
    renderer.onUpdate(this._update)
  }

  render() {
    this.scene.add(this.light)
    this.scene.add(this.lightHelper)
  }

  _update = () => {
    this.light.position.y -= 0.005
    this.light.position.x += 0.005
  }

  /**
   * Create spot light
   * @private
   */
  _createLight() {
    this.light = new _SpotLight(0x8c8c8c)
    this.light.position.set(-441, 889, -1563)
    this.light.angle = Math.PI / 2.2
    this.light.penumbra = 0.0
    this.light.decay = 1
    this.light.distance = 10000
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 1254
    this.light.shadow.mapSize.height = 1254
    this.light.shadow.camera.near = 1
    this.light.shadow.camera.far = 2000
  }

  /**
   * Create light helper
   * @private
   */
  _createLightHelper() {
    this.lightHelper = new SpotLightHelper(this.light)
  }

  /**
   * Bind DAT.GUI
   * @private
   */
  _bindDat() {
    dat.onChange('spot:light:color', (value) => {
      this.light.color.setHex(value)
      this.lightHelper.update()
    })
    dat.onChange('spot:light:shadow', (value) => {
      this.light.shadow.mapSize.width = value
      this.light.shadow.mapSize.height = value
    })
    this.light.shadow.mapSize.width
    dat.onChange('spot:light:bias', (value) => {
      this.light.shadow.bias = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:position:x', (value) => {
      this.light.position.x = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:position:y', (value) => {
      this.light.position.y = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:position:z', (value) => {
      this.light.position.z = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:target:x', (value) => {
      this.light.target.position.set(value, 0, 0)
      this.lightHelper.update()
    })
    dat.onChange('spot:light:target:y', (value) => {
      this.light.target.position.y = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:target:z', (value) => {
      this.light.target.position.z = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:angle', (value) => {
      this.light.angle = Math.PI / value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:penumbra', (value) => {
      this.light.penumbra = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:decay', (value) => {
      this.light.decay = value
      this.lightHelper.update()
    })
    dat.onChange('spot:light:distance', (value) => {
      this.light.distance = value
      this.lightHelper.update()
    })
  }
}
