
<template>
  <el-popover
    :width="width"
    :title="showTitle"
    trigger="hover"
  >
    <i slot="reference" class="ibps-icon-help" style="color: #cacad3;font-size: 13px;" />
    <div v-html="showContent" />
  </el-popover>
</template>
<script>

export default {
  props: {
    prop: {
      type: String
    },
    title: String,
    content: String,
    width: {
      type: [Number, String],
      default: 250
    }
  },
  computed: {
    showTitle() {
      return this.title || ''
    },
    showContent() {
      return this.content
    }
  }
}
</script>
