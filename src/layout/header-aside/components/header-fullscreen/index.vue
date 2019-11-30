<template>
  <el-tooltip
    :content="active ? $t('navbar.exitFullscreen'): $t('navbar.fullscreen')"
    effect="dark"
    placement="bottom"
  >
    <el-button class="ibps-mr btn-text can-hover" type="text" @click="toggle">
      <ibps-icon v-if="active" name="compress" size="16" />
      <ibps-icon v-else name="arrows-alt" size="16" />
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('ibps/fullscreen', [
      'active'
    ])
  },
  methods: {
    ...mapActions('ibps/fullscreen', [
      'toggle'
    ])
  }
}
</script>
