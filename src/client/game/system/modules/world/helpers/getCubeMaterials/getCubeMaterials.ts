import { MeshLambertMaterial, TextureLoader, Material, RepeatWrapping } from 'three'
import gameEvents from '@game/system/modules/game-events'
import { toRad } from '@game/utils'

export default function () {
  // TODO: We need to get rid of the materials from here
  // Those should not be injected when generating the chunk
  const grassTexture = new TextureLoader().load('../resources/textures/blocks/hardened_clay_stained_green.png')
  const matGrass = new MeshLambertMaterial({
    map: grassTexture,
  })
  // matGrass.eu
  const matDirt = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/dirt.png'),
  })
  const matStone = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/cobblestone_mossy.png'),
  })
  const textureLog = new TextureLoader().load('../resources/textures/blocks/log_spruce.png')
  textureLog.rotation = toRad(-90)
  const matLog = new MeshLambertMaterial({
    map: textureLog,
  })
  const matLeaves = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/leaves.png'),
    transparent: true,
  })

  const waterTexture = new TextureLoader().load('../resources/textures/blocks/water.png')
  waterTexture.wrapS = RepeatWrapping
  waterTexture.wrapT = RepeatWrapping
  const matWater: Material = new MeshLambertMaterial({
    map: waterTexture,
    transparent: true,
    opacity: 0.5,
  })

  const matSand = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/sand.png'),
  })

  // animate water
  gameEvents.register('render', () => {
    matWater.map.offset.x += 0.002
    matWater.map.offset.y += 0.002
  })

  return [matGrass, matDirt, matStone, matLog, matLeaves, matWater, matSand]
}
