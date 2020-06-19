import toRange from '@game/utils/toRange'
import { Perf } from '@game/utils'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  ({ data }) => {
    Perf.get(`⚙ normalize worker`)

    const chunks = data.chunks
    const maxNoise = Math.max(...Object.values(chunks).map((chunk) => chunk.noiseMax))
    const minNoise = Math.min(...Object.values(chunks).map((chunk) => chunk.noiseMin))

    Object.entries(chunks).forEach(([key, value]) => {
      const chunk = chunks[key]
      chunk.data = chunk.data.map((data) => {
        data.noiseValue = toRange(data.noiseValue, maxNoise, minNoise, 1, 0)
        return data
      })
    })

    ctx.postMessage(chunks)
    Perf.get(`⚙ normalize worker`).end()
  },
  false,
)
