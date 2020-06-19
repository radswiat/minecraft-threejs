import PromiseThrottle from 'promise-throttle'

import { worldConfig } from '@game/config'

export default function throttlePromise({ paraller = 5 }: { parallel?: number } = {}) {
  return new PromiseThrottle({
    requestsPerSecond: paraller,
    promiseImplementation: Promise,
  })
}
