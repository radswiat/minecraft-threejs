// @ts-ignore
import NormalizeWorker from 'worker-loader!./workers/normalize/normalize.worker'
import gameLoaderStore from '@shared/stores/gameLoader'

import { ChunkCoordinated } from '../world-chunks-generator.types'

export default function normalizeChunkNoise(chunks: ChunkCoordinated): Promise<ChunkCoordinated> {
  return new Promise((resolve) => {
    const worker = new NormalizeWorker()
    worker.postMessage({
      chunks: JSON.stringify(chunks),
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
