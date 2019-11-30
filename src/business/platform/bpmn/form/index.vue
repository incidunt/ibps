<template>
  <div
    v-loading.fullscreen.lock="loading"
    :element-loading-text="$t('common.loading')"
  >
    <template v-if="formModel.type === 'INNER'">
      <!---在线表单--->
      <formrender
        v-if="formDef"
        ref="formrender"
        :form-def="formDef"
        :buttons="buttons"
        :data="formData"
        :params="formParams"
        :readonly="readonly"
        @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
        @callback="callback"
        @close="closeDialog"
      />
    </template>
    <!---内嵌url表单,外部url表单---->
    <template
      v-else-if="formModel.type === 'URL_LOAD'|| formModel.type === 'FRAME'"
    >
      <form-toolbar
        v-if="formModel.type === 'URL_LOAD'"
        :buttons="buttons"
        @validate="validateForm"
        @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
        @callback="callback"
        @close="closeDialog"
      />
      <!--url表单 iframe方式-->
      <iframe
        v-if="formUrlType === 'iframe'"
        ref="formrender"
        :class="formModel.type === 'URL_LOAD'?'ibps-container-url-frame':'ibps-container-frame'"
        frameborder="0"
      />
      <!--url表单 vue组件方式-->
      <component
        :is="formUrlName"
        v-else
        ref="formrender"
        :params="formParams"
        :readonly="readonly"
      />
    </template>
    <!--流程图-->
    <flow-diagram-dialog
      :visible="flowDiagramVisible"
      :def-id="defId"
      :task-id="taskId"
      :inst-id="instanceId"
      @close="visible => flowDiagramVisible= visible"
    />
    <!--流程历史-->
    <approval-history-dialog
      :visible="approvalHistoryVisible"
      :task-id="taskId"
      :inst-id="instanceId"
      @close="visible => approvalHistoryVisible= visible"
    />
    <!--流程实例-->
    <instance-detail
      :visible="instanceDetailVisible"
      :bpmn-inst-id="instanceId"
      @close="visible => instanceDetailVisible= visible"
    />

    <!--启动流程-->
    <start-flow-dialog
      :visible="startFlowDialogVisible"
      :def-id="defId"
      :data="submitFormData"
      @close="visible => startFlowDialogVisible= visible"
      @action-event="saveStartFlow"
    />

    <!--同意-->
    <agree-dialog
      :visible="agreeDialogVisible"
      :action="actionName"
      :task-id="taskId"
      :version="version"
      :is-common="attributes.isCommonJumpType"
      :hide-opinion="isBpmOpinionHide"
      :hide-path="attributes.isHidePath"
      @close="visible => agreeDialogVisible= visible"
      @action-event="handleActionEvent"
    />

    <!--驳回-->
    <reject-dialog
      :visible="rejectDialogVisible"
      :action="actionName"
      :task-id="taskId"
      @close="visible => rejectDialogVisible= visible"
      @action-event="handleActionEvent"
    />
    <!--终止流程-->
    <approve-dialog
      :visible="approveDialogVisible"
      :action="actionName"
      :task-id="taskId"
      @close="visible => approveDialogVisible= visible"
      @action-event="handleActionEvent"
    />
    <!--转办-->
    <delegate-dialog
      :id="taskChangeId"
      :visible="delegateDialogVisible"
      :action="actionName"
      :task-id="taskId"
      :readonly="delegateReadonly"
      title="任务转办"
      @close="visible => delegateDialogVisible= visible"
      @callback="callback"
    />
    <add-sign-task-dialog
      :visible="addSignTaskDialogVisible"
      :action="actionName"
      :task-id="taskId"
      title="任务补签"
      @close="visible => addSignTaskDialogVisible= visible"
      @action-event="handleActionEvent"
      @callback="callback"
    />
  </div>
</template>
<script>
import { getFormData, getInstFormData } from '@/api/platform/bpmn/bpmInst'
import { getTaskFormData } from '@/api/platform/bpmn/bpmTask'
import FormUtil from '@/business/platform/form/utils/formUtil'
import ActionMixin from './action'
import BpmnButton from './button'

import Formrender from '@/business/platform/form/formrender/index.vue'
import FormToolbar from '@/business/platform/form/formrender/toolbar.vue'

import FlowDiagramDialog from '@/business/platform/bpmn/components/flow-diagram/dialog'
import ApprovalHistoryDialog from '@/business/platform/bpmn/components/approval-history/dialog'
import InstanceDetail from '@/views/platform/bpmn/bpmInst/detail'

import StartFlowDialog from '@/business/platform/bpmn/form-ext/start-flow'
import AgreeDialog from '@/business/platform/bpmn/form-ext/agree'
import RejectDialog from '@/business/platform/bpmn/form-ext/reject'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'
import DelegateDialog from '@/business/platform/bpmn/task-change/edit'
import AddSignTaskDialog from '@/business/platform/bpmn/form-ext/add-sign-task'

const _import = require('@/router/_import_' + process.env.NODE_ENV)

