<template>
  <div
    v-clickoutside="handleClose"
    class="el-tree-select"
    @click="toggleTree"
  >
    <div
      v-if="multiple"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' }"
      class="el-tree-select__tags"
    >
      <transition-group @after-leave="resetInputHeight">
        <el-tag
          v-for="item in selected"
          :key="item.value"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          type="info"
          disable-transitions
          @close.stop="deleteTag(item)"
        >
          <span class="el-tree-select__tags-text">{{ item.label }}</span>
        </el-tag>
      </transition-group>
      <input
        v-if="filterable"
        ref="input"
        v-model="query"
        :disabled="selectDisabled"
        :autocomplete="false"
        :style="{ width: inputLength + 'px'}"
        type="text"
        class="el-tree-select__input"
        @focus="handleFocus"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @input="e => handleQueryChange(e.target.value)"
      >
    </div>
    <el-input
      ref="reference"
      v-model="selectedLabel"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :size="selectSize"
      :class="{ 'is-focus': visible }"
      :placeholder="currentPlaceholder"
      type="text"
      @focus="handleFocus"
      @keyup.native="onInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template v-if="$slots.prefix" slot="prefix">
        <slot name="prefix" />
      </template>
      <i
        slot="suffix"
        :class="suffixIconClass"
        @click="handleIconClick"
      />
    </el-input>
    <transition name="el-zoom-in-top">
      <div
        v-show="visible"
        ref="popper"
        :style="{minWidth: inputWidth + 'px'}"
        class="el-tree-select-dropdown el-popper"
      >
        <el-scrollbar
          wrap-class="el-tree-select-dropdown__wrap"
        >
          <el-tree
            ref="tree"
            :data="data"
            :lazy="lazy"
            :load="load"
            :check-on-click-node="checkOnClickNode"
            :props="treeProps"
            :show-checkbox="showCheckbox"
            :expand-on-click-node="false"
            :check-strictly="checkStrictly"
            :filter-node-method="filterNodeMethod"
            :default-checked-keys="checkedKeys"
            :node-key="nodeKey"
            :empty-text="emptyText"
            :current-node-key="currentNodeKey"
            default-expand-all
            highlight-current
            @check="handleCheck"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
// 参考 https://github.com/ElemeFE/element/blob/29e76cda035bb8a951e6792a33ba4ff5056515a0/packages/tree-select/src/main.vue
// 可能下个版本出现，再进行修复
// API https://deploy-preview-12104--element.netlify.com/#/zh-CN/component/tree-select
// import ElInput from 'element-ui/packages/input'
// import ElTree from 'element-ui/packages/tree/src/tree.vue'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Popper from 'element-ui/src/utils/vue-popper'
import { PopupManager } from 'element-ui/src/utils/popup'
import { valueEquals } from 'element-ui/src/utils/util'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import emitter from 'element-ui/src/mixins/emitter'
import { t } from 'element-ui/src/locale'
// TODO: 等 vue-popper 合并后，这里还需要做出调整
const popperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions,
    visibleArrow: {
      type: Boolean,
      default: true
    }
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
}
const sizeMap = {
  'medium': 36,
  'small': 32,
  'mini': 28
}

