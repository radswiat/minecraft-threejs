import {Noise} from 'noisejs';
import Utils from '../utils';
self.addEventListener('message', function(e) {
  let seed = e.data.seed;
  let chunkSize = e.data.chunkSize;
  let noise = new Noise(seed);
  let chunkNoise = {};
  let chunkLocation = e.data.chunkLocation;
  let mod = e.data.mod;

  /**
   * Check if cube is filled or not
   * @param noiseValue
   * @returns {boolean}
   */
  var isCubeFilled = (noiseValue) => {
    if (noiseValue > 0.2) {
      return true;
    }
    return false;
  };

  /**
   * Get noise
   * - using cache
   * @param x
   * @param y
   * @param z
   */
  var getNoiseFor = (x, y, z) => {
    if( typeof chunkNoise[`${x}_${y}_${z}`] !== 'undefined') {
      return chunkNoise[`${x}_${y}_${z}`].noiseValue;
    }
    let noiseValue = noise.perlin3(x / mod, y / mod, z / mod);
    // return noiseValue;
    // noiseValue = ( noiseValue / 2 ) / y;
    noiseValue += ( 8 - y ) / 10; // ( 5 / z ) / 10
    return noiseValue;
  };

  /**
   * Get surrounding cube,
   * - returns true if cube exists
   * @param x
   * @param y
   * @param z
   * @returns {boolean}
   */
  var getSurrounding = (x, y, z) => {
    return isCubeFilled(getNoiseFor(x, y, z));
  };

  /**
   * Loop through every chunk cube,
   * - calculate noise for cube
   * - calculate noise for surrounding cubes
   */
  for (let x = chunkSize / 2 * -1; x <= chunkSize / 2; x++) {
    for (let y = chunkSize / 2 * -1; y <= chunkSize / 2; y++) {
      for (let z = chunkSize / 2 * -1; z <= chunkSize / 2; z++) {

        // translate by the chunkId
        let tx = ( chunkLocation.y * chunkSize ) + x;
        let ty = y;
        let tz = ( chunkLocation.x * chunkSize ) + z;

        // main noise value
        var noiseValue = getNoiseFor(tx, ty, tz);
        if( isCubeFilled(noiseValue) ) {
          // get surrounding area noise
          var surroundingNoiseValues = {
            px : getSurrounding(tx + 1, ty, tz),
            nx : getSurrounding(tx - 1, ty, tz),
            py : getSurrounding(tx, ty + 1, tz),
            pz : getSurrounding(tx, ty, tz + 1),
            nz : getSurrounding(tx, ty, tz - 1),
            ny : getSurrounding(tx, ty - 1, tz)
          };

          let material = 0;
          // dirt on edges
          // if(surroundingNoiseValues.pz && surroundingNoiseValues.nz) {
          //   material = 1;
          // }
          if( ty > Utils.rnd(10, 12) ) {
            material = 2;
          }
          if( ty < Utils.rnd(1, 4) ) {
            material = 1;
          }

          chunkNoise[`${tx}_${ty}_${tz}`] = {
            location: {
              x: tx, y: ty, z: tz
            },
            surrounding: surroundingNoiseValues,
            noiseValue: noiseValue,
            material
          };
        }
      }
    }
  }

  let chunkTreeChance = Math.round(Utils.rnd(5, 10));

  for(let i = 0; i < Math.round(Utils.rnd(1, 5 * chunkTreeChance)); i++) {
    // generate trees when we got whole chunk
    let x = ( chunkLocation.y * chunkSize ) + Math.round(Utils.rnd(-10, 10));
    let z = ( chunkLocation.x * chunkSize ) + Math.round(Utils.rnd(-10, 10));
    var found = null;
    // lets find out where it ends in y ( up/down axis )
    for(let y = -13; y <= 13; y++) {
      if(typeof chunkNoise[`${x}_${y}_${z}`] !== 'undefined') {
        found = ( y + 1 );
      }
    }

    if(found) {
      // three height
      let treeHeight = Math.round(Utils.rnd(6, 12));
      for(let y = found; y <= treeHeight; y++ ) {
        chunkNoise[`${x}_${y}_${z}`] = {
          location: {
            x, y, z
          },
          surrounding: {
            px : false,
            nx : false,
            py : false,
            pz : false,
            nz : false,
            ny : false
          },
          noiseValue: getNoiseFor(x, y, z),
          material: 3
        };
      }
    }
  }



  // let noiseValue = data.noise.perlin3(data.x, data.y, data.z);
  self.postMessage(chunkNoise);
}, false);



// var mountain = this.simplex.noise3D(Math.abs(x / mod), Math.abs(y / mod), Math.abs(z / mod));
// mountain = mountain / 4;
// mountain += ( 2 - x ) / 10;
// mountain = mountain / y;

// normalize land a bit
// noiseValue = noiseValue / 2;
//noiseValue += ( 10 - z ) / 10; // ( 5 / z ) / 10
// noiseValue = noiseValue / z; // z - flat, x - tall, y - tall



// var suite = new Benchmark.Suite();
// suite.add('getCubeNoise(cached)', () => {
//   this.getCubeNoise(0, 0, 0);
// })
// .add('getCubeNoise(not cached)', () => {
//   this.getCubeNoiseNoCache(0,0,0);
// })
// .on('cycle', function(event) {
//   console.info(String(event.target));
// })
// .on('complete', function() {
//   console.warn('Fastest is ' + this.filter('fastest').map('name'));
// })
// // run async
// .run({ 'async': true });