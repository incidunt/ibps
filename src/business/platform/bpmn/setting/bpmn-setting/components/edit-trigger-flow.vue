<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="edit-trigger-dialog"
    width="95%"
    top="5vh"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :rules="rules"
      :element-loading-text="$t('common.loading')"
      :model="form"
      label-width="100px"
    >
      <el-row>
        <el-col :span="11">
          <el-form-item label="触发流程" prop="trigerFlowKey">
            <bpm-def-selector
              v-model="form.trigerFlowKey"
              value-key="defKey"
              @callback="handleFlowSelectorValue"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="触发动作">
            <el-select v-model="form.action" placeholder="请选择">
              <el-option
                v-for="item in triggerOptions"
                :key="item.action"
                :label="item.actionName"
                :value="item.action"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>源数据信息</span>
              <el-button type="text" @click.native="getSrcReadData()">数据源加载</el-button>
            </div>
            <div
              v-for="(item,index) in srcReadList"
              :key="index"
              class="item"
              draggable="true"
              @dragstart="dragstart($event, item)"
              @dragend="dragend"
            >
              <span>{{ item.code }}</span>
              <span> {{ item.name }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>目标数据信息</span>
              <el-button type="text" @click.native="getDestReadData()">数据源加载</el-button>
            </div>
            <template v-if="form.bpmTrigerParamPoList && form.bpmTrigerParamPoList.length >0">
              <div
                v-for="(item,index) in form.bpmTrigerParamPoList"
                :key="index"
                @drop="drop($event,index)"
                @dragover.prevent
              >
                <el-col :span="10" class="item item-label">
                  <span>{{ item.destAttr }}</span>
                  <span> {{ item.destAttrName }}</span>
                </el-col>
                <el-col :span="14" class="item item-icon">
                  <span>{{ item.srcAttr }}</span>
                  <span> {{ item.srcAttrName }}<i v-if="item.srcAttr" class="el-icon-close" @click="handleDel(index,item)" /></span>
                </el-col>
              </div>
            </template>
            <div v-else>暂无数据</div>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getSrcRead, getDestRead } from '@/api/platform/bpmn/bpmTriggerFlow'
