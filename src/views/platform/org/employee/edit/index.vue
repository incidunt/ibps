<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="0"
    class="employee-dialog"
    width="80%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-tabs
      v-model="activeName"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      class="emp-tab"
    >
      <el-tab-pane label="基本资料" name="basic-info">
        <basic-info
          ref="basicInfo"
          :readonly="readonly"
          :data="employee"
          @input="data => employee = data"
        />
      </el-tab-pane>
      <el-tab-pane label="扩展属性" name="ext-attr">
        <ext-attr
          ref="attrInfo"
          :readonly="readonly"
          :data="employee.attrItemList"
          @input="data => employee.attrItemList = data"
        />
      </el-tab-pane>
      <el-tab-pane v-if="!infoIncludes('org-info')" label="组织信息" name="org-info">
        <org-info
          ref="orgInfo"
          :span="span"
          :readonly="readonly"
          :data="employee.orgItem"
          @input="data => employee.orgItem = data"
        />
      </el-tab-pane>

      <el-tab-pane label="岗位信息" name="position-info">
        <position-info
          ref="positionInfo"
          :span="span"
          :readonly="readonly"
          :org-id="orgId"
          :data="employee.posItemList"
          @input="data => employee.posItemList = data"
        />
      </el-tab-pane>
      <el-tab-pane v-if="!infoIncludes('role-info')" name="role-info">
        <span slot="label">角色信息
          <el-tooltip
            v-if="id"
            class="item"
            effect="light"
            content="“其他”来源的角色继承于组织、岗位，不能删除！"
            placement="bottom"
          >
            <ibps-icon name="help" style="color:#dd5b44;" />
          </el-tooltip>
        </span>
        <role-info
          ref="roleInfo"
          :span="span"
          :readonly="readonly"
          :data="employee.roleItemList"
          @input="data => employee.roleItemList = data"
        />
      </el-tab-pane>
      <el-tab-pane label="用户组信息" name="group-info">
        <group-info
          ref="groupInfo"
          :readonly="readonly"
          :data="employee.userGroupItemList"
          @input="data => employee.userGroupItemList = data"
        />
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
import { create, update, load } from '@/api/platform/org/employee'

import ActionUtils from '@/utils/action'
import BasicInfo from './basic-info'
import ExtAttr from './ext-attr'
import OrgInfo from './org-info'
import PositionInfo from './position-info'
import RoleInfo from './role-info'
import GroupInfo from './group-info'

