<template>
  <div class="form-editor-table">
    <div class="panel panel-default">
      <div class="panel-heading">
        <span>子表字段</span>
        <div class="ibps-fr">
          <el-dropdown trigger="click" @command="addColumn">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus-outline" />
              添加字段
            </span>
            <el-dropdown-menu slot="dropdown" class="field-type-dropdown">
              <el-scrollbar
                tag="div"
                wrap-class="el-select-dropdown__wrap"
                view-class="el-select-dropdown__list"
              >
                <template v-for="field in fieldTypes">
                  <el-dropdown-item
                    :key="field.key"
                    :command="field.field_type"
                    :divided="field.divided"
                  >
                    <i :class="field.icon" />{{ field.label }}
                  </el-dropdown-item>
                </template>
              </el-scrollbar>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="panel-body">
        <div class="choices">
          <vue-draggable v-model="columns" v-bind="draggableOptions" @start=" isDragging = true" @end=" isDragging = false">
            <div v-for="(column,i) in columns" :key="i" class="option draggable">
              <div class="actions-left" @click="settingColumn(column)">
                <span>{{ column.label }}</span>
              </div>
              <el-button-group class="column-actions">
                <el-button size="small" type="text" icon="el-icon-delete" @click="removeColumn(i)" />
                <el-button data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
              </el-button-group>
            </div>
          </vue-draggable>
        </div>
        <div v-if="columns.length===0" class="el-table__empty-block">
          <span class="el-table__empty-text">未设置字段</span>
        </div>
      </div>
    </div>
    <!--操作按钮-->
    <div class="panel panel-default">
      <div class="panel-heading">
        <span>操作按钮</span>
        <div class="ibps-fr">
          <el-dropdown trigger="click" @command="addButton">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus-outline" />
              添加按钮
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-scrollbar
                tag="div"
                wrap-class="el-select-dropdown__wrap"
                view-class="el-select-dropdown__list"
              >
                <template v-for="button in buttonTypes">
                  <el-dropdown-item
                    :key="button.type"
                    :command="button.type"
                    :disabled="button.disabled"
                    :divided="button.divided"
                  >
                    <i :class="button.icon" />{{ button.label }}
                  </el-dropdown-item>
                </template>
              </el-scrollbar>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="panel-body">
        <div class="choices">
          <vue-draggable v-model="buttons" v-bind="draggableOptions" @start=" isDragging = true" @end=" isDragging = false">
            <div v-for="(button,i) in buttons" :key="i" class="option draggable">
              <div class="actions-left">
                <span><i :class="'ibps-icon-'+button.icon" />{{ button.label }}</span>
              </div>
              <el-button-group class="button-actions">
                <el-button size="small" type="text" icon="el-icon-setting" @click="settingButton(i)" />
                <el-button size="small" type="text" icon="el-icon-delete" @click="removeButton(i)" />
                <el-button data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
              </el-button-group>
            </div>
          </vue-draggable>
        </div>
        <div v-if="buttons.length===0" class="el-table__empty-block">
          <span class="el-table__empty-text">未设置按钮</span>
        </div>
      </div>
    </div>
    <edit-button
      :visible="buttonDialogVisible"
      :data="editData"
      :fields="fields"
      :columns="columns"
      @close="visible => buttonDialogVisible = visible"
      @callback="handleButton"
    />

  </div>
</template>
<script>
import FIELD_TYPES from '../../../constants/fieldTypes'
import { tableFieldTypes } from '../../../constants/fieldTypes'
import BUTTON_TYPES from '../../../constants/buttonTypes'
import { tableButtonTypes } from '../../../constants/buttonTypes'
import { getDefaultAttributes } from '../../utils'
import EditorMixin from '../mixins/editor'
import _defaultsDeep from 'lodash.defaultsdeep'
import VueDraggable from 'vuedraggable'
import EditButton from '../components/edit-button'

