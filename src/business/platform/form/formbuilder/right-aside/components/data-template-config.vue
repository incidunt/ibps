<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-config-dialog"
    top="5vh"
    width="50%"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <!--TODO：树形的数据处理--->
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="唯一标识（主键）：" prop="id">
        <el-select v-model="formData.id" style="width:100%" clearable>
          <el-option
            v-for="column in columns"
            :key="column.name"
            :value="column.name"
            :label="column.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="显示值：" prop="text">
        <el-select v-model="formData.text" style="width:100%" clearable>
          <el-option
            v-for="column in columns"
            :key="column.name"
            :value="column.name"
            :label="column.label"
          />
        </el-select>
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
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '关联配置'
    },
    columns: {
      type: Array
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formName: 'form',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      defaultFormData: {
        id: '',
        text: ''
      },
      formData: {
        id: '',
        text: ''
      },
      rules: {
        id: [{ required: true, message: this.$t('validate.required') }],
        text: [{ required: true, message: this.$t('validate.required') }]
      }
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
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          this.$emit('callback', this.formData)
          this.closeDialog()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.data)) {
        this.formData = JSON.parse(JSON.stringify(this.data))
      } else {
        this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
      }
    }
  }
}
</script>
