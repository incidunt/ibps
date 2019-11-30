<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :top="top"
    class="doTypeDialog"
    width="70%"
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
          <el-form-item label="类型名称:" prop="name">
            <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form}" />
            <span v-else>{{ form.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型key:" prop="key">
            <el-input v-if="!readonly" v-model="form.key" />
            <span v-else>{{ form.key }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子集类型:" prop="subType">
            <el-select
              v-if="!readonly"
              v-model="form.subType"
              placeholder="请选择"
              style="width:100%;"
              @change="loadSubType"
            >
              <el-option
                v-for="option in subOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-tag v-else :type="form.subType|optionsFilter(subOptions,'type')">{{ form.subType|optionsFilter(subOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否默认:" prop="isDef">
            <el-radio-group v-if="!readonly" v-model="form.isDef">
              <el-radio
                v-for="value in isDefOptions "
                :key="value.label"
                :label="value.value"
              >{{ value.label }}</el-radio>
            </el-radio-group>
            <el-tag v-else :type="form.isDef|optionsFilter(isDefOptions,'type')">{{ form.isDef|optionsFilter(isDefOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="子集keys:" prop="subKeys">
            <el-checkbox-group v-if="!readonly" v-model="form.subKeys">
              <el-checkbox
                v-for="(value,i) in subKeysOptions "
                :key="i"
                :label="value.label"
              >{{ value.label }}</el-checkbox>
            </el-checkbox-group>
            <el-tag
              v-for="(item,i) in form.subKeys"
              v-else
              :key="i"
            >
              {{ item|optionsFilter(subKeysOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col v-if="readonly" :span="12">
          <el-form-item label="创建人:">
            <el-input v-if="!readonly" v-model="form.creator" />
            <span v-else>{{ form.creator }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="readonly" :span="12">
          <el-form-item label="创建时间:">
            <el-input v-if="!readonly" v-model="form.createTime" />
            <span v-else>{{ form.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述:" prop="comment">
            <el-input v-if="!readonly" v-model.number="form.comment" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" />
            <span v-else>{{ form.comment }}</span>
          </el-form-item>
        </el-col>
      </el-row>

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
import { save, get, getDoTypeOrTemplateList } from '@/api/platform/codegen/doType'
import { subOptions, isDefOptions } from './constants'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'

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
      formName: 'form',
      top: '0',
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      subOptions: subOptions,
      isDefOptions: isDefOptions,
      subKeysOptions: [],
      defaultForm: {},
      form: {
        key: '',
        name: '',
        subType: 'template',
        isDef: 'false',
        subKeys: [],
        comment: '',
        creator: this.$store.getters.userId
      },
      rules: {
        key: [{ required: true, message: this.$t('validate.required') }],
        name: [{ required: true, message: this.$t('validate.required') }],
        filename: [{ required: true, message: this.$t('validate.required') }],
        dir: [{ required: true, message: this.$t('validate.required') }],
        content: [{ required: true, message: this.$t('validate.required') }],
        subKeys: [{ required: true, message: this.$t('validate.required') }]
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
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
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
      const data = JSON.parse(JSON.stringify(this.form))
      data.subKeys = data.subKeys.join(',')
      data.createTime = Date.parse(data.createTime)
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
    // 子集Key数据获取
    loadSubType(subType = 'template') {
      getDoTypeOrTemplateList({
        doTypeId: '', // 生成类型id
        typeId: '',
        subType: subType
      }).then(response => {
        const data = response.data
        this.subKeysOptions = data.map(item => {
          return {
            label: item.key,
            name: item.name
          }
        })
        console.log(this.subKeysOptions)
      }).catch(() => {})
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.top = '6vh'
        this.loadSubType()
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.top = '10vh'
        const data = response.data
        data.subKeys = data.subKeys.split(',')
        this.form = data
        this.form.createTime = fecha.format(response.data.createTime, 'yyyy-MM-dd HH:mm:ss')
        this.loadSubType(data.subType)
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.doTypeDialog{
  .el-dialog__body{
    padding: 17px 20px;
  }
  .el-checkbox-group{
    .el-checkbox+.el-checkbox{
      margin-left: 0;
    }
    label{
      min-width: 156px;
    }
  }
}
</style>
