<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    class="group-edit-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="groupForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="group"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="用户组名称:" prop="name">
        <el-input v-if="!readonly" v-model="group.name" v-pinyin="{vm:group,key:'groupAlias'}" />
        <span v-else>{{ group.name }}</span>
      </el-form-item>
      <el-form-item label="用户组别名:" prop="groupAlias">
        <el-input v-if="!readonly" v-model="group.groupAlias" :disabled="formId!==''" />
        <span v-else>{{ group.groupAlias }}</span>
      </el-form-item>
      <el-form-item label="描述:" prop="groupNote">
        <el-input v-if="!readonly" v-model="group.groupNote" type="textarea" row="3" />
        <span v-else>{{ group.groupNote }}</span>
      </el-form-item>
      <!--  用户列表 -->
      <div>
        <div v-if="!readonly" class="ibps-mb-5">
          <el-button type="primary" icon="ibps-icon-add" @click="handleAdd">添加人员</el-button>
        </div>
        <el-table
          :data="group.partyUserGroupPoList"
          border
          empty-text="请添加人员"
        >
          <el-table-column
            :label="$t('components.crud.index')"
            type="index"
            width="50"
          />
          <el-table-column label="成员名" prop="userName" />
          <el-table-column v-if="!readonly" label="管理" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 人员选择器 -->
      <ibps-employee-selector-dialog
        :visible="selectorVisible"
        :value="[]"
        multiple
        @close="visible => selectorVisible = visible"
        @action-event="handleSelectorActionEvent"
      />
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
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import { saveCascade, loadCascade } from '@/api/platform/org/group'
import ActionUtils from '@/utils/action'
import { validateKey, validateEmpty } from '@/utils/validate'

export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
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
      selectorVisible: false,
      formName: 'groupForm',
      formLabelWidth: '120px',
      dialogVisible: this.dialogVisible,
      dialogLoading: false,
      defaultForm: {},
      group: {
        name: '',
        groupAlias: '',
        groupNote: '',
        partyUserGroupPoList: []
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') },
          { validator: validateEmpty, trigger: 'blur' }],
        groupAlias: [{ required: true, validator: validateKey }]
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
    group: {
      handler: function(val, oldVal) {
        var pattern = /\s/
        if (pattern.test(val.name)) {
          if (pattern.test(val.groupAlias)) {
            val.groupAlias = ''
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.group))
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
      console.info(this.group)
      saveCascade(this.group).then(response => {
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
      this.group.partyUserGroupPoList = []
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
        this.group = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      loadCascade({
        groupId: this.formId
      }).then(response => {
        this.group = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    // 处理 添加人员
    handleAdd() {
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      data.forEach(d => {
        if (this.isHasUser(d.id)) {
          return false
        }
        this.group.partyUserGroupPoList.push({
          userId: d.id,
          userName: d.name
        })
      })
      this.selectorVisible = false
    },
    isHasUser(id) {
      return this.group.partyUserGroupPoList.findIndex((d) => { return d.userId === id }) > -1
    },
    handleDelete(index, row) {
      this.group.partyUserGroupPoList.splice(index, 1)
    }
  }

}
</script>
<style lang='scss'>
.group-edit-dialog{
  .el-dialog__body{
    height:  calc(40vh - 80px) !important;
  }
}
</style>
