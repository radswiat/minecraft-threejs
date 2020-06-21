import { ChunkCoordinated } from './world-chunks-generator.types'

export default new (class Memory {
  chunksCache: ChunkCoordinated = {}

  public get(key, subKey) {}
})()
