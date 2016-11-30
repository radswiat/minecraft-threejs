import Alea from 'alea';
import SimplexNoise from 'simplex-noise';
import _ from 'lodash';
import ChunkNoiseViewer from '../objects/chunk-noise-viewer';
import {Noise} from 'noisejs';

export default class WorldGen {

  cb = null;

  defaultOptions = {
    chunkSize: {width: 26, height: 26}
  };

  constructor(seed, options) {
    let random = new Alea('my-seed');
    this.simplex = new SimplexNoise(random);
    this.noise = new Noise(1);
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

  exists(x, y, z) {

    let chunkSize = this.defaultOptions.chunkSize.width;
    // is out of boundaries ?
    // draw it !
    if( Math.abs(x) >= chunkSize / 2 || Math.abs(y) >= chunkSize / 2 || Math.abs(z) >= chunkSize / 2) {
      return false
    }

    return this.modApply(this.modCube(x, y, z), x, y, z);
  }

  get(cb) {
    this.cb = cb;
    for (let x = this.cfg.chunkSize.width / 2 * -1; x <= this.cfg.chunkSize.width / 2; x++) {
      for (let y = this.cfg.chunkSize.width / 2 * -1; y <= this.cfg.chunkSize.width / 2; y++) {
        for (let z = this.cfg.chunkSize.height / 2 * -1; z <= this.cfg.chunkSize.height / 2; z++) {
          var noiseValue = this.modCube(x, y, z);
          this.modApply(noiseValue, x, y, z, cb);
        }
      }
    }
    this.helperNoise1.end();
    this.helperNoise2.end();
  }

  modCube(x, y, z) {
    let mod = 30;
    var noiseValue = this.noise.perlin3(x / mod, y / mod, z / mod);
    this.helperNoise1.add(x, y, z, noiseValue);
    return noiseValue;
  }

  modApply(noiseValue, x, y, z, cb) {
    if (noiseValue > 0.2) {
      this.helperNoise2.add(x, y, z, noiseValue);
      if(typeof cb === 'function') {
        cb(x, y, z);
      }
      return true;
    }

    this.helperNoise2.add(x, y, z, null);
    return false;
  }


}


// var mountain = this.simplex.noise3D(Math.abs(x / mod), Math.abs(y / mod), Math.abs(z / mod));
// mountain = mountain / 4;
// mountain += ( 2 - x ) / 10;
// mountain = mountain / y;

// normalize land a bit
// noiseValue = noiseValue / 2;
//noiseValue += ( 10 - z ) / 10; // ( 5 / z ) / 10
// noiseValue = noiseValue / z; // z - flat, x - tall, y - tall