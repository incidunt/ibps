<template>
  <div class="panel-body ibps-bpm-event-seting">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <template v-if="nodeType==='start'">
        <el-tab-pane label="开始事件" name="start">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content bg-purple" />说明：
            </el-col>
            <el-col :span="21">
              <div class="grid-content bg-purple" />该脚本在
              <span style="color:#dd5a43">流程启动</span>
              时执行，用户可以使用
              <span style="color:#dd5a43">execution</span>做操作。例如设置流程变量:execution.setVariable("total", 100);
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">脚本：</el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="commonScriptVisible=true">常用脚本</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
            </el-col>
            <el-col :span="8">
              <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="(data)=> handleFormVar('start',data)" />
            </el-col>
          </el-row>
          <codemirror v-model="script.start" :options="cmOption" />
        </el-tab-pane>
      </template>

      <template v-else-if="nodeType==='userTask'|| nodeType==='signTask'">
        <el-tab-pane label="前置脚本" name="start">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content bg-purple" />说明：
            </el-col>
            <el-col :span="21">
              <div class="grid-content bg-purple" />该事件在
              <span style="color:#dd5a43">该任务启动前</span>执行，用户可以使用
              <span style="color:#dd5a43">execution</span>做操作。例如设置流程变量:execution.setVariable("total", 100);
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">脚本：</el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="commonScriptVisible=true">常用脚本</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
            </el-col>
            <el-col :span="8" style="position:relative">
              <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="(data)=> handleFormVar('create',data)" />
            </el-col>
          </el-row>
          <codemirror v-model="script.create" :options="cmOption" />
        </el-tab-pane>
        <el-tab-pane label="后置脚本" name="afterScript">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content bg-purple" />说明：
            </el-col>
            <el-col :span="21">
              <div class="grid-content bg-purple" />该事件在
              <span style="color:#dd5a43">该任务结束后</span>执行，用户可以使用
              <span style="color:#dd5a43">execution</span>做操作。例如设置流程变量:execution.setVariable("total", 100);
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">脚本：</el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="commonScriptVisible=true">常用脚本</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
            </el-col>
            <el-col :span="8" style="position:relative">
              <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="(data)=> handleFormVar('complete',data)" />
            </el-col>
          </el-row>
          <codemirror ref="afterScript" v-model="script.complete" :options="cmOption" />
        </el-tab-pane>
      </template>
      <template v-else-if="nodeType==='end'">
        <el-tab-pane label="结束事件 " name="start">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content bg-purple" />说明：
            </el-col>
            <el-col :span="21">
              <div class="grid-content bg-purple" />该脚本在
              <span style="color:#dd5a43">流程结束</span>时执行，用户可以使用
              <span style="color:#dd5a43">execution</span>做操作。例如设置流程变量:execution.setVariable("total", 100);
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">脚本：</el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="commonScriptVisible=true">常用脚本</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
            </el-col>
            <el-col :span="8" style="position:relative">
              <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="(data)=> handleFormVar('end',data)" />
            </el-col>
          </el-row>
          <codemirror v-model="script.end" :options="cmOption" />
        </el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane label="节点脚本" name="start">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content bg-purple" />说明：
            </el-col>
            <el-col :span="21">
              <div class="grid-content bg-purple" />该脚本在脚本任务触发时执行，用户可以使用execution做操作。例如设置流程变量:execution.setVariable("total", 100);
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">脚本：</el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="commonScriptVisible=true">常用脚本</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="mini" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
            </el-col>
            <el-col :span="8" style="position:relative">
              <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="(data)=> handleFormVar('node',data)" />
            </el-col>
          </el-row>
          <codemirror v-model="script.node" :options="cmOption" />
        </el-tab-pane>
      </template>
    </el-tabs>
    <common-script
      :multiple="true"
      :visible="commonScriptVisible"
      :style="{width:'100%'}"
      class="form-content"
      @close="visible => commonScriptVisible = visible"
    />
    <condition-script-select
      :visible="conditionScriptSelectVisible"
      :style="{width:'100%'}"
      class="form-content"
      @close="visible => conditionScriptSelectVisible = visible"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import commonScript from '../components/form-script/common-script/dialog'
import conditionScriptSelect from '../components/form-script/condition-script'
import { getFormVars } from '../utils'
import BpmnFormVar from '../components/form-var'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'

export default {
  components: {
    codemirror,
    commonScript,
    conditionScriptSelect,
    BpmnFormVar
  },
  props: {
    data: Object,
    nodeType: String,
    nodeId: String
  },
  data() {
    return {
      cmOption: {
        lineNumbers: true,
        autoCloseTags: true,
        line: true,
        mode: 'text/html',
        theme: 'eclipse'
      },
      commonScriptVisible: false, // 常用脚本
      conditionScriptSelectVisible: false, // 条件脚本
      activeName: 'start',
      afterScriptRefresh: false
    }
  },
  computed: {
    ...mapState({
      boDefData: state => state.ibps.bpmn.boDefData,
      variables: state => state.ibps.bpmn.variables
    }),
    formVars() {
      return getFormVars(this.boDefData, this.variables, this.nodeId)
    },
    script() {
      return this.data ? this.data : {}
    }
  },
  methods: {
    tabClick(tab) {
      if (tab.name === 'afterScript' && !this.afterScriptRefresh) {
        this.$refs.afterScript.refresh()
        this.afterScriptRefresh = true
      }
    },
    handleFormVar(key, node) {
      let data = ''
      if (node.attrType === 'field') {
        if (node.type === 'string') {
          data = node.tableName + '.getString("' + node.key + '")'
        } else if (node.type === 'number') {
          data = node.tableName + '.getInt("' + node.key + '")'
        } else if (node.type === 'date') {
          data = node.tableName + '.getDate("' + node.key + '")'
        } else {
          data = node.tableName + '.get("' + node.key + '")'
        }
      } else if (node.attrType === 'var') {
        data = node.key
      } else if (node.attrType === 'bpmConstants') {
        data = node.key
      } else {
        return
      }
      // TODO： 插入
      this.script[key] = (this.script[key] || '') + data
    }
  }
}
</script>
<style lang="scss">
.ibps-bpm-event-seting {
  .el-row {
    margin-bottom: 10px;
  }

  .CodeMirror {
    height: 150px !important;
    .CodeMirror-scroll {
      padding-bottom: 8px !important;
      height: 150px !important;
      border: 1px solid #eee {
        left: none;
        bottom: 1px;
      }
    }
  }
}
</style>
