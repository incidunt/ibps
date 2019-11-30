<template>
  <el-dialog
    :title="defTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog bpmn-copy-dialog"
    @close="closeDialog"
  >
    <el-form
      ref="copyBpmnForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="define"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <!--
        名称修改下一版本做
              <el-row>
          <el-col :span="12">
          <el-form-item label="流程定义名称">
            <el-input v-model="data.name" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新流程定义名称" prop="name">
            <el-input v-model="define.name" v-pinyin="{vm:define}" />
          </el-form-item>
        </el-col>
            <、el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="旧流程定义key">
            <el-input v-model="data.defKey" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新流程定义key" prop="key">
            <el-input v-model="define.key" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { copy } from '@/api/platform/bpmn/bpmDefinition'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String,
    data: Object
  },
  data() {
    return {
      formName: 'copyBpmnForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      define: {
        defId: this.id,
        name: '',
        key: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, validator: validateKey }]
      }
    }
  },
  computed: {
    formId() {
      return this.id
    },
    defTitle() {
      return this.title + `【${this.data.name}】`
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
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (this.define.key === this.data.defKey) {
            this.$message({
              message: '流程定义Key不能与原流程定义Key一致',
              type: 'warning'
            })
          } else {
            this.saveData()
          }
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      copy({
        oldDefId: this.id,
        newDefKey: this.define.key
      }).then(response => {
        ActionUtils.successMessage('复制成功！')
        this.$emit('callback', this)
        this.closeDialog()
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
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    }
  }

}
</script>
