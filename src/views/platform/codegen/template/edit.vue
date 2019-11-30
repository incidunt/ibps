<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
    top="0"
    width="70%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板名称:" prop="name">
            <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form}" />
            <span v-else>{{ form.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板key:" prop="key">
            <el-input v-if="!readonly" v-model="form.key" />
            <span v-else>{{ form.key }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件名:" prop="filename">
            <el-input v-if="!readonly" v-model="form.filename" />
            <span v-else>{{ form.filename }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="代码目录:" prop="dir">
            <el-input v-if="!readonly" v-model="form.dir" />
            <span v-else>{{ form.dir }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否子表:" prop="sub">
            <el-radio-group v-if="!readonly" v-model="form.sub">
              <el-radio
                v-for="value in subOptions "
                :key="value.label"
                :label="value.value"
              >{{ value.label }}</el-radio>
            </el-radio-group>
            <el-tag v-else :type="form.sub|optionsFilter(subOptions,'type')">{{ form.sub|optionsFilter(subOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否覆盖:" prop="override">
            <el-radio-group v-if="!readonly" v-model="form.override">
              <el-radio
                v-for="value in overrideOptions "
                :key="value.label"
                :label="value.value"
              >{{ value.label }}</el-radio>
            </el-radio-group>
            <el-tag v-else :type="form.override|optionsFilter(overrideOptions,'type')">{{ form.override|optionsFilter(overrideOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模板路径:" prop="path">
            <el-input v-if="!readonly" v-model="form.path" />
            <span v-else>{{ form.path }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="readonly" :span="12">
          <el-form-item label="创建人:">
            <el-input v-if="!readonly" v-model="form.creator" />
            <span v-else>{{ form.creator }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="readonly" :span="12">
          <el-form-item label="创建时间:">
            <el-input v-if="!readonly" v-model="form.createTime" />
            <span v-else>{{ form.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模板内容:" prop="content">
            <codemirror v-model="form.content" :options="cmOption" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述:" prop="comment">
            <el-input v-if="!readonly" v-model.number="form.comment" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" />
            <span v-else>{{ form.comment }}</span>
          </el-form-item>
        </el-col>
      </el-row>

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
import { save, get } from '@/api/platform/codegen/template'
import { subOptions, overrideOptions } from './constants'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'

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
      cmOption: {
        lineNumbers: true,
        autoCloseTags: true,
        line: true,
        mode: 'text/html',
        theme: 'eclipse',
        readOnly: false
      },
      formName: 'form',
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      subOptions: subOptions,
      overrideOptions: overrideOptions,
      defaultForm: {},
      form: {
        key: '',
        name: '',
        filename: '',
        dir: '',
        sub: 'true',
        override: 'true',
        path: '',
        content: '',
        comment: '',
        id: '',
        isDef: 'N',
        creator: this.$store.getters.userId
      },
      rules: {
        key: [{ required: true, message: this.$t('validate.required') }],
        name: [{ required: true, message: this.$t('validate.required') }],
        filename: [{ required: true, message: this.$t('validate.required') }],
        dir: [{ required: true, message: this.$t('validate.required') }],
        content: [{ required: true, message: this.$t('validate.required') }]
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
    },
    form: {
      handler: function(val, oldVal) {
        if (val.content !== '') {
          this.$refs[this.formName].clearValidate('content')
        } else {
          this.formValidate()
        }
      },
      deep: true
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
      const data = JSON.parse(JSON.stringify(this.form))
      data.createTime = Date.parse(data.createTime)
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
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.cmOption.readOnly = this.readonly
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.form = response.data
        this.form.createTime = fecha.format(response.data.createTime, 'yyyy-MM-dd HH:mm:ss')
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
