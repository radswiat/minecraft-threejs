import { SpotLight as _SpotLight, SpotLightHelper, Scene, Object3D } from 'three'

// import dat from '@game/helpers/dat-gui'
import dat from '@game/helpers/dat'
import renderer from '@game/system/engine/renderer'

export default class SpotLight {
  private target: Object3D = null
  private light: _SpotLight = null
  private scene: Scene = null
  private lightHelper: SpotLightHelper = null

  constructor(scene: Scene) {
    this.scene = scene
    this._createLight()
    this._createLightHelper()
    this._bindDat()
    renderer.onUpdate(this._update)
  }

  /**
   * Create spot light
   * @private
   */
  _createLight() {
    this.target = new Object3D()
    this.light = new _SpotLight(0x8c8c8c)
    this.light.target = this.target
    this.light.position.set(-1861, -801, 1367)
    this.light.angle = Math.PI / 2.2
    this.light.penumbra = 0.0
    this.light.decay = 1
    this.light.distance = 10000
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 2048
    this.light.shadow.mapSize.height = 2048
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
    const datSpotLight = dat.createSpace('SpotLight', this.light)
    datSpotLight.onChange(() => {
      this.lightHelper.update()
    })
    datSpotLight.addColor('color')
    datSpotLight.add('position.x', { range: 10000, opts: [1] })
    datSpotLight.add('position.y', { range: 10000, opts: [1] })
    datSpotLight.add('position.z', { range: 10000, opts: [1] })
    datSpotLight.add('target.position.x', { range: 10000, opts: [1] })
    datSpotLight.add('target.position.y', { range: 10000, opts: [1] })
    datSpotLight.add('target.position.z', { range: 10000, opts: [1] })
    datSpotLight.add('shadow.mapSize.width', { range: 10000, opts: [1] })
    datSpotLight.add('shadow.mapSize.height', { range: 10000, opts: [1] })
    datSpotLight.add('shadow.bias', { range: 10000, opts: [1] })
    datSpotLight.add('angle', { opts: [0, 90, 1], convert: 'deg' })
    datSpotLight.add('penumbra', { range: 10000, opts: [1] })
    datSpotLight.add('decay', { range: 10000, opts: [1] })
    datSpotLight.add('distance', { range: 10000, opts: [1] })
  }

  render() {
    this.scene.add(this.light)
    this.scene.add(this.lightHelper)
    this.scene.add(this.target)
  }

  _update = () => {
    this.light.position.z -= 0.005
    this.light.position.x += 0.005
  }
}
