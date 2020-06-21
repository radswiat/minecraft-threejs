import { MeshLambertMaterial, TextureLoader, BoxGeometry, Mesh } from 'three'
import { toRad } from '@game/utils'
import dat from '@game/helpers/dat'

export default function (scene) {
  const x = -0
  // box 1
  const grassTexture = new TextureLoader().load('../resources/textures/blocks/hardened_clay_stained_green.png')
  const matGrass = new MeshLambertMaterial({
    map: grassTexture,
  })

  var geometry = new BoxGeometry(100, 100, 100)
  const mesh = new Mesh(geometry, matGrass)
  geometry.translate(x, -1000, 0)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.rotateX(toRad(-87))
  mesh.rotateY(toRad(23))
  mesh.rotateZ(toRad(-79))
  scene.add(mesh)

  // box 2
  var geometry2 = new BoxGeometry(1000, 10, 1000)
  const mesh2 = new Mesh(geometry2, matGrass)
  geometry2.translate(x, -0, 0)
  mesh2.castShadow = true
  mesh2.receiveShadow = true
  mesh2.rotateX(toRad(-87))
  mesh2.rotateY(toRad(23))
  mesh2.rotateZ(toRad(-79))
  scene.add(mesh2)

  const datHelper = dat.createSpace('test', mesh2)
  datHelper.add('rotation.x', { range: 10000, opts: [1], convert: 'deg' })
  datHelper.add('rotation.y', { range: 10000, opts: [1], convert: 'deg' })
  datHelper.add('rotation.z', { range: 10000, opts: [1], convert: 'deg' })
}
// import gameEvents from '@game/system/modules/game-events'
// import { toRad } from '@game/utils'
//
// export default function () {
//   // TODO: We need to get rid of the materials from here
//   // Those should not be injected when generating the chunk
//   const grassTexture = new TextureLoader().load('../resources/textures/blocks/hardened_clay_stained_green.png')
//   const matGrass = new MeshLambertMaterial({
//     map: grassTexture,
//   })
//   // matGrass.eu
//   const matDirt = new MeshLambertMaterial({
//     map: new TextureLoader().load('../resources/textures/blocks/dirt.png'),
//   })
//   const matStone = new MeshLambertMaterial({
//     map: new TextureLoader().load('../resources/textures/blocks/cobblestone_mossy.png'),
//   })
//   const textureLog = new TextureLoader().load('../resources/textures/blocks/log_spruce.png')
//   textureLog.rotation = toRad(-90)
//   const matLog = new MeshLambertMaterial({
//     map: textureLog,
//   })
//   const matLeaves = new MeshLambertMaterial({
//     map: new TextureLoader().load('../resources/textures/blocks/leaves.png'),
//     transparent: true,
//   })
//
//   const waterTexture = new TextureLoader().load('../resources/textures/blocks/water.png')
//   waterTexture.wrapS = RepeatWrapping
//   waterTexture.wrapT = RepeatWrapping
//   const matWater: Material = new MeshLambertMaterial({
//     map: waterTexture,
//     transparent: true,
//     opacity: 0.5,
//   })
//
//   const matSand = new MeshLambertMaterial({
//     map: new TextureLoader().load('../resources/textures/blocks/sand.png'),
//   })
//
//   // animate water
//   gameEvents.register('render', () => {
//     matWater.map.offset.x += 0.002
//     matWater.map.offset.y += 0.002
//   })
//
//   return [matGrass, matDirt, matStone, matLog, matLeaves, matWater, matSand]
// }
