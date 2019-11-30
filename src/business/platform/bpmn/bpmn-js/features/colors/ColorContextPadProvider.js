'use strict'
import {
  assign
} from 'min-dash'

function ColorContextPadProvider(contextPad, popupMenu, canvas, translate) {
  this._contextPad = contextPad
  this._popupMenu = popupMenu
  this._canvas = canvas
  this._translate = translate

  contextPad.registerProvider(this)
}

ColorContextPadProvider.$inject = [
  'contextPad',
  'popupMenu',
  'canvas',
  'translate'
]
export default ColorContextPadProvider

ColorContextPadProvider.prototype.getContextPadEntries = function(element) {
  var contextPad = this._contextPad
  var popupMenu = this._popupMenu
  var canvas = this._canvas
  var translate = this._translate

  var actions = {
    'colorize': {
      group: 'edit',
      className: 'bpmn-icon-colorize',
      title: translate('Colorize'),
      action: {
        click: function(event, element) {
          // get start popup draw start position
          var position = assign(getStartPosition(canvas, contextPad, element), {
            cursor: { x: event.x, y: event.y }
          })

          // open color picker submenu popup
          popupMenu.open(element, 'color-picker', position)
        }
      }
    }
  }

  return actions
}

// helpers //////////////////////
// 位置
function getStartPosition(canvas, contextPad, element) {
  var Y_OFFSET = 5

  var diagramContainer = canvas.getContainer()

  var pad = contextPad.getPad(element).html

  var diagramRect = diagramContainer.getBoundingClientRect()

  var padRect = pad.getBoundingClientRect()

  var top = padRect.top - diagramRect.top
  var left = padRect.left - diagramRect.left

  var pos = {
    x: left,
    y: top + padRect.height + Y_OFFSET
  }

  return pos
}
