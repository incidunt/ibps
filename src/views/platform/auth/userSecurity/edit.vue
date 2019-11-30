<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    class="dialog user-security-edit-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="userSecurityForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="userSecurity"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="是否启用复杂度策略:" prop="isUseComp">
        <el-switch
          v-if="!readonly"
          v-model="userSecurity.isUseComp"
          :active-value="'Y'"
          :inactive-value="'N'"
          active-text="启用"
          inactive-text="禁用"
        />
        <el-tag v-else :type="userSecurity.isUseComp|optionsFilter(statusOptions,'type')">
          {{ userSecurity.isUseComp|optionsFilter(statusOptions,'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item label="复杂度设置:" prop="complexity">
        <el-checkbox-group v-if="!readonly" v-model="userSecurity.complexity">
          <el-checkbox label="1">包含小写字母</el-checkbox>
          <el-checkbox label="2">包含大写字母</el-checkbox>
          <el-checkbox label="3">包含数字</el-checkbox>
          <el-checkbox label="4">包含特殊字符</el-checkbox>
        </el-checkbox-group>
        <el-tag
          v-for="(item,i) in userSecurity.complexity"
          v-else
          :key="i"
          :type="item|optionsFilter(checkListOptions,'type')"
        >
          {{ item|optionsFilter(checkListOptions,'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item label="密码长度最小值（字符）:" prop="minLength">
        <el-input v-if="!readonly" v-model="userSecurity.minLength" />
        <span v-else>{{ userSecurity.minLength }}</span>
      </el-form-item>
      <el-form-item label="密码长度最大值（字符）:" prop="maxLength">
        <el-input v-if="!readonly" v-model="userSecurity.maxLength" />
        <span v-else>{{ userSecurity.maxLength }}</span>
      </el-form-item>
      <el-form-item label="强制更改密码期限（天）:" prop="updTlimit">
        <el-input v-if="!readonly" v-model="userSecurity.updTlimit" />
        <span v-else>{{ userSecurity.updTlimit }}</span>
      </el-form-item>
      <el-form-item label="最长使用期限（天）:" prop="timeLimit">
        <el-input v-if="!readonly" v-model="userSecurity.timeLimit" />
        <span v-else>{{ userSecurity.timeLimit }}</span>
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
import { save, get } from '@/api/platform/auth/userSecurity'
import { statusOptions, checkListOptions } from './constants'
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
    var validateMinLength = (rule, value, callback) => {
      const re = /^[1-9]\d*$/
      if (!re.test(value)) {
        callback(new Error('请输入非0整数！'))
      } else {
        const MinLengthNum = parseInt(value)
        const MaxLengthNum = parseInt(this.userSecurity.maxLength)
        if (MinLengthNum < this.userSecurity.complexity.length && this.userSecurity.complexity.length !== []) {
          callback(new Error('整数位长度不能小于' + this.userSecurity.complexity.length))
        } else if (MinLengthNum > MaxLengthNum) {
          callback(new Error('密码最少长度”不能大于“密码最大长度'))
        } else if (MinLengthNum > 20) {
          callback(new Error('密码最少长度不能大于20'))
        } else {
          callback()
        }
      }
    }
    var validateMaxLength = (rule, value, callback) => {
      const re = /^[1-9]\d*$/
      if (!re.test(value)) {
        callback(new Error('请输入非0整数！'))
      } else {
        const MinLengthNum = parseInt(this.userSecurity.minLength)
        const MaxLengthNum = parseInt(value)
        if (MinLengthNum > MaxLengthNum) {
          callback(new Error('密码最大长度”不能小于“密码最少长度'))
        } else if (MaxLengthNum > 20) {
          callback(new Error('密码最大长度不能大于20'))
        } else {
          callback()
        }
      }
    }
    var validateUpdTlimit = (rule, value, callback) => {
      const re = /^[1-9]\d*$/
      if (!re.test(value)) {
        callback(new Error('请输入非0整数！'))
      } else {
        const updateTimeLimit = parseInt(value)
        if (updateTimeLimit > 32767) {
          callback(new Error('强制更改密码时间不能大于32767'))
        } else {
          callback()
        }
      }
    }
    var validateTimeLimit = (rule, value, callback) => {
      const re = /^[1-9]\d*$/
      if (!re.test(value)) {
        callback(new Error('请输入非0整数！'))
      } else {
        const timeLimit = parseInt(value)
        if (timeLimit > 32767) {
          callback(new Error('最长使用期限不能大于32767'))
        } else {
          callback()
        }
      }
    }

    return {
      formName: 'userSecurityForm',
      formLabelWidth: '180px',
      dialogVisible: this.visible,
      dialogLoading: false,
      statusOptions: statusOptions,
      checkListOptions: checkListOptions,
      defaultForm: {},
      userSecurity: {
        isUseComp: 'N',
        complexity: [],
        minLength: '',
        maxLength: '',
        updTlimit: '',
        timeLimit: '',
        isDefault: 'N'
      },
      rules: {
        isUseComp: [{ required: true, message: this.$t('validate.required') }],
        complexity: [{ required: true, message: this.$t('validate.required') }],
        checkList: [{ required: true, message: this.$t('validate.required') }],
        minLength: [{ required: true, message: this.$t('validate.required') }, { validator: validateMinLength, trigger: 'blur' }],
        maxLength: [{ required: true, message: this.$t('validate.required') }, { validator: validateMaxLength, trigger: 'blur' }],
        updTlimit: [{ required: true, message: this.$t('validate.required') }, { validator: validateUpdTlimit, trigger: 'blur' }],
        timeLimit: [{ required: true, message: this.$t('validate.required') }, { validator: validateTimeLimit, trigger: 'blur' }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
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
    // 默认表单
    this.defaultForm = JSON.parse(JSON.stringify(this.userSecurity))
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
      const data = JSON.parse(JSON.stringify(this.userSecurity))
      data.complexity = data.complexity.join(',')
      save(data).then(response => {
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
        this.userSecurity = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        userSecurityId: this.formId
      }).then(response => {
        const data = response.data
        data.complexity = data.complexity.split(',')
        this.userSecurity = data
        if (!this.readonly) {
          this.formValidate()
        }
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.user-security-edit-dialog{
  .el-dialog__body{
    height:  calc(42vh - 100px) !important;
  }
}
</style>
