let zIndex = 1000000000
const canvasCache = {}
export default function createCtx(canvasSize: number, { left, top, id }: { left: number; top: number }): CanvasRenderingContext2D {
  const canvas = canvasCache[id]
  zIndex++
  if (canvas) {
    canvas.style = `position: absolute; top: ${top}px; left: ${left}px; z-index: 1000000000; background: #c3c3c3; z-index: ${zIndex}`
    return null
  } else {
    const canvas = document.createElement('canvas')
    canvas.classList = ['noise-canvas']
    canvas.width = canvasSize
    canvas.height = canvasSize
    // @ts-ignore
    canvas.style = `position: absolute; top: ${top}px; left: ${left}px; z-index: 1000000000; background: #c3c3c3; z-index: ${zIndex}`
    document.body.appendChild(canvas)
    canvasCache[id] = canvas
    return canvas.getContext('2d')
  }
}
