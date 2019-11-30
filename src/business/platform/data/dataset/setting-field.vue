<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="设置字段控件"
    width="60%"
    top="5vh"
    append-to-body
    class="setting-field-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <ibps-layout ref="layout">
      <div slot="west">
        <div :style="{ width:`${width}px`,height:`${height}px`}" class="left-aside">
          <el-header :height="'30px'" class="layout-header">
            <div class="layout-header-title">
              数据集
            </div>
          </el-header>
          <el-scrollbar
            :style="{ height:`${height-35}px`}"
            style="width:100%;"
            wrap-class="sidebar-wrapper"
          >
            <el-tree
              :data="datesetTreeData"
              :props="{
                children: 'children',
                label: 'label'
              }"
              :expand-on-click-node="false"
              default-expand-all
              @node-click="handleClick"
            />
          </el-scrollbar>
        </div>
      </div>
      <div>
        <el-header :height="'30px'" class="layout-header">
          <div class="layout-header-title">
            字段设置
          </div>
        </el-header>
        <el-form v-if="$utils.isNotEmpty(formData)" :model="formData" label-width="120px" class="ibps-p-5">
          <el-form-item label="显示名:" prop="label">
            <el-input v-model="formData.label" />
          </el-form-item>

          <el-form-item v-if="formData.attrType !== 'table'" label="控件类型:" prop="field_type">
            <el-select v-model="formData.field_type" style="width:100%">
              <el-option
                v-for="item in fieldTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <!-- 枚举值格式 -->
          <el-form-item v-if="formData.field_type === 'radio' ||formData.field_type === 'checkbox' ||formData.field_type === 'select'" label-width="0" prop="options">
            <field-options v-model="formData.field_options.options" />
          </el-form-item>
          <!-- 日期格式 -->
          <el-form-item v-if="formData.field_type === 'datePicker'" label="日期格式" prop="datefmt_type">
            <el-select v-model="formData.field_options.datefmt_type" style="width:100%">
              <el-option
                v-for="(item,index) in datefmtTypeOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <el-input
              v-if="formData.field_options.datefmt_type ==='custom'"
              v-model="formData.field_options.datefmt"
            />
          </el-form-item>
          <!-- 数据字典 -->
          <el-form-item v-if="formData.field_type === 'dictionary'" label="数据字典" prop="dictionary">
            <ibps-type-select
              v-model="formData.field_options.dictionary"
              category-key="DIC_TYPE"
              node-key="typeKey"
              clearable
            />
          </el-form-item>
          <!-- 选择器 -->
          <template v-if="formData.field_type === 'selector'" prop="selector_type">
            <el-form-item label="选择器类型">
              <el-select v-model="formData.field_options.selector_type" style="width:100%">
                <el-option
                  v-for="item in selectorTypeOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="存储格式" prop="store">
              <el-select v-model="formData.field_options.store" style="width:100%">
                <el-option
                  v-for="item in selectorStoreOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>

          <!-- 自定义对话框 TODO: -->
          <template v-if="formData.field_type === 'customDialog'">
            <el-form-item>
              <template slot="label">自定义对话框</template>
              <ibps-data-template-selector2
                v-model="formData.field_options.dialog"
                type="dialog"
                placeholder="请选择自定义对话框"
              />
            </el-form-item>
            <el-form-item>
              <template slot="label">是否多选</template>
              <el-switch
                v-model="formData.field_options.multiple"
                active-value="Y"
                inactive-value="N"
              />
            </el-form-item>
            <el-form-item>
              <template slot="label">存储格式</template>
              <el-select v-model="formData.field_options.store" style="width:100%;">
                <el-option
                  v-for="item in dialogStoreOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <div v-else>
          <el-alert
            title="没有选择字段,请选择左侧的树的字段"
            type="warning"
          />
        </div>
      </div>
    </ibps-layout>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { buildTree } from '@/api/platform/data/dataset'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'
import SettingField from '../constants/setting-field'
import { datefmtTypeOptions, selectorTypeOptions, selectorStoreOptions, dialogStoreOptions } from '@/business/platform/form/constants/fieldOptions'

import FieldOptions from '@/business/platform/data/components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'

export default {
  components: {
    FieldOptions,
    IbpsTypeSelect,
    IbpsDataTemplateSelector2
  },
  props: {
    visible: Boolean,
    datasetKey: String,
    datasets: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      width: 220,
      height: 450,
      dialogVisible: false,
      datesetTreeData: [],
      defaultForm: {
        label: '',
        field_options: {}
      },
      formData: null,
      toolbars: [
        { key: 'confirm' },
        { key: 'reset', type: 'info', icon: 'el-icon-refresh-left', label: '重置' },
        { key: 'cancel' }
      ],
      fieldTypeOptions: SettingField.FIELD_TYPE,
      datefmtTypeOptions: datefmtTypeOptions,
      selectorTypeOptions: selectorTypeOptions,
      selectorStoreOptions: selectorStoreOptions,
      dialogStoreOptions: dialogStoreOptions,

      datasetsData: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    formData(val, oldVal) {
      if (val !== oldVal && this.$utils.isNotEmpty(val)) {
        const index = this.datasetsData.findIndex((data) => {
          return data.name === val.name
        })
        this.datasetsData.splice(index, 1, val)
      }
    }

  },
  methods: {
    handleClick(val) {
      const data = JSON.parse(JSON.stringify(val))
      if (data.attrType !== 'table' && this.$utils.isEmpty(data.field_type)) {
        data.field_type = 'text'
        data.field_options = {}
      }
      this.formData = data
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.saveData()
          break
        case 'reset':
          this.resetData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    saveData() {
      this.$emit('callback', this.datasetsData)
      this.closeDialog()
    },
    resetData() {
      this.$confirm('确认重置吗？重置后设置的字段会还原默认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        buildTree({
          datasetKey: this.datasetKey
        }).then(response => {
          ActionUtils.success('重置成功！')
          const datasets = response.data
          this.$emit('callback', datasets)
          this.closeDialog()
        }).catch((e) => {
        })
      }).catch(() => {})
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.formData = null
      this.datasetsData = JSON.parse(JSON.stringify(this.datasets))
      this.datesetTreeData = TreeUtils.transformToArrayFormat(this.datasets, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
    }
  }

}
</script>
<style lang="scss">
.setting-field-dialog{
  .el-dialog__body{
    padding:0
  }
  .left-aside {
    border-right: 1px solid #E4E7ED;
  }
   .layout-header {
      background: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;
      font-weight: bold;
      text-align: center;
      padding: 6px;
      position: relative;
      overflow: hidden;
  }
}

</style>
