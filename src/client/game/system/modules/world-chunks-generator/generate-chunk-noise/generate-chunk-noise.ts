// @ts-ignore
import ChunkNoiseWorker from 'worker-loader!./workers/noise/noise.worker'

import { worldConfig } from '@game/config'

import { Chunk, ChunkNoiseOpts } from '../world-chunks-generator.types'

export default function generateChunkNoise(seedId: number, { location, chunkMod, chunkId }: ChunkNoiseOpts): Promise<Chunk> {
  return new Promise((resolve) => {
    const worker = new ChunkNoiseWorker()
    worker.postMessage({
      seed: seedId,
      mod: chunkMod,
      chunkId,
      chunkLocation: location,
      chunkSize: worldConfig.chunkSize,
    })
    worker.onmessage = ({ data }: { data: Chunk }) => {
      if (data.done) {
        resolve(JSON.parse(data.data))
      }
    }
  })
}
