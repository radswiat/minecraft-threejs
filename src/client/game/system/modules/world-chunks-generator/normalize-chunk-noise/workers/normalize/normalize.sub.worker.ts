import toRange from '@game/utils/toRange'
import { Perf } from '@game/utils'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  ({ data }) => {
    Perf.get(`⚙ normalize worker sub`)
    const chunk = data.chunk
    const maxNoise = data.maxNoise
    const minNoise = data.minNoise
    chunk.data = chunk.data.map((data) => {
      data.noiseValue = toRange(data.noiseValue, maxNoise, minNoise, 1, 0)
      return data
    })
    ctx.postMessage(chunk.data)
    Perf.get(`⚙ normalize worker sub`).end()
  },
  false,
)
