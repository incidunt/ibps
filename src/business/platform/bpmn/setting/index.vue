<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="bpm-def-setting-dialog"
    fullscreen
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <div slot="title" style="padding-left: 10px;">
      <el-button icon="el-icon-circle-close" @click="closeDialog()">关闭</el-button>
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
    </div>
    <ibps-layout
      v-if="dialogVisible"
      ref="layout"
      v-loading.fullscreen.lock="dialogLoading"
      :element-loading-text="$t('common.loading')"
      class="ibps-bpm-layout"
    >
      <el-alert
        type="warning"
      >
        <i class="ibps-icon-lightbulb-o" />点击空白处进行全局配置，点击对应的节点进行节点配置
        <el-button type="primary" plain icon="ibps-icon-file-code-o" size="mini" @click="onXmlClick('bpmn')">BPMNXML</el-button>
        <el-button type="primary" plain icon="ibps-icon-file-code-o" size="mini" @click="onXmlClick('design')">DesignXML</el-button>
      </el-alert>
      <bpmn-image
        ref="bpmnImage"
        @loading="loading=>dialogLoading =loading"
        @on-node="onNode"
      />
      <div slot="east">
        <bpmn-setting
          v-if="formData"
          :data="formData"
          :node-id="nodeId"
          :node-type="nodeType"
          :def-id="defId"
          :def-key="defKey"
        />
      </div>
    </ibps-layout>
  </el-dialog>
</template>

<script>
import { saveSetting, setting, getXml } from '@/api/platform/bpmn/bpmDefinition'
import { mapActions } from 'vuex'
import ActionUtils from '@/utils/action'
import BpmnImage from './bpmn-image'
import BpmnSetting from './bpmn-setting'
import { getToken } from '@/utils/auth'

export default {
  name: 'bpm-definition-setting',
  components: {
    BpmnImage,
    BpmnSetting
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defId: {
      type: String
    },
    defKey: {
      type: String
    },
    data: {
      type: Object
    },
    title: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      nodeType: 'global',
      nodeId: '',
      formData: {}
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
    ...mapActions({
      setMessageTypes: 'ibps/bpmn/setMessageTypes',
      setNodeList: 'ibps/bpmn/setNodeList',
      setCurNode: 'ibps/bpmn/setCurNode',
      setDefId: 'ibps/bpmn/setDefId'
    }),
    onNode(node) {
      this.nodeType = node.nodeType
      this.nodeId = node.nodeId
      // TODO: 滚动到表头
      window.scrollTo(0, 0)
      this.setCurNode(node)
    },
    onXmlClick(type) {
      const defId = this.defId
      const access_token = getToken()
      this.$utils.open(getXml({ defId, type, access_token }))
    },
    // 保存数据
    handleSave() {
      this.saveData()
    },
    // 提交保存数据
    saveData() {
      console.info(this.formData)
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveSetting({
        data: JSON.stringify(this.formData),
        defId: this.defId
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
        console.warn(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },

    // 获取表单数据
    getFormData() {
      this.nodeType = 'global'
      this.nodeId = ''
      this.dialogLoading = true
      if (this.$utils.isNotEmpty(this.data)) {
        this.formData = JSON.parse(JSON.stringify(this.data))
        this.initParameters()
        return
      }
      setting({
        defId: this.defId,
        defKey: this.defKey
      }).then(response => {
        this.dialogLoading = false
        const responseData = response.data
        this.formData = this.$utils.parseData(responseData.data)

        this.initParameters({
          messageTypes: this.$utils.parseData(responseData.messageTypes)
        })
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    initParameters(parms = {}) {
      console.info(this.formData)
      this.loadFlowDiagram(this.defId)
      this.setDefId(this.defId)
      this.setNodeList(this.handlerNodeList(this.formData.nodes))
      if (this.$utils.isNotEmpty(parms.messageTypes)) {
        this.setMessageTypes(parms.messageTypes)
      } else {
        this.loadMessageTypes()
      }
    },
    loadFlowDiagram(defId) {
      this.$refs.bpmnImage.loadFlowDiagram(defId)
    },
    handlerNodeList(nodes) {
      if (this.$utils.isEmpty(nodes)) {
        return []
      }
      const nodeList = []
      nodes.forEach(node => {
        nodeList.push({
          value: node.id,
          label: node.node_name,
          nodeType: node.node_type
        })
      })
      return nodeList
    },
    loadMessageTypes() {
      // TODO: 消息类型
      this.setMessageTypes()
    }

  }

}
</script>
<style lang="scss">
  .bpm-def-setting-dialog{
    .el-dialog__body{
    overflow: hidden;
    }
    .el-dialog__body{
      padding: 0;
    }
   .el-dialog__header {
      width: '100%-500px';
      padding: 5px;
      background-color: #f5f5f7;
    }
  }
</style>
