<template>
  <ibps-container>
    <iframe
      id="frameForm"
      ref="frameForm"
      src="http://127.0.0.1:9528/#/platform/bpmn/form"
      class="ibps-container-frame"
      frameborder="0"
    />
  </ibps-container>
</template>
<script>
export default {
  data() {
    return {
      // src: 'http://127.0.0.1:9528/#/platform/bpmn/form?taskId=619184612328865793'
    }
  },
  mounted() {
    const data = JSON.stringify({
      taskId: '619184612328865793'
    })
    const frameForm = this.$refs.frameForm
    if (frameForm.attachEvent) { // 兼容浏览器判断
      frameForm.attachEvent('onload', function() {
        const iframeWin = frameForm.contentWindow
        iframeWin.postMessage(data, '*')
      })
    } else {
      frameForm.onload = function() {
        console.info('onload')
        const iframeWin = frameForm.contentWindow
        iframeWin.postMessage(data, '*')
      }
    }
    window.addEventListener('message', function(e) {
      console.log('message', e.origin, e.data)// 父类页面接收参数
      const msg = e.data
      if (!msg || !msg.type) return
      if (msg.type === 'init') { // 初始化
        const iframeWin = frameForm.contentWindow
        iframeWin.postMessage(data, '*')
      } else if (msg.type === 'callback') { // 回调处理
        console.info(msg.data)
      }
    })
  }

}
</script>
<style lang="scss" scoped>
.ibps-container-frame {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}
</style>
