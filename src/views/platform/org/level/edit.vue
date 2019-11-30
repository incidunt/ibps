<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    :class="readonly?'leave-dialog-readonly':'leave-dialog-disReadonly'"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="levelForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="level"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="level.name" />
        <span v-else>{{ level.name }}</span>
      </el-form-item>
      <el-form-item label="参与者类型:" prop="type">
        <el-select v-if="!readonly" v-model="level.type" :disabled="formId!==''" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-tag v-else :type="level.type|optionsFilter(typeOptions,'type')">{{ level.type|optionsFilter(typeOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="级别数值:" prop="level">
        <el-input v-if="!readonly" v-model="level.level" />
        <span v-else>{{ level.level }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="创建时间:">
        <span>{{ level.createTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="更新时间:">
        <span>{{ level.updateTime }}</span>
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
import { save, get } from '@/api/platform/org/level'
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
    const validateLevel = (rule, value, callback) => {
      const re = /^[0-9]{1,3}$/
      if (!re.test(value)) {
        if (value.length > 3) {
          callback(new Error('整数位长度不能超过3'))
        } else {
          callback(new Error('请输入整数！'))
        }
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      var re = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]{1,255}$/g
      if (re.test(value)) {
        callback(new Error('字符请勿携带特殊字符或者空格'))
      } else {
        if (value.length > 255) {
          callback(new Error('字节长度不能超过255!'))
        } else {
          callback()
        }
      }
    }
    return {
      formName: 'levelForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      typeOptions: typeOptions,
      defaultForm: {},
      level: {
        name: '',
        type: 'org',
        level: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateName, trigger: 'blur' }
        ],
        type: [{ required: true, message: this.$t('validate.required') }],
        level: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateLevel, trigger: 'blur' }
        ]
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
    this.defaultForm = JSON.parse(JSON.stringify(this.level))
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
      save(this.level).then(response => {
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
        this.level = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        levelId: this.formId
      }).then(response => {
        this.level = response.data
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
// .leave-dialog-readonly{
//   .el-dialog__body{
//     height:  calc(42vh - 140px) !important;
//   }
// }
// .leave-dialog-disReadonly{
//   .el-dialog__body{
//     height: calc(32vh - 140px) !important;
//   }
// }
</style>
