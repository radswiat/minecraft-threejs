import { random } from '@game/utils'

export default new (class BiomeGrass {
  public name = 'grass'
  public translate = (x: number, y: number, z: number) => {
    return [x, y, z]
  }
  public applyMaterial(noiseValue, surroundingNoiseValues, x, y, z) {
    if (y < 6) return 2
    // if (y > random(8, 12)) return 2
    // if (y < random(1, 4)) return 1
    return 0
  }
})()
