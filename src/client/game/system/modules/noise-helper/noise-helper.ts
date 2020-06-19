import { worldConfig } from '@game/config/world'
import createCtx from './utils/createCtx'

import { Chunk } from '@game/system/modules/world-chunks-generator/world-chunks-generator.types'

// let sizeFactor = 6
const borderSize = 0
let currentChunkCount = 0
let currentRow = 0
const layer = -10

/**
 * Render visible canvas noise helper
 * @param chunk
 */
export default function noiseHelper(chunk: Chunk) {
  let sizeFactor = 12 / Math.sqrt(worldConfig.chunks)
  // calc canvas size based on chunk size and size factor
  let canvasSize = worldConfig.chunkSize * sizeFactor + borderSize
  // row module based on current chunk count
  const rowModulo = currentChunkCount % Math.sqrt(worldConfig.chunks)
  // increment row count when it should print in new raw
  if (rowModulo === 0) currentRow++

  // create ctx to draw on
  const ctx = createCtx(canvasSize, { top: canvasSize * (currentRow - 1), left: canvasSize * rowModulo })

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
  // ctx.font = '24px serif'
  // ctx.fillStyle = 'red'
  // ctx.fillText(chunk.chunkId, canvasSize / 2 - 20, 20)
  currentChunkCount++
}