export default {
  components: {
    VueDraggable,
    EditButton
  },
  mixins: [EditorMixin],
  data() {
    return {
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        axis: 'y'
      },
      fieldTypes: tableFieldTypes,
      buttonDialogVisible: false,
      editIndex: -1,
      editData: {},
      defaultButtonValue: {
        type: '',
        code: '',
        label: '',
        position: '',
        style: '',
        icon: '',
        enabledCustom: 'N',
        dialog: '',
        custom: {
          link_condition: [],
          link_linkage: []
        }
      }
    }
  },
  computed: {
    columns: {
      get() {
        return this.fieldItem.field_options.columns ? this.fieldItem.field_options.columns || [] : []
      },
      set(value) {
        this.fieldItem.field_options.columns = value
      }
    },
    buttons: {
      get() {
        return this.fieldOptions ? this.fieldOptions.buttons || [] : []
      },
      set(value) {
        this.fieldItem.field_options.buttons = value
      }
    },
    buttonTypes() {
      return tableButtonTypes.map((button) => {
        if (this.buttons && this.buttons.length > 0) {
          button.disabled = button.type === 'custom' ? false : this.buttons.findIndex((btn) => {
            return btn.type === button.type
          }) > -1
        }
        return button
      })
    }
  },
  methods: {
    /**
     * 添加字段
     */
    addColumn(type) {
      const column = getDefaultAttributes(FIELD_TYPES[type])
      const id = this.$utils.guid()
      column.id = id
      this.columns.push(column)
    },
    /**
     * 删除字段
     */
    removeColumn(i) {
      this.columns.splice(i, 1)
    },
    /**
     * 设置字段
     */
    settingColumn(column) {
      column.code = this.fieldItem.name
      column.isSub = true
      this.$emit('select', column)
    },
    // =====================按钮======================
    /**
     * 添加按钮
     */
    addButton(type) {
      const button = JSON.parse(JSON.stringify(BUTTON_TYPES[type]))
      button.scope = null
      button.type = type
      button.position = 'all'
      this.buttons.push(button)
    },
    /**
     * 删除按钮
     */
    removeButton(i) {
      this.buttons.splice(i, 1)
    },
    /**
     * 设置按钮
     */
    settingButton(index) {
      const data = this.$utils.isNotEmpty(index) ? this.buttons[index] : {}
      const editButton = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultButtonValue)
      this.editData = this.buildButton(editButton)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.title = this.$utils.isNotEmpty(index) ? '编辑按钮' : '添加按钮'
      this.buttonDialogVisible = true
    },
    buildButton(editButton) {
      const button = BUTTON_TYPES[ editButton.type]
      if (this.$utils.isEmpty(editButton.position)) {
        editButton.position = button.position
      }
      if (this.$utils.isEmpty(editButton.style)) {
        editButton.style = button.style
      }
      return editButton
    },
    handleButton(button) {
      this.buttons.splice(this.editIndex, 1, button)
    }
  }
}
</script>
<style lang="scss">
.form-editor-table {
  .choices {
    .option {
      position: relative;
      margin-bottom: 5px;
      border: 1px solid transparent;
      background-color: #f5f7fa;
      padding: 5px 0 5px 20px;
      .actions-left{
        height: 24px;
        line-height: 24px;
      }
      .el-input {
        display: inline-block;
        width: 35%;
        vertical-align: middle;
      }
      .el-checkbox{
          margin-right: 10px;
      }

      .column-actions{
        position: absolute;
        width: 40px;
        top: 0;
        right: 0;
        line-height: 20px;
        padding-left: 5px;
        background: #e7f1f1;
        .el-button {
          padding-right: 4px;
          margin-right: 2px;
        }
        [data-role="sort_choice"]{
            cursor: move
        }
      }

      .button-actions {
        position: absolute;
        width: 60px;
        top: 0;
        right: 0;
        line-height: 20px;
        padding-left: 5px;
        background: #e7f1f1;
        .el-button {
          padding-right: 4px;
          margin-right: 2px;
        }
        [data-role="sort_choice"]{
            cursor: move
        }
      }

    }
  }
  .more-actions {
    text-align: right;
    margin-top: 10px;
    margin-right:10px;
    .el-button {
      border-right: 1px solid #D9D9D9;
      padding-right: 4px;
      margin-right: 2px;
    }
  }
  .other-choice-input {
    width: 100px  !important;
    margin-top: -3px;
    margin-left: 4px;
    background: rgba(255,255,255,0.65);
    height: 2em;
  }

}
// .sortable-ghost{
//   border: 1px dashed #C3C9D0;
//   margin-bottom: 5px
// }
</style>

