// @ts-ignore
import { Noise } from 'noisejs'

/**
 * Get noise for location
 * - using cache
 * @param noise
 * @param x
 * @param y
 * @param z
 */
export default function isCubeFilled(noise: Noise, x: number, y: number, z: number): number {
  const frequency = 1.5
  const mod = 150

  const noiseValue =
    1 * noise.perlin3((1 * x) / mod, (1 * y) / mod, (1 * z) / mod) +
    0.5 * noise.perlin3((2 * x) / mod, (2 * y) / mod, (2 * z) / mod) +
    0.25 * noise.perlin3((4 * x) / mod, (4 * y) / mod, (4 * z) / mod) * frequency

  return Math.round(noiseValue * 2) / 2
}
