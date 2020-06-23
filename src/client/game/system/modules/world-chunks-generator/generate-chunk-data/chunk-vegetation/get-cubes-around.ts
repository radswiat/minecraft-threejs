export default function getCubesAround(radius: number, location: { x: number; y: number; z: number }, cb: Function) {
  let x0 = radius
  let y0 = 0
  let radiusError = 1 - x0

  while (x0 >= y0) {
    cb(x0 + location.x, y0 + location.y, location.z)
    cb(y0 + location.x, x0 + location.y, location.z)
    cb(-x0 + location.x, y0 + location.y, location.z)
    cb(-y0 + location.x, x0 + location.y, location.z)
    cb(-x0 + location.x, -y0 + location.y, location.z)
    cb(-y0 + location.x, -x0 + location.y, location.z)
    cb(x0 + location.x, -y0 + location.y, location.z)
    cb(y0 + location.x, -x0 + location.y, location.z)
    y0++
    if (radiusError < 0) {
      radiusError += 2 * y0 + 1
    } else {
      x0--
      radiusError += 2 * (y0 - x0 + 1)
    }
  }

  // while (r <= radius) {
  //   cb(r + location.x, location.y + location.y, location.z)
  //   cb(location.y + location.x, r + location.y, location.z)
  //   cb(-r + location.x, location.y + location.y, location.z)
  //   cb(-location.y + location.x, r + location.y, location.z)
  //   cb(-r + location.x, -location.y + location.y, location.z)
  //   cb(-location.y + location.x, -r + location.y, location.z)
  //   cb(r + location.x, -location.y + location.y, location.z)
  //   cb(location.y + location.x, -r + location.y, location.z)
  //   r++
  // }
}

// export default function getCubesAround(radius: number, location: { x: number; y: number; z: number }, cb: Function) {
//   let r = 0
//   while (r <= radius) {
//     cb(location.x, location.y - r, location.z)
//     cb(location.x + r, location.y - r, location.z)
//     cb(location.x + r, location.y, location.z)
//     cb(location.x + r, location.y + r, location.z)
//     cb(location.x, location.y + r, location.z)
//     cb(location.x - r, location.y + r, location.z)
//     cb(location.x - r, location.y, location.z)
//     cb(location.x - r, location.y - r, location.z)
//     r++
//   }
// }
// //
// // -1-1    0-1    1-1
// // -1 0    0 0    1 0
// // -1 -1   0 1    1 1
