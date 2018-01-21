import THREE from 'three';

export default class Sphere {

  static isGui = false;

  constructor(app, gui, params) {
    this.app = app;
    this.gui = gui;
    this.params = params;
    this.create();
    return this.cube;
  }

  create() {
    // loading texture
    var texture = THREE.ImageUtils.loadTexture("../assets/textures/blocks/hardened_clay_stained_green.png");
    var cubeGeometry = new THREE.BoxGeometry(this.params.size, this.params.size, this.params.size);
    var cubeMaterial = new THREE.MeshLambertMaterial();
    cubeMaterial.map = texture;
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.castShadow = true;


  }

}
