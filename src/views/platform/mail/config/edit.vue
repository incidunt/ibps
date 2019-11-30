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
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <div class="basic-info">
        <p v-if="!readonly" class="basic-info-title">基本资料</p>
        <el-form-item label="名称:" prop="userName">
          <el-input v-if="!readonly" v-model="form.userName" />
          <span v-else>{{ form.userName }}</span>
        </el-form-item>
        <el-form-item label="是否默认:" prop="isDefault">
          <el-switch
            v-if="!readonly"
            v-model="form.isDefault"
            :active-value="true"
            :inactive-value="false"
          />
          <el-tag v-else :type="form.isDefault|optionsFilter(typeOptions,'type')">{{ form.isDefault|optionsFilter(typeOptions,'label') }}</el-tag>
        </el-form-item>
      </div>
      <div class="mail-config">
        <p v-if="!readonly" class="mail-config-title">邮箱配置</p>
        <el-form-item label="邮件地址:" prop="mailAddress">
          <el-input v-if="!readonly" v-model="form.mailAddress" />
          <span v-else>{{ form.mailAddress }}</span>
        </el-form-item>
        <el-form-item label="邮件密码:" prop="mailPass">
          <el-input v-if="!readonly" v-model="form.mailPass" type="password" />
          <span v-else>{{ form.mailPass }}</span>
        </el-form-item>
        <el-form-item label="服务器类型:" prop="mailType">
          <el-input v-if="!readonly" v-model="form.mailType" disabled />
          <span v-else>{{ form.mailType }}</span>
        </el-form-item>
        <el-form-item class="ail-config-checkbox">
          <el-form-item prop="isValidate">
            <el-checkbox v-if="!readonly" v-model="form.isValidate">是否需要身份认证</el-checkbox>
            <span v-else>{{ form.isValidate }}</span>
          </el-form-item>
          <el-form-item prop="isHanDleAttach">
            <el-checkbox v-if="!readonly" v-model="form.isHanDleAttach">是否下载附件</el-checkbox>
            <span v-else>{{ form.isHanDleAttach }}</span>
          </el-form-item>
          <el-form-item prop="useSsl">
            <el-checkbox v-if="!readonly" v-model="form.useSsl">开启SSL安全连接</el-checkbox>
            <span v-else>{{ form.useSsl }}</span>
          </el-form-item>
          <p v-if="!readonly" style="margin:5px 0;">不开启<span style="color:#478fca">SSL安全连接</span>，
            <span style="color:red">POP3</span>端口默认为<span style="color:red">110</span>，
            <span style="color:red">SMTP</span> 默认端口为<span style="color:red">25</span>；如开启，请自行查询端口；</p>
        </el-form-item>
        <el-form-item label="服务器(pop3):" prop="popHost">
          <el-input v-if="!readonly" v-model="form.popHost" />
          <span v-else>{{ form.popHost }}</span>
        </el-form-item>
        <el-form-item label="端口(pop3):" prop="popPort">
          <el-input v-if="!readonly" v-model="form.popPort" />
          <span v-else>{{ form.popPort }}</span>
        </el-form-item>
        <el-form-item label="服务器(SMTP):" prop="smtpHost">
          <el-input v-if="!readonly" v-model="form.smtpHost" />
          <span v-else>{{ form.smtpHost }}</span>
        </el-form-item>
        <el-form-item label="端口(SMTP):" prop="smtpPort">
          <el-input v-if="!readonly" v-model="form.smtpPort" />
          <span v-else>{{ form.smtpPort }}</span>
        </el-form-item>
      </div>
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
import { save, get, test } from '@/api/platform/mail/config'
import { typeOptions } from './constants'
import ActionUtils from '@/utils/action'

export default {
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
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      typeOptions: typeOptions,
      form: {
        id: this.id,
        userId: this.$store.getters.userId,
        userName: '',
        isDefault: true,
        mailAddress: '',
        mailPass: '',
        mailType: 'POP3',
        isValidate: false,
        isHanDleAttach: false,
        useSsl: false,
        popHost: '',
        popPort: '110',
        smtpHost: '',
        smtpPort: '25'
      },
      rules: {
        mailAddress: [{ required: true, message: this.$t('validate.required') },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        userName: [{ required: true, message: this.$t('validate.required') }],
        isDefault: [{ required: true, message: this.$t('validate.required') }],
        popHost: [{ required: true, message: this.$t('validate.required') }],
        smtpHost: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'test', label: '测试', icon: 'ibps-icon-bug', type: 'success' },
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
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'test':
          this.testData()
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
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      console.info(this.form)
      save(this.form).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 测试数据
    testData() {
      test(this.form).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
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
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        mailConfigId: this.formId
      }).then(response => {
        this.form = response.data
        console.log(this.form)
        this.formValidate()
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
