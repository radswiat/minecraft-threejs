import Alea from 'alea';
import SimplexNoise from 'simplex-noise';
import _ from 'lodash';

export default class WorldGen {

  cb = null;

  defaultOptions = {
    // worldSize : { x : 50, y: 50, z: 50 }
    worldSize : { x : 25, y: 25, z: 10 }
  };

  constructor(seed, options) {
    let random = new Alea('my-seed');
    this.simplex = new SimplexNoise(random);
    this.cfg = _.merge(this.defaultOptions, options);
  }

  get(cb) {

    this.cb = cb;

    let mod = 30;

    for (let x = this.cfg.worldSize.x / 2 * - 1; x <= this.cfg.worldSize.x / 2; x++) {
      for (let y = this.cfg.worldSize.y / 2 * - 1; y <= this.cfg.worldSize.y / 2; y++) {
        for (let z = this.cfg.worldSize.z / 2 * - 1; z <= this.cfg.worldSize.z /2; z++) {

          var noise = this.simplex.noise3D(x / mod , y / mod, z / mod);

          // var mountain = this.simplex.noise3D(Math.abs(x / mod), Math.abs(y / mod), Math.abs(z / mod));
          // mountain = mountain / 4;
          // mountain += ( 2 - x ) / 10;
          // mountain = mountain / y;

          noise += ( 10 - z ) / 10; // ( 5 / z ) / 10
          noise = noise / z;

          if(noise > 0.2) {
            cb(x, y, z);
          }

        }
      }
    }
  }

}

