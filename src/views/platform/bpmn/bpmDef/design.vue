<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    fullscreen
    class="bpmn-def-design-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div slot="title" class="ibps-pl-5">
      <el-button icon="el-icon-circle-close" @click="closeDialog()">关闭</el-button>
      <template v-if="$utils.isEmpty(id)">
        <el-button type="primary" icon="ibps-icon-save" @click="handleSave(true,false)">发布</el-button>
        <el-button type="primary" icon="ibps-icon-clipboard" @click="handleSave(false,false)">保存草稿</el-button>
      </template>
      <template v-else>
        <el-button type="primary" icon="ibps-icon-save" @click="handleSave(true,false)">保存</el-button>
        <el-button type="primary" icon="ibps-icon-clipboard" @click="handleSave(true,true)">发布新版本</el-button>
      </template>
      <el-upload
        ref="upload"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleImport"
        style="display: inline-block;"
        action="http://www.bpmhome.cn/posts/"
      >
        <el-button slot="trigger" type="primary" icon="ibps-icon-import">导入BPMN</el-button>
      </el-upload>
      <el-button type="primary" icon="ibps-icon-export" @click="handleExportBPMN()">导出BPMN</el-button>
      <el-button type="primary" icon="ibps-icon-file-code-o" @click="handleExportSVG()">导出SVG</el-button>

      <span class="red">点击空白处设置流程定义</span>
    </div>
    <div
      v-if="dialogVisible"
      id="js-drop-zone"
      v-loading.fullscreen.lock="dialogLoading"
      :element-loading-text="$t('common.loading')"
      class="content with-diagram"
    >
      <div class="message intro">
        <div class="note">
          从你的桌面拖拽或
          <a id="js-create-diagram" href>新建</a>BPM 流程图.
        </div>
      </div>

      <div class="message error">
        <div class="note">
          <p>Ooops, we could not display the BPMN 2.0 diagram.</p>
          <div class="details">
            <span>Import Error Details</span>
            <pre />
          </div>
        </div>
      </div>
      <div id="js-canvas" class="canvas" />
      <!--属性面板-->
      <div class="properties-container">
        <div
          :style="{right:(propertiesVisible?'355px':'-45px')}"
          class="toggle"
          @click="handleProperties"
        >
          属性面板
        </div>
        <div
          v-show="propertiesVisible"
          id="js-properties-panel"
          class="properties-panel-parent"
        />
      </div>

      <!--工具栏-->
      <div class="io-zoom-controls">
        <ul class="io-zoom io-control io-control-list io-horizontal">
          <li>
            <button title="小地图" @click="handleMiniMap">
              <i class="ibps-icon-map-o " />
            </button>
          </li>
          <li>
            <button title="快捷键" @click="handleKeyboard">
              <i class="ibps-icon-keyboard-o " />
            </button>
          </li>
          <li class="hr">
            <button title="重置缩放" @click="handleZoomReset">
              <i class="ibps-icon-crosshairs " />
            </button>
          </li>
          <li>
            <button title="放大" @click="handleZoomIn">
              <i class="ibps-icon-plus" />
            </button>
          </li>
          <li>
            <button title="缩小" @click="handleZoomOut">
              <i class="ibps-icon-minus" />
            </button>
          </li>
        </ul>
      </div>
    </div>
    <bpmn-definition-selector-dialog
      :visible="selectorVisible"
      :multiple="false"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </el-dialog>
</template>

<script>
import { getModeler, saveModeler } from '@/api/platform/bpmn/bpmModeler'

import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'
import BpmnDefinitionSelectorDialog from '@/business/platform/bpmn/definition/dialog'
import '@/assets/fonts/bpmn.css'
import '@/assets/styles/bpmn-js/diagram-js.css'
import '@/assets/styles/bpmn-js/diagram-js-minimap.css'
import '@/assets/styles/bpmn-js/bpmn-js-properties-panel.css'
import '@/assets/styles/bpmn-js/color-picker.css'

import BpmnModeler from '@/business/platform/bpmn/bpmn-js/Modeler'
import DiagramJsOrigin from 'diagram-js-origin'// 原始坐标
import MinimapModule from 'diagram-js-minimap'// 小地图
import TranslateModule from '@/business/platform/bpmn/bpmn-js/i18n'// 国际化
import BpmnJsInColor from '@/business/platform/bpmn/bpmn-js/features/colors'// 染色

import PropertiesPanelModule from 'bpmn-js-properties-panel'// 属性面板
import PropertiesProviderModule from '@/business/platform/bpmn/bpmn-js/properties-panel/provider/camunda'
import CamundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

var ibpsBpmnDesign = window.ibpsBpmnDesign = {
  canEdit: true
}

