<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="repliy-dialog"
    width="65%"
    top="0"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="主题：">
            <span>{{ form.subject }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发送时间：">
            <span>{{ form.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发送人：">
            <span>{{ form.ownerName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="回复内容：">
            <ibps-ueditor v-model="reply.content" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="原消息内容：">
            <span>{{ form.content }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件:">
            <img :src="fileSrc" style="width:40px;height:30px;cursor:pointer">
            <label style="position:relative;top:-7px;cursor:pointer">{{ fileTile }}</label>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="list">
            <repli-list :id="formId" />
          </el-form-item>
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
import { get, saveReply } from '@/api/platform/message/innerMessage'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'
import IbpsUeditor from '@/components/ibps-ueditor'
import repliList from './detail/reply-list'

export default {
  components: {
    IbpsUeditor,
    repliList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      form: {},
      reply: {
        msgId: '',
        content: '',
        fileMsg: [],
        editorValue: ''
      },
      fileSrc: '',
      fileTile: '',
      toolbars: [
        { key: 'save', label: '回复' },
        { key: 'cancel' }
      ]
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
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 提交回复数据
    handleSave() {
      // MOCK参数回传处理，不是最终确定方案，待接口完成后再进行调整。
      this.reply.fileMsg.splice(0, 0, this.form.fileMsg)
      // this.reply.fileMsg = this.form.fileMsg
      this.reply.editorValue = this.reply.content
      this.reply.msgId = this.formId
      saveReply(this.reply).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.reply.content = ''
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        innerMessageId: this.formId
      }).then(response => {
        this.form = response.data
        this.form.createTime = fecha.format(response.data.createTime, 'yyyy-MM-dd HH:mm:ss')
        this.fileSrc = this.form.fileMsg.src
        this.fileTile = this.form.fileMsg.title
        console.log(this.form)
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
.repliy-dialog{
  .el-dialog__body{
    padding: 20px 20px;
  }
  .list{
  .el-form-item__content{
    height: 300px;
    margin-left: 0px!important;
    .ibps-container-crud__header{
        display: none;
      }
    .el-table--border{
      height: 300px !important;
    }
    }
  }
}

</style>
