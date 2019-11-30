<template>
  <div>
    <el-input
      v-model="value.nodeName"
      placeholder="请选择节点"
      readonly
      :disabled="disabled"
      @click.native="handleNode"
    >
      <el-button
        slot="append"
        type="primary"
        icon="el-icon-search"
        :style="buttonStyle"
      />
    </el-input>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="相同节点执行人"
      width="40%"
      class="sameNode"
      append-to-body
      @open="loadNodeList"
      @close="closeDialog"
    >
      <div class="same-node-content">
        <el-tooltip
          class="item"
          effect="light"
          placement="bottom"
        >
          <div slot="content">1、相同节点执行人，只能设置前置节点;<br>2、若选择分支网关
            、同步分支网关之后的节点，则有可能出现执行人为空;<br>3、该节点之前无其他节点，则无法设置相同节点执行人;</div>
          <span :style="{'textAlign':'center'}">
            节点选择:<i class="header-icon el-icon-info" /></span>
        </el-tooltip>
        <p />

        <table class="table table-striped table-bordered table-hover">
          <tbody>
            <tr
              v-for="item in nodeList"
              :key="item.nodeId"
              @click="()=>{ nodeId=item.nodeId}"
            >
              <td>
                <el-radio
                  v-model="nodeId"
                  :label="item.nodeId"
                >{{ item.name }}</el-radio>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="actions"
          @action-event="handleActionEvent"
        />
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { sameNodeDialog } from '@/api/platform/bpmn/bpmNodeDef'

export default {
  props: {
    value: {
      type: Object
    },
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
      nodeId: '',
      nodeList: [],
      dialogVisible: false,
      actions: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    ...mapState({
      curNode: state => state.ibps.bpmn.curNode,
      defId: state => state.ibps.bpmn.defId
    }),

    buttonStyle() {
      if (this.disabled) {
        return {}
      }
      return {
        background: '#409eff',
        color: ' #ffffff'
      }
    }
  },
  methods: {
    loadNodeList() {
      sameNodeDialog({
        defId: this.defId,
        nodeId: this.curNode.nodeId
      }).then(response => {
        this.nodeList = response.data.nodeDefList
      }).catch(() => {
      })
    },
    handleNode() {
      if (this.disabled) { return }
      this.nodeId = this.value.nodeId
      this.dialogVisible = true
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      if (this.$utils.isEmpty(this.nodeId)) {
        this.$message({
          message: '请选择节点',
          type: 'warning'
        })
        return
      }
      const data = JSON.parse(JSON.stringify(this.value))
      const node = this.nodeList.find((node) => {
        return node.nodeId === this.nodeId
      })

      data.nodeId = this.nodeId
      data.nodeName = node.name
      this.$emit('input', data)

      this.closeDialog()
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

