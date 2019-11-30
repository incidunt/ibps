<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="添加栏目"
    append-to-body
    @open="loadData()"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
    >

      <el-form-item label="模块名称:" prop="alias">
        <el-select
          v-model="form.alias"
          filterable
          placeholder="请输入栏目名称"
          style="width:100%;"
        >
          <el-option
            v-for="item in columnList"
            :key="item.alias"
            :label="item.name"
            :value="item.alias"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="高度:" prop="height">
        <el-input-number
          v-model="form.height"
          :min="1"
          :max="100"
          :step="5"
          placeholder="请输入高度"
        />
      </el-form-item>

      <el-form-item label="宽度:" prop="width">
        <el-input-number
          v-model="form.width"
          :min="1"
          :max="24"
          :step="2"
          placeholder="请输入宽度"
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
import { findHashRightsColumn } from '@/api/platform/desktop/column'
import { initColumn } from '@/pages/dashboard/components'

import uuid from 'uuid'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      formLabelWidth: '120px',
      formName: 'form',
      form: {
        alias: '',
        height: 10,
        width: 12
      },
      rules: {
        alias: [{ required: true, message: this.$t('validate.required') }],
        height: [{ required: true, message: this.$t('validate.required') }],
        width: [{ required: true, message: this.$t('validate.required') }]
      },
      columnList: [],
      pagination: {
        page: 1,
        limit: 100
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    systemAlias() {
      return this.$store.getters.system ? this.$store.getters.system.alias : ''
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
    loadData() {
      initColumn(this.systemAlias)
      findHashRightsColumn().then(response => {
        this.columnList = response.data
      }).catch(() => {
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    handleConfirm() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          const item = { 'x': 0, 'y': 0, 'w': this.form.width, 'h': this.form.height, 'i': uuid() + '', alias: this.form.alias }
          this.$emit('confirm', item)
        } else {
          this.$message.closeAll()
          this.$message({
            message: '请选择栏目',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

