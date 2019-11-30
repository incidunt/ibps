<template>
  <div class="ibps-list-item">
    <div class="ibps-list-icon">
      <el-badge :is-dot="extra.isDownload === 'N'" class="item">
        <slot name="icon" />
      </el-badge>
    </div>
    <div class="ibps-list-main">
      <div class="ibps-list-download-title" @click="download(extra)"><el-link><slot>{{ title }}(点击下载)</slot></el-link></div>
      <div class="ibps-list-download-label"><slot name="label">{{ label }}</slot></div>
      <div class="ibps-list-tip"><slot name="label">创建时间: {{ extra.createTime || '--' }}</slot></div>
      <div class="ibps-list-tip"><slot name="label">上次下载时间: {{ extra.lastDownloadTime || '--' }}</slot></div>
    </div>
  </div>
</template>
<script>
import { downloadByLink, markDownloaded } from '@/api/platform/socket/file'
import { downloadFileAsync } from '@/business/platform/file/utils'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    extra: {
      type: Object
    },
    href: {
      type: String,
      default: ''
    }
  },
  methods: {
    download(fileItem) {
      const vm = this
      downloadByLink({ link: fileItem.link }).then((res) => {
        // 拿着存储 ID 调用下载
        const data = res.data
        downloadFileAsync({ id: data, fileName: fileItem.name, ext: fileItem.type }).then(() => {
          vm.markDownloaded(fileItem)
        })
      })
    },
    /**
     * 设置文件为已下载
     * @param fileItem
     */
    markDownloaded(fileItem) {
      const vm = this
      markDownloaded({ fileId: fileItem.id }).then(() => {
        vm.$store.dispatch('ibps/message/set', true).then(() => {
          console.debug('推送消息个数更新')
        })
        this.$notify({
          title: '提示',
          message: '下载成功',
          type: 'success',
          position: 'top-left',
          duration: 3 * 1000
        })
      })
    }
  }
}
</script>
<style scoped>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
