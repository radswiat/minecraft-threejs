import { Noise } from 'noisejs';

import { random } from 'utils';

self.addEventListener('message', ({ data }) => {
  const seed = data.seed;
  const chunkSize = data.chunkSize;
  const noise = new Noise(seed);
  const chunkNoise = {};
  const chunkLocation = data.chunkLocation;
  const mod = data.mod;

  /**
   * Check if cube is filled or not
   * @param noiseValue
   * @return {boolean}
   */
  const isCubeFilled = (noiseValue) => {
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
  const getNoiseFor = (x, y, z) => {
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
   * @return {boolean}
   */
  const getSurrounding = (x, y, z) => {
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
        const tx = (chunkLocation.y * chunkSize) + x;
        const ty = y;
        const tz = (chunkLocation.x * chunkSize) + z;

        // main noise value
        const noiseValue = getNoiseFor(tx, ty, tz);
        if (isCubeFilled(noiseValue)) {
          // get surrounding area noise
          const surroundingNoiseValues = {
            px: getSurrounding(tx + 1, ty, tz),
            nx: getSurrounding(tx - 1, ty, tz),
            py: getSurrounding(tx, ty + 1, tz),
            pz: getSurrounding(tx, ty, tz + 1),
            nz: getSurrounding(tx, ty, tz - 1),
            ny: getSurrounding(tx, ty - 1, tz),
          };

          let material = 0;
          // dirt on edges
          // if(surroundingNoiseValues.pz && surroundingNoiseValues.nz) {
          //   material = 1;
          // }
          if (ty > random(10, 12)) {
            material = 2;
          }
          if (ty < random(1, 4)) {
            material = 1;
          }

          chunkNoise[`${tx}_${ty}_${tz}`] = {
            location: {
              x: tx, y: ty, z: tz,
            },
            surrounding: surroundingNoiseValues,
            noiseValue,
            material,
          };
        }
      }
    }
  }


  /***
   *
   *
   *
   *
   * All below for tree generation,
   * it will be moved somewhere else ...later :)
   *
   *
   *
   * =====================================================
   */



  var drawTreeCube = (x, y, z) => {
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
  };

  var drawLeavesCube = (x, y, z) => {
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
      material: 4
    };
  };


  var drawCubeCircle = (location, r) => {
    var x0 = location.x;
    var z0 = location.z;
    var y = location.y;
    // lest make leaves around
    var z = 0;
    var decisionOver2 = 1 - r;
    while(r >= z) {
      drawLeavesCube(r + x0, y, z + z0);
      drawLeavesCube(z + x0, y, r + z0);
      drawLeavesCube(-r + x0, y, z + z0);
      drawLeavesCube(-z + x0, y, r + z0);
      drawLeavesCube(-r + x0, y, -z + z0);
      drawLeavesCube(-z + x0, y, -r + z0);
      drawLeavesCube(r + x0, y, -z + z0);
      drawLeavesCube(z + x0, y, -r + z0);
      z++;
      if (decisionOver2 <= 0) {
        decisionOver2 += 2 * y + 1; // Change in decision criterion for y -> y+1
      } else {
        r--;
        decisionOver2 += 2 * (y - r) + 1;
      }
    }
  };


  /**
   *
   * @param location
   */
  var generateTree = (location) => {

    var currHeight;

    // how much space left?
    let heightLeft = chunkSize - location.y;

    // won't be able to draw soo tiny tree
    if( heightLeft < 6 ) { return; }

    // lets draw base, base is always min 4 - 6
    let mod = 150;
    let height = Math.round(3 * ( Math.round(Math.abs(
      noise.simplex3(location.x / mod, location.y / mod, location.z / mod) * 100
    )) / 10 ) / 2);

    if(height < 3) height = 3;

    for(currHeight = location.y; currHeight <= location.y + height; currHeight++ ) {
      drawTreeCube(location.x, currHeight,location.z);
    }

    drawLeavesCube(location.x, currHeight,location.z);
    drawCubeCircle({x: location.x, y: currHeight - 1, z: location.z}, 1);
    drawCubeCircle({x: location.x, y: currHeight - 2, z: location.z}, 1);
    drawCubeCircle({x: location.x, y: currHeight - 2, z: location.z}, 2);
  };

  let chunkTreeChance = Math.round(random(5, 10));
  for(let i = 0; i < Math.round(Math.abs(noise.perlin2(Math.abs(chunkLocation.x) / 22, Math.abs(chunkLocation.y) / 22)) * 100); i++) {
    // generate trees when we got whole chunk
    let x = ( chunkLocation.y * chunkSize ) + Math.round(random(-10, 10));
    let z = ( chunkLocation.x * chunkSize ) + Math.round(random(-10, 10));
    var found = null;
    // lets find out where it ends in y ( up/down axis )
    for(let y = -13; y <= 13; y++) {
      if(typeof chunkNoise[`${x}_${y}_${z}`] !== 'undefined') {
        found = ( y + 1 );
      }
    }

    if(found) {
      generateTree({x: x, y: found, z: z});
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
