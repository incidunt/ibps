<template>
  <el-dialog
    :title="'添加按钮'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%"
    top="10vh"
    class="edit-button-dialog"
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
      <el-form-item label="操作类型:" prop="alias">
        <el-select v-model="form.alias" placeholder="请选择操作类型" @change="changAlias">
          <template v-for="item of buttonTypeMap">
            <el-option
              :key="item.alias"
              :label="item.name"
              :value="item.alias"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="按钮名称:" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item v-if="form.alias==='custom'" label="按钮编码:" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <!-- <template v-if="supportScript">
        <el-form-item label="前置脚本:" prop="beforeScript">
          <codemirror v-model="form.beforeScript" :options="cmOption" />
          <span>脚本为javascript，用于在提交前做些处理，需要返回true或false。返回false时不做提交动作。</span>
        </el-form-item>
        <el-form-item label="后者脚本:" prop="afterScript">
          <codemirror v-model="form.afterScript" :options="cmOption" />
          <span>脚本为javascript，用于在提交后做些处理，需要返回true或false。返回false时可以控制不关闭当前窗口。</span>
        </el-form-item>
      </template> -->
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import ActionUtils from '@/utils/action'
// import { codemirror } from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/eclipse.css'
// import 'codemirror/mode/xml/xml.js'
// import 'codemirror/addon/selection/active-line.js'
export default {
  // components: {
  //   codemirror
  // },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    buttonTypeMap: Object, // 按钮类型
    data: Object
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
      form: {},
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      rules: {
        alias: [{ required: true, message: this.$t('validate.required') }],
        name: [{ required: true, message: this.$t('validate.required') }],
        code: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    supportScript() { //  是否显示脚本
      if (!this.form.alias) {
        return true
      }
      const bt = this.buttonTypeMap[this.form.alias]
      return bt ? bt.supportScript : false
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
    changAlias(alias) {
      if (alias === 'custom') {
        return
      }
      const button = this.buttonTypeMap[alias]
      this.form.name = button ? button.name : ''
    },
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
      // 初始化表单
      this.form = JSON.parse(JSON.stringify(this.data))
      this.formValidate()
    }
  }

}
</script>
<style lang='scss' >
.edit-button-dialog{
    .el-select{
    width: 100%;
  }
      .CodeMirror{
    height: 100px!important;
    border-right:1px solid #eee;
    .CodeMirror-scroll{
      padding-bottom: 8px !important;
      height: 100px!important;
      border: 1px solid #eee
    }
  }
.el-dialog__header{
  height: 30px;
  line-height: 30px;
  padding: 10px;
}
.el-dialog__body{
  height: 55vh;
    padding: 10px 50px 0px 10px!important;
}
.el-dialog__footer{
  border: none
}
}
</style>
