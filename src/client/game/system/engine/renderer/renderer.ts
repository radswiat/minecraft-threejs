import { PCFSoftShadowMap, WebGLRenderer, Raycaster } from 'three'

export default new (class Renderer {
  updateStack = []

  create(selector) {
    this.renderer = new WebGLRenderer()
    this.renderer.setClearColor(0xeeeeee, 1.0)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    document.querySelector(selector).appendChild(this.renderer.domElement)
  }

  onUpdate(cb) {
    this.updateStack.push(cb)
  }

  render = (scene, camera) => {
    this.updateStack.map((cb) => {
      cb()
    })
    this.renderer.render(scene, camera)
    requestAnimationFrame(this.render.bind(this, scene, camera))
  }
})()
