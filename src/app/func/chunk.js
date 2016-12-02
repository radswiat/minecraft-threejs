import _ from 'lodash';
import ChunkNoiseViewer from '../objects/chunk-noise-viewer';
import {Noise} from 'noisejs';
import config from '../config';
import Utils from '../utils';
var ChunkNoiseWorker = require("worker-loader!./chunk-noise.worker.js");
var chankId = 0;

export default class Chunk {

  cb = null;
  cubeNoiseCache = {};


  constructor(seed, options) {
    this.id = chankId;
    chankId++;
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
  }

  generateNoise(location) {
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
    return new Promise((resolve) => {
      this.generateNoise(location).then(() => {
        this.cb = cb;
        for (let p in this.cubeNoiseCache) {
          cb(
            this.cubeNoiseCache[p].location.x,
            this.cubeNoiseCache[p].location.y,
            this.cubeNoiseCache[p].location.z,
            this.cubeNoiseCache[p].surrounding,
          );
        }
        this.helperNoise1.end();
        this.helperNoise2.end();
        resolve();
      });
    });
  }



}

