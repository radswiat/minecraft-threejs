// @ts-ignore
import SurroundingsWorker from 'worker-loader!./workers/surroundings/surroundings.worker'
import gameLoaderStore from '@shared/stores/gameLoader'

import { OptimizeChunkSurroundingsOpts } from './optimize-chunk-surroundings.types'

import { ChunkCoordinated } from '../world-chunks-generator.types'

export default function optimizeChunkSurroundings(
  chunks: ChunkCoordinated,
  { noiseRenderThreshold, thresholdMod }: OptimizeChunkSurroundingsOpts,
): Promise<ChunkCoordinated> {
  return new Promise((resolve) => {
    const worker = new SurroundingsWorker()
    worker.postMessage({
      chunks: JSON.stringify(chunks),
      noiseRenderThreshold,
      thresholdMod,
    })
    worker.onmessage = ({ data }: { data: ChunkCoordinated }) => {
      if (data.done) {
        resolve(JSON.parse(data.data))
      } else {
        gameLoaderStore.increment()
      }
    }
  })
}
