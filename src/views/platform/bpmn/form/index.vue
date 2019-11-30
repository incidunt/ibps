<template>
  <bpmn-formrender
    ref="bpmnFormrender"
    :def-id="defId"
    :pro-inst-id="proInstId"
    :task-id="taskId"
    :instance-id="instanceId"
    :task-change-id="taskChangeId"
    :closeable="false"
    @close="closeDialog"
    @callback="handleCallback"
  />
</template>
<script>
import BpmnFormrender from '@/business/platform/bpmn/form'

export default {
  components: {
    BpmnFormrender
  },
  data: function() {
    return {
      init: false,
      defId: '',
      proInstId: '',
      taskId: '',
      instanceId: '',
      taskChangeId: ''
    }
  },
  watch: {
    // 路由加载
    '$route.query': {
      handler(val, oldVal) {
        const data = this.$route.query
        if (this.$utils.isNotEmpty(data)) {
          this.loadFormData(data)
        }
      },
      immediate: true
    }
  },
  mounted() {
    const $this = this
    window.addEventListener('message', function(e) {
      try {
        const data = JSON.parse(e.data)
        $this.loadFormData(data)
      } catch (err) {
        // console.info(err)
      }
    })
    window.parent.postMessage({ type: 'init', data: 'isReady' }, '*')
  },
  methods: {
    loadFormData(data = {}) {
      this.defId = data.defId
      this.proInstId = data.proInstId
      this.taskId = data.taskId
      this.instanceId = data.instanceId
      this.taskChangeId = data.taskChangeId
      this.$nextTick(() => {
        this.$refs.bpmnFormrender.loadFormData()
      })
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleCallback(data) {
      // 如果iframe 回调
      if (parent) {
        window.parent.postMessage({ type: 'calback', data: data }, '*')
      }
      this.$emit('callback', data)
    }
  }
}
</script>
