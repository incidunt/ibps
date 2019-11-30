<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog auth_dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      label-width="160px"
    >
      <el-form-item label="分级管理员用户:" prop="managerID">
        <ibps-employee-selector v-model="form.managerID" />
      </el-form-item>
      <el-form-item label="被授权组织:">
        <label>{{ orgName }}</label>
      </el-form-item>
      <el-form-item label="本层级组织操作授权项:" prop="orgPerms">
        <el-checkbox-group v-model="form.orgPerms">
          <el-checkbox
            v-for="v in permsOptions"
            :key="v.value"
            :label="v.value"
            name="orgPerms"
          >
            {{ v.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="其子级组织操作授权项:" prop="userPerms">
        <el-checkbox-group v-model="form.userPerms">
          <el-checkbox
            v-for="v in permsOptions"
            :key="v.value"
            :label="v.value"
            name="userPerms"
          >
            {{ v.label }}
          </el-checkbox>
        </el-checkbox-group>
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
import { permsOptions } from './constants'
import { get, save } from '@/api/platform/org/auth'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'

import ActionUtils from '@/utils/action'
export default {
  components: {
    IbpsEmployeeSelector
  },
  props: {
    id: [String, Number],
    orgId: [String, Number],
    orgName: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      title: '设置分级管理员',
      formName: 'form',
      dialogLoading: false,
      dialogVisible: this.visible,
      width: '100%',
      permsOptions: permsOptions,
      defaultForm: {},
      form: {
        managerID: '',
        orgPerms: [],
        userPerms: []
      },
      rules: {
        managerID: [
          { required: true, message: this.$t('validate.required') }
        ]
      },
      toolbars: [
        { key: 'save' },
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
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        orgAuthId: this.formId
      }).then(response => {
        const data = response.data
        data.orgPerms = data.orgPerms.split(',')
        data.userPerms = data.userPerms.split(',')
        this.form = data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    // 提交保存数据
    submitForm() {
      this.dialogLoading = true
      this.saveData()
    },
    // 保存
    saveData() {
      if (this.$utils.isEmpty(this.form.managerID)) {
        this.$message.closeAll()
        this.$message.error('请选择分级管理员用户！')
        return
      }
      const data = JSON.parse(JSON.stringify(this.form))
      data.orgPerms = data.orgPerms.join(',')
      data.userPerms = data.userPerms.filter(item => item !== '')
      data.userPerms = data.userPerms.join(',')
      data.orgID = this.orgId
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    }
  }
}
</script>
<style lang="scss">
// .auth_dialog{
//   .el-dialog__body{
//     height:  calc(39vh - 150px) !important;
//   }
// }
</style>
