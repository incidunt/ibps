<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
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
      <el-form-item label="动作类型:" prop="action">
        <el-select v-if="!readonly" v-model="form.action" :disabled="formId!==''" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in actionOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-tag v-else :type="form.action|optionsFilter(actionOptions,'type')">{{ form.action|optionsFilter(actionOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="是否默认:" prop="isDefault">
        <el-switch
          v-if="!readonly"
          v-model="form.isDefault"
          active-value="Y"
          inactive-value="N"
        />
        <el-tag v-else :type="form.isDefault|optionsFilter(isDefaultOptions,'type')">{{ form.isDefault|optionsFilter(isDefaultOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="内容:" prop="value">
        <el-input v-if="!readonly" v-model="form.value" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        <span v-else>{{ form.value }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="创建人:" class="special-dispose">
        <ibps-employee-selector
          :value="form.createBy"
          style="width:200px;"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item v-if="readonly" label="创建时间:">
        <span>{{ form.createTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="使用次数:">
        <span>{{ form.times }}</span>
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
import { save, get } from '@/api/platform/bpmn/bpmCommonStatment'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import { actionOptions, isDefaultOptions } from './constants'
import ActionUtils from '@/utils/action'

export default {
  components: {
    IbpsEmployeeSelector
  },
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
      actionOptions: actionOptions,
      isDefaultOptions: isDefaultOptions,
      defaultForm: {},
      createByOptions: [],
      form: {
        action: 'agree',
        isDefault: 'Y',
        value: ''
      },
      rules: {
        action: [{ required: false, message: this.$t('validate.required') }],
        isDefault: [{ required: false, message: this.$t('validate.required') }],
        value: [{ required: true, message: this.$t('validate.required') }]
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
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
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
        id: this.formId
      }).then(response => {
        this.form = response.data
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
.special-dispose{
  .el-form-item__content{
    .el-selector{
      .el-selector__tags{
        margin-top:17px;
        .el-tag{
          margin:0;
        }
      }
      .el-input--small{
        display: none;
      }
    }
  }
}
</style>
