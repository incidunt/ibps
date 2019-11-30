<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="template-dialog"
    top="0vh"
    width="65%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      v-if="dialogVisible"
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
      class="template-dialog-form"
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form,key:'key'}" />
        <span v-else>{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="业务主键:" prop="key">
        <el-input v-if="!readonly" v-model="form.key" />
        <span v-else>{{ form.key }}</span>
      </el-form-item>
      <el-form-item label="模板分类:" prop="typeKey">
        <ibps-type-select
          v-if="!readonly"
          v-model="form.typeKey"
          node-key="typeKey"
          category-key="MSG_TEL_TYPE"
          clearable
        />
        <el-tag v-else>{{ form.typeKey|optionsFilter(typeOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="是否默认:" prop="isDefault">
        <el-switch
          v-if="!readonly"
          v-model="form.isDefault"
          active-value="Y"
          inactive-value="N"
        />
        <!-- <span v-else>{{ form.isDefault }}</span> -->
        <el-tag v-else :type="form.isDefault|optionsFilter(defaultOptions,'type')">{{ form.isDefault|optionsFilter(defaultOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="标题:" prop="subject">
        <el-input v-if="!readonly" v-model="form.subject" />
        <span v-else>{{ form.subject }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="创建人:">
        <span>{{ form.createBy }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="创建时间:">
        <span>{{ form.createTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="更新人:">
        <span>{{ form.updateBy }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="更新时间:">
        <span>{{ form.updateTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="模板二级分类:">
        <span>{{ form.subTypeKey }}</span>
      </el-form-item>
      <el-form-item label="纯文本内容:" prop="plain">
        <codemirror v-model="form.plain" :options="cmOption" />
      </el-form-item>
      <el-form-item label="微信文本内容:" prop="wechat">
        <codemirror v-model="form.wechat" :options="cmOption" />
      </el-form-item>
      <el-form-item label="HTML模板内容:" prop="html">
        <ibps-ueditor v-model="form.html" :readonly="readonly" />
      </el-form-item>
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
import { save, get } from '@/api/platform/message/messageTemplate'
import { typeOptions, defaultOptions } from './constants'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'
import IbpsUeditor from '@/components/ibps-ueditor'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'

import IbpsTypeSelect from '@/business/platform/cat/type/select'

export default {
  components: {
    IbpsTypeSelect,
    IbpsUeditor,
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
    title: String,
    editData: [Object, String]
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
      typeOptions: typeOptions,
      defaultOptions: defaultOptions,
      defaultForm: {},
      form: {
        name: '',
        key: '',
        typeKey: 'taskCreate',
        isDefault: 'true',
        subject: '',
        plain: '',
        wechat: '',
        html: '',
        id: '',
        createTime: '',
        htmlEditor: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }],
        typeKey: [{ required: true, message: this.$t('validate.required') }],
        isDefault: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
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
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
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
      const data = this.form
      data.createTime = Date.parse(data.createTime)
      data.updateTime = Date.parse(data.updateTime)
      save(data).then(response => {
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
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      get({
        messageTemplateId: this.formId
      }).then(response => {
        this.form = response.data
        this.form.createTime = fecha.format(response.data.createTime, 'yyyy-MM-dd HH:mm:ss')
        this.form.updateTime = fecha.format(response.data.updateTime, 'yyyy-MM-dd HH:mm:ss')
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.template-dialog-form{
  .CodeMirror{
    height: 150px!important;
    .CodeMirror-scroll{
      padding-bottom: 8px !important;
      height: 150px!important;
      border: 1px solid #eee{
        left:none;
        bottom:1px;
      }
    }
  }
}
</style>
