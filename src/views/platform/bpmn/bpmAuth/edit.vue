<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="bpmn-auth-dialog"
    top="0"
    width="80%"
    height="100%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="bpmAuthForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="bpmAuth"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="授权名称:" prop="name">
        <el-input v-if="!readonly" v-model="bpmAuth.name" />
        <span v-else>{{ bpmAuth.name }}</span>
      </el-form-item>
      <el-form-item label="权限类型:" prop="type">
        <el-checkbox-group v-model="bpmAuth.type" :disabled="readonly">
          <el-checkbox-button v-for="type in typeOptions" :key="type.value" :label="type.value">{{ type.label }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="授权人员:" prop="rightsOwner">
        <div v-if="!readonly" class="toolbar">
          <el-button type="primary" class="ibps-icon-add" @click="setBpmAuth">设置</el-button>
          <el-button type="danger" class="ibps-icon-remove" @click="()=>{bpmAuth.rightsOwner = []}">重置</el-button>
        </div>
        <el-table
          :data="bpmAuth.rightsOwner"
          border
          empty-text="暂无设置授权人员"
        >
          <el-table-column
            label="权限分类"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.type | optionsFilter(rightsTypeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="授权给"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type ==='all'">允许所有人访问</span>
              <span v-else>{{ scope.row.rightsName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="授权流程:" prop="rightsDef">
        <div v-if="!readonly" class="toolbar">
          <bpm-definition-selector
            button
            multiple
            @callback="updateDefine"
          />
          <el-button type="warning" class="ibps-icon-delete" @click="deleteDef">删除</el-button>
          <el-button type="danger" class="ibps-icon-remove" @click="()=>{bpmAuth.rightsDef = []}">重置</el-button>
        </div>
        <el-table
          ref="rightsDef"
          :data="bpmAuth.rightsDef"
          empty-text="暂无设置授权流程"
          :class="readonly?'authorization-table':null"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="!readonly"
            label="快捷设置"
          >
            <el-table-column
              type="selection"
            />
          </el-table-column>
          <el-table-column>
            <template v-if="!readonly" slot="header" slot-scope="scope">
              <span :key="scope.$index">
                定义：（
                <!-- <el-checkbox-group> -->
                <el-checkbox v-model="defalueCheckBoxVaries.m_edit" class="authorizationCheckbox" @change="meditChange">设计</el-checkbox>
                <el-checkbox v-model="defalueCheckBoxVaries.m_del" class="authorizationCheckbox" @change="mdelChange">删除</el-checkbox>
                <el-checkbox v-model="defalueCheckBoxVaries.m_start" class="authorizationCheckbox" @change="mstartChange">启动</el-checkbox>
                <el-checkbox v-model="defalueCheckBoxVaries.m_set" class="authorizationCheckbox" @change="msetChange">设置</el-checkbox>
                <el-checkbox v-model="defalueCheckBoxVaries.m_clean" class="authorizationCheckbox" @change="mcleanChange">清除数据</el-checkbox>
                <el-checkbox v-model="defalueCheckBoxVaries.m_guideEdit" class="authorizationCheckbox" @change="mguideEditChange">指南编辑</el-checkbox>
                <!-- </el-checkbox-group> -->
                ）<br>
                实例：（
                <el-checkbox v-model="defalueCheckBoxVaries.i_del" class="authorizationCheckbox" @change="idelChange">删除</el-checkbox>
                ）
              </span>
            </template>

            <el-table-column
              prop="defName"
              label="流程名称"
            />
            <el-table-column
              label="授权给"
            >
              <template slot-scope="scope">
                定义：（
                <el-checkbox v-model="scope.row.rights.m_edit" :disabled="readonly" class="authorizationCheckbox">设计</el-checkbox>
                <el-checkbox v-model="scope.row.rights.m_del" :disabled="readonly" class="authorizationCheckbox">删除</el-checkbox>
                <el-checkbox v-model="scope.row.rights.m_start" :disabled="readonly" class="authorizationCheckbox">启动</el-checkbox>
                <el-checkbox v-model="scope.row.rights.m_set" :disabled="readonly" class="authorizationCheckbox">设置</el-checkbox>
                <el-checkbox v-model="scope.row.rights.m_clean" :disabled="readonly" class="authorizationCheckbox">清除数据</el-checkbox>
                <el-checkbox v-model="scope.row.rights.m_guideEdit" :disabled="readonly" class="authorizationCheckbox">指南编辑</el-checkbox>
                ）<br>
                实例：（
                <el-checkbox v-model="scope.row.rights.i_del" :disabled="readonly" class="authorizationCheckbox">删除</el-checkbox>
                ）
              </template>

            </el-table-column>
          </el-table-column>
        </el-table>

      </el-form-item>
    </el-form>
    <rights-config
      :id="formId"
      :visible="dialogRightsVisible"
      :data="rightsOwnerList"
      title="设置权限"
      @callback="updateBpmAuth"
      @close="visible => dialogRightsVisible = visible"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { save, get } from '@/api/platform/bpmn/bpmAuth'
import { typeOptions, rightsTypeOptions } from './constants'
import ActionUtils from '@/utils/action'
import RightsConfig from '@/business/platform/rights/config'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'

export default {
  components: {
    RightsConfig,
    BpmDefinitionSelector
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
    title: {
      type: String,
      default: '流程代理设置'
    }
  },
  data() {
    return {
      formName: 'bpmAuthForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogRightsVisible: false,
      rightsTypeOptions: rightsTypeOptions,
      typeOptions: typeOptions,
      defaultForm: {},
      rightsOwnerList: [],
      bpmAuth: {
        id: '',
        name: '',
        type: [],
        rightsOwner: [],
        rightsDef: []
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }]
      },
      defalueFormCheckBoxVaries: {
        'm_edit': false,
        'm_del': false,
        'm_start': false,
        'm_set': false,
        'm_clean': false,
        'm_guideEdit': false,
        'i_del': false
      },
      defalueCheckBoxVaries: {},
      commonCheckList: [], // 全局多选框值
      defineSelect: [],
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
    this.defaultForm = JSON.parse(JSON.stringify(this.bpmAuth))
    this.defalueCheckBoxVaries = JSON.parse(JSON.stringify(this.defalueFormCheckBoxVaries))
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
      const newrRightsDef = JSON.parse(JSON.stringify(this.bpmAuth.rightsDef))
      if (this.$utils.isNotEmpty(newrRightsDef)) {
        for (const i in newrRightsDef[0].rights) {
          newrRightsDef[0].rights[i] = newrRightsDef[0].rights[i] === true ? 'Y' : 'N'
        }
      }
      const type = this.$utils.isNotEmpty(this.bpmAuth.type) ? this.bpmAuth.type.join(',') : ''
      const rightsOwner = this.$utils.isNotEmpty(this.bpmAuth.rightsOwner) ? JSON.stringify(this.bpmAuth.rightsOwner) : ''
      const rightsDef = this.$utils.isNotEmpty(newrRightsDef) ? JSON.stringify(newrRightsDef) : ''
      const data = {
        id: this.bpmAuth.id,
        name: this.bpmAuth.name,
        type: type,
        rightsOwner: rightsOwner,
        rightsDef: rightsDef
      }
      save(data).then(response => {
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
      this.defalueCheckBoxVaries = JSON.parse(JSON.stringify(this.defalueFormCheckBoxVaries))
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.bpmAuth = JSON.parse(JSON.stringify(this.defaultForm))

        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        const data = response.data
        this.rightsOwnerList = data.rightsOwnerList
        this.bpmAuth = {
          id: data.id,
          name: data.name,
          type: data.type !== '' ? data.type.split(',') : [],
          rightsOwner: this.$utils.isNotEmpty(data.rightsOwner) ? JSON.parse(data.rightsOwner) : [],
          rightsDef: this.$utils.isNotEmpty(data.rightsDef) ? JSON.parse(data.rightsDef) : []
        }
        this.bpmAuth.rightsDef.forEach(item => {
          item.rights = JSON.parse(item.rights)
        })
        for (const i in this.bpmAuth.rightsDef[0].rights) {
          this.bpmAuth.rightsDef[0].rights[i] = this.bpmAuth.rightsDef[0].rights[i] === 'Y'
        }
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    deleteDef() {
      if (this.$utils.isEmpty(this.defineSelect)) {
        ActionUtils.warning('请选择记录！')
        return
      }
      const selectionKey = []
      this.defineSelect.forEach(item => {
        selectionKey.push(item.defKey)
      })
      const rowIndex = []
      for (let i = 0; i < this.bpmAuth.rightsDef.length; i++) {
        const rightsDef = this.bpmAuth.rightsDef[i]
        if (selectionKey.indexOf(rightsDef.defKey) > -1) {
          rowIndex.push(i)
        }
      }
      rowIndex.forEach(index => {
        this.bpmAuth.rightsDef.splice(index, 1)
      })

      this.$refs.rightsDef.clearSelection()
    },
    setBpmAuth() {
      this.rightsOwnerList = [...this.bpmAuth.rightsOwner]
      this.dialogRightsVisible = true
    },
    updateBpmAuth(rights) {
      this.bpmAuth.rightsOwner = [...rights]
    },
    updateDefine(data) {
      const rightsDef = this.bpmAuth.rightsDef
      data.forEach(def => {
        let isExist = false
        rightsDef.forEach(e => {
          if (e.defKey === def.defKey) {
            isExist = true
          }
        })
        if (!isExist) {
          rightsDef.push({
            defKey: def.defKey,
            defName: def.name,
            rights: this.$utils.newData(this.defalueCheckBoxVaries) })
        }
      })

      this.bpmAuth.rightsDef = rightsDef
    },
    /**
     * @description 行点击时触发的事件
     */
    handleRowClick(row, event, column) {
      this.$refs.rightsDef.toggleRowSelection(row)
    },
    handleSelectionChange(selection) {
      this.defineSelect = selection
    },
    meditChange(value) {
      this.bpmAuth.rightsDef.forEach(element => {
        const params = value ? 'Y' : 'N'
        element.rights['m_edit'] = params
      })
    },
    mdelChange(value) {
      this.bpmAuth.rightsDef.forEach(element => {
        const params = value ? 'Y' : 'N'
        element.rights['m_del'] = params
      })
    },
    mstartChange(value) {
      this.bpmAuth.rightsDef.forEach(element => {
        const params = value ? 'Y' : 'N'
        element.rights['m_start'] = params
      })
    },
    msetChange(value) {
      this.bpmAuth.rightsDef.forEach(element => {
        const params = value ? 'Y' : 'N'
        element.rights['m_set'] = params
      })
    },
    mcleanChange(value) {
      this.bpmAuth.rightsDef.forEach(element => {
        const params = value ? 'Y' : 'N'
        element.rights['m_clean'] = params
      })
    },
    mguideEditChange(value) {
      this.bpmAuth.rightsDef.forEach(element => {
        const params = value ? 'Y' : 'N'
        element.rights['m_guideEdit'] = params
      })
    },
    idelChange(value) {
      this.bpmAuth.rightsDef.forEach(element => {
        const params = value ? 'Y' : 'N'
        element.rights['i_del'] = params
      })
    }
  }

}
</script>
<style lang='scss'>
.bpmn-auth-dialog{
  .el-dialog__body{
    height:  calc(100vh - 110px) !important;
  }
  .toolbar{
    padding-bottom: 5px;
  }
  .authorizationCheckbox{
    margin-right:5px;
    .el-checkbox__label{
      padding-left: 5px;
    }
  }
  .authorization-table{
    .el-table__header-wrapper{
      .el-table__header{
        .has-gutter{
          tr:nth-of-type(1){
            display: none;
          }
        }
      }
    }
  }
}
</style>
