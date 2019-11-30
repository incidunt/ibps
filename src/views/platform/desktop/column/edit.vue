<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog column-eidt-dialog"
    top="0"
    width="80%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      v-if="dialogVisible"
      ref="desktopColumnForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="desktopColumn"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称:" prop="name">
            <el-input v-if="!readonly" v-model="desktopColumn.name" v-pinyin="{vm:desktopColumn,key:'alias'}" />
            <span v-else>{{ desktopColumn.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名:" prop="alias">
            <el-input
              v-if="!readonly"
              v-model="desktopColumn.alias"
              :disabled="formId!==''"
            />
            <span v-else>{{ desktopColumn.alias }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="栏目类型:" prop="colType">
            <el-select v-if="!readonly" v-model="desktopColumn.colType" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="option in typeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-tag v-else :type="desktopColumn.colType|optionsFilter(typeOptions,'type')">{{ desktopColumn.colType|optionsFilter(typeOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="栏目分类:" prop="typeId">
            <ibps-type-select v-model="desktopColumn.typeId" category-key="DESKTOP_TYPE" clearable :readonly="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="展示效果:" prop="showEffect">
            <el-select v-if="!readonly" v-model="desktopColumn.showEffect" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="option in showEffectOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-tag v-else :type="desktopColumn.showEffect|optionsFilter(showEffectOptions,'type')">
              {{ desktopColumn.showEffect|optionsFilter(showEffectOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更多路径:" prop="colUrl">
            <el-input v-if="!readonly" v-model="desktopColumn.colUrl" />
            <span v-else>{{ desktopColumn.colUrl }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据加载方式:" prop="dataMode">
            <el-radio-group v-if="!readonly" v-model="desktopColumn.dataMode">
              <el-radio
                v-for="option in dataModeOptions"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
            <el-tag v-else :type="desktopColumn.dataMode|optionsFilter(dataModeOptions,'type')">
              {{ desktopColumn.dataMode|optionsFilter(dataModeOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否分页:" prop="needPage">
            <el-radio-group v-if="!readonly" v-model="desktopColumn.needPage">
              <el-radio
                v-for="option in booleanOptions"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
            <el-tag v-else :type="desktopColumn.needPage|optionsFilter(booleanOptions,'type')">
              {{ desktopColumn.needPage|optionsFilter(booleanOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="方法路径:" prop="dataFrom">
            <el-input v-if="!readonly" v-model="desktopColumn.dataFrom" />
            <span v-else>{{ desktopColumn.dataFrom }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="栏目高度:" prop="colHeight">
            <el-input v-if="!readonly" v-model="desktopColumn.colHeight" />
            <span v-else>{{ desktopColumn.colHeight }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公共栏目:" prop="isPublic">
            <el-radio-group v-if="!readonly" v-model="desktopColumn.isPublic">
              <el-radio
                v-for="option in booleanOptions"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
            <el-tag v-else :type="desktopColumn.isPublic|optionsFilter(booleanOptions,'type')">
              {{ desktopColumn.isPublic|optionsFilter(booleanOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" style="height:51px;">
          <el-form-item label="支持刷新:" prop="supportRefesh">
            <el-radio-group v-if="!readonly" v-model="desktopColumn.supportRefesh">
              <el-radio
                v-for="option in booleanOptions"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
            <el-tag v-else :type="desktopColumn.supportRefesh|optionsFilter(booleanOptions,'type')">
              {{ desktopColumn.supportRefesh|optionsFilter(booleanOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col v-if="desktopColumn.supportRefesh" :span="12">
          <el-form-item label="刷新时间:" prop="refeshTime">
            <el-input v-if="!readonly" v-model="desktopColumn.refeshTime" />
            <span v-else>{{ desktopColumn.refeshTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用:" prop="isEnabled">
            <el-switch
              v-if="!readonly"
              v-model="desktopColumn.isEnabled"
              :active-value="'Y'"
              :inactive-value="'N'"
            />

            <el-tag v-else :type="desktopColumn.isEnabled|optionsFilter(statusOptions,'type')">
              {{ desktopColumn.isEnabled|optionsFilter(statusOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="描述:" prop="memo">
            <el-input v-if="!readonly" v-model="desktopColumn.memo" type="textarea" rows="2" />
            <span v-else>{{ desktopColumn.memo }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="栏目模版:" prop="templateHtml">
            <codemirror v-model="desktopColumn.templateHtml" :options="cmOption" />
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
import { save, get, checkCode } from '@/api/platform/desktop/column'
import { typeOptions, statusOptions, dataModeOptions, showEffectOptions, booleanOptions } from './constants'
import ActionUtils from '@/utils/action'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import IbpsTypeSelect from '@/business/platform/cat/type/select'

export default {
  components: {
    codemirror,
    IbpsTypeSelect
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
    const validateNum = (rule, value, callback) => {
      const re = /^[0-9]{1,10}$/
      if (!re.test(value)) {
        if (value.length > 10) {
          callback(new Error('整数位长度不能超过10'))
        } else {
          callback(new Error('请输入整数！'))
        }
      } else {
        callback()
      }
    }
    const validateAlias = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (this.formId !== '') {
        callback()
        return
      }
      if (!reg.test(value)) {
        callback(new Error('必须是字母数字下划线'))
      } else {
        checkCode({ alias: value }).then(response => {
          if (!response.data) {
            callback(new Error(response.message))
          } else {
            callback()
          }
        })
      }
    }
    return {
      formName: 'desktopColumnForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      typeOptions: typeOptions,
      statusOptions: statusOptions,
      dataModeOptions: dataModeOptions,
      showEffectOptions: showEffectOptions,
      booleanOptions: booleanOptions,
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/html',
        theme: 'eclipse',
        readOnly: false
      },
      desktopColumn: {
        name: '',
        alias: '',
        typeId: '',
        colType: 0,
        colUrl: '',
        showEffect: 0,
        dataMode: 0,
        needPage: false,
        dataFrom: '',
        colHeight: '',
        isPublic: true,
        supportRefesh: true,
        refeshTime: '',
        isEnabled: 'Y',
        memo: '',
        templateHtml: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        alias: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateAlias, trigger: 'blur' }],
        refeshTime: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateNum, trigger: 'blur' }],
        templateHtml: [{ required: true, message: this.$t('validate.required') }]
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
      const data = JSON.parse(JSON.stringify(this.desktopColumn))
      data.needPage = data.needPage ? 'true' : 'false'
      data.isPublic = data.isPublic ? 'true' : 'false'
      data.supportRefesh = data.supportRefesh ? 'true' : 'false'
      save(data).then(response => {
        this.$emit('callback', this)
        // TODO 更新首页组件
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
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        desktopColumnId: this.formId
      }).then(response => {
        this.desktopColumn = response.data
        this.cmOption.readOnly = this.readonly
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
.column-eidt-dialog{
  .el-dialog__body{
    height:  calc(100vh) !important;
  }
}
.CodeMirror-lines {
    line-height: 20px;
}
</style>

