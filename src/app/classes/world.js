import {
  Geometry, BufferGeometry, PlaneBufferGeometry,
  Mesh, MeshLambertMaterial, DoubleSide,
  TextureLoader, Matrix4
} from '../../lib/three';
import Chunk from '../func/chunk';
import config from '../config';
import Perf from '../utils/perf';
import $ from 'jquery';

export default class World {

  constructor(app) {
    this.seed = config.seed;
    this.chunk = new Chunk(this.seed);
    this.app = app;
    this.generateChunks();
  }

  async generateChunks() {

    let $msg = $('<div id="msg_warning">Loading <span class="current">1</span> of <span>50</span> chunks ...<br>It can be a bit slow before finishing :)</div>');
    $('body').append($msg);

    var chanks = 6;
    for(let x = 0; x <= chanks; x++) {
      for(let y = 0; y <= chanks; y++) {
        await this.generateChunk({ x, y });
        let $current = $msg.find('span.current');
        $current.html(parseInt($current.html()) + 1);
      }
    }
    $msg.remove();
  }

  generateChunk(location) {
    return new Promise((resolve) => {
      let chunk = this.chunk;
      let cubeSize = config.cubeSize;

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

      // generate chunk
      let stats = { drawn: 0 };
      chunk.generateChunk(location, (x, y, z, surrounding) => {

        stats.drawn++;
        matrix.makeTranslation(x * cubeSize, y * cubeSize, z * cubeSize);

        // Check what cube geometry should be drawn
        if( !surrounding.px ) { tmpGeometry.merge( pxTmpGeometry, matrix ); }
        if( !surrounding.nx ) { tmpGeometry.merge( nxTmpGeometry, matrix ); }
        if( !surrounding.py ) { tmpGeometry.merge( pyTmpGeometry, matrix ); }
        if( !surrounding.pz ) { tmpGeometry.merge( pzTmpGeometry, matrix ); }
        if( !surrounding.nz ) { tmpGeometry.merge( nzTmpGeometry, matrix ); }
        if( !surrounding.ny ) { tmpGeometry.merge( nyTmpGeometry, matrix ); }

      }).then(() => {
        var geometry = new BufferGeometry().fromGeometry( tmpGeometry );
        geometry.computeBoundingSphere();
        var texture = new TextureLoader().load( "../assets/textures/blocks/hardened_clay_stained_green.png" );
        var mesh = new Mesh( geometry, new MeshLambertMaterial( { map: texture } ) ); // , side: DoubleSide
        this.app.scene.add( mesh );
        Perf.get('PERF_start_end').end();
        resolve();
      })
    })



  }
}