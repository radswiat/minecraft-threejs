import $ from 'jquery';
import Promise from 'bluebird';
var canvasID = 0;

export default class ChunkNoiseViewer {

  mode = 'x';
  modeTypes = {
    'x' : ['x', 'y'],
    'y' : ['y', 'z'],
    'z' : ['z', 'x']
  }
  recSize = 5;
  points = [];
  threads = [];
  maxNoise = 0;
  minNoise = 0;
  maxY = 0;
  minY = 0;
  maxX = 0;
  minX = 0;
  maxZ = 0;
  minZ = 0;

  /**
   * Convert noise to RGB gray color
   * @param noise
   * @returns {string}
   */
  noiseToRgb(noise) {
    if(noise === null) {
      return `rgb(${255},${190},${190})`;
    }
    let n = Math.round(( 100 * noise ) / this.maxNoise);
    let color = Math.round((255 * n) / 100);
    return `rgb(${color},${color},${color})`;
  }

  /**
   * Translate points to ABS points ( no negatives )
   * @param type
   * @param point
   * @returns {*}
   */
  translatePointToABS(type, point) {
    let min = this[`min${type.toUpperCase()}`];
    return point + Math.abs(min);
  }

  /**
   * Constructor
   * @param options
   */
  constructor(options) {
    this.createCanvas(options);
  }

  /**
   * Create canvas element
   * @param css
   */
  createCanvas(css) {
    this.canvasID = canvasID;
    this.$canvas = $('<canvas id="SeedCanvas_'+this.canvasID+'"></canvas>');
    canvasID++;
    this.$canvas.css(css);
    this.$canvas.css({
      position: 'fixed',
      'z-index' : 10000,
      border: '1px solid gray'
    });
    $('body').append(this.$canvas);
    this.canvas = document.getElementById('SeedCanvas_'+this.canvasID);
    let canvas = this.$canvas[0];
    this.ctx = canvas.getContext('2d');
    this.$canvas.on('click', this.changeMode.bind(this));
  }

  changeMode() {
    let index = Object.keys(this.modeTypes).indexOf(this.mode);
    if(typeof Object.keys(this.modeTypes)[index + 1] === 'undefined') { index =  -1; }
    this.mode = Object.keys(this.modeTypes)[index + 1];
    this.draw();
  }

  /**
   * Add point
   * @param x
   * @param y
   * @param noise
   */
  add(x, y, z, noise) {
    // async
    var thread = new Promise((resolve) => {
      requestAnimationFrame(() => {
        this.points.push({
          x: x,
          y: y,
          z: z,
          noise: noise
        });
        if(x > this.maxX) this.maxX = x;
        if(x < this.minX) this.minX = x;
        if(y > this.maxY) this.maxY = y;
        if(y < this.minY) this.minY = y;
        if(z > this.maxZ) this.maxZ = z;
        if(z < this.minZ) this.minZ = z;
        if(noise > this.maxNoise) this.maxNoise = noise;
        if(noise < this.minNoise) this.minNoise = noise;
        resolve();
      });
    });
    this.threads.push(thread);
  }

  /**
   * Draw final canvas points
   */
  end() {
    Promise.all(this.threads).then(() => {
      // adjust canvas size
      let size =  Math.round(Math.pow(this.points.length, 1/3)) * this.recSize;
      this.$canvas[0].width = size;
      this.$canvas[0].height = size;
      this.draw();
    })
  }

  draw() {
    this.points.forEach((point) => {
      this.rect(point[this.modeTypes[this.mode][0]], point[this.modeTypes[this.mode][1]], point.noise)
    })
  }

  rect(pos1 , pos2, strength) {
    this.ctx.fillStyle=this.noiseToRgb(strength);
    this.ctx.fillRect(
      this.recSize * this.translatePointToABS(this.modeTypes[this.mode][0], pos1),
      this.recSize * this.translatePointToABS(this.modeTypes[this.mode][1], pos2),
      this.recSize,
      this.recSize
    );
  }

}