<template>
  <div class="panel-body">
    <el-form :model="attribute" label-width="120px" label-position="left">
      <el-form-item label="标题规则:" :style="{'marginBottom':'10px'}">
        <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="handleFormVar" />
      </el-form-item>
      <div class="ibps-pb-5">
        <ibps-ueditor ref="subjectRule" v-model="attribute.subjectRule" />
      </div>
      <!-- <el-form-item label="流程描述:">
        <el-input v-model="attribute.description" type="textarea" />
      </el-form-item> -->
      <el-form-item label="通知类型:">
        <ibps-checkbox
          v-model="attribute.notifyType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />
      </el-form-item>
      <!-- <el-form-item label="测试通知类型:">
        <ibps-checkbox
          v-model="attribute.testNotifyType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />
      </el-form-item> -->
      <el-form-item label="跳过第一个节点:">
        <el-radio v-model="attribute.skipFirstNode" :label="true">是</el-radio>
        <el-radio v-model="attribute.skipFirstNode" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="第一个节点可以选择执行人:">
        <el-radio v-model="attribute.firstNodeUserAssign" :label="true">是</el-radio>
        <el-radio v-model="attribute.firstNodeUserAssign" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="相邻节点相同执行人直接跳过:">
        <el-radio v-model="attribute.skipSameUser" :label="true">是</el-radio>
        <el-radio v-model="attribute.skipSameUser" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="任务允许转办:">
        <el-radio v-model="attribute.allowTransTo" :label="true">是</el-radio>
        <el-radio v-model="attribute.allowTransTo" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="允许执行人为空:">
        <el-radio v-model="attribute.allowExecutorEmpty" :label="true">是</el-radio>
        <el-radio v-model="attribute.allowExecutorEmpty" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="执行人为空时跳过任务:">
        <el-radio v-model="attribute.skipExecutorEmpty" :label="true">是</el-radio>
        <el-radio v-model="attribute.skipExecutorEmpty" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="是否正式:">
        <el-radio v-model="attribute.testStatus" label="run">正式</el-radio>
        <el-radio v-model="attribute.testStatus" label="test">测试</el-radio>
      </el-form-item>
      <el-form-item label="状态:" :style="{'marginBottom':'0'}">
        <el-radio v-model="attribute.status" label="deploy">已发布</el-radio>
        <el-radio v-model="attribute.status" label="forbidden">禁止</el-radio>
        <el-radio v-model="attribute.status" label="forbidden_instance">禁止实例</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getFormVars } from '../utils'
import BpmnFormVar from '../components/form-var'
import IbpsUeditor from '@/components/ibps-ueditor'

export default {
  components: {
    IbpsUeditor,
    BpmnFormVar
  },
  props: {
    data: Object
  },
  computed: {
    ...mapState({
      messageTypes: state => state.ibps.bpmn.messageTypes,
      boDefData: state => state.ibps.bpmn.boDefData,
      variables: state => state.ibps.bpmn.variables
    }),
    attribute() {
      return this.data
    },
    formVars() {
      return getFormVars(this.boDefData, this.variables)
    }
  },
  methods: {
    handleFormVar(node) {
      let data = ''
      if (node.attrType === 'field') {
        data = '{' + node.tableName + '.' + node.key + '}'
      } else if (node.attrType === 'bpmConstants') {
        data = '{' + node.name + ':' + node.key + '}'
      } else if (node.attrType === 'var') {
        data = '{' + node.key + '}'
      } else {
        return
      }

      this.$refs.subjectRule.execCommand('inserthtml', data)
    }
  }
}
</script>
