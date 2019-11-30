<template>

  <ibps-container>
    <el-table
      :data="log"
      size="mini"
      style="width: 100%"
      :empty-text="$t('errorlog.table.empty-text')"
      stripe
      border
    >
      <!-- time -->
      <el-table-column
        prop="time"
        :label="$t('errorlog.table.label.time')"
        width="140"
      />
      <!-- message -->
      <el-table-column
        prop="message"
        :label="$t('errorlog.table.label.message')"
      />
      <!-- url -->
      <el-table-column
        :label="$t('errorlog.table.label.url')"
        align="center"
        min-width="200"
      >
        <template slot-scope="scope">
          {{ get(scope.row, 'meta.url') }}
        </template>
      </el-table-column>
      <!-- componnet -->
      <el-table-column
        :label="$t('errorlog.table.label.component')"
        align="center"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="get(scope.row, 'meta.instance.$vnode.componentOptions.tag')"
            type="info"
            size="mini"
          >
            &#60;{{ get(scope.row, 'meta.instance.$vnode.componentOptions.tag') }}&gt;
          </el-tag>
        </template>
      </el-table-column>
      <!-- more -->
      <el-table-column
        fixed="right"
        align="center"
        :label="$t('errorlog.table.label.more')"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleShowMore(scope.row)"
          >
            <ibps-icon name="eye" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="ibps-pt-5">
      <el-button
        type="primary"
        size="mini"
        :loading="uploading"
        @click="handleUpload"
      >
        <ibps-icon name="cloud-upload" />
        {{ $t('errorlog.upload.button', { number: log.length }) }}
      </el-button>
    </div>
  </ibps-container>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
export default {
  data() {
    return {
      uploading: false
    }
  },
  computed: {
    ...mapState('ibps/log', [
      'log'
    ])
  },
  methods: {
    get,
    handleShowMore(log) {
      // Print all information from a log to the console
      this.$notify({
        type: 'info',
        title: this.$t('notify.special.show-log.title'),
        message: this.$t('notify.special.show-log.message')
      })
      this.$log.capsule('IBPS', 'handleShowMore', 'primary')
      console.group(log.message)
      console.log('time: ', log.time)
      console.log('type: ', log.type)
      console.log(log.meta)
      console.groupEnd()
    },
    // Log upload
    handleUpload() {
      this.uploading = true
      this.$notify({
        type: 'info',
        title: this.$t('notify.special.upload.start.title'),
        message: this.$t('notify.special.upload.start.message')
      })
      setTimeout(() => {
        this.uploading = false
        this.$notify({
          type: 'success',
          title: this.$t('notify.special.upload.success.title'),
          message: this.$t('notify.special.upload.success.message')
        })
      }, 3000)
    }
  }
}
</script>
