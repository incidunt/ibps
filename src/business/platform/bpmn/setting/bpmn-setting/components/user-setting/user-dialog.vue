<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title+'选择'"
    top="10vh"
    width="70%"
    class="user-plugins-dialog"
    append-to-body
    @close="closeDialog"
  >
    <!--用户-->
    <user-plugin-cusers
      v-if="userType==='cusers'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 用户组 -->
    <user-plugin-group
      v-else-if="userType==='group'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 组织-->
    <user-plugin-org
      v-else-if="userType==='org'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 角色 -->
    <user-plugin-role
      v-else-if="userType==='role'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 岗位 -->
    <user-plugin-pos
      v-else-if="userType==='pos'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 组织负责人 -->
    <user-plugin-org-manager
      v-else-if="userType==='orgManager'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 参与者等级 -->
    <user-plugin-level
      v-else-if="userType==='level'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 用户上下级 -->
    <user-plugin-user-grade
      v-else-if="userType==='userGrade'"
      ref="userPlugin"
      v-model="formData"
    />
    <!-- 人员脚本 -->
    <user-plugin-hr-script
      v-else-if="userType==='hrScript'"
      ref="userPlugin"
      v-model="formData"
    />

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="handleActionEvent"
      />
    </div>

  </el-dialog>
</template>

<script>
import UserPluginCusers from './plugins/cusers'
import UserPluginGroup from './plugins/group'
import UserPluginOrg from './plugins/org'
import UserPluginRole from './plugins/role'
import UserPluginPos from './plugins/pos'
import UserPluginOrgManager from './plugins/org-manager'
import UserPluginLevel from './plugins/level'
import UserPluginUserGrade from './plugins/user-grade'
import UserPluginHrScript from './plugins/hr-script'

export default {
  components: {
    UserPluginCusers,
    UserPluginGroup,
    UserPluginOrg,
    UserPluginRole,
    UserPluginPos,
    UserPluginOrgManager,
    UserPluginLevel,
    UserPluginUserGrade,
    UserPluginHrScript
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Object,
    userType: String,
    title: String
  },
  data() {
    return {
      formData: {},
      dialogVisible: this.visible,
      actions: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.formData = JSON.parse(JSON.stringify(this.data))
        }
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      const rtn = this.$refs.userPlugin.getData()
      if (rtn && rtn.result) {
        this.closeDialog()
        this.$emit('callback', rtn.data)
      } else {
        this.$message.closeAll()
        this.$message({
          message: rtn.message || '出错了',
          type: 'warning'
        })
      }
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>

