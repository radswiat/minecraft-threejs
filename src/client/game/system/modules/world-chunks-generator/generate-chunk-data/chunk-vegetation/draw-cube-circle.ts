import getLeavesCube from '@game/system/modules/world-chunks-generator/generate-chunk-data/chunk-vegetation/get-leaves-cube'

export default function drawCubeCircle(location: { x: number; y: number; z: number }, r: number) {
  const cubes = []
  var x0 = location.x
  var y0 = location.y
  var z0 = location.z
  // lest make leaves around
  var y = 0
  var decisionOver2 = 1 - r
  while (r >= y) {
    cubes.push(getLeavesCube(r + x0, y + y0, z0))
    cubes.push(getLeavesCube(y + x0, r + y0, z0))
    cubes.push(getLeavesCube(-r + x0, y + y0, z0))
    cubes.push(getLeavesCube(-y + x0, r + y0, z0))
    cubes.push(getLeavesCube(-r + x0, -y + y0, z0))
    cubes.push(getLeavesCube(-y + x0, -r + y0, z0))
    cubes.push(getLeavesCube(r + x0, -y + y0, z0))
    cubes.push(getLeavesCube(y + x0, -r + y0, z0))
    y++
    if (decisionOver2 <= 0) {
      decisionOver2 += 2 * z0 + 1 // Change in decision criterion for y -> y+1
    } else {
      r--
      decisionOver2 += 2 * (z0 - r) + 1
    }
  }
  return cubes
}
