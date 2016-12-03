import {
  Geometry, BufferGeometry, PlaneBufferGeometry,
  Mesh, MeshLambertMaterial, DoubleSide,
  TextureLoader, Matrix4
} from '../../lib/three';
import Chunk from '../func/chunk';
import config from '../config';
import Perf from '../utils/perf';
import Message from '../utils/message';

export default class World {

  constructor(app) {
    this.seed = config.seed;
    this.chunk = new Chunk(this.seed);
    this.app = app;
    this.message = new Message(['Loading', '0', 'of', '49', 'It can be a bit slow before finishing :)']);
    this.generateChunks();
  }

  async generateChunks() {
    var chunks = 6;
    for(let x = 0; x <= chunks; x++) {
      for(let y = 0; y <= chunks; y++) {
        Perf.get(`Chunk ${x}${y} gen`);
        await this.generateChunk({ x, y });
        this.message.increase(1);
        Perf.get(`Chunk ${x}${y} gen`).end();
      }
    }
  }

  async generateChunk(location) {
    return new Promise( async (resolve) => {

      let stats = { drawn: 0 };
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
      await chunk.generateChunk(location, (x, y, z, surrounding) => {

        stats.drawn++;
        matrix.makeTranslation(x * cubeSize, y * cubeSize, z * cubeSize);

        // Check what cube geometry should be drawn
        if( !surrounding.px ) { tmpGeometry.merge( pxTmpGeometry, matrix ); }
        if( !surrounding.nx ) { tmpGeometry.merge( nxTmpGeometry, matrix ); }
        if( !surrounding.py ) { tmpGeometry.merge( pyTmpGeometry, matrix ); }
        if( !surrounding.pz ) { tmpGeometry.merge( pzTmpGeometry, matrix ); }
        if( !surrounding.nz ) { tmpGeometry.merge( nzTmpGeometry, matrix ); }
        if( !surrounding.ny ) { tmpGeometry.merge( nyTmpGeometry, matrix ); }

      });


      var geometry = new BufferGeometry().fromGeometry( tmpGeometry );
      geometry.computeBoundingSphere();
      var texture = new TextureLoader().load( "../assets/textures/blocks/hardened_clay_stained_green.png" );
      var mesh = new Mesh( geometry, new MeshLambertMaterial( { map: texture } ) );
      this.app.scene.add( mesh );

      resolve();
    });
  }
}