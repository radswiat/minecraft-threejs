import {
  CubeGeometry, Mesh, MeshBasicMaterial, RepeatWrapping, TextureLoader, DoubleSide
} from 'three';

export default function skybox(scene) {
  const geometry = new CubeGeometry(5000, 5000, 5000, 5000);

  const skyTop = new TextureLoader().load('../assets/textures/skybox/1/sky_02.png');
  console.log(skyTop);

  const skyLeft = new TextureLoader().load('../assets/textures/skybox/1/sky_04.png');
  skyLeft.wrapS = RepeatWrapping;
  skyLeft.repeat.x = -1;

  const skyRight = new TextureLoader().load('../assets/textures/skybox/1/sky_06.png');
  skyRight.wrapS = RepeatWrapping;
  skyRight.repeat.x = -1;

  const skyFront = new TextureLoader().load('../assets/textures/skybox/1/sky_05.png');
  skyFront.wrapS = RepeatWrapping;
  skyFront.repeat.x = -1;

  const skyBack = new TextureLoader().load('../assets/textures/skybox/1/sky_07.png');
  skyBack.wrapS = RepeatWrapping;
  skyBack.repeat.x = -1;

  const dirt = new TextureLoader().load('../assets/textures/blocks/dirt.png');
  dirt.wrapS = RepeatWrapping;
  dirt.repeat.x = -1;

  const cubeMaterials = [
    new MeshBasicMaterial({
      map: skyBack, // back
      side: DoubleSide,
    }),
    new MeshBasicMaterial({
      map: skyFront, // front
      side: DoubleSide,
    }),
    new MeshBasicMaterial({
      map: skyTop, // top
      side: DoubleSide,
    }),
    new MeshBasicMaterial({
      map: dirt,
      side: DoubleSide,
    }),
    new MeshBasicMaterial({
      map: skyLeft, // left
      side: DoubleSide,
    }),
    new MeshBasicMaterial({
      map: skyRight, // right
      side: DoubleSide,
    }),
  ];

  return new Mesh(geometry, [...cubeMaterials]);
}
