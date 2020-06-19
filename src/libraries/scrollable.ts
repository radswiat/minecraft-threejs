import $ from 'jquery'
;(function ($) {
  $.dragScroll = function (target, container, cb) {
    let clicked = false
    let clickY = 0
    let clickX = 0
    let clickTarget

    $(container).on('mousemove', function (e) {
      if (clicked) {
        console.log('top: ', $(target).position().top)
        console.log('clickY: ', clickY)
        console.log('e.clientY: ', e.clientY)
        cb(clickTarget - clickY - e.clientY)
      }
    })

    $(target).on('mousedown', function (e) {
      clicked = true
      clickY = e.clientY
      clickX = e.clientX
      clickTarget = $(target).position().top + $(target).height() / 2
    })

    $('body').on('mouseup', function (e) {
      clicked = false
    })
  }
})($)
