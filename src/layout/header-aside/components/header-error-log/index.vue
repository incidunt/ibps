<template>
  <div>
    <el-tooltip
      :content="tooltipContent"
      effect="dark"
      placement="bottom"
    >
      <el-button
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
        @click="handleClick"
      >
        <el-badge
          v-if="logLength > 0"
          :max="99"
          :value="logLengthError"
          :is-dot="logLengthError === 0"
        >
          <ibps-icon
            :name="logLengthError === 0 ? 'dot-circle-o' : 'bug'"
            style="font-size: 20px"
          />
        </el-badge>
        <ibps-icon
          v-else
          name="dot-circle-o"
          style="font-size: 20px"
        />
      </el-button>
    </el-tooltip>
    <el-dialog
      :title="tooltipContent"
      :fullscreen="true"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >

      <ibps-error-log-list />
      <div slot="footer" class="el-dialog--center el-dialog--bottom">
        <el-button type="danger" size="mini" @click="handleLogClean">
          <ibps-icon name="trash-o" />
          {{ $t('common.buttons.clean') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import IbpsErrorLogList from './components/list'
export default {
  components: {
    IbpsErrorLogList
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters('ibps', {
      logLength: 'log/length',
      logLengthError: 'log/lengthError'
    }),
    tooltipContent() {
      // `${this.logLength} 条日志${this.logLengthError > 0
      //   ? ` | 包含 ${this.logLengthError} 个异常`
      //   : ''}`
      return this.logLength === 0
        ? this.$t('errorlog.empty')
        : (
          this.logLengthError > 0 ? this.$t('errorlog.logError', {
            logLength: this.logLength,
            logLengthError: this.logLengthError
          })
            : this.$t('errorlog.logInfo', { logLength: this.logLength })
        )
    }
  },
  methods: {
    ...mapMutations('ibps/log', [
      'clean'
    ]),
    handleClick() {
      if (this.logLength > 0) {
        this.dialogVisible = true
      }
    },
    handleLogClean() {
      this.dialogVisible = false
      this.clean()
    }
  }
}
</script>
