<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    :class="className"
    @close="closeDialog"
    @open="handleSelectOptions(categoryKey)"
  >
    <el-form
      ref="settingTypeForm"
      v-loading="dialogLoading"
      :model="formModel"
      :element-loading-text="$t('common.loading')"
      :label-width="formLabelWidth"
    >
      <el-form-item label="设置分类">
        <ibps-type-select
          ref="ibpsTypeSelect"
          v-model="formModel.typeId"
          :category-key="categoryKey"
          clearable
        />
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
import ActionUtils from '@/utils/action'
import IbpsTypeSelect from '@/business/platform/cat/type/select'

export default {
  components: {
    IbpsTypeSelect
  },
  props: {
    className: String,
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '设置分类'
    },
    categoryKey: String
  },
  data() {
    return {
      formName: 'settingTypeForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      formModel: {
        typeId: ''
      },
      rules: {},
      toolbars: [
        { key: 'save' },
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
        if (this.visible) this.formModel.typeId = []
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
      this.$emit('save', this.formModel.typeId)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    handleSelectOptions(params) {
      this.$refs['ibpsTypeSelect'] ? this.$refs['ibpsTypeSelect'].loadTreeData(params) : null
    }

  }

}
</script>
