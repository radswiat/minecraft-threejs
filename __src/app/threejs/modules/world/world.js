import {
  Geometry, BufferGeometry, PlaneBufferGeometry,
  Mesh, MeshLambertMaterial,
  TextureLoader, Matrix4,
} from 'three';
import PromiseThrottle from 'promise-throttle';

import { storeAssetsLoader } from 'shared/store';
import { worldConfig } from 'config';
import Chunk from 'modules/chunk';
import { Perf } from 'utils';

import SpotLight from './comp/spot-light';
import hemiLight from './comp/hemi-light';
import ambientLight from './comp/ambient-light';
import skybox from './comp/skybox';
import btTower from './comp/bt-tower';

export default class World {


  meshes = [];
  lights = [];
  objects = [];

  constructor({ app, seed, chunkOptions }) {
    this.seed = seed;
    this.chunk = new Chunk(this.seed);
    this.app = app;
    this.chunkOptions = chunkOptions;
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

    // uncomment for debugging ( speed up world loading, comment out the above for loop )
    // const throttlePromise = promiseThrottle.add(this.generateChunk.bind(this, { x: 1, y: 1 }));
    // chunksDefer.push(
    //   throttlePromise,
    // );

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
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.meshes.push(mesh);
      this.app.scene.add(mesh);
    }
    Perf.get('worldChunks render').end();
    // render skybox
    const skyboxMesh = skybox();
    this.app.scene.add(skyboxMesh);
    this.meshes.push(skyboxMesh);

    // add spotlight
    const spotLight = new SpotLight(this.app.scene);
    spotLight.render();
    this.objects.push(...spotLight);

    // hemi light
    const hemiLightMesh = hemiLight();
    this.app.scene.add(hemiLightMesh);
    this.lights.push(hemiLightMesh);

    // ambient light
    const ambientLightMesh = ambientLight();
    this.app.scene.add(ambientLightMesh);
    this.lights.push(ambientLightMesh);

    // obj, bt tower
    btTower(this.app.scene);
  }

  destroy() {
    for (const mesh of this.meshes) {
      this.app.scene.remove(mesh);
    }
    for (const light of this.lights) {
      this.app.scene.remove(light);
    }
  }

  async generateChunk(location) {
    return new Promise(async (resolve) => {

      const stats = { drawn: 0 };
      const cubeSize = worldConfig.cubeSize;

      const matrix = new Matrix4();
      const pxGeometry = new PlaneBufferGeometry(cubeSize, cubeSize);
      pxGeometry.rotateY(Math.PI / 2);
      pxGeometry.translate(cubeSize / 2, 0, 0);
      const nxGeometry = new PlaneBufferGeometry(cubeSize, cubeSize);
      nxGeometry.rotateY(-Math.PI / 2);
      nxGeometry.translate(-cubeSize / 2, 0, 0);
      const pyGeometry = new PlaneBufferGeometry(cubeSize, cubeSize);
      pyGeometry.rotateX(-Math.PI / 2);
      pyGeometry.translate(0, cubeSize / 2, 0);
      const pzGeometry = new PlaneBufferGeometry(cubeSize, cubeSize);
      pzGeometry.translate(0, 0, cubeSize / 2);
      const nzGeometry = new PlaneBufferGeometry(cubeSize, cubeSize);
      nzGeometry.rotateY(Math.PI);
      nzGeometry.translate(0, 0, -cubeSize / 2);
      const nyGeometry = new PlaneBufferGeometry(cubeSize, cubeSize);
      nyGeometry.rotateX(Math.PI / 2);
      nyGeometry.translate(0, -cubeSize / 2, 0);

      // BufferGeometry
      const tmpGeometry = new Geometry();
      const pxTmpGeometry = new Geometry().fromBufferGeometry(pxGeometry);
      const nxTmpGeometry = new Geometry().fromBufferGeometry(nxGeometry);
      const pyTmpGeometry = new Geometry().fromBufferGeometry(pyGeometry);
      const pzTmpGeometry = new Geometry().fromBufferGeometry(pzGeometry);
      const nzTmpGeometry = new Geometry().fromBufferGeometry(nzGeometry);
      const nyTmpGeometry = new Geometry().fromBufferGeometry(nyGeometry);

      // generate chunk
      await this.chunk.generateChunk(location, this.chunkOptions, (cube) => {
        stats.drawn++;
        matrix.makeTranslation(cube.location.x * cubeSize, cube.location.y * cubeSize, cube.location.z * cubeSize);

        // Check what cube geometry should be drawn
        if (!cube.surrounding.px) { tmpGeometry.merge(pxTmpGeometry, matrix, cube.material); }
        if (!cube.surrounding.nx) { tmpGeometry.merge(nxTmpGeometry, matrix, cube.material); }
        if (!cube.surrounding.py) { tmpGeometry.merge(pyTmpGeometry, matrix, cube.material); }
        if (!cube.surrounding.pz) { tmpGeometry.merge(pzTmpGeometry, matrix, cube.material); }
        if (!cube.surrounding.nz) { tmpGeometry.merge(nzTmpGeometry, matrix, cube.material); }
        if (!cube.surrounding.ny) { tmpGeometry.merge(nyTmpGeometry, matrix, cube.material); }
      });

      const geometry = new BufferGeometry().fromGeometry( tmpGeometry );
      geometry.computeBoundingSphere();
      const matGrass = new MeshLambertMaterial({
        map: new TextureLoader().load('../assets/textures/blocks/hardened_clay_stained_green.png'),
      });
      const matDirt = new MeshLambertMaterial({
        map: new TextureLoader().load('../assets/textures/blocks/dirt.png'),
      });
      const matStone = new MeshLambertMaterial({
        map: new TextureLoader().load('../assets/textures/blocks/cobblestone_mossy.png'),
      });
      const matLog = new MeshLambertMaterial({
        map: new TextureLoader().load('../assets/textures/blocks/log_spruce.png'),
      });
      const matLeaves = new MeshLambertMaterial({
        map: new TextureLoader().load('../assets/textures/blocks/leaves.png'),
        transparent: true,
      });

      resolve({
        geometry,
        params: [matGrass, matDirt, matStone, matLog, matLeaves],
      });
    });
  }
}
