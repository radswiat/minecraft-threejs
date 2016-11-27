import THREE from '../lib/three';
import dat from 'dat-gui';
import $ from "jquery";
import WorldGen from './func/world-gen';
var SimplexNoise = require('simplex-noise');

// import object
import Camera from './objects/camera';
import Cube from './objects/cube';

var gui = new dat.GUI();

export default class App {

  scene;
  camera;
  renderer;
  updateStack = [];

  def = {};

  constructor() {
    this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.Fog(0xffffff, 30, 200);
    this.addControls();
    this.createRenderer();
    this.createAxes();
    this.createLights();

    let cubeSize = 5;
    let cubeSpacing = 0.00;

    let world = new WorldGen('af25', {
    });

    world.get((x, y, z) => {
      let cube = new Cube(this, gui, {
        size: cubeSize
      });
      cube.position.set(x * (cubeSize + cubeSpacing), z * (cubeSize + cubeSpacing), y * (cubeSize + cubeSpacing));
      this.scene.add(cube);
    });

    this.camera = new Camera(this, gui);
    requestAnimationFrame(this.update.bind(this));
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xEEEEEE, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    $("#WebGL-output").append(this.renderer.domElement);
  }

  createAxes() {
    var axes = new THREE.AxisHelper(60);
    this.scene.add(axes);
  }

  createLights() {
    var spotLight = new THREE.SpotLight(0xffffe5);
    spotLight.position.set(50, 60, 50);
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.4 );
    directionalLight.position.set( -50, 50, 50 );
    this.scene.add( directionalLight );
  }

  addControls() {
    // var controlsMethods = {
    //   addCube: () => {
    //     console.log('add cube');
    //     new Sphere(this, gui);
    //   }
    // }
    // gui.add(controlsMethods, 'addCube');
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  registerUpdate(cb) {
    this.updateStack.push(cb);
  }

  update() {
    this.updateStack.forEach((cb) => {
      cb();
    })
    this.render();
    requestAnimationFrame(this.update.bind(this));
  }
}
