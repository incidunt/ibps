<template>
  <div :class="classes">
    <div class="ibps-list-link">
      <list-download-item :title="title" :label="label" :extra="extra" :href="linkUrl">
        <slot slot="icon" name="icon" />
        <slot slot="default" />
        <slot slot="extra" name="extra" />
        <slot slot="label" name="label" />
      </list-download-item>
    </div>
  </div>
</template>
<script>
import ListDownloadItem from './list-download-item.vue'
import mixinsLink from './mixins/link'
const prefixCls = 'ibps-list'
export default {
  name: 'ibps-list-download',
  inject: ['listGroup'],
  components: {
    ListDownloadItem
  },
  mixins: [mixinsLink],
  props: {
    name: {
      type: [String, Number]
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    extra: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    divided: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      prefixCls: prefixCls
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-selected`]: this.selected,
          [`${prefixCls}-with-link`]: this.to,
          [`${prefixCls}-divided`]: this.divided
        }
      ]
    }
  },
  methods: {
    handleClickItem(event, new_window) {
      this.listGroup.handleClick(this.name)
      this.handleCheckClick(event, new_window)
    }
  }
}
</script>