export default {
  components: {
    BpmnDefinitionSelectorDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    typeId: String,
    title: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      minimap: false,
      propertiesVisible: true,
      bpmnModeler: null,
      selectorVisible: false,
      selectSubProcess: null
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    initUI() {
      // 当前窗口高度
      const height = window.innerHeight - 55
      this.bpmnModeler = new BpmnModeler({
        container: '#js-canvas',
        height: height,
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        keyboard: {
          bindTo: document
        },
        additionalModules: [
          TranslateModule,
          DiagramJsOrigin,
          MinimapModule,
          BpmnJsInColor,
          PropertiesPanelModule,
          PropertiesProviderModule
        ],
        moddleExtensions: {
          camunda: CamundaModdleDescriptor
        }
      })

      // check file api availability
      if (!window.FileList || !window.FileReader) {
        this.$alert('Looks like you use an older browser that does not support drag and drop. ' + 'Try using Chrome, Firefox or the Internet Explorer > 10.')
      } else {
        this.registerFileDrop(document.getElementById('js-canvas'), (xml) => {
          return this.openDiagram(xml)
        })
      }
      const container = document.getElementById('js-properties-panel')
      container.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'selectSubProcess') {
          this.selectorVisible = true
          this.selectSubProcess = e.target.parentNode.parentNode.childNodes[1].children[0]
        }
      })
    },
    registerFileDrop(container, callback) {
      const _this = this
      function handleFileSelect(e) {
        e.stopPropagation()
        e.preventDefault()
        const files = e.dataTransfer.files
        _this.handleImportFile(true, files[0], callback)
      }
      function handleDragOver(e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
      }

      container.addEventListener('dragover', handleDragOver, false)
      container.addEventListener('drop', handleFileSelect, false)
    },
    handleImportFile(isConfirm, file, callback) {
      if (!file) { return }
      if (file.name.indexOf('.bpmn') === -1) {
        this.$alert('请选择bpmn文件导入')
        return
      }
      if (isConfirm) {
        this.$confirm('是否加载导入的文件', '提示').then(() => {
          this.importFile(file, callback)
        }).catch(() => { })
      } else {
        this.importFile(file, callback)
      }
    },
    importFile(file, callback) {
      const reader = new FileReader()
      const _this = this
      reader.onload = function(e) {
        const xml = e.target.result
        if (callback) {
          callback(xml)
        } else {
          _this.openDiagram(xml)
        }
      }
      if (file) { reader.readAsText(file) }
    },
    openDiagram(xml) {
      this.bpmnModeler.importXML(xml, function(err) {
        if (err) {
          console.log('error rendering', err)
        }
      })
    },

    getBpmnXml(done) {
      let bpmnXml = ''
      this.bpmnModeler.saveXML({ format: false }, function(err, xml) {
        bpmnXml = done(err, xml)
      })
      return bpmnXml
    },
    setEncoded(name, data) {
      if (data) {
        const encodedData = encodeURIComponent(data)
        const elink = document.createElement('a')
        elink.download = name
        elink.style.display = 'none'
        elink.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      }
    },
    getNowFormatDate() {
      return fecha.formatDate('yyyyMMddHHmmss')
    },
    handleImport(file) {
      this.handleImportFile(false, file.raw)
    },
    handleExportBPMN() {
      this.getBpmnXml((err, xml) => {
        this.setEncoded('diagram-' + this.getNowFormatDate() + '.bpmn', err ? null : xml)
      })
    },
    handleExportSVG() {
      this.bpmnModeler.saveSVG((err, svg) => {
        this.setEncoded('diagram-' + this.getNowFormatDate() + '.svg', err ? null : svg)
      })
    },

    handleMiniMap() {
      if (this.minimap) {
        this.bpmnModeler.get('minimap').close()
      } else {
        this.bpmnModeler.get('minimap').open()
      }
      this.minimap = !this.minimap
    },
    // 快捷键
    handleKeyboard() {
      this.$alert(`<table>
        <tbody>
          <tr>
            <td>撤销</td>
            <td class="binding"><code>ctrl + Z</code></td>
          </tr>
          <tr>
            <td>恢复</td>
            <td class="binding"><code>ctrl + ⇧ + Z</code></td>
          </tr>
          <tr>
            <td>选择所有</td>
            <td class="binding"><code>ctrl + A</code></td>
          </tr>
          <tr>
            <td>滚动 (垂直)</td>
            <td class="binding">ctrl + Scrolling</td>
          </tr>
          <tr>
            <td>滚动 (水平)</td>
            <td class="binding">ctrl + ⇧ + Scrolling</td>
          </tr>
          <tr>
            <td>直接编辑</td>
            <td class="binding">E</td>
          </tr>
          <tr>
            <td>抓手工具</td>
            <td class="binding">H</td>
          </tr>
          <tr>
            <td>套索工具</td>
            <td class="binding">L</td>
          </tr>
          <tr>
            <td>坐标工具</td>
            <td class="binding">S</td>
          </tr>
        </tbody>
      </table>`, '快捷键', {
        dangerouslyUseHTMLString: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showConfirmButton: false
      })
    },
    handleProperties() {
      this.propertiesVisible = !this.propertiesVisible
    },
    handleZoomReset() {
      this.bpmnModeler.get('zoomScroll').reset()
    },
    handleZoomOut() {
      this.bpmnModeler.get('zoomScroll').stepZoom(-1)
    },
    handleZoomIn() {
      this.bpmnModeler.get('zoomScroll').stepZoom(1)
    },
    // 保存数据
    handleSave(isDeploy, newDeploy) {
      this.getBpmnXml((err, xml) => {
        if (err) {
          this.$alert(err)
          console.log(err.stack)
          return
        }
        if (this.$utils.isNotEmpty(this.id) && isDeploy && !newDeploy) {
          this.$confirm(`1.删除或修改节点会对结束/运行实例数据有影响，建议发布新版<br> 
          2.新增节点请及时配置新增节点数据，否则会影响运行实例及新发起的实例正常流转`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.saveData(isDeploy, newDeploy, xml)
          }).catch(() => {
          })
        } else {
          this.saveData(isDeploy, newDeploy, xml)
        }
      })
    },
    saveData(isDeploy, newDeploy, xml) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveModeler({
        deploy: isDeploy,
        newDeploy: newDeploy,
        typeId: this.typeId,
        defId: this.id,
        defXml: xml
      }).then(response => {
        loading.close()
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        loading.close()
        console.info(err)
      })
    },

    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.$nextTick(() => {
        this.initUI()
        this.initDiagramData()
      })
    },
    initDiagramData() {
      if (this.$utils.isEmpty(this.formId)) {
        ibpsBpmnDesign.canEdit = true
        this.bpmnModeler.createDiagram((err) => {
          if (err) {
            console.log('error rendering', err)
          }
        })
      } else {
        ibpsBpmnDesign.canEdit = false
        this.dialogLoading = true
        // 表单加载
        getModeler({
          defId: this.formId,
          impBpmn: 'N'
        }).then(response => {
          this.openDiagram(response.data)
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.selectorVisible = false
          this.selectSubProcess.value = data.defKey
          var e = document.createEvent('MouseEvents')
          e.initEvent('change', true, true)
          this.selectSubProcess.dispatchEvent(e)

          break
      }
    }

  }

}
</script>
<style lang="scss">
.bjs-powered-by {
  display: none;
}
.bpmn-def-design-dialog{
  .el-button+.el-button{
     margin-left: 5px;
  }
  .el-dialog__header{
    padding:5px;
    background-color: #f5f5f7;
  }
   .el-dialog__footer{
    padding: 0 ;
    border: 0;
  }
  .el-dialog__body{
    height:  calc(100vh - 45px) !important;
    padding: 0px;
  }

a:link {
  text-decoration: none;
}

.content {
  position: relative;
  width: 100%;
  height: 100%;

  > .message {
    width: 100%;
    height: 100%;
    text-align: center;
    display: table;

    font-size: 16px;
    color: #111;

    .note {
      vertical-align: middle;
      text-align: center;
      display: table-cell;
    }

    &.error {
      .details {
        max-width: 500px;
        font-size: 12px;
        margin: 20px auto;
        text-align: left;
        color: #BD2828;
      }

      pre {
        border: solid 1px #BD2828;
        background: #fefafa;
        padding: 10px;
        color: #BD2828;
      }
    }
  }
  &:not(.with-error) .error,
  &.with-error .intro,
  &.with-diagram .intro {
    display: none;
  }

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .canvas,
  .properties-panel-parent {
    display: none;
  }

  &.with-diagram {
    .canvas,
    .properties-panel-parent  {
      display: block;
    }
  }
}

.buttons {
  position: fixed;
  bottom: 20px;
  left: 20px;

  padding: 0;
  margin: 0;
  list-style: none;

  > li {
    display: inline-block;
    margin-right: 10px;

    > a {
      background: #DDD;
      border: solid 1px #666;
      display: inline-block;
      padding: 5px;
    }
  }

  a {
    opacity: 0.3;
  }

  a.active {
    opacity: 1.0;
  }
}

.properties-container{
  .toggle {
    position: absolute;
    top: 50%;
    background: #f8f8f8;
    padding: 7px 10px;
    transform: rotate(-90deg);
    white-space: nowrap;
    font-size: 13px;
    border: solid 1px #CCC;
    border-bottom: none;
    border-radius: 2px 2px 0 0;
    transform-origin: top left;
    z-index: 10;
    cursor: pointer;
    user-select: none;
  }

.properties-panel-parent {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  z-index: 10;
  border-left: 1px solid #ccc;
  overflow: auto;
  background: #fff;
  &:empty {
    display: none;
  }
  > .djs-properties-panel {
    padding-bottom: 70px;
    min-height:100%;
  }
}
}

//工具栏
  .io-zoom-controls {
    width: auto;
    position: absolute;
    bottom: 5px;
    right: 20px;
    z-index: 20;
  }
  .io-zoom-reset {
    margin-bottom: 10px;
  }
  .io-control {
    background: #fff;
    border-radius: 2px;
    border: solid 1px #e0e0e0;
    padding: 5px;
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
    font-size: 16px;
    line-height: 18px;
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
    .io-control-list.io-horizontal li.hr{
    border-left: solid 1px #eee;
    }

  .io-control-list.io-horizontal a {
    padding: 2px;
    margin: 0 5px;
  }

  .io-control-list.io-horizontal button {
    margin: 0 5px;
  }
 .binding {
    padding: 5px 10px;
    font-family: monospace;
}
}
</style>

