<template>
  <div>
    <div
      class="el-selector"
      @click="handleFocus"
    >
      <div
        ref="tags"
        :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }"
        class="el-selector__tags"
      >
        <transition-group @after-leave="resetInputHeight">
          <el-tag
            v-if="selected && selected.length == 0"
            :key="0"
            :type="'info'"
            disable-transitions
          >无</el-tag>
          <template v-else>
            <template v-for="(item,index) in selected">
              <el-tag
                v-if="item.type === 'none'"
                :key="index"
                type="info"
                disable-transitions
              >无</el-tag>
              <el-tag
                v-else-if="item.type === 'all'"
                :key="index"
                type="success"
                plain
                disable-transitions
              >所有人</el-tag>
              <template v-else>
                <el-tag
                  v-for="(id,j) in convertRightsId(item.rightsId) "
                  :key="item.rightsId+''+index+''+j"
                  disable-transitions
                  :type="convertRightsType(item.type) "
                  :title="convertRightsTypeTitle(item.type) "
                >{{ convertRightsName(item.rightsName,j) }}</el-tag>
              </template>
            </template>
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
        :style="{
          'font-size': selectedLabel===''?'inherit':'0'
        }"
        @focus="handleFocus"
        @mouseenter.native="inputHovering = true"
        @mouseleave.native="inputHovering = false"
      />
    </div>
    <rights-config
      :visible="dialogRightsVisible"
      :data="selected"
      title="权限配置"
      @callback="handleRightsConfirm"
      @close="visible => dialogRightsVisible = visible"
    />
  </div>

</template>
<script>
import RightsConfig from './index'
import { ownRightsOptions, typeArr } from './constants'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
import emitter from 'element-ui/src/mixins/emitter'
const sizeMap = {
  'medium': 36,
  'small': 32,
  'mini': 28
}

export default {
  components: {
    RightsConfig
  },
  mixins: [emitter],
  props: {
    value: {
      type: Array
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputLength: 20,
      inputWidth: 0,
      inputHovering: false,
      dialogRightsVisible: false,
      selected: []
    }
  },
  computed: {
    selectedLabel() {
      return this.value && this.value.length > 0 ? 'x' : ''
    },
    prefixIconClass() {
      let classes = ['el-selector__caret', 'el-input__icon']
      const criteria = this.clearable &&
          !this.selectDisabled &&
          this.inputHovering &&
          !this.multiple &&
          this.value !== undefined &&
          this.value !== null &&
          this.value !== ''
      if (criteria) {
        classes = [...classes, 'el-icon-plus', 'is-show-close']
      } else {
        classes.push('el-icon-plus')
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
      if (!this.value || (Array.isArray(this.value) && this.value.length === 0)) {
        return this.placeholder
      } else {
        return ''
      }
    }
  },
  watch: {
    value() {
      this.setSelected()
    }
  },
  mounted() {
    this.referenceElm = this.$refs.reference ? this.$refs.reference.$el : null
    this.popperElm = this.$refs.popper
    this.inputWidth = this.$refs.reference ? this.$refs.reference.$el.getBoundingClientRect().width : null
    addResizeListener(this.$el, this.handleResize)
    this.setSelected()
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.handleResize)
  },
  methods: {
    setSelected() {
      const result = []
      if (Array.isArray(this.value)) {
        this.value.forEach(item => {
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
      this.dialogRightsVisible = true
    },
    convertRightsId(ids) {
      if (this.$utils.isEmpty(ids)) return []
      return ids.split(',')
    },
    convertRightsName(names, j) {
      if (this.$utils.isEmpty(names)) return ''
      return names.split(',')[j] || ''
    },
    convertRightsTypeTitle(type) {
      return ownRightsOptions[type] ? ownRightsOptions[type].label : ''
    },
    convertRightsType(type) {
      const index = typeArr.findIndex(item => item.type === type)
      return typeArr[index] ? typeArr[index].color : ''
    },

    handleRightsConfirm(data) {
      if (data.length === 0) {
        data = [{ type: 'none' }]
      }
      this.selected = data
      this.$emit('input', this.selected)
    }
  }
}
</script>