export default {
  name: 'ibps-tree-select',
  // components: {
  //   ElInput,
  //   ElTree
  // },
  directives: { Clickoutside },
  mixins: [popperMixin, emitter],
  provide() {
    return {
      elTreeSelect: this
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
  props: {
    data: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },
    multiple: Boolean,
    disabled: Boolean,
    clearable: Boolean,
    size: {
      type: String,
      validator(val) {
        return ['medium', 'small', 'mini'].indexOf(val) > -1
      }
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    props: Object,
    placeholder: {
      type: String,
      default() {
        return t('el.treeSelect.placeholder')
      }
    },
    selectMode: {// 选值模式 leaf、any
      type: String,
      default: 'any',
      validator: function(value) {
        return ['any', 'leaf'].indexOf(value) !== -1
      }
    },
    displayMode: {// 显示模式 path 、name
      type: String,
      default: 'name',
      validator: function(value) {
        return ['name', 'path'].indexOf(value) !== -1
      }
    },
    separator: {// 树形选项分隔符
      type: String,
      default: '/'
    },
    lazy: Boolean,
    load: Function,
    showCheckbox: Boolean,
    checkStrictly: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    emptyText: String,
    showCheckedStrategy: { // 显示多选按钮
      type: String,
      default: 'child',
      validator(val) {
        return ['all', 'parent', 'child'].indexOf(val) > -1
      }
    }
  },
  data() {
    return {
      query: '',
      selectedLabel: '',
      inputLength: 20,
      visible: false,
      inputWidth: 0,
      inputHovering: false,
      treeVisibleOnFocus: false,
      selected: this.multiple ? [] : {},
      checkOnClickNode: false,
      treeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  computed: {
    suffixIconClass() {
      let classes = ['el-tree-select__caret', 'el-input__icon']
      const criteria = this.clearable &&
          !this.selectDisabled &&
          this.inputHovering &&
          !this.multiple &&
          this.value !== undefined &&
          this.value !== null &&
          this.value !== ''
      if (criteria) {
        classes = [...classes, 'el-icon-circle-close', 'is-show-close']
      } else {
        classes.push('el-icon-arrow-down')
        if (this.visible) {
          classes.push('is-reverse')
        }
      }
      return classes
    },
    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    selectSize() {
      return this.size || (this.elFormItem || {}).elFormItemSize || (this.$ELEMENT || {}).size
    },
    collapseTagSize() {
      return ['small', 'mini'].indexOf(this.selectSize) > -1
        ? 'mini'
        : 'small'
    },
    readonly() {
      const isIE = !this.$isServer && !isNaN(Number(document.documentMode))
      return !this.filterable || this.multiple || !isIE && !this.visible
    },
    checkedKeys() {
      if (this.multiple && this.showCheckbox) {
        return this.value || []
      } else {
        return []
      }
    },
    currentNodeKey() {
      if (this.multiple) {
        return this.value.length > 0 ? this.value[0].value : ''
      } else {
        if (this.value && Array.isArray(this.value)) {
          return this.value[0] || ''
        } else {
          return this.value || ''
        }
      }
    },
    currentPlaceholder() {
      if (!this.value || (Array.isArray(this.value) && this.value.length === 0)) {
        return this.placeholder
      } else {
        return ''
      }
    },
    labelKey() {
      return this.treeProps['label'] || 'name'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.updatePopper()
        if (this.multiple && this.filterable) {
          this.$refs.input.focus()
        }
        this.$emit('focus', this)
        if (!this.multiple && this.filterable) {
          this.broadcast('ElInput', 'inputSelect')
        }
      } else {
        this.destroyPopper()
        if (this.$refs.input) {
          this.$refs.input.blur()
        }
        this.$emit('blur', this)
        if (!this.multiple) {
          this.setSelected()
        }
        if (this.filterable) {
          setTimeout(() => {
            this.handleQueryChange('')
          }, 100)
        }
      }
    },
    value(val, oldVal) {
      if (this.multiple) {
        this.resetInputHeight()
      }
      this.setSelected()
      if (!valueEquals(val, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },
    data() {
      this.setSelected()
    },
    props: {
      handler(val, oldVal) {
        this.treeProps = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.multiple && this.showCheckbox) {
      this.checkOnClickNode = true
    }
    this.referenceElm = this.$refs.reference.$el
    this.popperElm = this.$refs.popper
    this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    addResizeListener(this.$el, this.handleResize)
    this.setSelected()
    this.fixZIndex()
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.handleResize)
  },
  methods: {
    /**
     * zxh 修复zindex 不是最高的被遮住
     */
    fixZIndex() {
      const allEl = [...document.all]
      let zIndex = 0
      allEl.forEach((el) => {
        const z = Number(window.getComputedStyle(el).zIndex) || 0
        if (z > zIndex) { zIndex = z }
      })
      const z = PopupManager.nextZIndex()
      if (zIndex >= z) {
        for (let i = 0; i < (zIndex - z); i++) {
          PopupManager.nextZIndex()
        }
      }
    },
    handleFocus(event) {
      this.treeVisibleOnFocus = true
      this.visible = true
      this.$emit('focus', event)
    },
    handleClose() {
      this.visible = false
    },
    toggleTree() {
      if (this.selectDisabled) return
      if (this.treeVisibleOnFocus) {
        this.treeVisibleOnFocus = false
      } else {
        this.visible = !this.visible
      }
    },
    handleIconClick(event) {
      if (this.suffixIconClass.indexOf('el-icon-circle-close') > -1) {
        event.stopPropagation()
        this.visible = false
        this.$emit('input', '')
        this.emitChange('')
        this.$emit('clear')
        this.selected = {}
        this.selectedLabel = ''
      }
    },
    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val, this.getNodeData(val))
      }
    },
    handleQueryChange(val) {
      this.$refs.tree.filter(val)
    },
    handleNodeClick(data, node, tree) {
      if (this.showCheckbox) return
      if (this.selectMode === 'leaf' && !node.isLeaf) {
        this.$message.warning('请选择叶子节点')
        return
      }
      const value = data[this.nodeKey]
      if (this.multiple) {
        const valueCopy = this.value.slice()
        const index = this.getValueIndex(valueCopy, value)
        if (index > -1) {
          valueCopy.splice(index, 1)
        } else {
          valueCopy.push(value)
        }
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
        this.$emit('input', valueCopy)
        this.emitChange(valueCopy)
      } else {
        // if (value === this.value) {
        //   value = ''
        // }
        this.$emit('input', value)
        this.emitChange(value)
        this.visible = false
      }
    },
    handleCheck(data, info) {
      const { checkedNodes } = info
      let nodes = []
      switch (this.showCheckedStrategy) {
        case 'parent':
          nodes = this.getTreeCheckedParentNodes()
          break
        case 'child':
          nodes = checkedNodes.filter(({ children }) => !(children && children.length))
          break
        default:
          nodes = checkedNodes
          break
      }
      const values = nodes.map((node) => node[this.nodeKey])
      if (this.filterable) this.$refs.input.focus()
      this.$emit('input', values)
      this.emitChange(values)
    },
    getTreeCheckedParentNodes() {
      const checkedNodes = []
      const traverse = (node) => {
        const childNodes = node.root ? node.root.childNodes : node.childNodes
        childNodes.forEach(child => {
          if (child.checked && !child.isLeaf) {
            checkedNodes.push({
              label: child.data.label,
              value: child.data.value
            })
          } else {
            traverse(child)
          }
        })
      }
      traverse(this.$refs.tree.store)
      return checkedNodes
    },
    getNodeData(value) {
      let node = null
      if (Array.isArray(this.data)) {
        const traverse = (arr, lablePrefix = []) => {
          for (let i = 0; i < arr.length; i++) {
            const child = arr[i]
            if (child[this.nodeKey] === value) {
              node = {
                label: child[this.labelKey],
                value: child[this.nodeKey],
                path: [...lablePrefix, child[this.labelKey]].join(this.separator),
                data: child
              }
              break
            } else if (child.children && child.children.length > 0) {
              traverse(child.children, [...lablePrefix, child[this.labelKey]])
            }
          }
        }
        traverse(this.data)
      }
      return node
    },
    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel
        this.handleQueryChange(this.query)
      }
    },
    filterNodeMethod(value, data) {
      if (!value) return true
      this.$nextTick(this.updatePopper)
      if (typeof this.filterMethod === 'function') {
        return this.filterMethod(value, data)
      } else {
        return data.label.indexOf(value) !== -1
      }
    },
    resetInputHeight() {
      this.$nextTick(() => {
        if (!this.$refs.reference) return
        const inputEl = this.$refs.reference.$refs.input
        const tags = this.$refs.tags
        let height = sizeMap[this.selectSize] || 40
        if (this.selected.length !== 0) {
          height = Math.max((tags.clientHeight + (tags.clientHeight > height ? 6 : 0)), height)
        }
        inputEl.style.height = `${height}px`
        if (this.visible) {
          this.updatePopper()
        }
      })
    },
    getValueIndex(arr = [], value) {
      let index = -1
      arr.some((item, i) => {
        if (item === value) {
          index = i
          return true
        } else {
          return false
        }
      })
      return index
    },
    deletePrevTag(e) {
      if (e.target.value.length <= 0) {
        this.selected.splice(-1, 1)
        const values = this.selected.map(({ value }) => value)
        this.$emit('input', values)
        this.emitChange(values)
      }
    },
    deleteTag(item) {
      this.selected = this.selected.filter(selectItem => selectItem !== item)
      const values = this.selected.map(({ value }) => value)
      this.$emit('input', values)
      this.emitChange(values)
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    },
    handleResize() {
      this.resetInputWidth()
      if (this.multiple) this.resetInputHeight()
    },
    setSelected() {
      if (this.multiple) {
        const result = []
        if (Array.isArray(this.value)) {
          this.value.forEach(value => {
            const node = this.getNodeData(value)
            if (node) result.push(node)
          })
        }
        this.selected = result
        if (result.length === 0) {
          this.selectedLabel = ''
        }
        this.$nextTick(this.resetInputHeight)
      } else {
        const node = this.getNodeData(this.value)
        if (node) {
          this.selected = node
          this.selectedLabel = this.displayMode === 'name' ? node.label : node.path
          if (this.filterable) this.query = this.selectedLabel
        } else {
          this.selected = {}
          this.selectedLabel = ''
          if (this.filterable) this.query = ''
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/components/tree-select.scss'
</style>
