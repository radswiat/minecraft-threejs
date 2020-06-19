import { worldConfig } from '@game/config/world'
import createCtx from './utils/createCtx'
import createScroller from './utils/createScroller'
import { Chunk } from '@game/system/modules/world-chunks-generator/world-chunks-generator.types'

// let sizeFactor = 6
const borderSize = 0

export default class NoiseHelper {
  private chunks: Chunk[] = []

  addChunk(chunk: Chunk) {
    this.chunks.push(chunk)
  }

  render() {
    let sizeFactor = 12 / Math.sqrt(worldConfig.chunks)
    // calc canvas size based on chunk size and size factor
    let canvasSize = worldConfig.chunkSize * sizeFactor + borderSize
    createScroller(-12, [-12, 12], (layer: number) => {
      console.log(`🏞 noise-helper: layer: ${layer}`)
      let currentRow = 0
      this.chunks.forEach((chunk: Chunk, idx: number) => {
        const rowModulo = idx % Math.sqrt(worldConfig.chunks)
        if (rowModulo === 0) currentRow++
        const ctx = createCtx(canvasSize, {
          top: canvasSize * (currentRow - 1),
          left: canvasSize * rowModulo,
          id: `${chunk.chunkId}${layer}`,
        })
        // If cached, skip
        if (!ctx) return
        // filter noise by visible Z axis
        const noise = chunk.data.filter(({ absLocation }) => {
          return absLocation.z === layer
        })

        noise.forEach(({ absLocation: { x, y }, noiseValue }) => {
          x += 12
          y += 12
          ctx.beginPath()
          ctx.rect(Math.abs(x) * sizeFactor, Math.abs(y) * sizeFactor, sizeFactor, sizeFactor)
          ctx.fillStyle = `rgba(0, 0, 0, ${noiseValue})`
          ctx.fill()
        })
      })
    })
  }
}
