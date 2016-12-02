import {
  WebGLRenderer, AxisHelper,
  PCFSoftShadowMap,
  MeshLambertMaterial,
  SpotLight, DirectionalLight,
  Matrix4, Mesh,
  Scene, Clock,
  Geometry, BufferGeometry, PlaneBufferGeometry,
  TextureLoader} from '../lib/three';
import dat from 'dat-gui';
import '../lib/FirstPersonControls';
import $ from "jquery";
import Camera from './objects/camera';
import Perf from './utils/perf';
import World from './classes/world';

// var gui = new dat.GUI();
var gui = null;

export default class App {

  scene;
  camera;
  renderer;
  updateStack = [];

  def = {};

  constructor() {
    Perf.get('PERF_start_end');
    this.scene = new Scene();
    this.clock = new Clock();
    // this.scene.fog = new THREE.Fog(0xffffff, 30, 200);
    this.createRenderer();
    this.createAxes();
    this.createLights();
    new World(this);
    this.camera = new Camera(this, gui);
    requestAnimationFrame(this.update.bind(this));
  }

  createRenderer() {
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(0xEEEEEE, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    $("#WebGL-output").append(this.renderer.domElement);
  }

  createAxes() {
    var axes = new AxisHelper(200);
    this.scene.add(axes);
  }

  createLights() {
    var spotLight = new SpotLight(0xffffe5);
    spotLight.position.set(50, 60, 50);
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    var directionalLight = new DirectionalLight( 0xffffff, 1.4 );
    directionalLight.position.set( -50, 50, 50 );
    this.scene.add( directionalLight );
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
    });
    this.render();
    requestAnimationFrame(this.update.bind(this));
  }
}
