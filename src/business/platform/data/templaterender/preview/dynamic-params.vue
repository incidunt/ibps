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
    <el-table :data="formData" border stripe>
      <el-table-column label="参数名称" prop="label" />
      <el-table-column label="参数值" prop="value">
        <template slot-scope="scope">
          <el-input v-model="scope.row.value" />
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>

  </el-dialog>
</template>
<script>
// import ActionUtils from '@/utils/action'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '[预览]动态参数设置'
    },
    conditions: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      formName: 'form',
      toolbars: [
        { key: 'confirm' },
        { key: 'confirmClose', label: '确认并关闭', type: 'danger' },
        { key: 'cancel' }
      ],
      formData: [],
      rules: {

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
        case 'confirmClose':
          this.handleConfirm(true)
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm(close = false) {
      const data = {}
      for (let i = 0; i < this.formData.length; i++) {
        const d = this.formData[i]
        data[d.name] = d.value
      }
      this.$emit('callback', data)
      if (close) {
        this.closeDialog()
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.formData = []
      for (const key in this.conditions) {
        const condition = this.conditions[key]
        this.formData.push({
          name: condition.field,
          label: condition.label,
          value: ''
        })
      }
    }
  }
}
</script>
