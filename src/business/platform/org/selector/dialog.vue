<template>
  <div>
    <!--用户选择器-->
    <ibps-employee-selector-dialog
      v-if="type === 'employee' || type === 'user'"
      :visible="employeeSelectorVisible"
      :value="selectorValue"
      :multiple="multiple"
      @close="closeDialog"
      @action-event="handleSelectorActionEvent"
    />
    <!--组织选择器-->
    <ibps-org-selector-dialog
      v-else-if="type === 'org'"
      :visible="orgSelectorVisible"
      :value="selectorValue"
      :multiple="multiple"
      @close="closeDialog"
      @action-event="handleSelectorActionEvent"
    />
    <!--岗位选择器-->
    <ibps-position-selector-dialog
      v-else-if="type === 'position'"
      :visible="positionSelectorVisible"
      :value="selectorValue"
      :multiple="multiple"
      @close="closeDialog"
      @action-event="handleSelectorActionEvent"
    />
    <!--角色选择器-->
    <ibps-role-selector-dialog
      v-else-if="type === 'role'"
      :visible="roleSelectorVisible"
      :value="selectorValue"
      :multiple="multiple"
      @close="closeDialog"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import IbpsOrgSelectorDialog from '@/business/platform/org/org/dialog'
import IbpsPositionSelectorDialog from '@/business/platform/org/position/dialog'
import IbpsRoleSelectorDialog from '@/business/platform/org/role/dialog'

export default {
  components: {
    IbpsEmployeeSelectorDialog,
    IbpsOrgSelectorDialog,
    IbpsPositionSelectorDialog,
    IbpsRoleSelectorDialog
  },
  props: {
    visible: {
      type: Boolean
    },
    type: {
      type: String
    },
    value: {
      type: [String, Number, Array, Object]
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      employeeSelectorVisible: false,
      orgSelectorVisible: false,
      positionSelectorVisible: false,
      roleSelectorVisible: false
    }
  },
  computed: {
    selectorValue() {
      return this.value
    }
  },
  watch: {
    visible(value) {
      this.dialogVisible(value)
    }
  },
  methods: {
    dialogVisible(visible = false) {
      if (this.type === 'employee' || this.type === 'user') {
        this.employeeSelectorVisible = visible
      } else if (this.type === 'org') {
        this.orgSelectorVisible = visible
      } else if (this.type === 'position') {
        this.positionSelectorVisible = visible
      } else if (this.type === 'role') {
        this.roleSelectorVisible = visible
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleSelectorActionEvent(buttonKey, data) {
      this.$emit('action-event', buttonKey, data)
    }

  }
}
</script>

