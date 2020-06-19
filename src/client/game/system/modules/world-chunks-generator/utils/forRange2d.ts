import promiseThrottle from '@game/system/modules/world-chunks-generator/utils/throttlePromise'

export default function forRange2d(rangeNumber: number, parallel: number | Function, cb?: Function) {
  const defer = []
  if (typeof parallel == 'function') {
    cb = parallel
    parallel = 2
  }
  const range = Math.floor(Math.sqrt(rangeNumber) / 2)
  // alert(`range: ${range}`)
  const throttle = promiseThrottle({ parallel })
  let count = 0
  for (let x = -range; x <= range; x++) {
    for (let y = -range; y <= range; y++) {
      count++
      defer.push(
        throttle.add(async () => {
          return await cb(x, y)
        }),
      )
    }
  }
  // alert(count)
  return Promise.all(defer)
}
