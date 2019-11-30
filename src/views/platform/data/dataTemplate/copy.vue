<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="复制表单"
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="原表单名称：" prop="origname">
            <el-input v-model="form.origname" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单名称：" prop="name">
            <el-input v-model="form.name" v-pinyin="{vm:form,key:'key'}" :clearable="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原表单Key：" prop="origKey">
            <el-input v-model="form.origCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单Key：" prop="key">
            <el-input v-model="form.key" :clearable="true" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="业务对象选择版本：" prop="boId" label-width="width:200px;">
            <el-radio-group v-model="form.boId">
              <el-radio v-for="(item,value) in boIdOptions" :key="value" :label="item.label">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveCopy } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    copyData: Object
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '130px',
      dialogVisible: this.visible,
      dialogLoading: false,
      boIdOptions: [
        // 数据展示，以接口数据为准。
        {
          label: '加班申请单:V2',
          value: '234325345336'
        },
        {
          label: '加班申请单:V1',
          value: '755634535563'
        }
      ],
      form: {
        origname: '',
        name: '',
        origKey: '',
        key: '',
        boId: '加班申请单:V2'
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }]
      }
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
      saveCopy({
        key: this.form.key,
        name: this.form.name
      }).then(response => {
        this.$emit('callback', this)
        this.closeDialog()
        this.$message.closeAll()
        this.$message({
          type: 'success',
          message: '复制数据模版成功!'
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName] ? this.$refs[this.formName].resetFields() : null
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = false
      this.formValidate()
      // this.form.origname = this.copyData.name || ''
      // this.form.origCode = this.copyData.code || ''
    }
  }

}
</script>
