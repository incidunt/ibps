<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="config-dialog"
    top="0"
    width="60%"
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
      <el-form-item label="用户ID：">
        <span>{{ form.userId }}</span>
      </el-form-item>
      <el-form-item label="用户名称：">
        <span>{{ form.userName }}</span>
      </el-form-item>
      <el-form-item label="外部邮件地址：">
        <span>{{ form.mailAddress }}</span>
      </el-form-item>
      <el-form-item label="外部邮件密码：">
        <span>{{ form.mailPass }}</span>
      </el-form-item>
      <el-form-item label="smtp主机：">
        <span>{{ form.smtpHost }}</span>
      </el-form-item>
      <el-form-item label="smtp端口：">
        <span>{{ form.smtpPort }}</span>
      </el-form-item>
      <el-form-item label="pop主机：">
        <span>{{ form.popHost }}</span>
      </el-form-item>
      <el-form-item label="pop端口：">
        <span>{{ form.popPort }}</span>
      </el-form-item>
      <el-form-item label="imap主机：">
        <!-- <span>{{ form.smtpHost }}</span> -->
      </el-form-item>
      <el-form-item label="imap端口：">
        <!-- <span>{{ form.smtpPort }}</span> -->
      </el-form-item>
      <el-form-item label="是否默认：">
        <el-tag :type="form.isDefault|optionsFilter(typeOptions,'type')">{{ form.isDefault|optionsFilter(typeOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="接收邮件服务器类型：">
        <span>{{ form.mailType }}</span>
      </el-form-item>
      <el-form-item label="是否使用SSL连接服务器：">
        <span>{{ form.useSsl }}</span>
      </el-form-item>
      <el-form-item label="是否需要身份认证：">
        <span>{{ form.isValidate }}</span>
      </el-form-item>
      <el-form-item label="是否下载附件：">
        <span>{{ form.isHanDleAttach }}</span>
      </el-form-item>
      <el-form-item label="是否删除远程邮件：">
        <span>{{ form.isDeleteRemote }}</span>
      </el-form-item>
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
import { typeOptions } from './constants'
import { get } from '@/api/platform/mail/config'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String,
    detailData: [Object, String]
  },
  data() {
    return {
      formLabelWidth: '185px',
      dialogVisible: this.visible,
      dialogLoading: false,
      typeOptions: typeOptions,
      form: {},
      toolbars: [
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
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        mailConfigId: this.formId
      }).then(response => {
        this.form = response.data
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.config-dialog{
  .basic-info-title,
  .mail-config-title{
    font-size: 18px;
    padding-bottom: 5px;
    border-bottom:1px solid #e5e5e5;
  }
  .ail-config-checkbox{
    margin-bottom: 0;
    .el-form-item--small{
      margin-bottom: 0;
    }
  }
  .el-dialog__body{
    padding: 10px 20px;
  }
}
</style>