export default {
  components: {
    Formrender,
    FormToolbar,
    FlowDiagramDialog,
    ApprovalHistoryDialog,
    InstanceDetail,
    StartFlowDialog,
    AgreeDialog,
    RejectDialog,
    ApproveDialog,
    DelegateDialog,
    AddSignTaskDialog
  },
  mixins: [
    ActionMixin
  ],
  props: {
    defId: {// 流程定义ID
      type: String
    },
    proInstId: {// 草稿流程实例ID
      type: String
    },
    instanceId: {// 流程实例ID
      type: String
    },
    taskId: {// 流程任务ID
      type: String
    },
    taskChangeId: {// 转办代理任务ID
      type: String
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      flowDiagramVisible: false,
      approvalHistoryVisible: false,
      instanceDetailVisible: false,
      startFlowDialogVisible: false,
      agreeDialogVisible: false, // 同意
      rejectDialogVisible: false,
      delegateDialogVisible: false,
      addSignTaskDialogVisible: false,
      approveDialogVisible: false,

      delegateReadonly: false,

      actionName: '',
      version: '',
      // ========表单的数据=======
      loading: false,
      formUrlName: '',
      formUrlType: 'inner', // 内嵌url方式：inner： vue组件方式，iframe：iframe方式

      formModel: {
        type: 'INNER'
      },
      formDef: null,
      buttons: [],
      formData: {},
      attributes: {}, // 新增扩展属性
      formParams: {}, // 表单流程扩展参数
      isBpmOpinionHide: false,
      readonly: false,

      submitFormData: {}
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
    // 获取数据
    loadFormData() {
      this.loading = true
      this.formDef = null
      this.buttons = null
      this.formData = null
      this.$nextTick(() => {
        this.readonly = false
        if (this.$utils.isNotEmpty(this.taskId)) { // 处理流程任务
          this.getTaskFormData()
        } else if (this.$utils.isNotEmpty(this.defId)) { // 启动 或者草稿流程启动
          this.getDefinitionFormData()
        } else if (this.$utils.isNotEmpty(this.instanceId)) { // 流程实例
          this.getInstanceFormData()
        } else {
          this.loading = false
        }
      })
    },

    /**
     * 启动 或者草稿流程
     */
    getDefinitionFormData() {
      this.formParams.defId = this.defId
      this.formParams.proInstId = this.proInstId || null
      getFormData({
        defId: this.defId,
        proInstId: this.proInstId || null
      }).then(response => {
        this.loading = false
        this.buildFormData(response.data)
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取流程任务表单
     */
    getTaskFormData() {
      this.loading = true
      this.formParams.taskId = this.taskId || null
      getTaskFormData({
        taskId: this.taskId
      }).then(response => {
        this.loading = false
        this.buildFormData(response.data)
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 流程实例 的表单数据
     */
    getInstanceFormData() {
      this.readonly = true
      this.formParams.instanceId = this.instanceId || null
      getInstFormData({
        instId: this.instanceId
      }).then(response => {
        this.loading = false
        this.buildFormData(response.data)
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 构建表单相关数据
     */
    buildFormData(data) {
      if (this.$utils.isEmpty(data)) {
        this.$alert(`未获取到数据`).then(() => {
          this.closeDialog()
        })
        return
      }
      const formModel = data.formModel
      this.formUrlType = 'inner'

      // 判断是否设置表单
      if (this.$utils.isEmpty(formModel)) {
        this.$alert(`未设置表单,请流程定义中设置表单`).then(() => {
          this.closeDialog()
        })
        return
      }
      this.formModel = formModel
      // ============在线表单 ================
      if (formModel.type === 'INNER') {
        if (this.$utils.isEmpty(formModel.formData)) {
          this.$alert(`未设置在线表单`).then(() => {
            this.closeDialog()
          })
        }

        // 表单定义
        this.formDef = this.$utils.parseData(formModel.formData) || {}

        this.formData = {
        // 表单数据
          responses: this.$utils.parseData(data.boData) || {},
          // 表单权限
          permissions: this.$utils.parseData(data.permissions) || {}
        }
        // 一些参数
        this.attributes = this.initAttributes(data)
        // 操作按钮
        this.buttons = this.buildButtons(data.buttons, this.attributes) || []
        // 表单意见
        this.formParams.formOpinionData = FormUtil.initFormOpinionData(data.attributes || {})
        // 表单意见是否隐藏意见
        this.$nextTick(() => {
          this.isBpmOpinionHide = this.handleBpmOpinionHide(data.attributes || {})
        })
        // 流程关联信息
        this.formParams.bpmLinkData = FormUtil.getBpmLinkData(data.attributes || {})
        // 版本号
        this.version = data.version

      //  ============内嵌表单[按钮这边提供] ================
      } else if (formModel.type === 'URL_LOAD') {
        const urlForm = !this.readonly ? formModel.formValue : formModel.editUrl
        if (this.$utils.isEmpty(urlForm)) {
          this.$alert(`未设置内嵌表单`).then(() => {
            this.closeDialog()
          })
        }
        // 一些参数
        this.attributes = this.initAttributes(data)
        // 操作按钮
        this.buttons = this.buildButtons(data.buttons, this.attributes) || []
        // 初始化url表单
        this.initUrlForm(urlForm)
      //  ============外部表单【iframe】 ================
      } else if (formModel.type === 'FRAME') {
        const urlForm = formModel.formValue
        if (this.$utils.isEmpty(urlForm)) {
          this.$alert(`未设置外部表单`).then(() => {
            this.closeDialog()
          })
        }
        // 初始化url表单
        this.initUrlForm(urlForm)
      }
    },
    // 初始化url表单
    initUrlForm(urlForm) {
      if (urlForm.startsWith('http')) {
        this.formUrlType = 'iframe'
        this.$nextTick(() => {
          this.$refs.formrender.src = urlForm
          // 传递消息
          this.$refs.formrender.contentWindow.postMessage({ data: this.attributes }, '*')
        })
      } else {
        this.formUrlType = 'inner'
        const formUrlName = 'IbpsBpmnFormUrl'
        this.$options.components[formUrlName] = _import(urlForm)
        this.formUrlName = formUrlName
      }
    },
    initAttributes(data) {
      const attributes = data.attributes || {}
      return {
        title: this.title,
        defId: this.defId,
        proInstId: this.proInstId,
        taskId: this.taskId,
        nodeId: attributes.nodeId,
        lockUser: attributes.lockUser,
        curUserId: attributes.curUserId,
        suspendState: attributes.suspendState,
        // 是否转办
        isHiddenDelegate: this.toBoolean(attributes.isHiddenDelegate),
        // 是否正常跳转
        isCommonJumpType: this.toBoolean(attributes.isCommonJumpType),
        // 是否隐藏意见
        isHideOpinion: this.toBoolean(attributes.isHideOpinion),
        // 是否隐藏路径
        isHidePath: this.toBoolean(attributes.isHidePath),
        // 是否结束
        isEnd: this.toBoolean(attributes.isEnd),
        // 第一个节点是否选择
        firstNodeUserAssign: attributes.firstNodeUserAssign,
        // 打印模版
        printTemplateId: data.formModel.templateId,
        // BO版本号
        version: data.version
      }
    },
    toBoolean: function(val) {
      return val && (val === true || val === 'true')
    },
    handleBpmOpinionHide(attributes = {}) {
      const formOpinionSetting = attributes.formOpinionSetting
      const nodeId = attributes.nodeId

      if (this.$utils.isNotEmpty(formOpinionSetting)) {
        for (const o in formOpinionSetting) {
          if (o === nodeId) {
            return formOpinionSetting[o] != null && formOpinionSetting[o] === true
          }
        }
      }
      if (this.hasFormOpinion()) {
        return true
      }
      // 是否有表单意见
      return this.attributes.isHideOpinion || false
    },
    /**
     * 构建操作按钮
     */
    buildButtons(buttons, params) {
      if (this.$utils.isEmpty(buttons)) {
        buttons = []
      }
      // 如果转办，代理不为空
      if (this.$utils.isNotEmpty(this.taskChangeId)) {
        buttons.unshift({
          alias: 'delegateDetail',
          name: '转办/代理明细'
        })
      }
      if (this.closeable) {
        buttons.unshift({
          alias: 'close'
        })
      }

      const btn = new BpmnButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    },
    getFormEL() {
      if (this.formUrlType === 'inner') {
        return this.$refs.formrender
      } else {
        try {
          // TODO: 跨域获取表单数据
          return this.$refs.formrender.contentWindow.ibpsFormUrl
        } catch (error) {
          return
        }
      }
    },
    // 获取表单数据
    getFormData() {
      if (!(this.getFormEL() && this.getFormEL().getFormData)) {
        this.$message({
          message: 'URL表单必须包含获取表单数据的方法【getFormData】',
          type: 'warning'
        })
        return
      }
      return this.getFormEL().getFormData()
    },
    // 是否有审批意见字段
    hasFormOpinion() {
      return this.getFormEL() ? this.getFormEL().hasFormOpinion() || false : false
    },
    // 获取表单意见数据
    getFormOpinionData() {
      return this.getFormEL().getFormOpinionData()
    },
    // 后置事件
    afterScript(key) {
      if (this.getFormEL() && this.getFormEL().afterScript) {
        return this.getFormEL().afterScript(key)
      }
    },
    callback() {
      this.closeDialog()
      this.$emit('callback', true)
    },
    // 关闭当前窗口
    closeDialog() {
      if (this.closeable) {
        this.$emit('close', false)
      }
    },
    // 验证表单if()
    validateForm(callback) {
      if (!(this.getFormEL() && this.getFormEL().validate)) {
        callback(true)
        return
      }
      this.getFormEL().validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ibps-container-frame {
      position: absolute;
      top: 0px;
      left: 0px;
      height: 100%;
      width: 100%;
  }
  .ibps-container-url-frame{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: calc(100vh - 50px) !important;
    margin-top: 50px;
  }
</style>

