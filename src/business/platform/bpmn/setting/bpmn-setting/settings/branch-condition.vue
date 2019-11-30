<template>
  <div class="panel-body branch-condition">

    <div v-for="(item,index) of conditions" :key="index" class="content">
      <div class="left">
        {{ item.name }}
      </div>
      <div class="right">
        <div>
          <el-button type="primary" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
          <bpmn-form-var style="display: inline-block" :data="formVars" :props="{label: 'name'}" @callback="(node)=>handleFormVar(item,node)" />
          <div v-if="item.sign">
            <el-button
              v-for="sign in item.sign"
              :key="sign.id"
              plain
              @click="handleSignResult(sign.id,item)"
            >{{ sign.name }}</el-button>
          </div>
          <div v-else>
            <el-button type="success" plain @click="handleResult('agree',item)">同意</el-button>
            <el-button type="danger" plain @click="handleResult('oppose',item)">反对</el-button>
          </div>
        </div>
        <codemirror v-model="item.value" :options="cmOption" />
      </div>
    </div>
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
import { getFormVars } from '../utils'
import BpmnFormVar from '../components/form-var'
import conditionScriptSelect from '../components/form-script/condition-script'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'
export default {
  components: {
    codemirror,
    conditionScriptSelect,
    BpmnFormVar
  },
  props: {
    data: Array
  },
  data() {
    return {
      conditionScriptSelectVisible: false,
      cmOption: {
        lineNumbers: true,
        autoCloseTags: true,
        line: true,
        mode: 'text/html',
        theme: 'eclipse'
      },
      text: ''
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
    conditions() {
      return this.data
    }
  },
  methods: {
    handleFormVar(item, node) {
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
      // TODO: 插入光标的位置
      item.value = (item.value || '') + data
    },
    handleSignResult(result, item) {
      item.value = `${result}`
    },
    handleResult(result, item) {
      item.value = `taskCmd.getActionName().equals("${result}")`
    }
  }
}
</script>
<style lang="scss">
.branch-condition{
  padding: 20px 10px !important;
  .el-button{
    padding: 5px;
    margin: 5px;
  }
    .CodeMirror{
    height: 150px!important;
   border-right:1px solid #eee;
    .CodeMirror-scroll{
      padding-bottom: 8px !important;
      height: 150px!important;
      border: 1px solid #eee{
        left:none;
        bottom:1px;
      }
    }
  }
  .content{
    &:last-child{
      border-bottom: 1px solid #ddd;
    }
        border: 1px solid #ddd;
        border-bottom: none;
    width: 100%;
    height: 230px;
   overflow: hidden;
    .left{
          background: #eee;
          color: #606266;
          font-weight: bold;
      float: left;
      text-align: center;
      border-right:1px solid #eee;
      box-sizing: border-box;
      padding-right: 5px;
    width: 20%;
    height: 100%;
    line-height: 230px;
    }
    .right{
      padding: 5px;
      box-sizing: border-box;
      float: left;
      width:80%;
    }
  }
}
</style>

