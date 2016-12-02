import {Noise} from 'noisejs';
self.addEventListener('message', function(e) {
  let seed = e.data.seed;
  let chunkSize = e.data.chunkSize;
  let noise = new Noise(seed);
  let chunkNoise = {};
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
    return  noise.perlin3(x / mod, y / mod, z / mod);
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
        // main noise value
        var noiseValue = getNoiseFor(x, y, z);
        if( isCubeFilled(noiseValue) ) {
          // get surrounding area noise
          var surroundingNoiseValues = {
            px : getSurrounding(x + 1, y, z),
            nx : getSurrounding(x - 1, y, z),
            py : getSurrounding(x, y + 1, z),
            pz : getSurrounding(x, y, z + 1),
            nz : getSurrounding(x, y, z - 1),
            ny : getSurrounding(x, y - 1, z)
          };
          chunkNoise[`${x}_${y}_${z}`] = {
            location: {
              x, y, z
            },
            surrounding: surroundingNoiseValues,
            noiseValue: noiseValue
          };
        }
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