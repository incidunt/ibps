<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span>{{ title }}</span>
      <div class="ibps-fr ibps-pr-10">
        <el-dropdown :hide-on-click="false" trigger="click" @command="addButton">
          <el-tooltip :content="'添加按钮'" placement="top">
            <span class="el-dropdown-link">
              <i class="el-icon-circle-plus el-icon--right" />
            </span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-scrollbar
              tag="div"
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"
            >
              <el-dropdown-item
                v-for="(button,index) in functionButtons"
                :key="button[buttonKey]+index"
                :disabled="isDisabled(button[buttonKey])"
                :command="button"
              >
                {{ button.label }}
              </el-dropdown-item>
            </el-scrollbar>
          </el-dropdown-menu>
        </el-dropdown>
        <el-divider direction="vertical" />
        <!-- 快捷权限设置-->
        <el-dropdown trigger="click" @command="settingRights">
          <el-tooltip content="快捷权限设置" placement="top">
            <span class="el-dropdown-link">
              <i class="ibps-icon ibps-icon-shield" />
            </span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-scrollbar
              tag="div"
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"
            />
            <el-dropdown-item
              v-for="(rightsType,index) in rightsTypes"
              :key="rightsType.value+index"
              :command="rightsType.value"
            >
              {{ rightsType.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="panel-body">
      <vue-draggable
        v-if="buttons && buttons.length >0"
        v-model="buttons"
        v-bind="draggableOptions"
        class="list-group"
        @start="isDragging = true"
        @end="()=>{isDragging= false}"
      >
        <div v-for="(button,i) in buttons" :key="button[buttonKey]+i" class="list-group-item">
          <div class="actions-left">
            {{ button.label }}
          </div>
          <el-button-group class="actions">
            <el-button size="small" type="text" title="设置" icon="ibps-icon-cog" @click="settingButton(i)" />
            <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeButton(i)" />
            <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
          </el-button-group>
        </div>
      </vue-draggable>
      <div v-else>
        <el-alert
          :closable="false"
          :title="'未设置'+title"
          type="info"
          center
        />
      </div>
    </div>
    <el-dialog
      ref="editFormDialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="title"
      class="edit-dialog"
      top="5vh"
      width="60%"
      append-to-body
      @close="closeDialog"
    >
      <slot v-if="dialogVisible" :data.sync="editData" name="edit" />
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="toolbars"
          @action-event="handleActionEvent"
        />
      </div>
    </el-dialog>
    <rights-config
      :visible="dialogRightsVisible"
      title="权限配置"
      @callback="handleRightsConfirm"
      @close="visible => dialogRightsVisible = visible"
    />
  </div>
</template>
<script>
import VueDraggable from 'vuedraggable'
import RightsConfig from '@/business/platform/rights/config'
import { rightsTypes } from '../constants'
import _defaultsDeep from 'lodash.defaultsdeep'
import ButtonsConstants from '@/business/platform/data/constants/buttons'

export default {
  components: {
    VueDraggable,
    RightsConfig
  },
  props: {
    title: {
      type: String
    },
    prop: {
      type: String
    },
    template: { // 模版
      type: Object,
      default: () => {}
    },
    types: {
      type: Array
    },
    defaultValue: {// 默认值
      type: Object,
      default: () => {
        return {
          rights: [{ type: 'all' }]
        }
      }
    }
  },
  data() {
    return {
      isDragging: false,
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      rightsTypes: rightsTypes,
      buttonKey: 'button_type',
      dialogVisible: false,
      editData: {},
      editIndex: -1,
      dialogRightsVisible: false,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    buttons: {
      get() {
        return this.template[this.prop] || []
      },
      set(value) {
        this.handleInput(value)
      }
    },
    functionButtons() {
      const buttons = []
      this.types.forEach(type => {
        const button = ButtonsConstants[type]
        if (!button) {
          console.error('Undefined type:' + type)
          return false
        }
        button[this.buttonKey] = type
        buttons.push(button)
      })
      return buttons
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
    // 添加按钮
    addButton(button) {
      const buttons = this.buttons
      buttons.push({
        label: button.label,
        [this.buttonKey]: button[this.buttonKey]
      })
      this.handleInput(buttons)
    },
    // 设置按钮
    settingButton(i) {
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(this.buttons[i])), this.defaultValue)
      this.editIndex = i
      this.dialogVisible = true
    },
    // 删除按钮
    removeButton(i) {
      this.buttons.splice(i, 1)
      this.handleInput(this.buttons)
    },
    settingRights(type) {
      if (this.buttons.length === 0) { return }
      if (type === 'none' || type === 'all') {
        const data = [{ type: type }]
        this.setRightsData(data)
      } else {
        this.dialogRightsVisible = true
      }
    },
    handleRightsConfirm(data) {
      if (data.length === 0) {
        data = [{ type: 'none' }]
      }
      this.setRightsData(data)
    },
    setRightsData(data) {
      const buttons = this.buttons.map((button) => {
        button.rights = data
        return button
      })
      this.handleInput(buttons)
      this.$message.closeAll()
      this.$message.success('设置权限成功')
    },
    // 是否禁用
    isDisabled(key) {
      if (key === 'custom' || key === 'sefStartFlow' || !this.buttons) {
        return
      }
      return !!this.buttons.find((button) => {
        return button[this.buttonKey] === key
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.dialogVisible = false
    },
    handleConfirm() {
      const data = this.$refs.editFormDialog.$slots.default[0].componentInstance.getFormData()
      if (!data) {
        return
      }
      this.buttons.splice(this.editIndex, 1, data)
      this.handleInput(this.buttons)
      this.closeDialog()
    },
    handleInput(value) {
      this.$emit('input', this.prop, value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin: 5px;
    border: 1px solid #ddd;
    .actions-left{
      height: 24px;
      line-height: 24px;
      margin-left: 5px;
    }

    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        // margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: right;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }

</style>
