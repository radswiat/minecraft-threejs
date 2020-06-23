import { worldConfig } from '@game/config'
import gameLoaderStore from '@shared/stores/gameLoader'
import { Perf } from '@game/utils'

import { WorldChunk } from '@game/@types/chunk.types'

import NoiseHelper from '@game/system/modules/noise-helper'
import gameEvents from '@game/system/modules/game-events'

import forEachRange from './utils/forEachRange'
import useWorker from './utils/useWorker'

import NoiseWorker from './generate-chunk-noise'
import DataWorker from './generate-chunk-data'

import generateChunkGeometries from './generate-chunk-geometries'
import memory from './world-chunks-generator.memory'

import { Chunks2D, Chunk, WorldChunksGeneratorOpts } from './world-chunks-generator.types'
import { memo } from 'react'

/**
 * Generate chunks
 * @param seedId
 * @param opts
 * @param opts.startChunkLocation
 */
export default async function worldChunksGenerator(
  seedId: number,
  { startChunkLocation = [0, 0] }: WorldChunksGeneratorOpts,
): Promise<WorldChunk[]> {
  // Chunk promises
  const chunksDefer: WorldChunk[] = []

  // list of all chunks
  let chunks: Chunks2D = {}

  // Get chunk drawing range
  // see: Centered octagonal number
  const range = Math.floor(Math.sqrt(worldConfig.chunks) / 2)
  const rangeArr: [number[], number[]] = [
    [startChunkLocation[0] - range, startChunkLocation[0] + range],
    [startChunkLocation[1] - range, startChunkLocation[1] + range],
  ]

  // generate-chunk-noise
  Perf.get(`🧩 chunks noise`)
  gameLoaderStore.setNewTask('Generate chunks noise', { max: worldConfig.chunks })
  await forEachRange(rangeArr, async (x: number, y: number) => {
    if (memory.chunksCache[`${x}${y}`]) return
    const { data } = await useWorker<Chunk>(NoiseWorker, {
      seedId,
      chunkId: `${x}:${y}`,
      chunkLocation: { x, y },
      chunkSize: worldConfig.chunkSize,
      normalize: {
        max: null,
        min: null,
      },
    })
    chunks[`${x}${y}`] = data
    gameLoaderStore.increment()
  })
  gameLoaderStore.setTaskFinished()
  Perf.get(`🧩 chunks noise`).end()

  // normalize chunk noise
  // uses: @web-worker
  Perf.get(`🧩 chunk data`)
  gameLoaderStore.setNewTask('Chunk data', { max: worldConfig.chunks })
  const { data, noiseMaps } = await useWorker<Chunks2D>(
    DataWorker,
    {
      chunks: JSON.stringify(chunks),
      noiseRenderThreshold: 0.65,
      noiseRenderThresholdMod: 20,
      waterLevel: -12,
      noiseMaps: memory.noiseMaps,
    },
    () => gameLoaderStore.increment(),
  )
  chunks = data
  memory.noiseMaps = noiseMaps
  gameLoaderStore.setTaskFinished()
  Perf.get(`🧩 chunk data`).end()

  // render geometries
  Perf.get(`🌍 geometries`)
  gameLoaderStore.setNewTask('Render geometries', { max: worldConfig.chunks })
  await forEachRange(rangeArr, async (x: number, y: number) => {
    if (memory.chunksCache[`${x}${y}`]) return
    memory.chunksCache[`${x}${y}`] = true
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
