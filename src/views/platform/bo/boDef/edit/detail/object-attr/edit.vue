<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="bo-attr-dialog"
    top="13vh"
    width="65%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="属性信息" name="attInfo">
        <el-form
          ref="form"
          v-loading="dialogLoading"
          :element-loading-text="$t('common.loading')"
          :model="form"
          :rules="rules"
          :label-width="formLabelWidth"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="名称：" prop="name">
                <el-input
                  v-model="form.name"
                  v-pinyin="{vm:form,config:{format:'WITHOUT_TONE'},py:[{key:'code',camelCase:true},{key:'fieldName',separator:'_',separatorEnd:true}]}"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编码" prop="code" class="forms">
                <span class="forms-span">
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="驼峰命名法：sysData、uesrId"
                    placement="bottom"
                  >
                    <ibps-icon name="exclamation-circle" class="forms-icon" />
                  </el-tooltip>：
                </span>
                <el-input v-model="form.code" :disabled="!form.edit&&isCreateTable==='Y'" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="字段" prop="fieldName" class="forms">
                <span class="forms-span">
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="下划线分隔：sys_data_"
                    placement="bottom"
                  >
                    <ibps-icon name="exclamation-circle" class="forms-icon" />
                  </el-tooltip>：
                </span>
                <el-input v-model="form.fieldName" :disabled="!form.edit&&isCreateTable==='Y'" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述：" prop="desc">
                <el-input v-model="form.desc" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col v-if="false" :span="12">
              <el-form-item label="是否允许为空：" prop="isNull">
                <el-radio-group v-model="form.isNull">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="false" :span="12">
              <el-form-item label="默认值" prop="defValue" class="forms">
                <span class="forms-span">
                  <el-tooltip effect="light" placement="bottom">
                    <div slot="content">
                      日期型默认值只支持函数值，例：<br>
                      oracle的sysdate;<br>
                      mysql的current_timestamp;<br>
                      sqlserver的getdate();
                    </div>
                    <ibps-icon name="exclamation-circle" class="forms-icon" />
                  </el-tooltip>：
                </span>
                <el-input v-model="form.defValue" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据类型：" prop="dataType">
                <el-select
                  v-if="!readonly"
                  v-model="form.dataType"
                  placeholder="请选择"
                  style="width:100%;"
                  :disabled="!form.edit&&isCreateTable==='Y'"
                  @change="dataType()"
                >
                  <el-option
                    v-for="option in typeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.dataType==='varchar'||form.dataType==='number'" label="属性长度：" prop="attrLength">
                <el-input v-model="form.attrLength" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.dataType==='date'" label="日期格式：" prop="format">
                <el-select v-model="form.format" placeholder="请选择" style="width:100%;">
                  <el-option
                    v-for="option in formatOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.dataType==='number'" label="小数位数：" prop="precision">
                <el-input v-model="form.precision" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { typeOptions, formatOptions, objectAttrRootData } from '../../../constants'
// const uuid = require('uuid')
import { validateInteger } from '@/utils/validate'
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
    title: String,
    datas: Object,
    isCreateTable: {
      type: String,
      default: 'N'
    },
    clear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'attInfo',
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      format: false,
      apply: true,
      typeOptions: typeOptions,
      formatOptions: formatOptions,
      defaultForm: {},
      form: objectAttrRootData,
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        code: [{ required: true, message: this.$t('validate.required') }],
        fieldName: [{ required: true, message: this.$t('validate.required') }],
        dataType: [{ required: true, message: this.$t('validate.required') }],
        format: [{ required: true, message: this.$t('validate.required') }],
        attrLength: [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }],
        precision: [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }]
      },
      toolbars: [
        { key: 'save', type: 'success', label: '应用', hidden: () => { return !this.apply } },
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    formData() {
      return this.datas
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
          this.handleSave('apply')
          break
        case 'confirm':
          this.handleSave('confirm')
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    dataType() {
      if (this.form.dataType === 'date') {
        this.form.format = 'yyyy-MM-dd'
      }
      if (this.form.dataType === 'varchar') {
        this.form.attrLength = '200'
      }
      if (this.form.dataType === 'number') {
        this.form.attrLength = '20'
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 保存数据
    handleSave(buttonKey) {
      if ((this.form.code && this.form.code !== this.form.code.trim()) ||
        (this.form.fieldName && this.form.fieldName !== this.form.fieldName.trim())) {
        this.$message({
          message: '编码和字段首尾不能存在空格，请删除后再进行保存操作',
          type: 'warning'
        })
        return
      }
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.$emit('callback', this.form, buttonKey)
          this.$nextTick(() => {
            if (!this.clear) {
              this.form = JSON.parse(JSON.stringify(this.defaultForm))
            }
          })
          if (buttonKey !== 'apply') {
            this.$nextTick(() => {
              if (!this.clear) {
                this.closeDialog()
              }
            })
          }
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.format = false
      this.$emit('close', false)
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
        this.apply = true
        return
      }
      this.form = JSON.parse(JSON.stringify(this.formData))
      this.apply = false
      if (!this.$utils.isEmpty(this.form.format)) {
        this.format = true
      }
    }
  }

}
</script>
<style lang="scss">
.bo-attr-dialog{
  .el-dialog__body{
    padding: 15px 20px;
    .forms{
      position: relative;
      label{
        width: 90px!important;
      }
      .forms-span{
        position:absolute;
        left: -40px;
        top: 0;
        .forms-icon{
          color: #337ab7;
        }
      }
    }
  }
}
</style>
