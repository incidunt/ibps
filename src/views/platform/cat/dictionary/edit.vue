<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog dictionary-edit-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="dictionaryForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="dictionary"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="父节点名称:" prop="parentId">
        <el-input v-if="!readonly" v-model="parentName" disabled />
        <span v-else>{{ parentName }}</span>
      </el-form-item>
      <el-form-item label="字典对照值:" prop="name">
        <el-input v-if="!readonly" v-model="dictionary.name" v-pinyin="{vm:dictionary}" />
        <span v-else>{{ dictionary.name }}</span>
      </el-form-item>
      <el-form-item label="字典对照码:" prop="key">
        <el-input v-if="!readonly" v-model="dictionary.key" />
        <span v-else>{{ dictionary.key }}</span>
      </el-form-item>
      <el-form-item label="序号:" prop="sn">
        <el-input v-if="!readonly" v-model="dictionary.sn" />
        <span v-else>{{ dictionary.sn }}</span>
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
import { save, getByTypeId } from '@/api/platform/cat/dictionary'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'

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
    typeId: String,
    title: String,
    parent: Object,
    dicParent: Object
  },
  data() {
    return {
      formName: 'dictionaryForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      dictionary: {
        id: '',
        typeId: '',
        parentId: '',
        parentName: '',
        name: '',
        key: '',
        sn: '1'
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, validator: validateKey }]
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
    },
    parentName() {
      if (this.$utils.isEmpty(this.formId)) {
        return this.parent ? this.parent.name : this.dicParent.name
      } else {
        return this.dictionary.parentName
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        console.log(this.dicParent, this.parent)
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.dictionary))
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
      if (!(this.formId && this.typeId)) {
        this.dictionary.typeId = this.dicParent.id
        this.dictionary.parentId = this.parent.id
      }
      console.log('save---', this.dictionary)
      save(this.dictionary).then(response => {
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
        this.dictionary = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      getByTypeId({
        dictionaryId: this.formId,
        typeId: this.typeId
      }).then(response => {
        this.dictionary = response.data
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
.dictionary-edit-dialog{
  .el-dialog__body{
    height:  calc(34vh - 128px) !important;
  }
}
</style>
