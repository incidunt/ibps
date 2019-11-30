<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    height="100%"
    top="10vh"
    @open="getFormData"
  >
    <el-form
      ref="demoForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="editForm"
      :label-width="formLabelWidth"
    >
      <el-form-item label="标题:">
        <el-input v-model="editForm.title" auto-complete="off" />
      </el-form-item>
      <el-form-item label="作者:">
        <el-input v-model="editForm.author" auto-complete="off" />
      </el-form-item>
      <el-form-item label="时间:">
        <el-input v-model="editForm.display_time" auto-complete="off" />
      </el-form-item>
      <el-form-item label="浏览数量:">
        <el-input v-model="editForm.pageviews" auto-complete="off" />
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="editForm.status" placeholder="请选择" style="width:100%;">
          <el-option label="草稿" value="draft" />
          <el-option label="发布" value="published" />
          <el-option label="删除" value="deleted" />
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
import { get, save } from '@/api/demo/list'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: Boolean,
    editId: String
  },
  data() {
    return {
      title: '演示dialog',
      formLabelWidth: '120px',
      dialogVisible: false,
      dialogLoading: false,
      defaultForm: {},
      editForm: {
        title: '',
        status: '',
        author: '',
        display_time: '',
        pageviews: ''
      },
      toolbars: [
        { key: 'save', label: '保存' },
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
    this.defaultForm = JSON.parse(JSON.stringify(this.editForm))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    saveData() {
      this.dialogLoading = true
      save(this.editForm).then(response => {
        this.dialogLoading = false
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (r) => {
          if (r) {
            this.closeDialog()
          }
        })
      }).catch(() => {
        this.dialogLoading = false
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
    getFormData() {
      if (this.$utils.isEmpty(this.id)) {
        // 重置表单
        this.editForm = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.id
      }).then(response => {
        this.editForm = response.data
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
