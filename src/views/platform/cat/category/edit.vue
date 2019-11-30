<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog category-edit-dialog"
    :class="!readonly?'category-edit-dialog':'category-edit-readonly-dialog'"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="categoryForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="category"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称:" prop="name">
        <el-input
          v-if="!readonly"
          v-model="category.name"
          v-pinyin="{vm:category,key:'categoryKey'}"
        />
        <span v-else>{{ category.name }}</span>
      </el-form-item>
      <el-form-item label="业务主键:" prop="categoryKey">
        <el-input v-if="!readonly" v-model="category.categoryKey" />
        <span v-else>{{ category.categoryKey }}</span>
      </el-form-item>
      <el-form-item label="序号:" prop="sn">
        <el-input v-if="!readonly" v-model="category.sn" />
        <span v-else>{{ category.sn }}</span>
      </el-form-item>
      <el-form-item label="是否默认:" prop="flag">
        <el-switch
          v-if="!readonly"
          v-model="category.flag"
          :active-value="1"
          :inactive-value="0"
        />
        <el-tag v-else :type="category.flag|optionsFilter(flagOptions)">{{ category.flag|optionsFilter(flagOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="结构类型:" prop="type">
        <el-radio-group v-if="!readonly" v-model="category.type">
          <el-radio
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.value"
          >{{ option.label }}
          </el-radio>
        </el-radio-group>
        <el-tag v-else :type="category.type|optionsFilter(typeOptions)">{{ category.type|optionsFilter(typeOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item v-if="readonly" label="创建时间:" prop="createTime">
        <span>{{ category.createTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="更新时间:" prop="updateTime">
        <span>{{ category.updateTime }}</span>
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
import { save, get } from '@/api/platform/cat/category'
import { typeOptions, flagOptions } from './constants'
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
    const validateIntegerLength = (rule, value, callback) => {
      const re = /^[0-9]{1,10}$/
      if (!re.test(value) && value.length < 10) {
        callback(new Error('请填写合法数字'))
      } else {
        if (value.length > 10) {
          callback(new Error('整数位最大长度不能超过10'))
        } else {
          callback()
        }
      }
    }
    return {
      formName: 'categoryForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      typeOptions: typeOptions,
      flagOptions: flagOptions,
      defaultForm: {},
      category: {
        name: '',
        categoryKey: '',
        flag: 1,
        sn: '',
        type: '1',
        createTime: '',
        updateTime: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') },
          { validator: validateEmpty, trigger: 'blur' }],
        sn: [{ required: true, message: this.$t('validate.required') },
          { validator: validateIntegerLength, trigger: 'blur' }
        ],
        categoryKey: [{ required: true, validator: validateKey }]
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
    category: {
      handler: function(val, oldVal) {
        var pattern = /\s/
        if (pattern.test(val.name)) {
          if (pattern.test(val.categoryKey)) {
            val.categoryKey = ''
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.category))
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
      console.info(this.category)
      save(this.category).then(response => {
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
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.category = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        categoryId: this.formId
      }).then(response => {
        this.category = response.data
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
.category-edit-dialog{
  .el-dialog__body{
    height:  calc(37vh - 100px) !important;
  }
}
.category-edit-readonly-dialog{
  .el-dialog__body{
    height:  calc(47vh - 100px) !important;
  }
}
</style>
