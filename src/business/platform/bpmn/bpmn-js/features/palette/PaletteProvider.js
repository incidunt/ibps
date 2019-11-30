import {
  assign
} from 'min-dash'

/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider(
  palette, create, elementFactory,
  spaceTool, lassoTool, handTool,
  globalConnect, translate) {
  this._palette = palette
  this._create = create
  this._elementFactory = elementFactory
  this._spaceTool = spaceTool
  this._lassoTool = lassoTool
  this._handTool = handTool
  this._globalConnect = globalConnect
  this._translate = translate

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
]

PaletteProvider.prototype.getPaletteEntries = function(element) {
  var actions = {}
  var create = this._create
  var elementFactory = this._elementFactory
  var spaceTool = this._spaceTool
  var lassoTool = this._lassoTool
  var handTool = this._handTool
  var globalConnect = this._globalConnect
  var translate = this._translate

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options))

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded
      }

      create.start(event, shape)
    }

    var shortType = type.replace(/^bpmn:/, '')

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    }
  }

  function createParticipant(event, collapsed) {
    create.start(event, elementFactory.createParticipantShape(collapsed))
  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event)
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event)
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function(event) {
          spaceTool.activateSelection(event)
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('Activate the global connect tool'),
      action: {
        click: function(event) {
          globalConnect.toggle(event)
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    // ======事件====
    // 开始
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
    ),
    // 结束
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none'
    ),
    'event-separator': {
      group: 'event',
      separator: true
    },
    // ======任务====
    'create.user-task': createAction(
      'bpmn:UserTask', 'activity', 'bpmn-icon-user-task'
    ),
    'create.receive-task': createAction(
      'bpmn:ReceiveTask', 'activity', 'bpmn-icon-receive-task'
    ),
    'create.service-task': createAction(
      'bpmn:ServiceTask', 'activity', 'bpmn-icon-service-task'
    ),
    'create.script-task': createAction(
      'bpmn:ScriptTask', 'activity', 'bpmn-icon-script-task'
    ),
    'create.call-activity': createAction(
      'bpmn:CallActivity', 'activity', 'bpmn-icon-subprocess-collapsed'
    ),

    'create.subprocess-expanded': createAction(
      'bpmn:SubProcess', 'activity', 'bpmn-icon-subprocess-expanded', translate('Create expanded SubProcess'),
      { isExpanded: true }
    ),
    'activity-separator': {
      group: 'activity',
      separator: true
    },
    // ======网关====
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
    ),
    'create.parallel-gateway': createAction(
      'bpmn:ParallelGateway', 'gateway', 'bpmn-icon-gateway-parallel'
    ),
    'create.inclusive-gateway': createAction(
      'bpmn:InclusiveGateway', 'gateway', 'bpmn-icon-gateway-or'
    ),
    'gateway-separator': {
      group: 'gateway',
      separator: true
    },
    // ======泳道====
    'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: translate('Create Pool/Participant'),
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    }
  })

  return actions
}
