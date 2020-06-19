export default function createCtx(canvasSize: number, { left, top }: { left: number; top: number }): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas')
  canvas.id = 'noise-canvas'
  canvas.width = canvasSize
  canvas.height = canvasSize
  // @ts-ignore
  canvas.style = `position: absolute; top: ${top}px; left: ${left}px; z-index: 1000000000; background: #c3c3c3;`
  document.body.appendChild(canvas)
  return canvas.getContext('2d')
}
