import { worldConfig } from 'config';

const ChunkNoiseWorker = require('worker-loader!./noise.worker.js');

export default class Chunk {

  cb = null;
  cubeNoiseCache = {};

  constructor(seed) {
    this.seed = seed;
  }

  async generateNoise(location, options) {
    return new Promise((resolve) => {
      const worker = new ChunkNoiseWorker();
      worker.postMessage({
        seed: this.seed,
        chunkLocation: location,
        chunkSize: worldConfig.chunkSize,
        ...options,
      });
      worker.onmessage = (e) => {
        this.cubeNoiseCache = e.data;
        resolve();
      };
    });
  }

  /**
   * Generate chunk
   * @param location
   * @param cb
   * @return {Promise<any>}
   */
  generateChunk(location, options, cb) {
    return new Promise(async (resolve) => {
      await this.generateNoise(location, options);
      this.cb = cb;
      for (const p in this.cubeNoiseCache) {
        cb(this.cubeNoiseCache[p]);
      }
      resolve();
    });
  }

}

