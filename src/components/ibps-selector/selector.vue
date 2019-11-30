<template>
  <div
    class="el-selector"
    @click="handleFocus"
  >
    <div
      v-if="selected && selected.length >0"
      ref="tags"
      :style="{ 'max-width': inputWidth + 'px', width: '100%' }"
      class="el-selector__tags"
    >
      <transition-group @after-leave="resetInputHeight">
        <template v-for="(item,index) in selected">
          <el-tag
            v-if="$utils.isNotEmpty(item)"
            :key="item+index"
            :closable="!selectDisabled"
            :size="collapseTagSize"
            disable-transitions
            @close="deleteTag(index)"
          >
            <span class="el-selector__tags-text">{{ item }}</span>
          </el-tag>
        </template>
      </transition-group>
    </div>
    <el-input
      ref="reference"
      v-model="selectedLabel"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :size="selectSize"
      :placeholder="currentPlaceholder"
      type="text"
      :class="readonlyText==='text'?'el-selector__readonly-text':''"
      @focus="handleFocus"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template v-if="!selectDisabled">
        <i slot="prefix" :class="prefixIconClass" />
      </template>
    </el-input>
  </div>

</template>
<script>
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import emitter from 'element-ui/src/mixins/emitter'
const sizeMap = {
  'medium': 36,
  'small': 32,
  'mini': 28
}

export default {
  name: 'ibps-selector',
  mixins: [emitter],
  props: {
    items: {
      type: Array
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'el-icon-plus'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * 只读样式 【text original】
     */
    readonlyText: {
      type: String,
      default: 'original'
    }
  },
  data() {
    return {
      query: '',
      inputLength: 20,
      inputWidth: 0,
      inputHovering: false,
      selected: []
    }
  },
  computed: {
    selectedLabel() {
      return this.items && this.items.length > 0 ? ' ' : ''
    },
    prefixIconClass() {
      let classes = ['el-selector__caret', 'el-input__icon']
      const criteria = this.clearable &&
          !this.selectDisabled &&
          this.inputHovering &&
          !this.multiple &&
          this.items !== undefined &&
          this.items !== null &&
          this.items !== ''
      if (criteria) {
        classes = [...classes, this.icon, 'is-show-close']
      } else {
        classes.push(this.icon)
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
    currentPlaceholder() {
      if (!this.items || (Array.isArray(this.items) && this.items.length === 0)) {
        return this.placeholder
      } else {
        return ''
      }
    }
  },
  watch: {
    items() {
      this.setSelected()
    }
  },
  mounted() {
    // if (this.multiple && Array.isArray(this.items) && this.items.length > 0) {
    //   this.currentPlaceholder = ''
    // }
    addResizeListener(this.$el, this.handleResize)

    const reference = this.$refs.reference
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width
      }
    })
    this.setSelected()
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.handleResize)
  },
  methods: {
    setSelected() {
      const result = []
      if (Array.isArray(this.items)) {
        this.items.forEach(item => {
          result.push(item)
        })
      }
      this.selected = result
      if (this.multiple) {
        this.$nextTick(this.resetInputHeight)
      }
    },
    resetInputWidth() {
      if (!this.$refs.reference) return
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
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
      })
    },
    handleResize() {
      this.resetInputWidth()
      if (this.multiple) this.resetInputHeight()
    },
    handleFocus() {
      if (this.disabled) return
      this.$emit('click')
    },
    deleteTag(index) {
      this.$emit('remove', index)
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/components/selector.scss'
</style>
