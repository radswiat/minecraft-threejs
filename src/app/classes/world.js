import {
  Geometry, BufferGeometry, PlaneBufferGeometry,
  Mesh, MeshLambertMaterial, MultiMaterial,
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
    this.message = new Message(['Loading', '0', 'of', '64', 'It can be a bit slow before finishing :)']);
    // this.generateChunksDebug();
    this.generateChunks();
  }

  async generateChunksDebug() {
    var chunks = 1;
    for(let x = 0; x <= chunks; x++) {
      for(let y = 0; y <= chunks; y++) {
        Perf.get(`Chunk ${x}${y} gen`);
        await this.generateChunk({ x, y });
        this.message.increase(1);
        Perf.get(`Chunk ${x}${y} gen`).end();
      }
    }
  }

  async generateChunks() {
    var chunks = 4;
    for(let x = -3; x <= chunks; x++) {
      for(let y = -3; y <= chunks; y++) {
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
      await chunk.generateChunk(location, (cube) => {

        stats.drawn++;
        matrix.makeTranslation(cube.location.x * cubeSize, cube.location.y * cubeSize, cube.location.z * cubeSize);

        // Check what cube geometry should be drawn
        if( !cube.surrounding.px ) { tmpGeometry.merge( pxTmpGeometry, matrix, cube.material ); }
        if( !cube.surrounding.nx ) { tmpGeometry.merge( nxTmpGeometry, matrix, cube.material ); }
        if( !cube.surrounding.py ) { tmpGeometry.merge( pyTmpGeometry, matrix, cube.material ); }
        if( !cube.surrounding.pz ) { tmpGeometry.merge( pzTmpGeometry, matrix, cube.material ); }
        if( !cube.surrounding.nz ) { tmpGeometry.merge( nzTmpGeometry, matrix, cube.material ); }
        if( !cube.surrounding.ny ) { tmpGeometry.merge( nyTmpGeometry, matrix, cube.material ); }

      });

      var geometry = new BufferGeometry().fromGeometry( tmpGeometry );
      geometry.computeBoundingSphere();
      var matGrass = new MeshLambertMaterial({
        map : new TextureLoader().load( "../assets/textures/blocks/hardened_clay_stained_green.png" )
      });
      var matDirt = new MeshLambertMaterial({
        map : new TextureLoader().load( "../assets/textures/blocks/dirt.png" )
      });
      var matStone = new MeshLambertMaterial({
        map : new TextureLoader().load( "../assets/textures/blocks/cobblestone_mossy.png" )
      });
      var matLog = new MeshLambertMaterial({
        map : new TextureLoader().load( "../assets/textures/blocks/log_spruce.png" )
      });
      var matLeaves = new MeshLambertMaterial({
        map : new TextureLoader().load( "../assets/textures/blocks/leaves.png" ),
        transparent: true
      });




      // var mesh = new Mesh( geometry, new MeshLambertMaterial( { map: texture } ) );
      var mesh = new Mesh( geometry, new MultiMaterial([matGrass, matDirt, matStone, matLog, matLeaves] ) );

      this.app.scene.add( mesh );

      resolve();
    });
  }
}