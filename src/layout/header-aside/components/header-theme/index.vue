<template>
  <div>
    <el-tooltip effect="dark" content="主题" placement="bottom">
      <el-button class="ibps-ml-0 ibps-mr btn-text can-hover" type="text" @click="dialogVisible = true">
        <ibps-icon name="diamond" size="16" />
      </el-button>
    </el-tooltip>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" title="主题" width="600px">
      <ibps-theme-list style="margin-top: -25px;" />
    </el-dialog>
  </div>
</template>

<script>
import IbpsThemeList from './components/ibps-theme-list'
export default {
  components: {
    IbpsThemeList
  },
  data() {
    return {
      dialogVisible: false
    }
  }
}
</script>
