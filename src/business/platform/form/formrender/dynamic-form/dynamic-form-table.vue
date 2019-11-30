<template>
  <div class="dynamic-form-table">
    <template v-if="columns && columns.length > 0">
      <!--表内模式-->
      <div v-if="mode === 'inner' || mode === 'dialog'" class="dynamic-form-table__inner panel panel-info">
        <div class="panel-heading ibps-clearfix">
          <div class="ibps-fl dynamic-form-table__label">{{ field.label }}</div>
          <div v-if=" toolbarButton && toolbarButton.length >0" class="ibps-fr">
            <el-button-group>
              <el-button
                v-for="(button,index) in toolbarButton"
                :key="index"
                :type="button.style"
                :icon="'ibps-icon-'+button.icon"
                @click="handleActionEvent(button)"
              >
                {{ button.label }}
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div class="panel-body">
          <el-table
            ref="elTable"
            :data="dataModel"
            :row-class-name="tableRowClassName"
            :show-summary="showSummary"
            :sum-text="sumText"
            border
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-if="!readonly"
              type="selection"
              width="50"
            />
            <el-table-column
              v-if="field.field_options.index"
              type="index"
              label="序号"
              width="50"
            />
            <template v-for="(column,j) in columns">
              <el-table-column
                v-if="!columnHidden(column)"
                :key="j"
                :prop="column.name"
                :label="column.label"
              >
                <template slot-scope="scope">
                  <template v-if="dataModel&& dataModel.length >0">
                    <dynamic-form-table-item
                      :key="scope.$index+j"
                      :models.sync="dataModel[scope.$index]"
                      :index="scope.$index"
                      :field="column"
                      :rights="columnsRights"
                      :code="code"
                      :mode="mode"
                      :readonly-style="readonlyStyle"
                    />
                  </template>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              v-if="manageButton && manageButton.length >0"
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  v-for="(button,index) in manageButton"
                  :key="index"
                  :type="button.style"
                  :icon="'ibps-icon-'+button.icon"
                  plain
                  @click="handleActionEvent(button,scope.$index)"
                >  {{ button.label }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--================块模式=================================-->
      <template v-else-if="mode === 'block'">
        <template v-if="dataModel&& dataModel.length >0">
          <template v-for="(data,index) in dataModel ">
            <div :key="index" class="dynamic-form-table__block panel panel-info">
              <div class="panel-heading ibps-clearfix">
                <!--块模式：工具栏-->
                <div class="ibps-fl dynamic-form-table__label">{{ field.label }}({{ index+1 }})</div>
                <div v-if="toolbarButton && toolbarButton.length >0" class="ibps-fr">
                  <el-button-group>
                    <template v-for="(button,b) in toolbarButton ">
                      <template v-if="!(button.type === 'remove' && dataModel.length==1) ">
                        <el-button
                          :key="b"
                          :type="button.style"
                          :icon="'ibps-icon-'+button.icon"
                          @click="handleActionEvent(button,index)"
                        >
                          {{ button.label }}
                        </el-button>
                      </template>
                    </template>
                  </el-button-group>
                </div>
              </div>
              <!--块模式：表单-->
              <div class="panel-body">
                <template
                  v-for="(column,j) in columns"
                >
                  <dynamic-form-table-item
                    :key="index+j"
                    :models.sync="dataModel[index]"
                    :index="index"
                    :field="column"
                    :rights="columnsRights"
                    :code="code"
                    :mode="mode"
                    :readonly-style="readonlyStyle"
                  />
                </template>
              </div>
            </div>
          </template>
        </template>
      </template>
    </template>
    <el-table
      v-else
      :data="[]"
      empty-text="您尚未创建任何字段。请在表单中添加字段。"
      border
    />
  </div>
</template>
<script>
import emitter from 'element-ui/src/mixins/emitter'
import { valueEquals } from 'element-ui/src/utils/util'
import FormOptions from '../../constants/formOptions'
import ActionUtils from '@/utils/action'
import FormUtil from '../../utils/formUtil'
import DynamicFormTableItem from './dynamic-form-table-item'
import { hasPermission } from '@/business/platform/form/constants/buttonTypes'

export default {
  components: {
    DynamicFormTableItem
  },
  mixins: [emitter],
  props: {
    value: [Array, Object], // 值
    field: {
      type: Object,
      required: true
    },
    defaultValue: { // 默认值
      type: Object
    },
    rights: {
      type: [String, Object]
    },
    readonly: {
      type: Boolean,
      default: false
    },
    readonlyStyle: {
      type: String,
      default: 'text'
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    let val = []
    if (this.$utils.isNotEmpty(this.value)) {
      val = this.value || this.defaultValue
    }
    return {
      dataModel: val,
      multipleSelection: '',
      fieldRights: {}, // 子表权限
      columnsRights: {},
      buttonsRights: {}
    }
  },
  computed: {
    fieldOptions() {
      const field_options = this.field.field_options || {}
      field_options.default_value_type = field_options.default_value_type || 'fixed'
      return field_options
    },
    toolbarButton() {
      return this.filterButtons('toolbar')
    },
    manageButton() {
      return this.filterButtons('manage')
    },
    mode() {
      return this.field.field_options.mode || 'inner'
    },
    showSummary() {
      return this.field.field_options.summary || false
    },
    sumText() {
      return this.field.field_options.sum_text || '合计'
    },
    code() {
      return this.field.name || ''
    },
    columns() {
      return this.field.field_options.columns || []
    },
    buttons() {
      return this.field.field_options.buttons || []
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val, oldVal) {
        this.dataModel = val
        if (!valueEquals(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', val)
        }
      }
    },
    dataModel: {
      deep: true,
      handler(val, oldVal) {
        this.$emit('update:value', val)
      }
    },
    defaultValue: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.$utils.isEmpty(this.dataModel) && this.mode === 'block') {
          this.handleAdd()
        }
      }
    },
    rights: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.fieldRights = val ? val[this.field.name] : {}
        }
      },
      deep: true,
      immediate: true
    },
    // 字段权限
    fieldRights: {
      handler(fieldRights) {
        if (this.$utils.isNotEmpty(fieldRights)) {
          this.columnsRights = this.getColumnsRights(fieldRights['columns'])
          this.buttonsRights = fieldRights['buttons']
        } else {
          if (this.$utils.isNotEmpty(this.columns)) {
            this.columns.forEach(column => {
              this.columnsRights[column.name] = FormUtil.getDefaultRigths(column) || (this.readonly ? FormOptions.t.PERMISSIONS.READ : null)
            })
          }
          if (this.$utils.isNotEmpty(this.buttons)) {
            this.buttons.forEach(button => {
              this.buttonsRights[button.type] = !this.readonly
            })
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    columnHidden(column) { // 是否隐藏
      return this.columnsRights[column.name] === FormOptions.t.PERMISSIONS.HIDE || column.field_type === 'hidden'
    },
    getColumnsRights(rights = {}) {
      const columnsRights = {}
      if (this.columns && this.columns.length > 0) {
        this.columns.forEach(column => {
          columnsRights[column.name] = rights[column.name] || FormUtil.getDefaultRigths(column)
        })
      }
      return columnsRights
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.$index = rowIndex
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    handleRowClick(row, event, column) {
      this.$refs.elTable.toggleRowSelection(row)
    },
    filterButtons(action) {
      if (this.readonly) return
      const buttons = []
      this.buttons.forEach(button => {
        if (hasPermission(button.type, action) && // 有位置权限
        (!button.position || button.position === 'all' || button.position === action) &&// 有位置权限
        (this.$utils.isEmpty(this.buttonsRights[button.type]) || this.buttonsRights[button.type]) // 有按钮权限
        ) {
          const b = JSON.parse(JSON.stringify(button))
          b.key = button.type
          b.position = action
          buttons.push(b)
        }
      })
      return buttons
    },
    handleActionEvent(button, index) {
      //
      // if (button.type === 'add' || button.type === 'edit' || button.type === 'remove') {
      //   // 前置事件
      //   const beforSubButtonResult = JForm._beforeSubButton(this, button.type, i, this.models)
      //   if (typeof (beforSubButtonResult) !== 'undefined' && !beforSubButtonResult) {
      //     return
      //   }
      // }
      if (button.type === 'add') {
        this.handleAdd()
      } else if (button.type === 'edit') {
        this.handleEdit(index)
      } else if (button.type === 'remove') {
        this.handleRemove(button, index)
      }
    },
    handleAdd() {
      this.dataModel.push(JSON.parse(JSON.stringify(this.defaultValue)))
    },
    handleRemove({ position }, index) {
      const selection = []
      if (position === 'toolbar' && this.mode !== 'block') {
        this.multipleSelection.forEach(row => {
          selection.push(row.$index)
        })
      } else {
        selection.push(index)
      }
      ActionUtils.removeRecord(selection, '确定删除？', true).then((ids) => {
        for (let i = this.dataModel.length - 1; i >= 0; i--) {
          if (ids.indexOf(i) > -1) {
            this.dataModel.splice(i, 1)
          }
        }
        // 后置事件
      })
    }
  }
}
</script>
<style lang="scss">
.dynamic-form-table{

  .panel-heading{
    border-bottom:0;
    border-left: 1px solid #dde7ee;
    border-right: 1px solid #dde7ee;
  }
  .dynamic-form-table__inner{
    .panel-body{
       padding: 0;
    }
  }
  .dynamic-form-table__block{
    padding-bottom:10px;
    .panel-body{
      border: 1px solid #dde7ee;
    }
  }
}
.is-error{
  .dynamic-form-table{
    border: 1px solid #F56C6C;
  }
}
.is-required{
  .dynamic-form-table__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
  }
}
</style>

