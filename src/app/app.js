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
import Chunk from './func/chunk';
import Camera from './objects/camera';

// var gui = new dat.GUI();
var gui = null;

export default class App {

  scene;
  camera;
  renderer;
  updateStack = [];

  def = {};

  constructor() {
    this.scene = new Scene();
    this.clock = new Clock();
    // this.scene.fog = new THREE.Fog(0xffffff, 30, 200);
    this.createRenderer();
    this.createAxes();
    this.createLights();
    this.genChunks();
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

  genChunks() {
    let chunk = new Chunk('af25');
    let cubeSize = 20;

    var matrix = new Matrix4();
    var pxGeometry = new PlaneBufferGeometry( cubeSize, cubeSize );
    pxGeometry.rotateY( Math.PI / 2 );
    pxGeometry.translate( cubeSize / 2, 0, 0 );
    var nxGeometry = new PlaneBufferGeometry( cubeSize, cubeSize );
    nxGeometry.rotateY( - Math.PI / 2 );
    nxGeometry.translate( - cubeSize / 2, 0, 0 );
    var pyGeometry = new PlaneBufferGeometry( cubeSize, cubeSize );
    pyGeometry.rotateX( - Math.PI / 2 );
    pyGeometry.translate( 0, cubeSize / 2, 0 );
    var pzGeometry = new PlaneBufferGeometry( cubeSize, cubeSize );
    pzGeometry.translate( 0, 0, cubeSize / 2 );
    var nzGeometry = new PlaneBufferGeometry( cubeSize, cubeSize );
    nzGeometry.rotateY( Math.PI );
    nzGeometry.translate( 0, 0, - cubeSize / 2 );
    var nyGeometry = new PlaneBufferGeometry( cubeSize, cubeSize );
    nyGeometry.rotateX( Math.PI / 2 );
    nyGeometry.translate( 0, - cubeSize / 2, 0 );

    // BufferGeometry
    var tmpGeometry = new Geometry();
    var pxTmpGeometry = new Geometry().fromBufferGeometry( pxGeometry );
    var nxTmpGeometry = new Geometry().fromBufferGeometry( nxGeometry );
    var pyTmpGeometry = new Geometry().fromBufferGeometry( pyGeometry );
    var pzTmpGeometry = new Geometry().fromBufferGeometry( pzGeometry );
    var nzTmpGeometry = new Geometry().fromBufferGeometry( nzGeometry );
    var nyTmpGeometry = new Geometry().fromBufferGeometry( nyGeometry );

    chunk.get((x, y, z) => {

      matrix.makeTranslation(x * cubeSize, y * cubeSize, z * cubeSize);

      // Check what cube geometry should be drawn
      if( !chunk.exists(x + 1, y, z) ) { tmpGeometry.merge( pxTmpGeometry, matrix ); }
      if( !chunk.exists(x - 1, y, z) ) { tmpGeometry.merge( nxTmpGeometry, matrix ); }
      if( !chunk.exists(x, y + 1, z) ) { tmpGeometry.merge( pyTmpGeometry, matrix ); }
      if( !chunk.exists(x, y, z + 1) ) { tmpGeometry.merge( pzTmpGeometry, matrix ); }
      if( !chunk.exists(x, y, z - 1) ) { tmpGeometry.merge( nzTmpGeometry, matrix ); }
      if( !chunk.exists(x, y - 1, z) ) { tmpGeometry.merge( nyTmpGeometry, matrix ); }
    });

    var geometry = new BufferGeometry().fromGeometry( tmpGeometry );
    geometry.computeBoundingSphere();
    var texture = new TextureLoader().load( "../assets/textures/blocks/hardened_clay_stained_green.png" );
    var mesh = new Mesh( geometry, new MeshLambertMaterial( { map: texture } ) );
    this.scene.add( mesh );
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
