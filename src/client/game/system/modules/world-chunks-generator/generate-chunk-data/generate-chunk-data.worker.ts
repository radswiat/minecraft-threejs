// @ts-ignore
import { Noise } from 'noisejs'
import { Perf } from '@game/utils'
import toRange from '@game/utils/toRange'

import isAboveThreshold from './utils/is-above-threshold'
import isCubeAtLocation from './utils/is-cube-at-location'
import isAllAroundSurrounded from './utils/is-all-around-surrounded'
import drawTree from './chunk-vegetation/draw-tree'

import { Chunks2D, Cubes3D, Chunk, ChunksArr, ChunkData } from '../world-chunks-generator.types'

const ctx: Worker = self as any

ctx.addEventListener(
  'message',
  async ({ data }) => {
    const chunks2D: Chunks2D = JSON.parse(data.chunks)
    const cubes3D: Cubes3D = {}
    const cubeNoiseMax = data.maxNoise || Math.max(...Object.values(chunks2D).map((chunk: Chunk) => chunk.noiseMaps.cubeMax))
    const cubeNoiseMin = data.minNoise || Math.min(...Object.values(chunks2D).map((chunk: Chunk) => chunk.noiseMaps.cubeMin))
    const treeNoiseMax = data.maxNoise || Math.max(...Object.values(chunks2D).map((chunk: Chunk) => chunk.noiseMaps.treeMax))
    const treeNoiseMin = data.minNoise || Math.min(...Object.values(chunks2D).map((chunk: Chunk) => chunk.noiseMaps.treeMin))
    const noiseRenderThreshold = data.noiseRenderThreshold
    const noiseRenderThresholdMod = data.noiseRenderThresholdMod
    const waterLevel = data.waterLevel

    const chunksArr: ChunksArr = Object.values(chunks2D)

    // =======================================================
    // Normalize chunks data and filter threshold
    // =======================================================
    Perf.get(`   🧩 normalize noise`)
    chunksArr.forEach((chunk: Chunk) => {
      chunk.data = chunk.data.map((data) => {
        data.noiseValue = toRange(data.noiseValue, cubeNoiseMax, cubeNoiseMin, 1, 0)
        return data
      })
    })

    // Filter blocks by min threshold & build up cubes3D data
    // Has to happen after normalize ?
    chunksArr.forEach((chunk: Chunk) => {
      chunk.data = chunk.data.filter((chunk: ChunkData) => {
        if (
          chunk.location.z === waterLevel ||
          isAboveThreshold(chunk.noiseValue, noiseRenderThreshold, noiseRenderThresholdMod, chunk.absLocation.z)
        ) {
          cubes3D[`${chunk.location.x}:${chunk.location.y}:${chunk.location.z}`] = chunk
          return true
        }
        return false
      })
    })
    Perf.get(`   🧩 normalize noise`).end()

    // =======================================================
    // Optimize chunks surroundings
    // =======================================================
    Perf.get(`   🏎 optimize surroundings`)
    chunksArr.forEach((chunk: Chunk) => {
      chunk.data = chunk.data.reduce((acc, data) => {
        const { x, y, z } = data.location
        data.surrounding = {
          px: !!isCubeAtLocation(cubes3D, x + 1, y, z),
          nx: !!isCubeAtLocation(cubes3D, x - 1, y, z),
          py: !!isCubeAtLocation(cubes3D, x, y + 1, z),
          pz: !!isCubeAtLocation(cubes3D, x, y, z + 1),
          nz: !!isCubeAtLocation(cubes3D, x, y, z - 1),
          ny: !!isCubeAtLocation(cubes3D, x, y - 1, z),
        }
        if (!isAllAroundSurrounded(data.surrounding)) {
          acc.push(data)
        }
        return acc
      }, [])
      ctx.postMessage({ done: false })
    })
    Perf.get(`   🏎 optimize surroundings`).end()

    // =======================================================
    // Vegetation
    // =======================================================
    const vegetationTreeCubes: ChunkData[] = []
    const noise = new Noise(1)
    Perf.get(`   🏎 vegetation`)
    chunksArr.forEach((chunk: Chunk) => {
      chunk.data = chunk.data.map((data: ChunkData) => {
        data.vegetation.treeNoise = toRange(data.vegetation.treeNoise, treeNoiseMax, treeNoiseMin, 1, 0)
        if (data.vegetation.treeNoise < 0.25 && data.absLocation.z >= -10) {
          const treeCubes = drawTree(noise, data.vegetation.treeNoise, cubes3D, data.location)
          // add to optimization
          treeCubes.forEach((chunk: ChunkData) => {
            cubes3D[`${chunk.location.x}:${chunk.location.y}:${chunk.location.z}`] = chunk
          })
          vegetationTreeCubes.push(...treeCubes)
        }
        return data
      })
      chunk.data.push(...vegetationTreeCubes)
    })
    Perf.get(`   🏎 vegetation`).end()

    // =======================================================
    // Finish
    // =======================================================
    Perf.get(`   ⚙ postMessage worker`)
    ctx.postMessage({ done: true, data: JSON.stringify(chunks2D) })
    Perf.get(`   ⚙ postMessage worker`).end()
  },
  false,
)
