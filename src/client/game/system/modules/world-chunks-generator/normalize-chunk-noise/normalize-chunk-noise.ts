// @ts-ignore
import NormalizeWorker from 'worker-loader!./workers/normalize/normalize.worker'

import { ChunkCoordinated } from '../world-chunks-generator.types'

export default function normalizeChunkNoise(chunks: ChunkCoordinated): Promise<ChunkCoordinated> {
  return new Promise((resolve) => {
    const worker = new NormalizeWorker()
    worker.postMessage({
      chunks,
    })
    worker.onmessage = ({ data }: { data: ChunkCoordinated }) => {
      resolve(data)
    }
  })
}
