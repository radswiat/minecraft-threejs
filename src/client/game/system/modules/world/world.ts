import { Mesh } from 'three'

import App from '@game/app'
import { Perf } from '@game/utils'
import { WorldChunk } from '@game/@types/chunk.types'

import biomeGrass from '@game/system/modules/biomes/biome-grass/biome-grass'

import SpotLight from './comp/spot-light'
import hemiLight from './comp/hemi-light'
import ambientLight from './comp/ambient-light'
import skybox from './comp/skybox'

import worldChunksGenerator from '@game/system/modules/world-chunks-generator'

import getCubeMaterials from './helpers/getCubeMaterials'

import { WorldOpts, ChunkOptions } from './world.types'

export default class World {
  private readonly app: App
  private readonly chunkOptions: ChunkOptions
  // private readonly chunkSeed: Chunk
  private worldChunks: WorldChunk[]

  meshes = []
  lights = []
  objects = []

  constructor(app: App, { seedId, chunkOptions }: WorldOpts) {
    Perf.get('Generate world init')
    this.app = app
    this.seedId = seedId
    // this.chunkSeed = new Chunk(seedId)
    this.chunkOptions = chunkOptions
    Perf.get('Generate world init').end()
  }

  /**
   * Generate world
   * - prepare world
   * @return {Promise<void>}
   */
  async generateWorld() {
    Perf.get('Generate world chunks')
    this.worldChunks = await worldChunksGenerator(1)
    Perf.get('Generate world chunks').end()
  }

  renderWorld() {
    Perf.get('Render world chunks')
    // render world chunks
    for (const chunk of this.worldChunks) {
      const worldChunkMesh = new Mesh(chunk.geometry, [...getCubeMaterials()])
      worldChunkMesh.castShadow = true
      worldChunkMesh.receiveShadow = true
      this.meshes.push(worldChunkMesh)
      this.app.scene.add(worldChunkMesh)
      chunk.helperGeometries.forEach((obj) => {
        this.app.scene.add(obj)
      })
    }
    Perf.get('Render world chunks').end()
    Perf.get('Render sky & lights')
    // render skybox
    const skyboxMesh = skybox()
    this.app.scene.add(skyboxMesh)
    this.meshes.push(skyboxMesh)

    // add spotlight
    const spotLight = new SpotLight(this.app.scene)
    spotLight.render()
    this.objects.push(spotLight)

    // hemi light
    const hemiLightMesh = hemiLight()
    this.app.scene.add(hemiLightMesh)
    this.lights.push(hemiLightMesh)

    // ambient light
    const ambientLightMesh = ambientLight()
    this.app.scene.add(ambientLightMesh)
    this.lights.push(ambientLightMesh)

    Perf.get('Render sky & lights').end()
  }

  destroy() {
    for (const mesh of this.meshes) {
      this.app.scene.remove(mesh)
    }
    for (const light of this.lights) {
      this.app.scene.remove(light)
    }
  }
}
