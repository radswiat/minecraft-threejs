import { Mesh, MeshLambertMaterial, BoxGeometry, ImageUtils } from 'three'

export default class Cube {
  static isGui = false

  constructor(app, gui, params) {
    this.app = app
    this.gui = gui
    this.params = params
    this.create()
    return this.cube
  }

  create() {
    // loading texture
    const texture = ImageUtils.loadTexture('../resources/textures/blocks/hardened_clay_stained_green.png')
    const cubeGeometry = new BoxGeometry(this.params.size, this.params.size, this.params.size)
    const cubeMaterial = new MeshLambertMaterial()
    cubeMaterial.map = texture
    this.cube = new Mesh(cubeGeometry, cubeMaterial)
    this.cube.castShadow = true
  }
}
