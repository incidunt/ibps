<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="6vh"
    class="dialog subsystem-edit-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="subsystemForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="subsystem"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称:" prop="name">
        <el-input
          v-if="!readonly"
          v-model="subsystem.name"
          v-pinyin="{vm:subsystem,key:'alias'}"
        />
        <span v-else>{{ subsystem.name }}</span>
      </el-form-item>
      <el-form-item label="别名:" prop="alias">
        <el-input v-if="!readonly" v-model="subsystem.alias" :disabled="formId!==''" />
        <span v-else>{{ subsystem.alias }}</span>
      </el-form-item>
      <el-form-item label="标志(logo)类型:" prop="logoType">
        <el-radio-group v-if="!readonly" v-model="subsystem.logoType">
          <el-radio label="font">字体图标</el-radio>
          <el-radio label="image">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="subsystem.logoType==='font'" label="标志(logo):" prop="logo">
        <ibps-icon-select v-if="!readonly" v-model="subsystem.logo" icon="el-icon-search" />
        <span v-else>{{ subsystem.logo }}</span>
      </el-form-item>
      <el-form-item v-if="subsystem.logoType==='image'" label="标志(logo):" prop="logo">
        <el-button v-if="!readonly" icon="el-icon-search">请选择</el-button>
        <span v-else>{{ subsystem.logo }}</span>
      </el-form-item>
      <el-form-item label="基准URL:" prop="baseUrl" class="ibps-md-0">
        <el-input v-if="!readonly" v-model="subsystem.baseUrl" />
        <span v-else>{{ subsystem.baseUrl }}</span>
        <div v-if="!readonly" class="ibps-help-block">如果不填写，则默认当前系统的web访问地址根路径。例：http://web.bpmhome.cn/</div>
      </el-form-item>
      <el-form-item label="子系统主页:" prop="homePage">
        <el-input v-if="!readonly" v-model="subsystem.homePage" />
        <span v-else>{{ subsystem.homePage }}</span>
      </el-form-item>
      <el-form-item label="是否本地:" prop="isLocal">
        <el-switch
          v-if="!readonly"
          v-model="subsystem.isLocal"
          :active-value="true"
          :inactive-value="false"
        />
        <el-tag v-else :type="subsystem.isLocal|optionsFilter(localOptions)">{{ subsystem.isLocal|optionsFilter(localOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="备注:" prop="memo">
        <el-input v-if="!readonly" v-model="subsystem.memo" type="textarea" rows="3" />
        <span v-else>{{ subsystem.memo }}</span>
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
import { save, get } from '@/api/platform/auth/subsystem'
import { validateKey } from '@/utils/validate'

import { localOptions } from './constants'
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
    title: String
  },
  data() {
    return {
      formName: 'subsystemForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      localOptions: localOptions,
      defaultForm: {},
      subsystem: {
        id: '',
        name: '',
        alias: '',
        logoType: 'font',
        logo: 'logo',
        baseUrl: '',
        homePage: '',
        memo: '',
        createTime: '',
        creatorId: '',
        isLocal: true
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        alias: [{ required: true, validator: validateKey }],
        logoType: [{ required: true, message: this.$t('validate.required') }],
        logo: [{ required: true, message: this.$t('validate.required') }],
        homePage: [{ required: true, message: this.$t('validate.required') }]
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
    this.defaultForm = JSON.parse(JSON.stringify(this.subsystem))
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
      console.info(this.subsystem)
      save(this.subsystem).then(response => {
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
        this.subsystem = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        systemId: this.formId
      }).then(response => {
        this.subsystem = response.data
        if (this.$utils.isEmpty(this.subsystem.logoType)) {
          this.subsystem.logoType = 'font'
        }
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
.subsystem-edit-dialog{
  .el-dialog__body{
    height:  calc(65vh - 120px) !important;
  }
}
</style>
