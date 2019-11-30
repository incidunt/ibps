<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="15vh"
    append-to-body
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
      class="api-grant-dialog"
    >
      <el-form-item label="授权类型:">
        <el-tag>{{ form.grantType|optionsFilter(constant[0],'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="授权标识:">
        <span>{{ form.grantKey }}</span>
      </el-form-item>
      <el-form-item label="过期时间:" prop="expireTime">
        <div v-if="audit===true?readonly:!readonly">
          <el-date-picker
            v-model="form.expireTime"
            type="date"
            placeholder="选择日期"
          />
        </div>
        <span v-else>{{ form.expireTime }}</span>
      </el-form-item>
      <el-form-item label="应用标识:">
        <span>{{ form.appKey }}</span>
      </el-form-item>
      <el-form-item label="接口标识:">
        <span>{{ form.apiKey }}</span>
      </el-form-item>
      <el-form-item label="频次:" prop="limit">
        <el-input v-if="audit===true?readonly:!readonly" v-model="form.limit" />
        <span v-else>{{ form.limit }}</span>
      </el-form-item>
      <el-form-item label="测试频次:" prop="testLimit">
        <el-input v-if="audit===true?readonly:!readonly" v-model="form.testLimit" />
        <span v-else>{{ form.testLimit }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="状态:">
        <el-tag :color="form.status|optionsFilter(constant[1],'color')" style="color:#ffffff">{{ form.status|optionsFilter(constant[1],'label') }}</el-tag>
      </el-form-item>
      <el-form-item v-if="readonly" label="审核时间:">
        <span>{{ form.auditTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="申请时间:">
        <span>{{ form.createTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="过期时间:">
        <span>{{ form.expireTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="理由:">
        <span>{{ form.cause }}</span>
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
import { save, get, doAuditBatch, audit } from '@/api/platform/auth/apiGrant'
import ActionUtils from '@/utils/action'
import { validateInteger } from '@/utils/validate'

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
    audit: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String,
    constant: Object
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      form: {},
      rules: {
        expireTime: [{ required: true, message: this.$t('validate.required') }],
        limit: [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }],
        testLimit: [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }]
      },
      toolbars: [
        { key: 'save', hidden: () => {
          if (!this.readonly) return false
          if (this.audit === false) return true
          return true
        }
        },
        { key: 'pass', icon: 'ibps-icon-legal', label: '通过', hidden: () => {
          if (this.audit === true) return false
          if (this.readonly) return true
          return true
        }
        },
        { key: 'nopass', icon: 'ibps-icon-legal', label: '不通过', hidden: () => {
          if (this.audit === true) return false
          if (this.readonly) return true
          return true
        }
        },
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
        case 'pass':
          this.handlePass()
          break
        case 'nopass':
          this.nopass()
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
      this.saveData()
    },
    // 提交保存数据
    saveData() {
      save(this.form).then(response => {
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
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        authApiGrantId: this.formId
      }).then(response => {
        this.form = response.data
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    nopass() {
      this.$prompt('请输入理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        inputErrorMessage: this.$t('validate.required')
      }).then(({ value }) => {
        this.batchAudit(this.formId, 0, value)
      })
    },
    batchAudit(ids, nopass, cause) {
      doAuditBatch({
        authApiGrantIds: ids,
        nopass: nopass || null,
        cause: cause || null
      }).then(response => {
        this.$emit('close', false)
        this.$emit('callback', this)
      })
    },
    handlePass() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.pass()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    pass() {
      const data = JSON.parse(JSON.stringify(this.form))
      audit(data).then(response => {
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
    }
  }

}
</script>
<style lang="scss">
.api-grant-dialog>div{
  margin-bottom: 10px 0 8px 0 !important;
}
</style>
