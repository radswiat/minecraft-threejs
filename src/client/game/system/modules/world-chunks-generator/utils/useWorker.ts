// @ts-nocheck
export default function useWorker<T>(Worker, opts, cb?): Promise<T> {
  return new Promise((resolve) => {
    const worker = new Worker()
    worker.postMessage(opts)
    worker.onmessage = ({ data }: { data: T }) => {
      if (data.done) {
        const { data: _data, ...others } = data
        resolve({
          data: JSON.parse(_data),
          ...others,
        })
      } else {
        if (typeof cb === 'function') {
          cb(data)
        }
      }
    }
  })
}
