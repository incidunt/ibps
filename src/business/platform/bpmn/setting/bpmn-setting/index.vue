<template>
  <div class="bpm-def-setting-right">
    <!---开始-->
    <start-event
      v-if="nodeType==='start'"
      :data="nodeData"
    />
    <!---结束-->
    <end-event
      v-else-if="nodeType==='end'"
      :data="nodeData"
    />
    <!---用户任务 || 会签任务-->
    <user-task
      v-else-if="nodeType==='userTask'|| nodeType==='signTask'"
      :data="nodeData"
      :def-id="defId"
      :def-key="defKey"
      :bo-data="boData"
    />
    <!---消息任务-->
    <receive-task
      v-else-if="nodeType==='receiveTask'"
      :data="nodeData"
    />
    <!---服务任务-->
    <service-task
      v-else-if="nodeType==='serviceTask'"
      :data="nodeData"
    />
    <!---脚本任务-->
    <script-task
      v-else-if="nodeType==='scriptTask'"
      :data="nodeData"
    />
    <!--内部子流程-->
    <sub-process
      v-else-if="nodeType==='subProcess'"
      :data="nodeData"
    />
    <!--外部子流程-->
    <call-activity
      v-else-if="nodeType==='callActivity'"
      :data="nodeData"
    />
    <!---网关-->
    <gateway
      v-else-if="nodeType==='exclusiveGateway' || nodeType==='inclusiveGateway'"
      :data="nodeData"
    />
    <!---全局-->
    <global
      v-else
      :data="nodeData"
      :def-key="defKey"
      @clean-form-data="cleanFormData"
    />
  </div>
</template>
<script>
import Global from './types/global'
import StartEvent from './types/start-event'
import EndEvent from './types/end-event'
import UserTask from './types/user-task'
import ReceiveTask from './types/receive-task'
import ServiceTask from './types/service-task'
import ScriptTask from './types/script-task'
import SubProcess from './types/sub-process'
import CallActivity from './types/call-activity'
import Gateway from './types/gateway'

export default {
  name: 'bpm-definition-setting-setting',
  components: {
    Global,
    StartEvent,
    EndEvent,
    UserTask,
    ReceiveTask,
    ServiceTask,
    ScriptTask,
    SubProcess,
    CallActivity,
    Gateway
  },
  props: {
    data: Object, // 数据
    nodeId: String, // 当前选择的节点ID
    nodeType: {
      type: String,
      default: 'global'
    },
    defId: String,
    defKey: String
  },
  computed: {
    // 全局数据
    globalData() {
      return this.data ? this.data['global'] : {}
    },
    // 节点数据(包含全局)
    nodeData() {
      if (!this.data) return {}
      return this.nodeType === 'global' ? this.data ? this.data['global'] : {} : this.nodeMap[this.nodeId] || {}
    },
    // 节点列表
    nodeList() {
      return this.data ? this.data.nodes || [] : []
    },
    // 节点Map
    nodeMap() {
      const nodeMap = {}
      if (this.$utils.isEmpty(this.nodeList)) {
        return nodeMap
      }
      this.nodeList.forEach(node => {
        nodeMap[node.id] = node
      })
      return nodeMap
    },
    boData() {
      return this.$utils.isNotEmpty(this.globalData) ? this.globalData.bo || {} : {}
    },
    // 业务对象编码
    boCode() {
      return this.boData ? this.boData.code || '' : ''
    }
  },
  watch: {
    boCode(val, oldVal) {
      if (this.$utils.isNotEmpty(val)) {
        return
      }
      for (let i = 0; i < this.data.nodes.length; i++) {
        const nodeData = this.data.nodes[i]
        if (nodeData.node_type === 'userTask' || nodeData.node_type === 'signTask') {
          const form = nodeData.form
          if (form && form.type === 'inner') {
            this.data.nodes[i].form.formValue = ''
          }
        }
      }
    }
  },
  methods: {
    cleanFormData() {
      for (let i = 0; i < this.data.nodes.length; i++) {
        const nodeData = this.data.nodes[i]
        if ((nodeData.node_type === 'userTask' || nodeData.node_type === 'signTask') && nodeData.formData) {
          this.data.nodes[i].formData.formValue = ''
        }
      }
    }
  }

}
</script>
<style lang="scss">
  .bpm-def-setting-right{
    position: fixed;
    top: 0;
    right: 0;
    width:550px;
    background-color: #fff;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    height: 100vh;
    overflow: auto;

    .el-collapse-item__header {
      padding-left: 25px;
      background-color: #409EFF;
      border-color: #409EFF;
      color: #ffffff;
      height: 40px;
      line-height: 40px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .el-collapse-item__content{
      padding-bottom: 10px;
      .panel-body{
        padding: 10px 15px;
        .el-form{
          .el-form-item{
            &:last-child{
              margin-bottom: 0;
            }
          }
        }
      }
    }

  .setting-title {
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    background: #e7eaec;
    border-bottom: 1px solid #e5e6e7;
  }
}
</style>
