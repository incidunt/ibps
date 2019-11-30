<template>
  <div class="bpm-setting-flow-diagram">
    <div :id="id" class="canvas" style="height:100%;padding-top:20px;" />
    <!--工具栏-->
    <div class="io-zoom-controls">
      <ul class="io-zoom-reset io-control io-control-list">
        <li>
          <button title="reset zoom" @click="zoomReset">
            <i class="ibps-icon ibps-icon-crosshairs" />
          </button>
        </li>
      </ul>
      <ul class="io-zoom io-control io-control-list">
        <li>
          <button title="zoom in" @click="zoomIn">
            <i class="ibps-icon ibps-icon-plus" />
          </button>
        </li>
        <li>
          <hr>
        </li>
        <li>
          <button href title="zoom out" @click="zoomOut">
            <i class="ibps-icon ibps-icon-minus" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getFlowDiagram } from '@/api/platform/bpmn/bpmImage'

import 'bpmn-js/dist/assets/diagram-js.css'
import BpmnViewer from 'bpmn-js'
// import Diagram from 'diagram-js'

import SelectionModule from 'diagram-js/lib/features/selection' // select elements
import TouchModule from 'diagram-js/lib/navigation/touch' // touch
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll' // zoom canvas
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas' // scroll canvas
import ModelingModule from 'diagram-js/lib/features/modeling' // basic modeling (create/move/remove shapes/connections)
import OutlineModule from 'diagram-js/lib/features/outline' // show element outlines
import PaletteModule from 'diagram-js/lib/features/palette' // palette
import ContextPadModule from 'diagram-js/lib/features/context-pad' // context pad for elements,
import ConnectModule from 'diagram-js/lib/features/connect' // connect elements

export default {
  props: {
    height: Number,
    width: Number,
    autoHeight: Boolean,
    id: {
      type: String,
      default: function() { // 随机个id避免一个页面多个流程图
        return 'ibps-flow-diagram' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    }
  },
  data() {
    return {
      viewer: null
    }
  },
  created() {
    this.$nextTick(() => {
      this.initUI()
    })
  },
  methods: {
    initUI() {
      // 当前窗口高度
      const height = this.autoHeight ? '90%' : window.innerHeight - 100
      this.viewer = new BpmnViewer({
        container: '#' + this.id,
        height: height,
        additionalModules: [
          SelectionModule,
          ZoomScrollModule,
          MoveCanvasModule,
          ModelingModule,
          // MoveModule,
          OutlineModule,
          // LassoToolModule,
          PaletteModule,
          // CreateModule,
          ContextPadModule,
          ConnectModule,
          // RulesModule,
          TouchModule
        ]
      })
    },
    loadFlowDiagram(defId) {
      this.$emit('loading', true)
      getFlowDiagram({
        defId: defId
      }).then(response => {
        this.$emit('loading', false)
        const data = response.data
        this.viewer.importXML(data.xml, (err) => {
          if (!err) {
            this.viewer.get('canvas').zoom('fit-viewport')
            this.handleEventBus()
          } else {
            console.log('[flow-diagram] something went wrong:', err)
          }
        })
      }).catch(() => {
        this.$emit('loading', false)
      })
    },

    handleEventBus() {
      const eventBus = this.viewer.get('eventBus')
      // you may hook into any of the following events
      const events = [
        'element.click',
        'element.dblclick'
      ]
      events.forEach((event) => {
        eventBus.on(event, (e) => {
          const el = e.element
          let nodeType = 'global'
          const type = el.type
          if (type.includes('StartEvent')) { // 开始事件
            nodeType = 'start'
          } else if (type.includes('EndEvent')) { // 结束事件
            nodeType = 'end'
          } else if (type.includes('UserTask')) { // 用户任务
            if (el.businessObject && el.businessObject.loopCharacteristics) {
              nodeType = 'signTask' // 会签任务
            } else {
              nodeType = 'userTask'
            }
          } else if (type.includes('ReceiveTask')) { // 消息任务
            nodeType = 'receiveTask'
          } else if (type.includes('ServiceTask')) { // 服务任务
            nodeType = 'serviceTask'
          } else if (type.includes('ScriptTask')) { // 脚本任务
            nodeType = 'scriptTask'
          } else if (type.includes('CallActivity')) { // 外部子流程
            nodeType = 'callActivity'
          } else if (type.includes('SubProcess')) { // 内部子流程
            nodeType = 'subProcess'
          } else if (type.includes('ExclusiveGateway')) { // 分支网关
            nodeType = 'exclusiveGateway'
          } else if (type.includes('InclusiveGateway')) { // 分支同步网关
            nodeType = 'inclusiveGateway'
          }
          const loading = this.$loading()
          setTimeout(() => {
            this.$emit('on-node', {
              nodeType,
              nodeId: el ? el.id : '',
              nodeName: el ? el.businessObject.name : ''
            })
            loading.close()
          }, 300)
        })
      })
    },
    zoomReset() {
      this.viewer.get('zoomScroll').reset()
    },
    zoomOut() {
      this.viewer.get('zoomScroll').stepZoom(-1)
    },
    zoomIn() {
      this.viewer.get('zoomScroll').stepZoom(1)
    }
  }
}
</script>
<style>
.bjs-powered-by {
  display: none;
}
</style>

<style lang="scss" scoped>
.bpm-setting-flow-diagram {
  .io-control {
    background: #fff;
    border-radius: 2px;
    border: solid 1px #e0e0e0;
    padding: 5px;
  }
  .io-zoom-controls {
    width: auto;
    position: absolfixedute;
    left: 15px;
    bottom: 90px;
  }
  .io-zoom-reset {
    margin-bottom: 10px;
  }

  .io-control-list {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  .io-control-list a,
  .io-control-list a:visited,
  .io-control-list button {
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 26px;
    color: #555555;
    background: none;
    border: none;
  }

  .io-control-list a:hover,
  .io-control-list a:visited:hover,
  .io-control-list button:hover {
    color: #333333;
  }

  .io-control-list a.inactive,
  .io-control-list a:visited.inactive,
  .io-control-list button.inactive {
    color: #e0e0e0;
    cursor: default;
  }

  .io-control-list.io-horizontal,
  .io-control-list.io-horizontal li {
    display: inline-block;
  }

  .io-control-list.io-horizontal a {
    padding: 2px;
    margin: 0 5px;
  }

  .io-control-list.io-horizontal button {
    margin: 0 5px;
  }

  .io-control hr {
    border: none;
    border-top: solid 1px #eee;
  }
}
</style>

