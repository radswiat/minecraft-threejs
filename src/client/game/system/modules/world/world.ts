import { Mesh, Fog } from 'three'

import App from '@game/app'
import { Perf } from '@game/utils'
import { WorldChunk } from '@game/@types/chunk.types'

import biomeGrass from '@game/system/modules/biomes/biome-grass/biome-grass'

import SpotLight from './comp/spot-light'
import hemiLight from './comp/hemi-light'
import ambientLight from './comp/ambient-light'
import skybox from './comp/skybox'
import directionalLight from './comp/directional-light'
import testMesh from './comp/test'

import worldChunksGenerator from '@game/system/modules/world-chunks-generator'

import getCubeMaterials from './helpers/getCubeMaterials'

import { WorldOpts, ChunkOptions } from './world.types'
import gameEvents from '@game/system/modules/game-events/game-events'
import { worldConfig } from '@game/config'

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
    this.currentChunk = [-3, 0]
    gameEvents.register('render', async ({ controls }) => {
      const playerPosition = controls.object.position
      const x = Math.floor(playerPosition.x / (worldConfig.chunkSize * worldConfig.cubeSize))
      const y = Math.floor(playerPosition.y / (worldConfig.chunkSize * worldConfig.cubeSize))
      // console.log(`x: ${playerPosition.x} | y: ${playerPosition.y} | z: ${playerPosition.z}`)
      // console.log(`current chunk: ${x}:${y}`)
      if (this.currentChunk[0] !== x || this.currentChunk[1] !== y) {
        console.warn(`x: ${x} | y: ${y}`)
        this.currentChunk = [x, y]
        await this.generateWorld()
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
      }
    })
    Perf.get('Generate world init').end()
  }

  /**
   * Generate world
   * - prepare world
   * @return {Promise<void>}
   */
  async generateWorld() {
    Perf.get('Generate world chunks')
    this.worldChunks = await worldChunksGenerator(1, { startChunkLocation: this.currentChunk })
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
    // testMesh(this.app.scene)
    // render skybox
    const skyboxMesh = skybox()
    this.app.scene.fog = new Fog('#efdec4', 800, 3500)
    this.app.scene.add(skyboxMesh)
    this.meshes.push(skyboxMesh)

    // add spotlight 1
    const spotLight = new SpotLight(this.app.scene, [-900, 3057, 2003], [-1074, 260, -347])
    spotLight.render()
    this.objects.push(spotLight)

    // const spotLight2 = new SpotLight(this.app.scene, [-941, 3657, 2303], [-1074, 260, -347])
    // spotLight2.render()
    // this.objects.push(spotLight2)

    // hemi light
    const hemiLightMesh = hemiLight()
    this.app.scene.add(hemiLightMesh)
    this.lights.push(hemiLightMesh)

    // ambient light
    const ambientLightMesh = ambientLight()
    this.app.scene.add(ambientLightMesh)
    this.lights.push(ambientLightMesh)

    // const [directionalLightMesh, helper] = directionalLight()
    // this.app.scene.add(directionalLightMesh)
    // this.app.scene.add(helper)
    // this.lights.push(directionalLightMesh)

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
