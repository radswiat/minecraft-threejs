import { MeshLambertMaterial, TextureLoader } from 'three'

export default function () {
  // TODO: We need to get rid of the materials from here
  // Those should not be injected when generating the chunk
  const matGrass = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/hardened_clay_stained_green.png'),
  })
  const matDirt = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/dirt.png'),
  })
  const matStone = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/cobblestone_mossy.png'),
  })
  const matLog = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/log_spruce.png'),
  })
  const matLeaves = new MeshLambertMaterial({
    map: new TextureLoader().load('../resources/textures/blocks/leaves.png'),
    transparent: true,
  })

  return [matGrass, matDirt, matStone, matLog, matLeaves]
}
