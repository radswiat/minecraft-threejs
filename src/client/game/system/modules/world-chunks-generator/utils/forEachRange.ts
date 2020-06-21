import PromiseQueue from 'p-queue'

/**
 *
 * @param range
 * @param parallel
 * @param cb
 */
export default function forEachRange(range: [number[], number[]], parallel: number | Function, cb?: Function) {
  const defer = []
  // const range = Math.floor(Math.sqrt(rangeNumber) / 2)

  // handle parallel or cb
  if (typeof parallel === 'function') {
    cb = parallel
    parallel = 6
  }

  const queue = new PromiseQueue({ concurrency: parallel })
  for (let x = range[0][0]; x <= range[0][1]; x++) {
    for (let y = range[1][0]; y <= range[1][1]; y++) {
      defer.push(
        queue.add(async () => {
          return await cb(x, y)
        }),
      )
    }
  }
  return Promise.all(defer)
}
