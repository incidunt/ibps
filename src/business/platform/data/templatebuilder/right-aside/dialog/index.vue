<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">对话框属性</div>
      <div class="panel-body">
        <el-form
          size="mini"
          label-width="120px"
        >
          <el-form-item label="是否多选">
            <el-switch v-model="attrs.multi" active-value="Y" inactive-value="N" @change="(val)=>handleAttrs('multi',val)" />
          </el-form-item>
          <el-form-item label="尺寸">
            <div>
              宽：<el-input-number v-model="attrs.width" placeholder="宽" @input="(val)=>handleAttrs('width',val)" />
            </div>
            <div>
              高：<el-input-number v-model="attrs.height" placeholder="高" @input="(val)=>handleAttrs('height',val)" />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--弹窗-功能按钮-->
    <button-template
      :template="buttons"
      :types="functionButtonTypes"
      title="弹窗-功能按钮"
      prop="dialog_buttons"
      @input="handleButtons"
    >
      <div slot="edit" slot-scope="scope">
        <editor-button :data="scope.data" type="edit" />
      </div>
    </button-template>
    <!--弹窗-对话框脚本-->
    <div class="panel panel-default">
      <div class="panel-heading">对话框脚本</div>
      <div class="panel-body">
        <el-button style="width:100%;" type="primary" icon="ibps-icon-file-code-o" @click="editTemplateScript()">设置对话框脚本</el-button>
        <template-script
          :visible="dialogScriptVisible"
          title="对话框模板脚本设置"
          type="dialog"
          @callback="handleDialogScript"
          @close="visible => dialogScriptVisible = visible"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ButtonTemplate from '../components/button'
import EditorButton from '../editors/editor-button'
import TemplateScript from '../editors/template-script'
export default {
  components: {
    ButtonTemplate,
    EditorButton,
    TemplateScript
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogScriptVisible: false,
      dialogScript: '',
      functionButtonTypes: ['ok', 'clean', 'cleanClose',	'cancel', 'custom']
    }
  },
  computed: {
    attrs: {
      get() {
        return this.data.attrs || {}
      },
      set(value) {
        console.info(value)
      }
    },
    buttons() {
      return this.data.buttons || {}
    }
  },
  methods: {
    handleAttrs(key, data) {
      const curDialogs = JSON.parse(JSON.stringify(this.data))
      if (!curDialogs.attrs) {
        curDialogs.attrs = {}
      }
      curDialogs.attrs[key] = data
      this.$emit('update', curDialogs)
    },
    handleButtons(key, data) {
      const curDialogs = JSON.parse(JSON.stringify(this.data))
      if (!curDialogs.buttons) {
        curDialogs.buttons = {}
      }
      curDialogs.buttons[key] = data
      this.$emit('update', curDialogs)
    },
    editTemplateScript() {
      this.dialogScriptVisible = true
    },
    handleDialogScript(script) {
      // script 为codemirror中填入的脚本值
      console.log(script)
    }
  }
}
</script>
