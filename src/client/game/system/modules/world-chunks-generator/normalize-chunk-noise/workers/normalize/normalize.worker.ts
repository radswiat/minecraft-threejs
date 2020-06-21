import { Perf } from '@game/utils'
import NormalizeSubWorker from 'worker-loader!./normalize.sub.worker'
import { ChunkCoordinated } from '@game/system/modules/world-chunks-generator/world-chunks-generator.types'
import PromiseQueue from 'p-queue'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  async ({ data }) => {
    Perf.get(`⚙ normalize worker`)

    const chunks = JSON.parse(data.chunks)
    const maxNoise = data.maxNoise || Math.max(...Object.values(chunks).map((chunk) => chunk.noiseMax))
    const minNoise = data.minNoise || Math.min(...Object.values(chunks).map((chunk) => chunk.noiseMin))

    const queue = new PromiseQueue({ concurrency: 12 })
    const defer = []
    Object.entries(chunks).forEach(([key, value]) => {
      const chunk = chunks[key]
      defer.push(
        queue.add(async () => {
          return new Promise((resolve) => {
            const worker = new NormalizeSubWorker()
            worker.postMessage({
              chunk,
              maxNoise,
              minNoise,
            })
            worker.onmessage = ({ data }: { data: ChunkCoordinated }) => {
              chunk.data = data
              ctx.postMessage({ done: false })
              resolve()
            }
          })
        }),
      )
    })

    await Promise.all(defer)

    ctx.postMessage({ done: true, data: JSON.stringify(chunks), maxNoise, minNoise })
    Perf.get(`⚙ normalize worker`).end()
  },
  false,
)
