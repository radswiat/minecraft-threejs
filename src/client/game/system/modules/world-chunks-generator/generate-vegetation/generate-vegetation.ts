// @ts-ignore
import VegetationWorker from 'worker-loader!./workers/vegetation/vegetation.worker'
import gameLoaderStore from '@shared/stores/gameLoader'

import { ChunkCoordinated } from '../world-chunks-generator.types'

export default function generateVegetation(chunks: ChunkCoordinated): Promise<ChunkCoordinated> {
  return new Promise((resolve) => {
    const worker = new VegetationWorker()
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
