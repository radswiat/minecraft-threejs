import {
  Geometry, BufferGeometry, PlaneBufferGeometry,
  Mesh, MeshLambertMaterial,
  TextureLoader, Matrix4,
  CubeGeometry, MeshBasicMaterial, DoubleSide, RepeatWrapping,
} from 'three';
import PromiseThrottle from 'promise-throttle';

import { storeAssetsLoader } from 'shared/store';
import { worldConfig } from 'config';
import Chunk from 'modules/chunk';
import { Perf } from 'utils';

export default class World {

  constructor({ app, seed }) {
    this.seed = seed;
    this.chunk = new Chunk(this.seed);
    this.app = app;
  }

  /**
   * Generate world
   * - prepare world
   * @return {Promise<void>}
   */
  async generateWorld() {
    Perf.get('Chunk gen');
    // set new title in store
    storeAssetsLoader.setTitle('Generating world');

    // promise throttle will resolve promises by throttling the execution
    const promiseThrottle = new PromiseThrottle({
      requestsPerSecond: 15,
      promiseImplementation: Promise,
    });

    // loop through and generate all chunks
    const chunksDefer = [];
    for (let x = -3; x <= worldConfig.chunks; x++) {
      for (let y = -3; y <= worldConfig.chunks; y++) {
        const throttlePromise = promiseThrottle.add(this.generateChunk.bind(this, { x, y }));
        chunksDefer.push(
          throttlePromise,
        );
        throttlePromise.then(() => storeAssetsLoader.incrementProgress());
      }
    }

    // set max store value
    storeAssetsLoader.setMax(chunksDefer.length);

    // when all chunks are finished
    this.worldChunks = await Promise.all(chunksDefer);
    Perf.get('Chunk gen').end();
  }

  renderWorld() {
    Perf.get('worldChunks render');
    // render world chunks
    for (const chunk of this.worldChunks) {
      const mesh = new Mesh(chunk.geometry, [...chunk.params]);
      this.app.scene.add(mesh);
    }
    Perf.get('worldChunks render').end();
    // render skybox
    this.skyBox();
  }

  skyBox() {
    const geometry = new CubeGeometry(5000, 5000, 5000, 5000);

    const textureTop = new TextureLoader().load('../assets/textures/blocks/sky_01.png');
    textureTop.wrapS = RepeatWrapping;
    textureTop.repeat.x = -1;

    const textureRight = new TextureLoader().load('../assets/textures/blocks/sky_02.png');
    textureRight.wrapS = RepeatWrapping;
    textureRight.repeat.x = -1;

    const textureLeft = new TextureLoader().load('../assets/textures/blocks/sky_02.png');
    textureLeft.wrapS = RepeatWrapping;
    textureLeft.repeat.x = -1;

    const textureBack = new TextureLoader().load('../assets/textures/blocks/sky_02.png');

    const cubeMaterials = [
      new MeshBasicMaterial({
        map: textureBack, // back
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: new TextureLoader().load( '../assets/textures/blocks/sky_02.png' ), // front
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureTop, // top
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: new TextureLoader().load( '../assets/textures/blocks/dirt.png' ),
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureLeft, // left
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureRight, // right
        side: DoubleSide,
      }),
    ];

    const sky = new Mesh(geometry, [...cubeMaterials]);
    this.app.scene.add(sky);
  }

  async generateChunk(location) {
    return new Promise( async (resolve) => {

      const stats = { drawn: 0 };
      const chunk = this.chunk;
      const cubeSize = worldConfig.cubeSize;

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
        map : new TextureLoader().load( '../assets/textures/blocks/hardened_clay_stained_green.png' )
      });
      var matDirt = new MeshLambertMaterial({
        map : new TextureLoader().load( '../assets/textures/blocks/dirt.png' )
      });
      var matStone = new MeshLambertMaterial({
        map : new TextureLoader().load( '../assets/textures/blocks/cobblestone_mossy.png' )
      });
      var matLog = new MeshLambertMaterial({
        map : new TextureLoader().load( '../assets/textures/blocks/log_spruce.png' )
      });
      var matLeaves = new MeshLambertMaterial({
        map : new TextureLoader().load( '../assets/textures/blocks/leaves.png' ),
        transparent: true
      });

      // const mesh = new Mesh(geometry, [matGrass, matDirt, matStone, matLog, matLeaves]);
      // this.app.scene.add(mesh);
      resolve({
        geometry,
        params: [matGrass, matDirt, matStone, matLog, matLeaves],
      });
    });
  }
}
