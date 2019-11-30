<template>
  <img
    :src="src"
    style="width:100%;height:100%;"
  >
</template>
<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'
export default {
  props: {
    src: String,
    options: Object
  },
  mounted() {
    this.createViewer()
  },
  destroyed() {
    this.$viewer && this.$viewer.destroy()
  },
  methods: {
    createViewer() {
      this.$viewer && this.$viewer.destroy()
      this.$viewer = new Viewer(this.$el, this.options)
      this.$emit('inited', this.$viewer)
    }
  }
}
</script>
