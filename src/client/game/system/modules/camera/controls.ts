import { Raycaster, Vector3 } from 'THREE'

var velocity = new Vector3()
var direction = new Vector3()
var prevTime = performance.now()
var moveForward = false
var moveBackward = false
var moveLeft = false
var moveRight = false
var canJump = false
var objects = []

const raycaster = new Raycaster(new Vector3(), new Vector3(0, -1, 0), 0, 10)

var onKeyDown = function (event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = true
      break

    case 37: // left
    case 65: // a
      moveLeft = true
      break

    case 40: // down
    case 83: // s
      moveBackward = true
      break

    case 39: // right
    case 68: // d
      moveRight = true
      break

    case 32: // space
      if (canJump === true) velocity.z += 350
      canJump = false
      break
  }
}

var onKeyUp = function (event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = false
      break

    case 37: // left
    case 65: // a
      moveLeft = false
      break

    case 40: // down
    case 83: // s
      moveBackward = false
      break

    case 39: // right
    case 68: // d
      moveRight = false
      break
  }
}

document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)

export default function controlsMove(controls) {
  window.requestAnimationFrame(() => {
    controlsMove(controls)
  })
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position)
    raycaster.ray.origin.z -= 10

    var intersections = raycaster.intersectObjects(objects)

    var onObject = intersections.length > 0

    var time = performance.now()
    var delta = (time - prevTime) / 1000

    velocity.x -= velocity.x * 10.0 * delta
    velocity.y -= velocity.y * 10.0 * delta

    velocity.z -= 9.8 * 100.0 * delta // 100.0 = mass

    direction.y = Number(moveForward) - Number(moveBackward)
    direction.x = Number(moveRight) - Number(moveLeft)
    direction.normalize() // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.y -= direction.y * 400.0 * delta
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta

    if (onObject === true) {
      velocity.z = Math.max(0, velocity.z)
      canJump = true
    }

    controls.moveRight(-velocity.x * delta)
    controls.moveForward(-velocity.y * delta)

    controls.getObject().position.z += velocity.z * delta // new behavior

    if (controls.getObject().position.z < 0) {
      velocity.z = 0
      controls.getObject().position.z = 0

      canJump = true
    }

    prevTime = time
  }
}
