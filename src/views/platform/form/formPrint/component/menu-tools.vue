<template>
  <div class="menu-tool">
    <div class="menu-group">
      <div class="menu-item" @click="handleClick({disabled:menuToolsDisabled||isUndoDisable,handle:'undoRedo',params:'undo'})">
        <el-tooltip effect="dark" content="撤回" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled || isUndoDisable}">
            <span
              style="background-position:41.65% 0"
            />
          </div>
        </el-tooltip>
      </div>
      <div class="menu-item" @click="handleClick({disabled:menuToolsDisabled||isRedoDisable,handle:'undoRedo',params:'redo'})">
        <el-tooltip effect="dark" content="重做" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled||isRedoDisable}">
            <span
              style="background-position:0 100%"
            />
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" content="字体" placement="bottom">
          <el-dropdown
            :disabled="menuToolsDisabled"
            trigger="click"
            @command="(command)=>{handleCommand(command.value,'setRangeCellStyle','fontFamily') ;font = command.label}"
          >
            <div class="el-dropdown-link" :class="{'menu-disabled':menuToolsDisabled}">
              {{ font }}
              <i class="el-icon-arrow-down icon el-icon--right" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item) in fonts" :key="item.value" :disabled="menuToolsDisabled" :command="item">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
      <div class="menu-item">
        <el-tooltip effect="dark" content="字号" placement="bottom">
          <el-dropdown
            trigger="click"
            @command="(command)=>{handleCommand(command.value,'setRangeCellStyle','fontSize');fontSize=command.label}"
          >
            <div class="el-dropdown-link" :class="{'menu-disabled':menuToolsDisabled}">
              {{ fontSize }}
              <i class="el-icon-arrow-down icon el-icon--right" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(command) in fontSizes" :key="command.value" :disabled="menuToolsDisabled" :command="command">
                {{ command.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
      <div class="menu-item" :class="{'checked':_isBold}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'bold',value:_isBold?'':'font-style-bold',checked:true}})">
        <el-tooltip effect="dark" content="粗体" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:58.31% 0"
            />
          </div>
        </el-tooltip>
      </div>
      <div class="menu-item" :class="{'checked':_isItalic}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'italic',value:_isItalic?'':'font-style-italic',checked:true}})">
        <el-tooltip effect="dark" content="斜体" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:16.66% 50%"
            />
          </div>
        </el-tooltip>
      </div>
      <div class="menu-item" :class="{'checked':_isUnderline}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'underline',value:_isUnderline?'':'font-style-underline',checked:true}})">
        <el-tooltip effect="dark" content="下划线" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:33.32% 50%"
            />
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item" :class="{'checked':_verticalAlign === 'top'}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'verticalAlign',value:'font-vertical-align-top',checked:true}})">
        <el-tooltip effect="dark" content="顶部对齐" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:91.63% 50%"
            />
          </div>
        </el-tooltip>
      </div>
      <div class="menu-item" :class="{'checked':_verticalAlign === 'middle'}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'verticalAlign',value:'font-vertical-align-middle',checked:true}})">
        <el-tooltip effect="dark" content="居中对齐" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:74.97% 50%"
            />
          </div>
        </el-tooltip>
      </div>
      <div class="menu-item" :class="{'checked':_verticalAlign === 'bottom'}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'verticalAlign',value:'font-vertical-align-bottom',checked:true}})">
        <el-tooltip effect="dark" content="底部对齐" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:41.65% 50%"
            />
          </div>
        </el-tooltip>
      </div>

      <div class="menu-item" :class="{'checked':_textAlign === 'left'}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'textAlign',value:'font-text-align-left',checked:true}})">
        <el-tooltip effect="dark" content="左对齐" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:83.3% 0"
            />
          </div>
        </el-tooltip>
      </div>
      <div class="menu-item" :class="{'checked':_textAlign === 'center'}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'textAlign',value:'font-text-align-center',checked:true}})">
        <el-tooltip effect="dark" content="居中对齐" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:66.64% 0"
            />
          </div>
        </el-tooltip>
      </div>

      <div class="menu-item" :class="{'checked':_textAlign === 'right'}" @click="handleClick({disabled:menuToolsDisabled,handle:'fontStyle',params:{type:'textAlign',value:'font-text-align-right',checked:true}})">
        <el-tooltip effect="dark" content="右对齐" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}">
            <span
              style="background-position:74.97% 0"
            />
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" content="边框线" placement="bottom">
          <el-dropdown
            trigger="click"
            @command="(command)=>{handleCommand(command.value,'setBorder','cell-border-'+command.type,command.type)}"
          >
            <div class="el-dropdown-link">
              <div class="menu-select menu-select-icon" :class="{'menu-disabled':menuToolsDisabled}">
                <div class="menu-icon">
                  <span
                    style="background-position:8.33% 100%"
                  />
                </div>
                <i class="el-icon-arrow-down icon el-icon--right" />
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item) in borderStyles" :key="item.value" :disabled="menuToolsDisabled" :command="item">
                <div class="menu-icon prevent-default">
                  <span
                    :style="{
                      'background-position':item.position
                    }"
                  />
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
      <div class="menu-item">
        <el-tooltip effect="dark" content="边框线粗细" placement="bottom">
          <el-dropdown
            trigger="click"
            @command="(command)=>{handleCommand(command.value,'setRangeCellStyle','cell-border-width')}"
          >
            <div class="el-dropdown-link">
              <div class="menu-select menu-select-icon" :class="{'menu-disabled':menuToolsDisabled}">
                <div class="menu-icon">
                  <span
                    style="background-position:0 0"
                  />
                </div>
                <i class="el-icon-arrow-down icon el-icon--right" />
              </div>

            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(command) in borderWidths" :key="command.value" :disabled="menuToolsDisabled" :command="command">
                <div :class="[command.className]">{{ command.text }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" content="插入/删除" placement="bottom">
          <el-dropdown
            trigger="click"
            @command="(command)=>{handleCommand(command,'insertOrRemove')}"
          >
            <div class="el-dropdown-link">
              <div class="menu-select menu-select-icon" :class="{'menu-disabled':menuToolsDisabled}">
                <div class="menu-icon">
                  <span
                    style="background-position:33.32% 0"
                  />
                </div>
                <i class="el-icon-arrow-down icon el-icon--right" />
              </div>

            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(command,ci) in insertOrRemoveList" :key="ci" :disabled="menuToolsDisabled" :command="command.params">
                <div :class="[command.className]">{{ command.text }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" :content="isCellMerge?'取消合并':'合并'" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}" @click="handleClick({disabled:menuToolsDisabled,handle:'merge',params:!isCellMerge})">
            <span
              :style="{'background-position':isCellMerge?'49.98% 0px':'91.63% 0'}"
            />
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" content="插入图片" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}" @click="handleClick({disabled:menuToolsDisabled,handle:'setCellImage',params:''})">
            <span
              style="background-position:24.99% 0"
            />
          </div>
        </el-tooltip>
      </div>
      <div class="menu-item">
        <el-tooltip effect="dark" content="设置背景图" placement="bottom">
          <el-popover
            :disabled="menuToolsDisabled"
            placement="bottom"
            :width="160"
            trigger="click"
          >
            <set-bg-image @submit="(...args)=>{toolComponentSubmit(item,...args)}" />
            <div slot="reference" class="menu-select menu-select-icon" :class="{'menu-disabled':menuToolsDisabled}">
              <div class="menu-icon">
                <span
                  style="background-position:8.33% 0"
                />
              </div>
              <i class="el-icon-arrow-down icon el-icon--right" />
            </div>
          </el-popover>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" content="纸张设置" placement="bottom">
          <el-popover
            :disabled="menuToolsDisabled"
            placement="bottom"
            :width="280"
            trigger="click"
          >
            <set-pages @submit="(...args)=>{toolComponentSubmit('pageSizeChange',...args)}" />
            <div slot="reference" class="menu-select menu-select-icon" :class="{'menu-disabled':menuToolsDisabled}">
              <div class="menu-icon">
                <span
                  style="background-position:0 50%"
                />
              </div>
              <i class="el-icon-arrow-down icon el-icon--right" />
            </div>
          </el-popover>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" content="单元格高度设置" placement="bottom">
          <el-popover
            :disabled="menuToolsDisabled"
            placement="bottom"
            :width="280"
            trigger="click"
          >
            <set-row-height @submit="(...args)=>{toolComponentSubmit('rowHeightChange',...args)}" />
            <div slot="reference" class="menu-select menu-select-icon" :class="{'menu-disabled':menuToolsDisabled}">
              <div class="menu-icon">
                <span
                  style="background-position:24.99% 100%"
                />
              </div>
              <i class="el-icon-arrow-down icon el-icon--right" />
            </div>
          </el-popover>
        </el-tooltip>
      </div>
    </div>
    <div class="menu-group">
      <div class="menu-item">
        <el-tooltip effect="dark" content="页眉页脚" placement="bottom">
          <div class="menu-icon " :class="{'menu-disabled':menuToolsDisabled}" @click="handleClick({disabled:menuToolsDisabled,handle:'viewPrintHeaderAndFooter',params:''})">
            <span
              style="background-position:16.66% 100%"
            />
          </div>
        </el-tooltip>
      </div>
    </div>
    <ibps-uploader-selector-dialog
      :visible="selectorVisible"
    />
  </div>
</template>
<script>
import SetBgImage from './set-bg-image'
import SetPages from './set-pages'
import SetRowHeight from './set-row-height'
import IbpsUploaderSelectorDialog from '@/business/platform/file/uploader'
export default {
  components: {
    SetBgImage,
    SetPages,
    SetRowHeight,
    IbpsUploaderSelectorDialog
  },
  props: {
    tools: {
      type: Array,
      default() {
        return []
      }
    },
    isUndoAvailable: {
      type: Boolean,
      default: false
    },
    isRedoAvailable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: true
    },
    isMerge: {
      type: Boolean,
      default: false
    },
    isBold: {
      type: Boolean,
      default: false
    },
    isItalic: {
      type: Boolean,
      default: false
    },
    isUnderline: {
      type: Boolean,
      default: false
    },
    verticalAlign: {
      type: String,
      default: 'middle'
    },
    textAlign: {
      type: String,
      default: 'center'
    }
  },
  data() {
    return {
      fonts: [{ label: '宋体', value: 'font-family-SimSun' }, { label: '楷体', value: 'font-family-KaiTi' }, { label: '黑体', value: 'font-family-SimHei' }],
      font: '宋体',
      fontSize: '9',
      fontSizes: [
        { label: '9', value: 'font-size-9' },
        { label: '10', value: 'font-size-10' },
        { label: '11', value: 'font-size-11' },
        { label: '12', value: 'font-size-12' },
        { label: '14', value: 'font-size-14' },
        { label: '18', value: 'font-size-18' },
        { label: '24', value: 'font-size-24' },
        { label: '30', value: 'font-size-30' },
        { label: '36', value: 'font-size-36' }
      ],
      borderStyles: [
        {
          position: '24.99% 50%',
          value: 'cell-border-bottom',
          type: 'bottom'
        },
        {
          position: '83.3% 50%',
          value: 'cell-border-top',
          type: 'top'
        },
        {
          position: '8.33% 100%',
          value: 'cell-border-left',
          type: 'left'
        },
        {
          position: '8.33% 50%',
          value: 'cell-border-right',
          type: 'right'
        },
        {
          position: '49.98% 50%',
          value: 'cell-border-none',
          type: 'none'
        },
        {
          position: '66.64% 50%',
          value: 'cell-border-top cell-border-bottom cell-border-left cell-border-right',
          type: 'all'
        },
        {
          position: '58.31% 50%',
          value: 'outer',
          type: 'outer'
        }
      ],

      borderWidths: [
        {
          className: '',
          text: '无边框',
          value: 'cell-border-width-none'
        },
        {
          className: 'menu-item-line menu-item-line-1',
          value: 'cell-border-width-1'
        },
        {
          className: 'menu-item-line  menu-item-line-2',
          value: 'cell-border-width-2'
        },
        {
          className: 'menu-item-line  menu-item-line-3',
          value: 'cell-border-width-3'
        },
        {
          className: 'menu-item-line  menu-item-line-4',
          value: 'cell-border-width-4'
        }
      ],
      insertOrRemoveList: [
        {
          className: 'menu-item-handle insert-rows',
          text: '插入行',
          params: 'insert_row'
        },
        {
          className: 'menu-item-handle insert-column',
          text: '插入列',
          params: 'insert_col'
        },
        {
          className: 'menu-item-handle remove-rows',
          text: '删除行',
          params: 'remove_row'
        },
        {
          className: 'menu-item-handle remove-column',
          text: '删除列',
          params: 'remove_col'
        }
      ],
      selectorVisible: false
    }
  },
  computed: {
    isUndoDisable() {
      return !this.isUndoAvailable
    },
    isRedoDisable() {
      return !this.isRedoAvailable
    },
    menuToolsDisabled() {
      return this.disabled
    },
    isCellMerge() {
      return this.isMerge
    },
    _isBold() {
      return this.isBold
    },
    _isItalic() {
      return this.isItalic
    },
    _isUnderline() {
      return this.isUnderline
    },
    _verticalAlign() {
      return this.verticalAlign
    },
    _textAlign() {
      return this.textAlign
    }
  },
  methods: {
    changeSelected() {

    },
    insertOrRemove(params) {
      this.$emit('insertOrRemove', params)
    },
    merge(params) {
      this.$emit('merge', params)
    },
    undoRedo(params) {
      this.$emit('undoRedo', params)
    },
    setCellImage() {
      this.$emit('setCellImage')
    },
    fontStyle({ disabled, type, value, checked = false }) {
      this.handleEmit('setRangeCellStyle', value, type, checked)
    },
    viewPrintHeaderAndFooter(params) {
      this.$emit('viewPrintHeaderAndFooter', params)
    },
    handleEmit(...args) {
      this.$emit(...args)
    },
    handleClick(item) {
      if (item.disabled || this.menuToolsDisabled) { return }

      if (item.handle) {
        this[item.handle](item.params)
      }
    },
    toolComponentSubmit(eventName, ...args) {
      this.handleEmit(eventName, ...args)
    },
    handleCommand(command, handle, key, ...args) {
      // this[handle](command)
      if (this.menuToolsDisabled) { return }
      this.handleEmit(handle, command, key, ...args)
    }
  }
}
</script>
<style lang="scss" >
.menu-tool {
  background: #fafafa;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .menu-disabled{
    cursor: not-allowed;
    opacity: 0.4;
  }
  .menu-group {
    display: flex;
    position: relative;
    align-items: center;
    padding: 5px;
    &:last-of-type{
      &::after{
        display: none;
      }
    }
    &::after{
      content: '';
      background: #BEBEBE;
      width: 1px;
      height: 18px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0
    }
  }
  .icon{
    color: #409eff;
    margin-left: 0;
  }
  .menu-item {
    border: 1px solid transparent;
    transition: border 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 3px;

    .ban {
      cursor: not-allowed;
    }

    &:hover,
    &.checked {
      border-color: #e0e0e0;
    }
  }
}
.menu-icon {
  width: 18px;
  height: 18px;
  position: relative;

  span {
    position: absolute;
    overflow: hidden;
    background: url("./../../../../../assets/images/form/print_menu_tool_icon.png")
      no-repeat;
    /*background-position: 41.65% 0;*/
    background-size: 243px 54px;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /*opacity: .4;*/
  }
}
.menu-select-icon {
  display: flex;
  align-items: center;
}
.menu-select {
  min-width: 40px;
}
.prevent-default{
  pointer-events: none;
}
.menu-item-line {
  margin: 7px auto;
  position: relative;
  height: 30px;
  &::after{
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    border-bottom: solid #000;
    top: 50%;
    transform: translateY(-50%);
  }
  &.menu-item-line-1 {
    &::after{
      border-width: 1px;
    }
  }
  &.menu-item-line-2 {
   &::after{
      border-width: 2px;
    }
  }
  &.menu-item-line-3 {
   &::after{
      border-width:3px;
    }
  }
  &.menu-item-line-4 {
   &::after{
      border-width: 4px;
    }
  }
}
.menu-item-handle{
  text-align: center;
  padding-left: 20px;
  position: relative;
  &::before{
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    overflow: hidden;
    background: url("./../../../../../assets/images/form/print_menu_tool_icon.png") no-repeat;
    background-size: 182px 42px;
  }
  &.insert-rows{
    &::before{
      background-position: 16.66% 0;
    }
  }
    &.insert-column{
     &::before{
       background-position: 33.32% 0;
     }
  }
    &.remove-rows{
      &::before{
        background-position: 99.96% 50%;
      }
  }
    &.remove-column{
      &::before{
        background-position: 99.96% 0;
      }
  }
}
</style>
