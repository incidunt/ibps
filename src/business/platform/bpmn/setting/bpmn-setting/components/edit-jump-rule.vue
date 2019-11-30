<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="edit-rule-dialog"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :rules="rules"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
    >
      <el-form-item label="规则名称:" prop="ruleName">
        <el-input v-model="form.ruleName" />
      </el-form-item>
      <el-form-item label="目标节点:" prop="targetNode">
        <el-select v-model="form.targetNode" placeholder="请选择节点">
          <el-option
            v-for="item in nodeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="规则表达式:" prop="condition">
        <el-row :gutter="10">
          <el-col :span="5">
            <el-button type="primary" size="mini" @click="commonScriptVisible=true">常用脚本</el-button>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" size="mini" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
          </el-col>
          <el-col :span="5">
            <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="handleFormVar" />
          </el-col>
        </el-row>
        <codemirror v-model="form.condition" :options="cmOption" />
        <div>这个脚本需要使用返回语句(return)返回布尔值，返回true流程将跳转到指定的节点。</div>

      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
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
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import ActionUtils from '@/utils/action'
import CommonScript from '../components/form-script/common-script/dialog'
import ConditionScriptSelect from '../components/form-script/condition-script'
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
    CommonScript,
    ConditionScriptSelect,
    BpmnFormVar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    data: Object,
    nodeList: Array
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
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      commonScriptVisible: false, // 常用脚本
      conditionScriptSelectVisible: false, // 条件脚本
      form: {},
      rules: {
        ruleName: [{ required: true, message: this.$t('validate.required') }],
        targetNode: [{ required: true, message: this.$t('validate.required') }],
        condition: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
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
    formId() {
      return this.id
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
        case 'confirm':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      this.$emit('callback', this.form)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.form = JSON.parse(JSON.stringify(this.data))
      this.formValidate()
    },
    handleFormVar(node) {
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
      this.form.condition = (this.form.condition || '') + data
    }
  }

}
</script>
<style lang='scss' >
.edit-rule-dialog{
    .CodeMirror{
    height: 150px!important;
    border-right:1px solid #eee;
    .CodeMirror-scroll{
      padding-bottom: 8px !important;
      height: 150px!important;
      border: 1px solid #eee
    }
  }
  .el-select{
    width: 100%;
  }
.el-dialog__header{
  height: 30px;
  line-height: 30px;
  padding: 10px;
}
.el-dialog__body{
  height: 50vh;
  padding: 10px 50px 10px 10px!important;
}
}
</style>
