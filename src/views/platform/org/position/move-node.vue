<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    class="dialog"
    @open="onOpen"
  >
    <ibps-tree
      ref="elTree"
      v-loading.body="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :width="width"
      :height="height"
      :data="treeData"
      :options="treeOptions"
    />
    <div slot="footer" style="text-align: center;">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { saveMove } from '@/api/platform/org/position'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: Boolean,
    id: [String, Number],
    data: Array
  },
  data() {
    return {
      // tree 配置
      width: 600,
      height: document.clientHeight,
      dialogVisible: this.visible,
      treeOptions: {},
      treeData: [],

      options: [],
      // 弹窗配置
      title: '移动节点',
      dialogLoading: false,
      editForm: {
        name: '',
        account: '',
        wcAccount: '',
        orgName: '',
        gender: '',
        createTime: ''
      },
      toolbars: [
        { key: 'save', label: '保存' },
        { key: 'cancel' }
      ]

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
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    onOpen() {
      this.treeData = JSON.parse(JSON.stringify(this.data))
      this.$nextTick(() => {
        this.$refs.elTree.remove(this.id)
      })
    },
    // 保存数据
    saveData() {
      const destinationId = this.$refs.elTree.getCurrentKey()
      if (this.$utils.isEmpty(destinationId)) {
        this.$message.closeAll()
        this.$message({
          message: '请选择节点',
          type: 'warning'
        })
        return
      }
      this.dialogLoading = true
      saveMove({
        positionId: this.id,
        destinationId: destinationId
      })
        .then(response => {
          this.dialogLoading = false
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, r => {
            if (r) {
              this.closeDialog()
            }
          })
        })
        .catch(() => {
          this.dialogLoading = false
        })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.editForm = {}
    }
  }
}
</script>
