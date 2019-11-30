<template>
  <div
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    class="flow-diagram"
  >
    <div
      v-if="statusColorList.length >0"
      class="ibps-pl-5"
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <div slot="title">流程图图示(<span class="red">点击节点查看节点的审批历史</span>)</div>
          <el-row :gutter="5">
            <el-col
              v-for="(status,index) in statusColorList"
              :key="status.value+index"
              :span="3"
              class="ibps-ellipsis"
              style="padding-top:5px;"
            >
              <ibps-icon :style="{'color':status.color}" name="square-o" /> {{ status.value }}
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div :id="id" class="canvas" style="padding-top:20px;" />
    <!--工具栏-->
    <div v-if="toolbar" class="io-zoom-controls">
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
    <!--审批历史-->
    <approval-history-dialog
      :visible="approvalHistoryVisible"
      :task-id="taskId"
      :inst-id="instId"
      :node-id="nodeId"
      type="node"
      width="70%"
      @close="visible => approvalHistoryVisible= visible"
    />
  </div>
</template>
<script>
import { getFlowDiagram } from '@/api/platform/bpmn/bpmImage'
import ApprovalHistoryDialog from '../approval-history/dialog'

import 'bpmn-js/dist/assets/diagram-js.css'
import BpmnViewer from 'bpmn-js'
// import Diagram from 'diagram-js'

import SelectionModule from 'diagram-js/lib/features/selection' // select elements
import TouchModule from 'diagram-js/lib/navigation/touch' // touch
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll' // zoom canvas
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas' // scroll canvas
import ModelingModule from 'diagram-js/lib/features/modeling' // basic modeling (create/move/remove shapes/connections)
// import MoveModule from 'diagram-js/lib/features/move' // move shapes
import OutlineModule from 'diagram-js/lib/features/outline' // show element outlines
// import LassoToolModule from 'diagram-js/lib/features/lasso-tool' // lasso tool for element selection
import PaletteModule from 'diagram-js/lib/features/palette' // palette
// import CreateModule from 'diagram-js/lib/features/create' // create elements
import ContextPadModule from 'diagram-js/lib/features/context-pad' // context pad for elements,
import ConnectModule from 'diagram-js/lib/features/connect' // connect elements
// import RulesModule from 'diagram-js/lib/features/rules' // rules

export default {
  name: 'flow-diagram',
  components: {
    ApprovalHistoryDialog
  },
  props: {
    visible: Boolean,
    defId: String,
    taskId: String,
    instId: String,
    toolbar: {
      type: Boolean,
      default: true
    },
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
      activeNames: [],
      statusColorList: [],
      viewer: null,
      loading: false,

      approvalHistoryVisible: false,
      nodeId: ''
    }
  },
  methods: {
    getFormData() {
      this.$nextTick(() => {
        this.init()
        this.loadData()
      })
    },
    loadData() {
      let hasEvent = true
      const parms = {}
      if (this.$utils.isNotEmpty(this.defId)) {
        parms['defId'] = this.defId
        hasEvent = false
      }
      if (this.$utils.isNotEmpty(this.taskId)) {
        parms['taskId'] = this.taskId
      }
      if (this.$utils.isNotEmpty(this.instId)) {
        parms['instId'] = this.instId
      }
      this.loading = true
      getFlowDiagram(parms).then(response => {
        this.loading = false
        const data = response.data
        const xml = data.xml
        const styleMap = data.styleMap || {}
        this.statusColorList = this.$utils.isEmpty(styleMap) ? [] : data.statusColorList
        this.initStatusColorList()

        this.viewer.importXML(xml, (err) => {
          if (!err) {
            this.viewer.get('canvas').zoom('fit-viewport')
            this.handleColor(styleMap)
            if (hasEvent) {
              this.handleEventBus()
            }
          } else {
            console.log('[flow-diagram] something went wrong:', err)
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      // 当前窗口高度
      const height = this.autoHeight ? '90%' : window.innerHeight - 180
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
    initStatusColorList() {
      if (this.$utils.isEmpty(this.statusColorList)) {
        return
      }
      const id = 'ibps-flow-diagram'
      let newStyle = ''
      this.statusColorList.forEach(item => {
        newStyle += `.ibps-flow-diagram-${item.key}:not(.djs-connection) .djs-visual > :nth-child(1) {stroke: ${item.color} !important;}  `
      })

      let styleTag = document.getElementById(id)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('type', 'text/css')
        styleTag.setAttribute('id', id)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = newStyle
    },
    /**
     * 染色
     */
    handleColor(styleMap) {
      if (this.$utils.isEmpty(styleMap) || this.$utils.isEmpty(this.statusColorList)) {
        return
      }
      const canvas = this.viewer.get('canvas')
      const elementRegistry = this.viewer.get('elementRegistry')
      for (const key in styleMap) {
        if (styleMap.hasOwnProperty(key)) {
          const style = styleMap[key]
          const shape = elementRegistry.get(key)// 存在的节点才上色
          if (shape) {
            canvas.addMarker(key, 'ibps-flow-diagram-' + style.status)
          }
        }
      }
    },
    handleEventBus() {
      const eventBus = this.viewer.get('eventBus')
      // you may hook into any of the following events
      const events = [
        'element.focus',
        'element.click'
      ]
      events.forEach((event) => {
        eventBus.on(event, (e) => {
          console.info(e)
          // e.element = the model element
          // e.gfx = the graphical element
          // e.preventDefault()
          // e.stopPropagation()
          if (e.element.type !== 'bpmn:UserTask') {
            return
          }
          this.nodeId = e.element.id
          this.approvalHistoryVisible = true
          // this.$refs.historyPopover.$el.children[0].style = `top:${e.element.y + 200}px;left:${e.element.x}px;`
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

<style lang="scss">
.flow-diagram{
  .io-control {
    background: #fff;
    border-radius: 2px;
    border: solid 1px #e0e0e0;
    padding: 5px;
  }
  .io-zoom-controls {
    width: auto;
    position: absolute;
    right: 15px;
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

  .bjs-powered-by {
    display: none;
  }
// .ibps-flow-diagram-pending:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #f55353 !important;
// }
// .ibps-flow-diagram-submit:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #f89801 !important;
// }
// .ibps-flow-diagram-resubmit:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #e8d367 !important;
// }
// .ibps-flow-diagram-agree:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #58bc5b !important;
// }

// .ibps-flow-diagram-oppose:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #2886c6 !important;
// }
// .ibps-flow-diagram-reject:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #700101 !important;
// }
// .ibps-flow-diagram-rejectToStart:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #a54e4e !important;
// }
// .ibps-flow-diagram-recover:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #569296 !important;
// }

// .ibps-flow-diagram-recoverToStart:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #58a7cb !important;
// }

// .ibps-flow-diagram-sign_pass:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #6fa547 !important;
// }
// .ibps-flow-diagram-sign_no_pass:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #afab3d !important;
// }
// .ibps-flow-diagram-abandon:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #026670 !important;
// }
// .ibps-flow-diagram-manual_end:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #bc79b8 !important;
// }

// .ibps-flow-diagram-complete:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #5b6956 !important;
// }
// .ibps-flow-diagram-suspend:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #c33a1f !important;
// }

// .ibps-flow-diagram-skip:not(.djs-connection) .djs-visual > :nth-child(1) {
//   stroke: #6fa547 !important;
// }
}

</style>

