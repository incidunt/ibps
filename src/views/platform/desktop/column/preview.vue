<template>
  <el-dialog
    ref="dialog"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :fullscreen="fullscreen"
    class="desktop-preview-dialog"
    :class="fullscreen?'fullscreen':null"
    top="10vh"
    width="60%"
    @open="getFormData"
    @close="closeDialog"
  >
    <div
      v-if="init"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      class="ibps-desktop-page"
    >
      <component
        :is="getComponentAlias(desktopColumn.alias)"
        :id="desktopColumn.id"
        :ref="desktopColumn.alias"
        :alias="desktopColumn.alias"
        :visible="componentVisible"
        @action-event="actionEvent"
      />
    </div>
    <div v-if="!screen" slot="footer" class="el-dialog--center">
      <el-button icon="el-icon-circle-close" @click="closeDialog()">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Vue from 'vue'
import { get } from '@/api/platform/desktop/column'
import { buildComponent } from '@/pages/dashboard/components/util'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String,
    screen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      Visible: false,
      componentVisible: false,
      dialogLoading: false,
      fullscreen: false,
      init: false,
      desktopColumn: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    actionEvent(command) {
      if (this.screen) {
        this.closeDialog()
        return
      }
      if (command === 'fullscreen') {
        this.fullscreen = !this.fullscreen
      }
    },
    isScreen(refs) {
      this.$nextTick(() => {
        if (this.screen) {
          refs['dialog'].$el.childNodes[0].childNodes[1].style.height = 100 + '%'
        }
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.init = false
      this.$emit('close', false)
    },
    getComponentAlias(alias) {
      return `ibps-desktop-preview-${alias}`
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      this.fullscreen = !!this.screen
      this.isScreen(this.$refs)
      this.componentVisible = true
      get({
        desktopColumnId: this.id
      }).then(response => {
        const column = this.desktopColumn = response.data
        const name = this.getComponentAlias(column.alias)
        Vue.component(name, (resolve, reject) => {
          resolve(buildComponent(name, column))
        })
        this.init = true
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
  .desktop-preview-dialog{
    .el-dialog__body{
      height:  calc(65vh - 80px);
      .el-card{
        height: 100%;
        .el-card__body{
          height: 85%;
        }
      }
    }
  }
  .fullscreen{
    .el-dialog__body{
      height:  calc(90vh - 80px);
      .el-card{
        height: 100%;
        .el-card__body{
          height: 90%;
        }
      }
    }
  }
</style>

