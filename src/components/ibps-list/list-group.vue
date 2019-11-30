<template>
  <div class="ibps-list-group">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'cell-group',
  provide() {
    return {
      listGroup: this
    }
  },
  methods: {
    handleClick(name) {
      this.$emit('on-click', name)
    }
  }
}
</script>
