'use strict'

function ColorPopupProvider(popupMenu, modeling, translate, config) {
  this._popupMenu = popupMenu
  this._modeling = modeling
  this._translate = translate
  this.config = config
  this.analyticsService = config ? config.analyticsService : null

  popupMenu.registerProvider('color-picker', this)
}

ColorPopupProvider.$inject = [
  'popupMenu',
  'modeling',
  'translate',
  'config.colorMenuProvider'
]
export default ColorPopupProvider

var colors = [{
  fill: void 0,
  stroke: void 0,
  label: 'None'
}, {
  fill: '#BBDEFB',
  stroke: '#1E88E5',
  label: 'Blue'
}, {
  fill: '#FFE0B2',
  stroke: '#FB8C00',
  label: 'Orange'
}, {
  fill: '#C8E6C9',
  stroke: '#43A047',
  label: 'Green'
}, {
  fill: '#FFCDD2',
  stroke: '#E53935',
  label: 'Red'
}, {
  fill: '#E1BEE7',
  stroke: '#8E24AA',
  label: 'Purple'
}]

ColorPopupProvider.prototype.getEntries = function(element) {
  return []
}

ColorPopupProvider.prototype.getHeaderEntries = function(element) {
  var modeling = this._modeling
  var translate = this._translate
  // var analyticsService = this.analyticsService
  return colors.map(function(color) {
    return {
      id: 'colorize-' + color.label.toLowerCase(),
      title: translate(color.label),
      className: 'bjs-color-menu-entry',
      action: function() {
        modeling.setColor(element, {
          fill: color.fill,
          stroke: color.stroke
        })

        // analyticsService.pushEvent({
        //   category: 'DIAGRAMS',
        //   action: 'DIAGRAM_COLOR'
        // })
      }
    }
  })
}
