<template>
  <div :class="classes">
    <a
      v-if="to"
      :href="linkUrl"
      :target="target"
      class="ibps-list-link"
      @click.exact="handleClickItem($event, false)"
      @click.ctrl="handleClickItem($event, true)"
      @click.meta="handleClickItem($event, true)"
    >
      <list-item :title="title" :label="label" :extra="extra">
        <slot slot="icon" name="icon" />
        <slot slot="default" />
        <slot slot="extra" name="extra" />
        <slot slot="label" name="label" />
      </list-item>
    </a>
    <div v-else class="ibps-list-link" @click="handleClickItem">
      <list-item :title="title" :label="label" :extra="extra">
        <slot slot="icon" name="icon" />
        <slot slot="default" />
        <slot slot="extra" name="extra" />
        <slot slot="label" name="label" />
      </list-item>
    </div>
    <div v-if="to" class="ibps-list-arrow">
      <slot name="arrow">
        <i class="el-icon-arrow-right" />
      </slot>
    </div>
  </div>
</template>
<script>
import ListItem from './list-item.vue'
import mixinsLink from './mixins/link'
const prefixCls = 'ibps-list'
export default {
  name: 'ibps-list',
  inject: ['listGroup'],
  components: {
    ListItem
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
      type: String,
      default: ''
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
