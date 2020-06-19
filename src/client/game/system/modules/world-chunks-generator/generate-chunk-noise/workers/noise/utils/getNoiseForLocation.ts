/**
 * Get noise for location
 * - using cache
 * @param noise
 * @param noiseChunks
 * @param x
 * @param y
 * @param z
 * @param mod
 */
export default function isCubeFilled(noise, noiseChunks, x, y, z, mod = 100): boolean {
  const frequency = 1.5
  mod = 150
  // const mod = 100
  // if (cache[`${x}_${y}_${z}`]) return cache[`${x}_${y}_${z}`].noiseValue
  //     1 * toPositiveRange(noise.perlin3(x / frequency, y / frequency, z / frequency)) +
  let noiseValue =
    1 * noise.perlin3((1 * x) / mod, (1 * y) / mod, (1 * z) / mod) +
    0.5 * noise.perlin3((2 * x) / mod, (2 * y) / mod, (2 * z) / mod) +
    0.25 * noise.perlin3((4 * x) / mod, (4 * y) / mod, (4 * z) / mod) * frequency

  // let noiseValue = toPositiveRange(noise.simplex3((1 * x) / mod, (1 * y) / mod, (1 * z) / mod))
  // let noiseValue = toPositiveRange(noise.perlin3((1 * x) / mod, (1 * y) / mod, (1 * z) / mod))
  // let noiseValue = noise.perlin3((1 * x) / mod, (1 * y) / mod, (1 * z) / mod) * frequency

  // if (m) {
  //   // console.log(x, y, z)
  //   // console.log(noise.perlin3(0.12, 0.24, 0.5))
  //   console.log(noiseValue)
  //   m--
  // }
  // noiseValue += -z / 2 // ( 5 / z ) / 10
  // noiseValue = Math.pow(noiseValue, 5.0)
  // cache[`${x}_${y}_${z}`] = { noiseValue }
  noiseValue = Math.round(noiseValue * 2) / 2
  return noiseValue
  // return noiseValue;
  // noiseValue = ( noiseValue / 2 ) / y;
  noiseValue += (8 - y) / 10 // ( 5 / z ) / 10
  // cut hills :)
  // if (f(noise, noiseChunks, x, y, z, 1) < 0) {
  //   noiseValue = 0
  // }
  // return noiseValue
}
