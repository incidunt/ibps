<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog org-edit-dialog"
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
      <el-form-item label="岗位名称:" prop="name">
        <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form,name:'name',key:'posAlias'}" />
        <span v-else>{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="岗位别名:" prop="posAlias">
        <el-input v-if="!readonly" v-model="form.posAlias" />
        <span v-else>{{ form.posAlias }}</span>
      </el-form-item>
      <el-form-item label="岗位等级:" prop="levelID">
        <el-select v-if="!readonly" v-model="form.levelID" style="width:100%;">
          <el-option v-for="(v,i) in levelOptions" :key="i" :label="v.name" :value="v.id" />
        </el-select>
        <span v-else> {{ form.levelID|optionsFilter(levelOptions,'name','id') }}</span>
      </el-form-item>
      <el-form-item label="岗位说明:" prop="desc">
        <el-input v-if="!readonly" v-model="form.desc" />
        <span v-else>{{ form.desc }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="创建时间:">
        <span>{{ form.createTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="更新时间:">
        <span>{{ form.updateTime }}</span>
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
import { save, get } from '@/api/platform/org/position'
import { findByType as findLevelByType } from '@/api/platform/org/level'
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
    orgId: String,
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,

      levelOptions: [],
      defaultForm: {},
      form: {
        name: '',
        posAlias: '',
        levelID: '',
        desc: '',
        id: '',
        orgID: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('validate.required') }
        ],
        posAlias: [{ required: true, message: this.$t('validate.required') }],
        levelID: [
          { required: true, message: this.$t('validate.required') }
        ]
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
    this.loadLevelList()
  },
  methods: {
    loadLevelList() {
      findLevelByType({
        type: 'position'
      }).then(response => {
        this.levelOptions = response.data
        if (this.$utils.isNotEmpty(this.levelOptions)) {
          this.defaultForm.levelID = this.levelOptions[0].id
          if (this.$utils.isEmpty(this.formId)) {
            this.form.levelID = this.defaultForm.levelID
          }
        }
      })
    },
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
      this.form.orgID = this.orgId
      save(this.form).then(response => {
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
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.form.orgID = this.orgId
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        positionId: this.formId
      }).then(response => {
        this.form = response.data
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
.org-edit-dialog{
  .el-dialog__body{
    height:  calc(50vh - 277px) !important;
  }
}
</style>
