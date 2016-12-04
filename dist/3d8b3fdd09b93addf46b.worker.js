/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _noisejs = __webpack_require__(1);

	var _utils = __webpack_require__(2);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	self.addEventListener('message', function (e) {
	  var seed = e.data.seed;
	  var chunkSize = e.data.chunkSize;
	  var noise = new _noisejs.Noise(seed);
	  var chunkNoise = {};
	  var chunkLocation = e.data.chunkLocation;
	  var mod = e.data.mod;

	  /**
	   * Check if cube is filled or not
	   * @param noiseValue
	   * @returns {boolean}
	   */
	  var isCubeFilled = function isCubeFilled(noiseValue) {
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
	  var getNoiseFor = function getNoiseFor(x, y, z) {
	    if (typeof chunkNoise[x + '_' + y + '_' + z] !== 'undefined') {
	      return chunkNoise[x + '_' + y + '_' + z].noiseValue;
	    }
	    var noiseValue = noise.perlin3(x / mod, y / mod, z / mod);
	    // return noiseValue;
	    // noiseValue = ( noiseValue / 2 ) / y;
	    noiseValue += (8 - y) / 10; // ( 5 / z ) / 10
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
	  var getSurrounding = function getSurrounding(x, y, z) {
	    return isCubeFilled(getNoiseFor(x, y, z));
	  };

	  /**
	   * Loop through every chunk cube,
	   * - calculate noise for cube
	   * - calculate noise for surrounding cubes
	   */
	  for (var x = chunkSize / 2 * -1; x <= chunkSize / 2; x++) {
	    for (var y = chunkSize / 2 * -1; y <= chunkSize / 2; y++) {
	      for (var z = chunkSize / 2 * -1; z <= chunkSize / 2; z++) {

	        // translate by the chunkId
	        var tx = chunkLocation.y * chunkSize + x;
	        var ty = y;
	        var tz = chunkLocation.x * chunkSize + z;

	        // main noise value
	        var noiseValue = getNoiseFor(tx, ty, tz);
	        if (isCubeFilled(noiseValue)) {
	          // get surrounding area noise
	          var surroundingNoiseValues = {
	            px: getSurrounding(tx + 1, ty, tz),
	            nx: getSurrounding(tx - 1, ty, tz),
	            py: getSurrounding(tx, ty + 1, tz),
	            pz: getSurrounding(tx, ty, tz + 1),
	            nz: getSurrounding(tx, ty, tz - 1),
	            ny: getSurrounding(tx, ty - 1, tz)
	          };

	          var material = 0;
	          // dirt on edges
	          // if(surroundingNoiseValues.pz && surroundingNoiseValues.nz) {
	          //   material = 1;
	          // }
	          if (ty > _utils2.default.rnd(10, 12)) {
	            material = 2;
	          }
	          if (ty < _utils2.default.rnd(1, 4)) {
	            material = 1;
	          }

	          chunkNoise[tx + '_' + ty + '_' + tz] = {
	            location: {
	              x: tx, y: ty, z: tz
	            },
	            surrounding: surroundingNoiseValues,
	            noiseValue: noiseValue,
	            material: material
	          };
	        }
	      }
	    }
	  }

	  var chunkTreeChance = Math.round(_utils2.default.rnd(5, 10));

	  for (var i = 0; i < Math.round(_utils2.default.rnd(1, 5 * chunkTreeChance)); i++) {
	    // generate trees when we got whole chunk
	    var _x = chunkLocation.y * chunkSize + Math.round(_utils2.default.rnd(-10, 10));
	    var _z = chunkLocation.x * chunkSize + Math.round(_utils2.default.rnd(-10, 10));
	    var found = null;
	    // lets find out where it ends in y ( up/down axis )
	    for (var _y = -13; _y <= 13; _y++) {
	      if (typeof chunkNoise[_x + '_' + _y + '_' + _z] !== 'undefined') {
	        found = _y + 1;
	      }
	    }

	    if (found) {
	      // three height
	      var treeHeight = Math.round(_utils2.default.rnd(6, 12));
	      for (var _y2 = found; _y2 <= treeHeight; _y2++) {
	        chunkNoise[_x + '_' + _y2 + '_' + _z] = {
	          location: {
	            x: _x, y: _y2, z: _z
	          },
	          surrounding: {
	            px: false,
	            nx: false,
	            py: false,
	            pz: false,
	            nz: false,
	            ny: false
	          },
	          noiseValue: getNoiseFor(_x, _y2, _z),
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A speed-improved perlin and simplex noise algorithms for 2D.
	 *
	 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
	 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
	 * Better rank ordering method by Stefan Gustavson in 2012.
	 * Converted to Javascript by Joseph Gentle.
	 *
	 * Version 2012-03-09
	 *
	 * This code was placed in the public domain by its original author,
	 * Stefan Gustavson. You may use it as you see fit, but
	 * attribution is appreciated.
	 *
	 */

	(function(global){

	  // Passing in seed will seed this Noise instance
	  function Noise(seed) {
	    function Grad(x, y, z) {
	      this.x = x; this.y = y; this.z = z;
	    }

	    Grad.prototype.dot2 = function(x, y) {
	      return this.x*x + this.y*y;
	    };

	    Grad.prototype.dot3 = function(x, y, z) {
	      return this.x*x + this.y*y + this.z*z;
	    };

	    this.grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
	                 new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
	                 new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

	    this.p = [151,160,137,91,90,15,
	    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
	    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
	    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
	    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
	    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
	    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
	    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
	    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
	    // To remove the need for index wrapping, double the permutation table length
	    this.perm = new Array(512);
	    this.gradP = new Array(512);

	    this.seed(seed || 0);
	  }

	  // This isn't a very good seeding function, but it works ok. It supports 2^16
	  // different seed values. Write something better if you need more seeds.
	  Noise.prototype.seed = function(seed) {
	    if(seed > 0 && seed < 1) {
	      // Scale the seed out
	      seed *= 65536;
	    }

	    seed = Math.floor(seed);
	    if(seed < 256) {
	      seed |= seed << 8;
	    }

	    var p = this.p;
	    for(var i = 0; i < 256; i++) {
	      var v;
	      if (i & 1) {
	        v = p[i] ^ (seed & 255);
	      } else {
	        v = p[i] ^ ((seed>>8) & 255);
	      }

	      var perm = this.perm;
	      var gradP = this.gradP;
	      perm[i] = perm[i + 256] = v;
	      gradP[i] = gradP[i + 256] = this.grad3[v % 12];
	    }
	  };

	  /*
	  for(var i=0; i<256; i++) {
	    perm[i] = perm[i + 256] = p[i];
	    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
	  }*/

	  // Skewing and unskewing factors for 2, 3, and 4 dimensions
	  var F2 = 0.5*(Math.sqrt(3)-1);
	  var G2 = (3-Math.sqrt(3))/6;

	  var F3 = 1/3;
	  var G3 = 1/6;

	  // 2D simplex noise
	  Noise.prototype.simplex2 = function(xin, yin) {
	    var n0, n1, n2; // Noise contributions from the three corners
	    // Skew the input space to determine which simplex cell we're in
	    var s = (xin+yin)*F2; // Hairy factor for 2D
	    var i = Math.floor(xin+s);
	    var j = Math.floor(yin+s);
	    var t = (i+j)*G2;
	    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
	    var y0 = yin-j+t;
	    // For the 2D case, the simplex shape is an equilateral triangle.
	    // Determine which simplex we are in.
	    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
	      i1=1; j1=0;
	    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
	      i1=0; j1=1;
	    }
	    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	    // c = (3-sqrt(3))/6
	    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	    var y1 = y0 - j1 + G2;
	    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
	    var y2 = y0 - 1 + 2 * G2;
	    // Work out the hashed gradient indices of the three simplex corners
	    i &= 255;
	    j &= 255;

	    var perm = this.perm;
	    var gradP = this.gradP;
	    var gi0 = gradP[i+perm[j]];
	    var gi1 = gradP[i+i1+perm[j+j1]];
	    var gi2 = gradP[i+1+perm[j+1]];
	    // Calculate the contribution from the three corners
	    var t0 = 0.5 - x0*x0-y0*y0;
	    if(t0<0) {
	      n0 = 0;
	    } else {
	      t0 *= t0;
	      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
	    }
	    var t1 = 0.5 - x1*x1-y1*y1;
	    if(t1<0) {
	      n1 = 0;
	    } else {
	      t1 *= t1;
	      n1 = t1 * t1 * gi1.dot2(x1, y1);
	    }
	    var t2 = 0.5 - x2*x2-y2*y2;
	    if(t2<0) {
	      n2 = 0;
	    } else {
	      t2 *= t2;
	      n2 = t2 * t2 * gi2.dot2(x2, y2);
	    }
	    // Add contributions from each corner to get the final noise value.
	    // The result is scaled to return values in the interval [-1,1].
	    return 70 * (n0 + n1 + n2);
	  };

	  // 3D simplex noise
	  Noise.prototype.simplex3 = function(xin, yin, zin) {
	    var n0, n1, n2, n3; // Noise contributions from the four corners

	    // Skew the input space to determine which simplex cell we're in
	    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
	    var i = Math.floor(xin+s);
	    var j = Math.floor(yin+s);
	    var k = Math.floor(zin+s);

	    var t = (i+j+k)*G3;
	    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
	    var y0 = yin-j+t;
	    var z0 = zin-k+t;

	    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	    // Determine which simplex we are in.
	    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	    if(x0 >= y0) {
	      if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
	      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
	      else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
	    } else {
	      if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
	      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
	      else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
	    }
	    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	    // c = 1/6.
	    var x1 = x0 - i1 + G3; // Offsets for second corner
	    var y1 = y0 - j1 + G3;
	    var z1 = z0 - k1 + G3;

	    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
	    var y2 = y0 - j2 + 2 * G3;
	    var z2 = z0 - k2 + 2 * G3;

	    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
	    var y3 = y0 - 1 + 3 * G3;
	    var z3 = z0 - 1 + 3 * G3;

	    // Work out the hashed gradient indices of the four simplex corners
	    i &= 255;
	    j &= 255;
	    k &= 255;

	    var perm = this.perm;
	    var gradP = this.gradP;
	    var gi0 = gradP[i+   perm[j+   perm[k   ]]];
	    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
	    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
	    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

	    // Calculate the contribution from the four corners
	    var t0 = 0.5 - x0*x0-y0*y0-z0*z0;
	    if(t0<0) {
	      n0 = 0;
	    } else {
	      t0 *= t0;
	      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
	    }
	    var t1 = 0.5 - x1*x1-y1*y1-z1*z1;
	    if(t1<0) {
	      n1 = 0;
	    } else {
	      t1 *= t1;
	      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
	    }
	    var t2 = 0.5 - x2*x2-y2*y2-z2*z2;
	    if(t2<0) {
	      n2 = 0;
	    } else {
	      t2 *= t2;
	      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
	    }
	    var t3 = 0.5 - x3*x3-y3*y3-z3*z3;
	    if(t3<0) {
	      n3 = 0;
	    } else {
	      t3 *= t3;
	      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
	    }
	    // Add contributions from each corner to get the final noise value.
	    // The result is scaled to return values in the interval [-1,1].
	    return 32 * (n0 + n1 + n2 + n3);

	  };

	  // ##### Perlin noise stuff

	  function fade(t) {
	    return t*t*t*(t*(t*6-15)+10);
	  }

	  function lerp(a, b, t) {
	    return (1-t)*a + t*b;
	  }

	  // 2D Perlin Noise
	  Noise.prototype.perlin2 = function(x, y) {
	    // Find unit grid cell containing point
	    var X = Math.floor(x), Y = Math.floor(y);
	    // Get relative xy coordinates of point within that cell
	    x = x - X; y = y - Y;
	    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	    X = X & 255; Y = Y & 255;

	    // Calculate noise contributions from each of the four corners
	    var perm = this.perm;
	    var gradP = this.gradP;
	    var n00 = gradP[X+perm[Y]].dot2(x, y);
	    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
	    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
	    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

	    // Compute the fade curve value for x
	    var u = fade(x);

	    // Interpolate the four results
	    return lerp(
	        lerp(n00, n10, u),
	        lerp(n01, n11, u),
	       fade(y));
	  };

	  // 3D Perlin Noise
	  Noise.prototype.perlin3 = function(x, y, z) {
	    // Find unit grid cell containing point
	    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
	    // Get relative xyz coordinates of point within that cell
	    x = x - X; y = y - Y; z = z - Z;
	    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	    X = X & 255; Y = Y & 255; Z = Z & 255;

	    // Calculate noise contributions from each of the eight corners
	    var perm = this.perm;
	    var gradP = this.gradP;
	    var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
	    var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
	    var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
	    var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
	    var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
	    var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
	    var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
	    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

	    // Compute the fade curve value for x, y, z
	    var u = fade(x);
	    var v = fade(y);
	    var w = fade(z);

	    // Interpolate
	    return lerp(
	        lerp(
	          lerp(n000, n100, u),
	          lerp(n001, n101, u), w),
	        lerp(
	          lerp(n010, n110, u),
	          lerp(n011, n111, u), w),
	       v);
	  };

	  global.Noise = Noise;

	})( false ? this : module.exports);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;

	var _classCallCheck2 = __webpack_require__(3);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(4);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Utils = function () {
	  function Utils() {
	    (0, _classCallCheck3.default)(this, Utils);
	  }

	  (0, _createClass3.default)(Utils, null, [{
	    key: 'toDeg',
	    value: function toDeg(rad) {
	      return rad * 180 / Math.PI;
	    }
	  }, {
	    key: 'toRad',
	    value: function toRad(deg) {
	      return deg * Math.PI / 180;
	    }
	  }, {
	    key: 'degAbs',
	    value: function degAbs(deg) {
	      return deg - Math.floor(deg / 360) * 360;
	    }
	  }, {
	    key: 'defined',
	    value: function defined(object) {
	      if (typeof object !== 'undefined') {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'rnd',
	    value: function rnd(min, max) {
	      return Math.random() * (max - min) + min;
	    }
	  }]);
	  return Utils;
	}();

	exports.default = Utils;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(5);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(6), __esModule: true };

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	var $Object = __webpack_require__(10).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(8);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(18), 'Object', {defineProperty: __webpack_require__(14).f});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(9)
	  , core      = __webpack_require__(10)
	  , ctx       = __webpack_require__(11)
	  , hide      = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 9 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 10 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(12);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(14)
	  , createDesc = __webpack_require__(22);
	module.exports = __webpack_require__(18) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(15)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , toPrimitive    = __webpack_require__(21)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(18) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(18) && !__webpack_require__(19)(function(){
	  return Object.defineProperty(__webpack_require__(20)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(19)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16)
	  , document = __webpack_require__(9).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }
/******/ ]);