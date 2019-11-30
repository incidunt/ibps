<template>
  <el-tooltip
    effect="dark"
    placement="bottom"
  >
    <div slot="content">{{ $t('search.tip') }}<br>
      {{ $t('search.press') }}<span class="panel-search__key">{{ hotkey.open }}</span>
      {{ $t('search.panel') }}<br>
      {{ $t('search.press') }}<span class="panel-search__key">{{ hotkey.close }}</span>
      {{ $t('search.close') }}
    </div>
    <el-button class="ibps-mr btn-text can-hover" type="text" @click="handleClick">
      <ibps-icon name="search" size="18" />
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('ibps/search', [
      'hotkey'
    ])
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/public.scss';
  .panel-search__key {
    padding: 1px 5px;
    margin: 0px 2px;
    border-radius: 2px;
    background-color: $color-text-normal;
    color: $color-bg;
  }
</style>