import bpmDefSelector from '@/business/platform/bpmn/definition/selector'
export default {
  components: {
    // draggable,
    bpmDefSelector
  },
  props: {
    title: { // 标题
      type: String,
      default: '添加流程'
    },
    data: Object,
    visible: {
      type: Boolean,
      default: false
    },
    nodeMap: Object,
    id: String,
    boData: Object
  },
  data() {
    return {
      dragData: '',
      formName: 'form',
      dialogVisible: this.visible,
      selectorValue: {},
      dialogLoading: false,
      form: {
        defId: '',
        trigerFlowKey: '',
        trigerFlowName: '',
        actionName: '同意',
        action: 'agree',
        bpmTrigerParamPoList: []
      },
      rules: {},
      triggerOptions: [{
        action: 'agree',
        actionName: '同意'
      }, {
        action: 'oppose',
        actionName: '反对'
      }, {
        action: 'reject',
        actionName: '驳回'
      }, {
        action: 'rejectToStart',
        actionName: '驳回发起人'
      }, {
        action: 'rejectToPrevious',
        actionName: '驳回上一步'
      }],
      //  {
      //   action: 'custom',
      //   actionName: '[自定义按钮]'
      // }],
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      srcReadList: []
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
    // 拖拽开始
    dragstart(event, data) {
      this.dragData = data
    },
    // 拖拽结束
    dragend(event) {
      event.dataTransfer.clearData()
    },
    // 拖拽放置事件
    drop(event, index) {
      this.form.bpmTrigerParamPoList = this.form.bpmTrigerParamPoList.map((item, ind) => {
        if (index === ind) {
          item.srcAttr = this.dragData.code
          item.srcAttrName = this.dragData.name
        }
        return item
      })
    },
    // 删除拖拽数据
    handleDel(index, item) {
      this.form.bpmTrigerParamPoList = this.form.bpmTrigerParamPoList.map((item, ind) => {
        if (index === ind) {
          item.srcAttr = ''
          item.srcAttrName = ''
        }
        return item
      })
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave() {
      if (this.$utils.isEmpty(this.form.trigerFlowKey)) {
        this.$message.closeAll()
        this.$message.error('请绑定触发流程！')
        return
      }
      if (this.form.bpmTrigerParamPoList.length === 0) {
        this.$message.closeAll()
        this.$message.error('未绑定目标数据信息！')
        return
      }
      const flag = this.form.bpmTrigerParamPoList.find((item) => {
        if (this.$utils.isNotEmpty(item.srcAttr)) {
          return item
        }
      })
      if (this.$utils.isEmpty(flag)) {
        this.$message.closeAll()
        this.$message.error('未绑定目标数据信息！')
        return
      }

      const data = this.form
      data.actionName = this.getActionName()

      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.form = JSON.parse(JSON.stringify(this.data))
      if (this.$utils.isNotEmpty(this.boData) && this.$utils.isNotEmpty(this.boData.code)) {
        this.getSrcReadData()
      }
    },
    getActionName() {
      const actionName = ''
      for (let i = 0; i < this.triggerOptions.length; i++) {
        const option = this.triggerOptions[i]
        if (option.action === this.form.action) {
          return option.actionName
        }
      }
      return actionName
    },
    // 获取源数据
    getSrcReadData() {
      getSrcRead({
        boCode: this.boData.code,
        boVersion: this.boData.version
      }).then(response => {
        this.srcReadList = this.$utils.parseData(response.data.attrs)
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取目标数据
    getDestReadData() {
      if (this.$utils.isEmpty(this.form.trigerFlowKey)) {
        this.$message.closeAll()
        this.$message.error('请选择触发流程')
        return
      }

      getDestRead({ defKey: this.form.trigerFlowKey }).then(response => {
        const attrs = this.$utils.parseData(response.data.attrs)
        if (this.$utils.isEmpty(attrs)) {
          this.$message.closeAll()
          this.$message.warning('目标数据未配置业务对象！')
          return
        }
        this.form.bpmTrigerParamPoList = attrs.map((attr) => {
          return {
            'destAttr': attr.code,
            'destAttrName': attr.name,
            'srcAttr': '',
            'srcAttrName': ''
          }
        })
      }).catch((res) => {
        console.log(res)
      })
    },
    // 处理选择器获取的数据
    handleFlowSelectorValue(data) {
      this.form.trigerFlowName = data.name
      if (this.$utils.isNotEmpty(this.form.trigerFlowKey)) {
        this.getDestReadData()
      }
    }
  }

}
</script>
<style lang='scss' >
.edit-trigger-dialog{
  .el-dialog__header{
    height: 30px;
    line-height: 30px;
    padding: 10px;
  }
  .el-dialog__body{
    padding: 10px !important;
    height: 450px;
    overflow-y: auto
  }
  .el-dialog__footer{
    border: none
  }
  .el-card{
    margin: 0 2px;
    .el-button{
      float: right;
      padding: 3px 0
    }
  }
  .item{
    height: 30px;
    border: 1px solid #ccc;
    line-height: 30px;
    margin: 4px 0;
    span{
      text-align: center;
      display: table;
      float: left;
    }
    span:nth-child(1){
      width: 35%;
      text-align: right;
    }
    span:nth-child(2){
      width: 65%;
    }
    i{
      float: right;
      line-height: 30px;
      margin-right: 5px;
      color:red;
    }
  }
  .item-label{
    border: none;
    padding-right: 8px;
     span:nth-child(1){
      width: 50%;
    }
    span:nth-child(2){
      width:50%;
     text-align: right;
    }
  }
}
</style>
