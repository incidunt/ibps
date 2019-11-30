<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    class="attr-edit-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="attrForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="attr"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="属性名称:" prop="name">
        <el-input v-if="!readonly" v-model="attr.name" v-pinyin="{vm:attr}" />
        <span v-else>{{ attr.name }}</span>
      </el-form-item>
      <el-form-item label="业务主键:" prop="key">
        <el-input v-if="!readonly" v-model="attr.key" :disabled="formId!==''" />
        <span v-else>{{ attr.key }}</span>
      </el-form-item>
      <el-form-item label="参与者类型:" prop="partyType">
        <el-select v-if="!readonly" v-model="attr.partyType" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in partyTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-tag v-else :type="attr.partyType|optionsFilter(partyTypeOptions)">{{ attr.partyType|optionsFilter(partyTypeOptions,'label') }}</el-tag>
      </el-form-item>

      <el-form-item label="属性类型:" prop="type">
        <el-select v-if="!readonly" v-model="attr.type" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in attrTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-tag v-else :type="attr.type|optionsFilter(attrTypeOptions)">{{ attr.type|optionsFilter(attrTypeOptions,'label') }}</el-tag>
      </el-form-item>

      <el-form-item label="数据类型:" prop="dataType">
        <el-select v-if="!readonly" v-model="attr.dataType" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in dataTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-tag v-else :type="attr.dataType|optionsFilter(dataTypeOptions)">{{ attr.dataType|optionsFilter(dataTypeOptions,'label') }}</el-tag>
      </el-form-item>
      <!-- 选项的属性-->
      <el-form-item v-if="attr.dataType==='OPTION'" label="是否多选:" prop="isMulti">
        <el-switch
          v-if="!readonly"
          v-model="attr.isMulti"
          active-value="Y"
          inactive-value="N"
        />
        <el-tag
          v-else
          :type="attr.isMulti|optionsFilter(multiOptions,'type')"
        >
          {{ attr.isMulti|optionsFilter(multiOptions,'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item v-if="attr.dataType==='OPTION'" label="选项:" prop="options">
        <el-button v-if="!readonly" type="primary" icon="ibps-icon-add" @click.prevent="addOption()">添加</el-button>
        <el-row :gutter="20">
          <el-col v-if="!readonly" :span="10">
            选项
          </el-col>
          <el-col v-else :span="10" class="dataType-option">
            选项
          </el-col>
          <el-col v-if="!readonly" :span="10">
            值
          </el-col>
          <el-col v-else :span="10" class="dataType-value">
            值
          </el-col>
          <el-col v-if="!readonly" :span="4">
            操作
          </el-col>
          <el-row
            v-for="(option, index) in attr.options"
            :key="index"
            :gutter="20"
            class="option-form"
          >
            <el-col :span="10">
              <el-input v-if="!readonly" v-model="option.groupName" />
              <span v-else>{{ option.groupName }}</span>
            </el-col>
            <el-col :span="10">
              <el-input v-if="!readonly" v-model="option.value" />
              <span v-else>{{ option.value }}</span>
            </el-col>
            <el-col v-if="!readonly" :span="4">
              <el-button type="danger" icon="ibps-icon-delete" @click.prevent="removeOption(option)" />
            </el-col>
          </el-row>
        </el-row>
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
import { save, load } from '@/api/platform/org/attr'
import { partyTypeOptions, attrTypeOptions, dataTypeOptions, multiOptions } from './constants'
import ActionUtils from '@/utils/action'
import { validateKey, validateEmpty } from '@/utils/validate'

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
      formName: 'attrForm',
      formLabelWidth: '120px',
      dialogVisible: this.dialogVisible,
      dialogLoading: false,
      validatorOptions: false,
      partyTypeOptions: partyTypeOptions,
      attrTypeOptions: attrTypeOptions,
      dataTypeOptions: dataTypeOptions,
      multiOptions: multiOptions,
      defaultForm: {},
      attr: {
        id: '',
        name: '',
        key: '',
        partyType: 'employee',
        type: 'desc',
        dataType: 'STRING',
        isMulti: 'N',
        options: []
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') },
          { validator: validateEmpty, trigger: 'blur' }],
        key: [{ required: true, validator: validateKey }],
        partyType: [{ required: true, message: this.$t('validate.required') }],
        type: [{ required: true, message: this.$t('validate.required') }],
        dataType: [{ required: true, message: this.$t('validate.required') }],
        isMulti: [{ required: true, message: this.$t('validate.required') }]
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
    },
    attr: {
      handler: function(val, oldVal) {
        var pattern = /\s/
        if (pattern.test(val.name)) {
          if (pattern.test(val.key)) {
            val.key = ''
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.attr))
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
    checkOptions(options) {
      for (let i = 0; i < options.length; i++) {
        const option = options[i]
        if (this.$utils.isEmpty(option.groupName) || this.$utils.isEmpty(option.value)) {
          return true
        }
      }
      for (let i = 0; i < options.length; i++) {
        const option = options[i]
        for (let j = 0; j < options.length; j++) {
          const op = options[j]
          if (i !== j && option.value === op.value) {
            return true
          }
        }
      }
      return false
    },
    // 提交保存数据
    saveData() {
      const data = this.attr
      if (data.dataType === 'OPTION') {
        if (this.$utils.isEmpty(data.options)) {
          this.$message.closeAll()
          this.$message({
            message: '请先添加自定义选项！',
            type: 'warning'
          })
          return
        }
        if (this.checkOptions(data.options)) {
          this.$message.closeAll()
          this.$message({
            message: '自定义选项值不能为空且不能重复！',
            type: 'warning'
          })
          return
        }
      }

      save(data).then(response => {
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
      this.attr.options = []
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
        this.attr = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      load({
        attrId: this.formId
      }).then(response => {
        this.attr = response.data
        console.info(this.attr)
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },

    addOption() {
      this.attr.options.push(
        {
          groupName: '',
          value: ''
        }
      )
    },
    removeOption(option) {
      const index = this.attr.options.indexOf(option)
      if (index !== -1) {
        this.attr.options.splice(index, 1)
      }
    }
  }

}
</script>

<style lang='scss' >
.attr-edit-dialog{
  .el-dialog__body{
    height:  calc(40vh - 110px) !important;
  }
}
.dataType-option,
.dataType-value{
  border: 1px solid #c0c4cc;
  background-color: #f5f5f6;
  font-weight: 600;
  color: #909399;
}

.option-form{
  margin: 0 !important;
  margin-left:10px;
  div{
    padding: 1px;
    span{
      padding-left: 10px;
      padding-right: 10px;
      display: block;
      width: 99%;
      border: 1px solid #c0c4cc;
    }
  }
}
</style>
