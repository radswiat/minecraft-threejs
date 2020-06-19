import PromiseQueue from 'p-queue'

/**
 *
 * @param rangeNumber
 * @param parallel
 * @param cb
 */
export default function forEachRange(rangeNumber: number, parallel: number | Function, cb?: Function) {
  const defer = []
  const range = Math.floor(Math.sqrt(rangeNumber) / 2)

  // handle parallel or cb
  if (typeof parallel === 'function') {
    cb = parallel
    parallel = 6
  }

  const queue = new PromiseQueue({ concurrency: parallel })
  for (let x = -range; x <= range; x++) {
    for (let y = -range; y <= range; y++) {
      defer.push(
        queue.add(async () => {
          return await cb(x, y)
        }),
      )
    }
  }
  return Promise.all(defer)
}
