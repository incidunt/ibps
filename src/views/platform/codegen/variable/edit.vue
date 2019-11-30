<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
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
      <el-form-item label="变量名:" prop="name">
        <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form}" />
        <span v-else>{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="变量key:" prop="key">
        <el-input v-if="!readonly" v-model="form.key" />
        <span v-else>{{ form.key }}</span>
      </el-form-item>
      <el-form-item label="变量值:" prop="value">
        <el-input v-if="!readonly" v-model="form.value" />
        <span v-else>{{ form.value }}</span>
      </el-form-item>
      <el-form-item label="变量类型:" prop="type">
        <el-select v-if="!readonly" v-model="form.type" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-tag v-else :type="form.type|optionsFilter(typeOptions,'type')">{{ form.type|optionsFilter(typeOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="变量描述:" prop="comment">
        <el-input v-if="!readonly" v-model.number="form.comment" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" />
        <span v-else>{{ form.comment }}</span>
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
import { save, get } from '@/api/platform/codegen/variable'
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
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      typeOptions: typeOptions,
      defaultForm: {},
      form: {
        key: '',
        name: '',
        value: '',
        type: 'global',
        comment: '',
        creator: this.$store.getters.userId
      },
      rules: {
        key: [{ required: true, message: this.$t('validate.required') }],
        name: [{ required: true, message: this.$t('validate.required') }],
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
