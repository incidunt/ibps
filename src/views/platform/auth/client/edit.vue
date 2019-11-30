<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    class="client-form-dialog"
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
      <el-form-item label="第三方名称:" prop="clientName">
        <el-input v-if="!readonly" v-model="form.clientName" v-pinyin="{vm:form,name:'clientName',key:'clientKey'}" />
        <span v-else>{{ form.clientName }}</span>
      </el-form-item>
      <el-form-item label="第三方标识:" prop="clientKey">
        <el-input v-if="!readonly" v-model="form.clientKey" />
        <span v-else>{{ form.clientKey }}</span>
      </el-form-item>
      <el-form-item label="第三方Domain:" prop="clientUri">
        <el-input v-if="!readonly" v-model="form.clientUri" />
        <span v-else>{{ form.clientUri }}</span>
      </el-form-item>
      <el-form-item label="密钥:" prop="clientSecret">
        <el-input v-if="!readonly" v-model="form.clientSecret" readonly>
          <el-button slot="append" icon="el-icon-refresh" @click="resetPassWord">重置</el-button>
        </el-input>
        <span v-else>{{ form.clientSecret }}</span>
      </el-form-item>
      <el-form-item label="作用域:" prop="scope">
        <el-checkbox-group v-if="!readonly" v-model="form.scope">
          <el-checkbox v-for="(item, i) in constant[0]" :key="i" :label="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
        <span v-else class="ibps-tag-list">
          <el-tag
            v-for="(item,i) in form.scope"
            :key="i"
          >
            {{ item|optionsFilter(constant[0],'label') }}
          </el-tag>
        </span>
      </el-form-item>
      <el-form-item label="授权类型:" prop="grantTypes">
        <el-checkbox-group v-if="!readonly" v-model="form.grantTypes">
          <el-checkbox v-for="(item, i) in constant[1]" :key="i" :label="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
        <el-tag
          v-for="(item,i) in form.grantTypes"
          v-else
          :key="i"
        >
          {{ item|optionsFilter(constant[1],'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item label="过期时间:" prop="expireTime">
        <div v-if="audit===true?readonly:!readonly">
          <el-date-picker
            v-model="form.expireTime"
            type="date"
            placeholder="选择日期"
            style="width:100%;"
            value-format="yyyy-MM-dd"
            @change="changeExpireTime"
          />
        </div>
        <span v-else>{{ form.expireTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="申请时间:" prop="createTime">
        <span>{{ form.createTime }}</span>
      </el-form-item>
      <el-form-item label="描述:" prop="clientDesc">
        <el-input v-if="!readonly" v-model="form.clientDesc" type="textarea" />
        <span v-else>{{ form.clientDesc }}</span>
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
import { save, get, doAuditBatch, audit } from '@/api/platform/auth/client'
import fecha from '@/utils/fecha'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'

const uuid = require('uuid')

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
    var futureOneYear = new Date()
    futureOneYear.setFullYear(futureOneYear.getFullYear() + 1)
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.dialogVisible,
      dialogLoading: false,
      defaultForm: {},
      defaulRules: {},
      lessTodayTime: false,
      form: {
        clientKey: '',
        clientName: '',
        clientUri: '',
        clientSecret: '',
        scope: [],
        grantTypes: [],
        expireTime: futureOneYear,
        clientDesc: '',
        status: 'pendding',
        createBy: this.$store.getters.userId,
        createTime: ''
      },
      rules: {
        clientKey: [{ required: true, validator: validateKey, message: this.$t('validate.required') }],
        clientName: [{ required: true, message: this.$t('validate.required') }],
        clientUri: [{ required: true, message: this.$t('validate.required') }],
        expireTime: [{ required: true, message: this.$t('validate.required') }],
        scope: [{ required: true, message: this.$t('validate.required') }],
        grantTypes: [{ required: true, message: this.$t('validate.required') }]
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
    },
    formClientSecret() {
      return this.form.clientSecret
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
    this.defaulRules = JSON.parse(JSON.stringify(this.rules))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'pass':
          this.pass()
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
      if (this.lessTodayTime) {
        this.$message({
          message: '过期时间必须大于当前日期，请重新选择！',
          type: 'warning'
        })
        return
      }
      const data = JSON.parse(JSON.stringify(this.form))
      data.scope = data.scope.join(',')
      data.grantTypes = data.grantTypes.join(',')
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
      this.lessTodayTime = false
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
      if (this.readonly) {
        this.rules = {}
      } else {
        this.rules = this.defaulRules
      }
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.resetPassWord()
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        authClientId: this.formId
      }).then(response => {
        const data = response.data
        data.scope = data.scope.split(',')
        data.grantTypes = data.grantTypes.split(',')
        this.form = data
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    // 随机重置
    resetPassWord() {
      this.form.clientSecret = uuid()
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
        authClientIds: ids,
        nopass: nopass || null,
        cause: cause || null
      }).then(response => {
        this.$emit('close', false)
        this.$emit('callback', this)
      })
    },
    pass() {
      const data = JSON.parse(JSON.stringify(this.form))
      data.scope = data.scope.join(',')
      data.grantTypes = data.grantTypes.join(',')
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
    },
    changeExpireTime(date) {
      const todayDate = new Date()
      const todayTime = todayDate.getTime()
      const selectDate = fecha.parse(date, 'yyyy-MM-dd').getTime()
      this.lessTodayTime = selectDate < todayTime
      if (this.lessTodayTime) {
        this.$message({
          message: '过期时间必须大于当前日期，请重新选择！',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang='scss' >
.client-form-dialog{
  .el-dialog__body{
    height:  calc(80vh - 110px) !important;
  }
}
</style>
