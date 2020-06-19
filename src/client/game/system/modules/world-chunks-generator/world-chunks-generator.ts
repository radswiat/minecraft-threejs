import { worldConfig } from '@game/config'
import gameLoaderStore from '@shared/stores/gameLoader'
import { Perf } from '@game/utils'

import { WorldChunk } from '@game/@types/chunk.types'

import noiseHelper from '@game/system/modules/noise-helper'

import forRange2d from './utils/forRange2d'
import generateChunkGeometries from './generate-chunk-geometries'
import generateChunkNoise from './generate-chunk-noise'
import normalizeChunkNoise from './normalize-chunk-noise'
import optimizeChunkSurroundings from './optimize-chunk-surroundings'

import { ChunkCoordinated } from './world-chunks-generator.types'

/**
 * Generate chunks
 * @param seedId
 */
export default async function worldChunksGenerator(seedId: number): Promise<WorldChunk[]> {
  // Chunk promises
  const chunksDefer = []

  // list of all chunks
  let chunks: ChunkCoordinated = {}

  // generate-chunk-noise
  // uses: @web-worker
  Perf.get(`🧩 chunks noise`)
  gameLoaderStore.setNewTask('Generate chunks noise', { max: worldConfig.chunks })
  await forRange2d(worldConfig.chunks, async (x: number, y: number) => {
    chunks[`${x}${y}`] = await generateChunkNoise(seedId, {
      chunkId: `${x}:${y}`,
      location: { x, y },
      chunkMod: worldConfig.chunkMod,
    })
    gameLoaderStore.increment()
  })
  gameLoaderStore.setTaskFinished()
  Perf.get(`🧩 chunks noise`).end()

  // normalize chunk noise
  // uses: @web-worker
  Perf.get(`🧩 normalize noise`)
  gameLoaderStore.setNewTask('Normalize chunk noise', { max: 1 })
  chunks = await normalizeChunkNoise(chunks)
  gameLoaderStore.setTaskFinished()
  Perf.get(`🧩 normalize noise`).end()

  // render noise helper
  Perf.get(`⚙ noiseHelper`)
  gameLoaderStore.setNewTask('Noise helper', { max: worldConfig.chunks })
  await forRange2d(worldConfig.chunks, async (x, y) => {
    noiseHelper(chunks[`${x}${y}`])
    gameLoaderStore.increment()
  })
  gameLoaderStore.setTaskFinished()
  Perf.get(`⚙ noiseHelper`).end()

  // optimize surroundings
  Perf.get(`🏎 optimize surroundings`)
  gameLoaderStore.setNewTask('Optimize chunk surroundings', { max: 1 })
  chunks = await optimizeChunkSurroundings(chunks, {
    noiseRenderThreshold: 0.65,
  })
  gameLoaderStore.setTaskFinished()
  Perf.get(`🏎 optimize surroundings`).end()

  // render geometries
  Perf.get(`🌍 geometries`)
  gameLoaderStore.setNewTask('Render geometries', { max: worldConfig.chunks })
  await forRange2d(worldConfig.chunks, async (x, y) => {
    chunksDefer.push(
      await generateChunkGeometries(chunks[`${x}${y}`], {
        location: { x, y },
      }),
    )
    gameLoaderStore.increment()
  })
  gameLoaderStore.setTaskFinished()
  Perf.get(`🌍 geometries`).end()

  gameLoaderStore.setNewTask('Starting world...', { max: 1 })
  return chunksDefer
}
