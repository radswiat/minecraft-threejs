import $ from 'jquery'
import '@libraries/scrollable'

let hasBeenCreated = false
let currentLayer: number = null
export default function createScroller(initialLayer: number, range, cb: Function): void {
  currentLayer = initialLayer
  if (hasBeenCreated) return

  const height = 300

  const rangeValue = Math.abs(range[0] - range[1]) + 1

  const scrollContainer = $('<div id="scroller-container" />')
  scrollContainer.css({ position: 'absolute', top: 0, left: '300px', width: '10px', height: `${height}px`, background: 'red' })

  const scrollRails = $('<div id="scroller-rails" />')
  scrollRails.css({ position: 'relative', width: '100%', height: '100%', background: 'gray' })

  const scroll = $('<div id="scroller-scroll" />')
  scroll.css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '10px',
    height: `${height / rangeValue}`,
    background: 'yellow',
    cursor: 'pointer',
  })

  $.dragScroll(scroll, scrollRails, (scrollPositionY: number) => {
    scroll.css({ top: `${Math.abs(scrollPositionY)}px` })
    const percScrollPosition = Math.abs((scrollPositionY * 100) / height)
    const layer = Math.round((rangeValue * percScrollPosition) / 100) - range[1]
    console.log(`layer: ${layer}`)
    cb(layer)
  })

  $('body').append(scrollContainer)
  scrollContainer.append(scrollRails)
  scrollRails.append(scroll)

  hasBeenCreated = true
  cb(currentLayer)
}
