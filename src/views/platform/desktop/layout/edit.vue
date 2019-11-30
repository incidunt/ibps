<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    top="5vh"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="desktopLayoutForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="desktopLayout"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="desktopLayout.name" />
        <span v-else>{{ desktopLayout.name }}</span>
      </el-form-item>
      <el-form-item label="排序:" prop="sn">
        <el-input v-if="!readonly" v-model.number="desktopLayout.sn" />
        <span v-else>{{ desktopLayout.sn }}</span>
      </el-form-item>
      <el-form-item label="描述:" prop="memo">
        <el-input v-if="!readonly" v-model.number="desktopLayout.memo" type="textarea" rows="2" />
        <span v-else>{{ desktopLayout.memo }}</span>
      </el-form-item>
      <el-col :span="24">
        <el-form-item label="布局模版:" prop="templateHtml">
          <codemirror v-model="desktopLayout.templateHtml" :options="cmOption" style="height:50px;" />
        </el-form-item>
      </el-col>
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
import { save, get } from '@/api/platform/desktop/layout'
import ActionUtils from '@/utils/action'

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/eclipse.css'
// language
import 'codemirror/mode/xml/xml.js'
// require active-line.js
import 'codemirror/addon/selection/active-line.js'

export default {

  components: {
    codemirror
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'desktopLayoutForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      cmOption: {
        lineNumbers: true,
        autoCloseTags: true,
        line: true,
        mode: 'text/html',
        theme: 'eclipse'
      },
      defaultForm: {},
      desktopLayout: {
        name: '',
        sn: 1,
        memo: '',
        templateHtml: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        sn: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
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
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.desktopLayout))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
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
      console.info(this.desktopLayout)
      save(this.desktopLayout).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.desktopLayout = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        desktopLayoutId: this.formId
      }).then(response => {
        this.desktopLayout = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
