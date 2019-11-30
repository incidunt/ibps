<template>
  <span v-if="actions" class="ibps-desktop-toolbar">
    <el-button-group>
      <template v-for="button in toolbars">
        <el-tooltip
          :key="button.key"
          :content="getLabel(button)"
          :placement="button.placement||'bottom-start'"
        >
          <el-button
            :key="button.key"
            :size="button.size|| $ELEMENT.size "
            :type="getType(button)"
            :icon="getIcon(button)"
            :disabled="button.disabled"
            :circle="button.circle||false"
            :round="button.round||false"
            class="toolbar-icon"
            @click="emitEventHandler('action-event',button.key,position,button,toolbars)"
          />
        </el-tooltip>
      </template>
    </el-button-group>
  </span>
</template>
<script>
import { getButtonIcon } from '@/utils/button'
export default {
  props: {
    actions: {
      type: Array,
      required: true
    },
    position: {
      type: String,
      default: 'toolbar'
    }
  },
  data() {
    return {
      toolbars: this.actions
    }
  },
  methods: {
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    getLabel({ label, key }) {
      if (label) return label
      return this.$te('common.buttons.' + key) ? this.$t('common.buttons.' + key) : key
    },
    getIcon({ icon, key }) {
      if (icon) { return icon }
      return getButtonIcon(key)
    },
    getType({ type, key }) {
      if (type) { return type }
      return null
    },
    callback(value) {
      this.toolbars = value
    }
  }
}
</script>
<style lang="scss" scoped>
  .ibps-desktop-toolbar{
    float: right;
    margin-top: -5px;
  }
</style>

