import { AxesHelper, DirectionalLight, Scene } from 'THREE'

import renderer from '@game/system/engine/renderer'
import dat from '@game/helpers/dat-gui'
import { worldConfig } from '@game/config'
import AssetsLoader from '@game/system/modules/assets-loader'
import Camera from '@game/system/modules/camera'
import World from '@game/system/modules/world'
import { Perf } from '@game/utils'
import { storeAssetsLoader } from '@shared/stores'

// import three js extensions
import '@libraries/first-person-controls'

export default class App {
  scene
  camera
  renderer
  updateStack = []

  def = {}

  constructor() {
    Perf.get('Engine starts')
    this.init()
  }

  async init() {
    // storeAssetsLoader.setLoading(true)
    //
    // // load assets
    // const assetsLoader = new AssetsLoader()
    // await assetsLoader.loadAssets()

    // create new scene
    this.scene = new Scene()

    // create new world
    this.world = new World(this, {
      seed: worldConfig.seed,
      chunkOptions: {
        mod: 30,
      },
    })

    // dat.onChange('world:chunk:mod', async (value) => {
    //   if (storeAssetsLoader.isLoading) return
    //   storeAssetsLoader.setLoading(true)
    //   this.world.destroy()
    //   this.world = new World({
    //     app: this,
    //     seed: worldConfig.seed,
    //     chunkOptions: {
    //       mod: value,
    //     },
    //   })
    //   await this.world.generateWorld()
    //   this.world.renderWorld()
    //   storeAssetsLoader.setLoading(false)
    // })

    // generate world chunks
    // - we won't be rendering it yet
    await this.world.generateWorld()

    // create renderer
    // required before rendering anything to the scene
    // - at this point, react will be replaced with threejs!
    renderer.create('#WebGL-output')

    storeAssetsLoader.setLoading(false)

    // axis helper
    // show axis for debugging
    this.createAxis()

    // render pre-generated world
    this.world.renderWorld()

    // apply lights to the world
    this.createLights()
    this.camera = new Camera(this)
    Perf.get('Engine starts').end()

    // start renderer loop
    // - it will initialize infinite rendering
    renderer.render(this.scene, this.camera)
  }

  createAxis() {
    const axis = new AxesHelper(200)
    this.scene.add(axis)
  }

  createLights() {
    const directionalLight = new DirectionalLight(0xffffff, 1.4)
    directionalLight.position.set(-50, 50, 50)
    this.scene.add(directionalLight)
  }
}
