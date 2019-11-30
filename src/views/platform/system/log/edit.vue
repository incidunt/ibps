<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="1vh"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
      class="log-dialog"
    >
      <el-form-item label="标题:">
        <span>{{ form.title }}</span>
      </el-form-item>
      <el-form-item label="类型:">
        <el-tag :type="form.type|optionsFilter(statusTypeOptions,'type')">{{ form.type|optionsFilter(statusTypeOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="模块:">
        <span>{{ form.module }}</span>
      </el-form-item>
      <el-form-item label="子模块:">
        <span>{{ form.subModule }}</span>
      </el-form-item>
      <el-form-item label="IP地址:">
        <span>{{ form.ipAddr }}</span>
      </el-form-item>
      <el-form-item label="请求URI::">
        <span>{{ form.requestUri }}</span>
      </el-form-item>
      <el-form-item label="操作人:">
        <span>{{ form.createor }}</span>
      </el-form-item>
      <el-form-item label="创建时间:">
        <span>{{ form.createTime }}</span>
      </el-form-item>
      <el-form-item label="用户代理:">
        <span>{{ form.userAgent }}</span>
      </el-form-item>
      <el-form-item label="操作方式:">
        <span>{{ form.method }}</span>
      </el-form-item>
      <el-form-item label="操作提交的数据:">
        <span>{{ form.params }}</span>
      </el-form-item>
      <el-form-item label="异常数据:">
        <span>{{ form.exception }}</span>
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
import { get } from '@/api/platform/org/level'
import { statusTypeOptions } from './constants'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      statusTypeOptions: statusTypeOptions,
      form: {},
      toolbars: [
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
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
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
    }
  }

}
</script>