export default {
  components: {
    BasicInfo,
    ExtAttr,
    OrgInfo,
    PositionInfo,
    RoleInfo,
    GroupInfo
  },
  props: {
    visible: Boolean,
    id: String,
    title: String,
    readonly: {
      type: Boolean,
      default: false
    },
    ceroParams: {
      type: Object,
      default: () => {}
    },
    span: [Number, String]
  },
  data() {
    return {
      info: [],
      orgId: '',
      dialogLoading: false,
      dialogVisible: false,
      activeName: 'basic-info',
      defaultEmployee: {
        id: '',
        account: '',
        password: '',
        isSuper: 'N',
        name: '',
        status: 'actived',
        gender: 'male',
        email: '',
        photo: '',
        mobile: '',
        createTime: '',
        attrItemList: [], // 扩展属性
        groupID: '', // 组织ID
        posItemList: [],
        roleItemList: [],
        userGroupItemList: [],
        orgItem: {} // 组织全部信息
      },
      employee: {},
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
    ceroParams: {
      handler: function(val, oldVal) {
        if (val && val !== {}) {
          this.orgId = val.groundId
        }
      },
      deep: true
    }
  },
  methods: {
    infoIncludes(params) {
      const arr = this.ceroParams !== undefined ? this.ceroParams.unshow : []
      return arr.includes(params)
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

    handleSave() {
      // 验证表单是否填写
      this.$refs.basicInfo.validate((valid) => {
        if (valid) {
          this.saveData()
        } else {
          this.activeName = 'basic-info'
          ActionUtils.saveErrorMessage()
        }
        console.log(valid)
      })
    },
    saveData() {
      const attrValidator = this.$refs['attrInfo'] ? this.$refs['attrInfo'].callback() : null
      const vo = this.formatSubmitData()
      // if (vo) return
      if (!this.$utils.isEmpty(this.formId) && !this.ceroParams) {
        delete vo.partyEmployeePo.password
      }
      this.dialogLoading = true
      if (this.formId) {
        if (!attrValidator) {
          this.$message.closeAll()
          this.$message({
            message: '请检查表单数据是否填写正确',
            type: 'warning'
          })
          this.dialogLoading = false
          return
        }
        update(vo).then(response => {
          this.dialogLoading = false
          this.$emit('dialog-callback', this)
          ActionUtils.saveSuccessMessage(response.message, r => {
            // if (this.$utils.isEmpty(this.formId)) {
            //   this.$refs[this.formName].resetFields()
            // }
            if (r) {
              this.closeDialog()
            }
          })
        }).catch(() => {
          this.dialogLoading = false
        })
      } else {
        if (!attrValidator) {
          this.$message.closeAll()
          this.$message({
            message: '请检查表单数据是否填写正确',
            type: 'warning'
          })
          this.dialogLoading = false
          return
        }

        create(vo).then(response => {
          this.dialogLoading = false
          this.$emit('dialog-callback', this)
          ActionUtils.saveSuccessMessage(response.message, r => {
            if (r) {
              this.closeDialog()
            } else {
              this.init()
              this.$refs.attrInfo.clearData()
            }
          })
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    // 初始化页面，出现之前的数据
    init() {
      this.activeName = 'basic-info'
      this.employee = this.$utils.newData(this.defaultEmployee)
      this.$nextTick(() => {
        this.$refs.orgInfo !== undefined ? this.$refs.orgInfo.init() : null
        this.$refs.positionInfo.init()
        this.$refs.roleInfo !== undefined ? this.$refs.roleInfo.init() : null
      })
    },
    getFormData() {
      this.init()
      this.$nextTick(() => { this.$refs['basicInfo'].handleGetDefaultUserSecurity() })
      if (this.$utils.isEmpty(this.formId)) {
        // 清空拓展属性数据
        this.$nextTick(() => {
          this.$refs.attrInfo.clearData()
        })
        return
      }
      this.dialogLoading = true
      // 用户基本信息
      load({
        employeeId: this.formId
      }).then(response => {
        this.dialogLoading = false
        this.employee = response.data
        this.employee.orgItem = response.variables.partyOrg || {}
        this.employee.attrItemList = response.variables.partyAttrs || []
        this.employee.posItemList = response.variables.partyPositions || []
        this.employee.roleItemList = response.variables.partyRoles || []
        this.employee.userGroupItemList = response.variables.partyGroups || []
        this.$nextTick(() => {
          this.$refs.attrInfo.loadAttrData()
        })
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    formatSubmitData() {
      console.log('---------save employee------')
      const vo = {}
      vo.partyEmployeePo = this.employee
      vo.user = this.employee
      vo.user.password = this.formId === '' || this.ceroParams ? this.employee.password : this.defaultEmployee.password
      vo.partyEmployeePo.groupID = this.ceroParams !== {} && this.ceroParams ? this.ceroParams.groundId : this.formatOrgData()
      vo.positionVoList = this.formatPositionData()
      vo.roleVoList = this.formatRoleData()
      vo.attrValueVoList = this.employee.attrItemList
      vo.userGroupPoList = this.formatUserGroupData()
      if (this.ceroParams !== {} && this.ceroParams) {
        vo.partyEmployeePo.prem = this.ceroParams.prem
      }
      console.log(vo)

      return vo
    },
    formatOrgData() {
      return this.employee.orgItem.id || ''
    },
    formatPositionData() {
      const result = []
      const list = this.employee.posItemList
      if (this.$utils.isEmpty(list)) return result
      for (const variable of list) {
        const tmp = { 'id': variable.id, 'name': variable.name }
        tmp['isMainPost'] = variable.isMainPost === 'Y'
        tmp['isPrincipal'] = variable.isPrincipal === 'Y'
        result.push(tmp)
      }
      return result
    },
    formatRoleData() {
      const result = []
      const list = this.employee.roleItemList
      if (this.$utils.isEmpty(list)) return result
      for (const variable of list) {
        const tmp = { 'id': variable.id, 'name': variable.name }
        tmp['subSystemName'] = variable.subSystemName
        tmp['source'] = this.employee.id ? variable.source : '自有'
        tmp['canDelete'] = variable.source === '自有'
        result.push(tmp)
      }
      return result
    },
    formatUserGroupData() {
      const result = []
      const list = this.employee.userGroupItemList
      if (this.$utils.isEmpty(list)) return result
      for (const variable of list) {
        result.push({ 'groupId': variable.id, 'groupName': variable.name })
      }
      return result
    }
  }
}
</script>
<style lang='scss' >
.employee-dialog{
  .el-dialog__body{
    height:  calc(100vh - 110px) !important;
  }

}
</style>
