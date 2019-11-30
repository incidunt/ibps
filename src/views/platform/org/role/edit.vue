<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog role-edit-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="roleForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="role"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="角色名称:" prop="name">
        <el-input v-if="!readonly" v-model="role.name" v-pinyin="{vm:role,key:'roleAlias'}" />
        <span v-else>{{ role.name }}</span>
      </el-form-item>
      <el-form-item label="角色别名:" prop="roleAlias">
        <el-input v-if="!readonly" v-model="role.roleAlias" :disabled="formId!==''" />
        <span v-else>{{ role.roleAlias }}</span>
      </el-form-item>
      <el-form-item label="所属子系统:" prop="subSystemId">
        <el-select v-if="!readonly" v-model="role.subSystemId" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in subSystemList"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          />
        </el-select>
        <span v-else>{{ role.subSystemId|optionsFilter(subSystemList,'name','id','所有系统') }} </span>
      </el-form-item>
      <el-form-item label="描述:" prop="roleNote">
        <el-input v-if="!readonly" v-model="role.roleNote" :rows="4" type="textarea" />
        <span v-else>{{ role.roleNote }}</span>
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
import { save, get } from '@/api/platform/org/role'

import { findAllSubsystem } from '@/api/platform/auth/subsystem'
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
      formName: 'roleForm',
      formLabelWidth: '120px',
      dialogVisible: this.dialogVisible,
      dialogLoading: false,
      subSystemList: [],
      defaultForm: {},
      role: {
        name: '',
        roleAlias: '',
        subSystemId: '',
        roleNote: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') },
          { validator: validateEmpty, trigger: 'blur' }],
        roleAlias: [{ required: true, validator: validateKey }],
        subSystemId: [{ required: true, message: this.$t('validate.required'), trigger: 'change' }]
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
    role: {
      handler: function(val, oldVal) {
        var pattern = /\s/
        if (pattern.test(val.name)) {
          if (pattern.test(val.roleAlias)) {
            val.roleAlias = ''
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.role))
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
    loadSubSystemData() {
      findAllSubsystem().then(response => {
        this.subSystemList = response.data
        if (this.$utils.isEmpty(this.formId) &&
          this.$utils.isNotEmpty(this.subSystemList)) {
          this.role.subSystemId = this.subSystemList[0].id
        }
      })
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
      save(this.role).then(response => {
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
      this.loadSubSystemData()
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.role = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        roleId: this.formId
      }).then(response => {
        this.role = response.data
        this.role.subSystemId = response.variables.systemId
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
.role-edit-dialog{
  .el-dialog__body{
    height:  calc(50vh - 230px) !important;
  }
}
</style>
