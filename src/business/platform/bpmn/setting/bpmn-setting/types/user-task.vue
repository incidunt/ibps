<template>
  <div>
    <div v-sticky class="setting-title" @click="onTitle">
      用户任务设置--【{{ data.node_name }}】
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="用户设置" name="userSetting">
        <user-setting :data="users" />
      </el-collapse-item>
      <el-collapse-item title="表单设置" name="fromSetting">
        <form-setting
          :data="formData"
          :bo-data="boData"
          :def-key="defKey"
          :node-id="data.id"
          form-type="node"
        />
      </el-collapse-item>
      <el-collapse-item v-if="nodeType==='signTask'" title="会签规则" name="signRule">
        <sign-rule :data="signRule" />
      </el-collapse-item>
      <el-collapse-item v-if="nodeType==='signTask'" title="会签特权" name="signPrivileges">
        <sign-privileges :data.sync="signPrivileges" />
      </el-collapse-item>
      <el-collapse-item title="事件设置" name="eventScript">
        <event-script :data="scripts" :node-type="nodeType" :node-id="data.id" />
      </el-collapse-item>
      <el-collapse-item title="按钮设置" name="buttonSetting">
        <button-setting :data="buttons" :node-type="nodeType" />
      </el-collapse-item>
      <el-collapse-item title="跳转规则设置" name="jumpRuleSetting">
        <jump-rule :data="jumpRules" />
      </el-collapse-item>
      <el-collapse-item title="催办设置" name="reminder">
        <reminder-setting :data="reminders" :def-id="defId" :cur-node="data" />
      </el-collapse-item>
      <el-collapse-item title="触发流程设置" name="triggerFlow">
        <trigger-flow :data="trigerFlows" :def-id="defId" :cur-node="data" :bo-data="boData" />
      </el-collapse-item>
      <!-- <el-collapse-item name="endNotify">
        <template slot="title">
          办理抄送设置
          <el-tooltip class="item" effect="light" content="进行设置节点结束时抄送给某批人！" placement="bottom">
            <i class="header-icon el-icon-info" />
          </el-tooltip>
        </template>
        <notify-setting :data="procNotify" />
      </el-collapse-item> -->

      <el-collapse-item title="其他设置" name="otherOttribute">
        <other-attribute-node :data="attributes" :cur-node="data" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import mixins from '../mixins/type'
export default {
  mixins: [mixins],
  props: {
    data: Object,
    defId: String,
    defKey: String,
    boData: Object
  },
  data() {
    return {
      activeNames: ['userSetting', 'fromSetting', 'signRule', 'signPrivileges', 'eventScript', 'buttonSetting', 'jumpRuleSetting', 'reminder', 'triggerFlow', 'endNotify', 'otherOttribute']
    }
  },
  computed: {
    nodeType() {
      return this.data ? this.data.node_type || 'userTask' : 'userTask'
    },
    // 用户人员
    users() {
      return this.data ? this.data.users || [] : []
    },
    // 表单
    formData() {
      return this.data ? this.data.form || {} : {}
    },
    // 会签设置
    signRule() {
      return this.data ? this.data.signRule || {} : {}
    },
    // 会签特权
    signPrivileges: {
      get() {
        return this.data ? this.data.privileges || {} : {}
      },
      set(value) {
        this.data.privileges = value || {}
      }
    },
    // 脚本
    scripts() {
      return this.data ? this.data.scripts || {} : {}
    },
    // 按钮
    buttons() {
      return this.data ? this.data.buttons || [] : []
    },
    // 跳转规则
    jumpRules() {
      return this.data ? this.data.jumpRules || [] : []
    },
    // 催办
    reminders() {
      return this.data ? this.data.reminders || [] : []
    },
    // 触发流程
    trigerFlows() {
      return this.data ? this.data.trigerFlows || [] : []
    },
    // 抄送
    procNotify() {
      return this.data ? this.data.procNotify || [] : []
    },
    // 其它设置
    attributes() {
      return this.data ? this.data.attributes || {} : {}
    }
  }
}
</script>

