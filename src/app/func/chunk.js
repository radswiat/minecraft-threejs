import _ from 'lodash';
import ChunkNoiseViewer from '../objects/chunk-noise-viewer';
import {Noise} from 'noisejs';
import Utils from '../utils';
var ChunkNoiseWorker = require("worker-loader!./chunk-noise.worker.js");

export default class WorldGen {

  cb = null;
  cubeNoiseCache = {};

  defaultOptions = {
    chunkSize: {width: 26, height: 26}
  };

  constructor(seed, options) {
    this.seed = seed;
    this.cfg = _.merge(this.defaultOptions, options);
    this.helperNoise1 = new ChunkNoiseViewer({
      left: 0,
      top: 0
    });
    this.helperNoise2 = new ChunkNoiseViewer({
      right: 0,
      top: 0
    });
    this.readyPromise = new Promise((resolve) => {
      this.generateNoise(resolve);
    })
  }

  generateNoise(resolve) {
    var worker = new ChunkNoiseWorker();
    worker.postMessage({
      seed: this.seed,
      chunkSize: this.defaultOptions.chunkSize.width,
      mod: 30
    });
    worker.onmessage = (e) => {
      this.cubeNoiseCache = e.data;
      resolve();
    };
  }

  ready(cb) {
    this.readyPromise.then(cb);
  }

  /**
   * Generate chunk,
   * @param cb
   */
  generateChunk(cb) {
    this.cb = cb;
    for (let p in this.cubeNoiseCache) {
      // this.helperNoise2.add(x, y, z, noiseValue);
      cb(
        this.cubeNoiseCache[p].location.x,
        this.cubeNoiseCache[p].location.y,
        this.cubeNoiseCache[p].location.z,
        this.cubeNoiseCache[p].surrounding,
      );
    }
    this.helperNoise1.end();
    this.helperNoise2.end();
  }

}

