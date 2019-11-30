<template>
  <el-dialog
    :width="dialogWidth"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="0"
    class="dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="dataSourceDefForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="dataSourceDef"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="dataSourceDef.name" v-pinyin="{vm:dataSourceDef,key:'alias'}" />
        <span v-else>{{ dataSourceDef.name }}</span>
      </el-form-item>
      <el-form-item label="别名:" prop="alias">
        <el-input v-if="!readonly" v-model="dataSourceDef.alias" />
        <span v-else>{{ dataSourceDef.alias }}</span>
      </el-form-item>
      <el-form-item label="初始化方法:" prop="initMethod">
        <el-input v-if="!readonly" v-model="dataSourceDef.initMethod" />
        <span v-else>{{ dataSourceDef.initMethod }}</span>
      </el-form-item>
      <el-form-item label="关闭方法:" prop="closeMethod">
        <el-input v-if="!readonly" v-model="dataSourceDef.closeMethod" />
        <span v-else>{{ dataSourceDef.closeMethod }}</span>
        <div class="el-form-item__error">
          格式：classPath|method，
          例：org.logicalcobwebs.proxool.ProxoolFacade|shutdown
        </div>
      </el-form-item>
      <el-form-item label="说明:" prop="commnet">
        <el-input v-if="!readonly" v-model="dataSourceDef.commnet" />
        <span v-else>{{ dataSourceDef.commnet }}</span>
      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="参数配置" name="configuration">
        <el-row :gutter="20">
          <el-col :span="4">名称</el-col>
          <el-col :span="4">描述</el-col>
          <el-col :span="4">参数类型</el-col>
          <el-col :span="4">默认值</el-col>
          <el-col :span="2">是否必填</el-col>
          <el-col :span="6">管理</el-col>
        </el-row>
        <el-row v-for="item in dataSourceDef.variables" :key="item.name" :gutter="20">
          <el-col :span="4">{{ item.name }}</el-col>
          <el-col :span="4">
            <el-input v-model="item.comment" />
          </el-col>
          <el-col :span="4">{{ item.type }}</el-col>
          <el-col :span="4">
            <el-input v-model="item.default" />
          </el-col>
          <el-col :span="2">
            <el-select v-model="item.necessary" placeholder="请选择">
              <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button
              size="mini"
            >上移</el-button>
            <el-button
              size="mini"
            >下移</el-button>
            <el-button
              size="mini"
            >删除</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { save, test } from '@/api/platform/system/identity'
import { get } from '@/api/platform/ds/dataSourceDef'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'

export default {
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
      dialogWidth: '75%',
      formName: 'dataSourceDefForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      activeName: 'configuration',
      dataSourceDef: {
        name: '',
        alias: '',
        id: '',
        dbType: '',
        driver: '',
        driverUrl: '',
        isDefault: true,
        password: '',
        user: '',
        status: '',
        variables: [
          { name: 'delegateProperties1', comment: 'delegateProperties1', type: 'Boolean', default: '', necessary: '0' },
          { name: 'delegateProperties2', comment: 'delegateProperties2', type: 'Boolean', default: '', necessary: '0' },
          { name: 'delegateProperties3', comment: 'delegateProperties3', type: 'Boolean', default: '', necessary: '0' },
          { name: 'delegateProperties4', comment: 'delegateProperties4', type: 'Boolean', default: '', necessary: '0' },
          { name: 'delegateProperties5', comment: 'delegateProperties5', type: 'Boolean', default: '', necessary: '0' }
        ]
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        alias: [{ required: true, validator: validateKey }]
      },
      options: [{
        value: '1',
        label: '是'
      }, {
        value: '0',
        label: '否'
      }],
      value: '',
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        // { key: 'preview', icon: 'ibps-icon-preview', label: '预览' },
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
    this.defaultForm = JSON.parse(JSON.stringify(this.dataSourceDef))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        // case 'preview':
        //   this.handleSave(true)
        //   break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave(preview = false) {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (preview) {
            this.handlePreview()
          } else {
            this.saveData()
          }
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      save(this.dataSourceDef).then(response => {
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
    handlePreview() {
      test(this.dataSourceDef).then(response => {
        const data = response.data
        this.$alert(data, '预览流水号', {
          dangerouslyUseHTMLString: true
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
        this.dataSourceDef = JSON.parse(JSON.stringify(this.defaultForm))
        // this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.dataSourceDef = response.data
        // this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    handleClick() {
      // nothing
    }
  }

}
</script>

