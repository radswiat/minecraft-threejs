import {Noise} from 'noisejs';
import config from '../config';
var ChunkNoiseWorker = require("worker-loader!./chunk-noise.worker.js");

export default class Chunk {

  cb = null;
  cubeNoiseCache = {};

  constructor(seed) {
    this.seed = seed;
  }

  async generateNoise(location) {
    return new Promise((resolve) => {
      var worker = new ChunkNoiseWorker();
      worker.postMessage({
        seed: this.seed,
        chunkLocation: location,
        chunkSize: config.chunkSize,
        mod: 30
      });
      worker.onmessage = (e) => {
        this.cubeNoiseCache = e.data;
        resolve();
      };
    })
  }

  /**
   * Generate chunk,
   * @param cb
   */
  generateChunk(location, cb) {
    return new Promise( async (resolve) => {
      await this.generateNoise(location);
      this.cb = cb;
      for (let p in this.cubeNoiseCache) {
        cb(
          this.cubeNoiseCache[p].location.x,
          this.cubeNoiseCache[p].location.y,
          this.cubeNoiseCache[p].location.z,
          this.cubeNoiseCache[p].surrounding,
        );
      }
      resolve();
    });
  }

}

