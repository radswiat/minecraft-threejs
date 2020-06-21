import { worldConfig } from '@game/config'
import gameLoaderStore from '@shared/stores/gameLoader'
import { Perf } from '@game/utils'

import { WorldChunk } from '@game/@types/chunk.types'

import NoiseHelper from '@game/system/modules/noise-helper'
import gameEvents from '@game/system/modules/game-events'

import forEachRange from './utils/forEachRange'
import generateChunkGeometries from './generate-chunk-geometries'
import generateChunkNoise from './generate-chunk-noise'
import normalizeChunkNoise from './normalize-chunk-noise'
import optimizeChunkSurroundings from './optimize-chunk-surroundings'
import generateVegetation from './generate-vegetation'
import memory from './world-chunks-generator.memory'

import { ChunkCoordinated, WorldChunksGeneratorOpts } from './world-chunks-generator.types'

const chunkCache = {}

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
  let chunks: ChunkCoordinated = {}

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
  gameLoaderStore.setNewTask('Normalize chunk noise', { max: worldConfig.chunks })
  chunks = await normalizeChunkNoise(chunks)
  gameLoaderStore.setTaskFinished()
  Perf.get(`🧩 normalize noise`).end()

  // optimize surroundings
  Perf.get(`🏎 optimize surroundings`)
  gameLoaderStore.setNewTask('Optimize chunk surroundings', { max: worldConfig.chunks })
  chunks = await optimizeChunkSurroundings(chunks, {
    noiseRenderThreshold: 0.65,
    thresholdMod: 20,
  })
  gameLoaderStore.setTaskFinished()
  Perf.get(`🏎 optimize surroundings`).end()

  // render noise helper
  // Perf.get(`⚙ noiseHelper`)
  // gameLoaderStore.setNewTask('Noise helper', { max: worldConfig.chunks })
  // const noiseHelper = new NoiseHelper()
  // await forEachRange(rangeArr, async (x: number, y: number) => {
  //   if (chunkCache[`${x}${y}`]) return
  //   noiseHelper.addChunk(chunks[`${x}${y}`])
  //   gameLoaderStore.increment()
  // })
  // noiseHelper.render()
  // gameLoaderStore.setTaskFinished()
  // Perf.get(`⚙ noiseHelper`).end()

  Perf.get(`🌍 vegetation`)
  gameLoaderStore.setNewTask('Generate vegetation', { max: worldConfig.chunks })
  chunks = await generateVegetation(chunks)
  gameLoaderStore.setTaskFinished()
  Perf.get(`🌍 vegetation`).end()

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
