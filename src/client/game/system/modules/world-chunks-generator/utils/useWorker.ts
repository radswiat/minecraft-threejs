export default function useWorker<T>(Worker, opts, cb?): Promise<T> {
  return new Promise((resolve) => {
    const worker = new Worker()
    worker.postMessage(opts)
    worker.onmessage = ({ data }: { data: T }) => {
      if (data.done) {
        resolve(JSON.parse(data.data))
      } else {
        if (typeof cb === 'function') {
          cb(data)
        }
      }
    }
  })
}
