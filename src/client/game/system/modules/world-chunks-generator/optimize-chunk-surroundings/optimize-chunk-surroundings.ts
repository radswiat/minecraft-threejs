// @ts-ignore
import SurroundingsWorker from 'worker-loader!./workers/surroundings/surroundings.worker'

import { OptimizeChunkSurroundingsOpts } from './optimize-chunk-surroundings.types'

import { Chunk, ChunkCoordinated } from '../world-chunks-generator.types'

export default function optimizeChunkSurroundings(
  chunks: ChunkCoordinated,
  { noiseRenderThreshold }: OptimizeChunkSurroundingsOpts,
): Promise<ChunkCoordinated> {
  return new Promise((resolve) => {
    const worker = new SurroundingsWorker()
    worker.postMessage({
      chunks,
      noiseRenderThreshold,
    })
    worker.onmessage = ({ data }: { data: ChunkCoordinated }) => {
      resolve(data)
    }
  })
}
