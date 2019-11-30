<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :top="readonly?'10vh':'0'"
    class="dialog"
    :class="!readonly?'identity-edit-dialog':'identity-edit-readonly-dialog'"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="identityForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="identity"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="identity.name" v-pinyin="{vm:identity,key:'alias'}" />
        <span v-else>{{ identity.name }}</span>
      </el-form-item>
      <el-form-item label="别名:" prop="alias">
        <el-input v-if="!readonly" v-model="identity.alias" :disabled="formId!==''" />
        <span v-else>{{ identity.alias }}</span>
      </el-form-item>
      <el-form-item label="规则:" prop="regulation">
        <el-input v-if="!readonly" v-model="identity.regulation" />
        <div v-if="!readonly">
          {yyyy}表示年份，如2015年表示为2015。<br>
          {yy}表示年份，如2015年表示为15。<br>
          {MM}表示月份，如果月份小于10，则加零补齐，如1月份表示为01。<br>
          {M}表示月份，月份不补齐，如1月份表示为1。<br>
          {dd}表示日，如果小于10号，则加零补齐，如1号表示为01。<br>
          {d}表示日，日期不补齐，如1号表示为1。<br>
          {NO}表示流水号，前面补零。<br>
          {no}表示流水号，不补零。<br>
        </div>
        <span v-else>{{ identity.regulation }}</span>
      </el-form-item>
      <el-form-item label="生成类型:" prop="genType">
        <el-radio-group v-if="!readonly" v-model="identity.genType">
          <el-radio
            v-for="option in genTypeOptions"
            :key="option.value"
            :label="option.value"
          >{{ option.label }}
          </el-radio>
        </el-radio-group>
        <div v-if="!readonly">
          流水号生成规则： <br>
          1.每天生成。每天从初始值开始计数。<br>
          2.递增，流水号一直增加。<br>
        </div>
        <span v-else>{{ identity.genType|optionsFilter(genTypeOptions,'label') }}</span>
      </el-form-item>
      <el-form-item label="流水号长度:" prop="noLength">
        <div v-if="!readonly">
          <el-input-number v-model="identity.noLength" :min="2" :max="32" />
          <div>
            这个长度表示当前流水号的长度数，只包括流水号部分{NO},如果长度为5，当前流水号为5，则在流水号前补4个0，表示为00005。
            则流水号一直递增。
          </div>
        </div>
        <span v-else>{{ identity.noLength }}</span>
      </el-form-item>
      <el-form-item label="初始值:" prop="initValue">
        <el-input v-if="!readonly" v-model="identity.initValue" type="number" />
        <span v-else>{{ identity.initValue }}</span>
        <div v-if="!readonly">
          初始值必须大于0，默认值为1。<br>
        </div>
      </el-form-item>
      <el-form-item label="步长:" prop="step">
        <el-input v-if="!readonly" v-model="identity.step" type="number" />
        <span v-else>{{ identity.step }}</span>
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
import { save, get, test } from '@/api/platform/system/identity'
import { genTypeOptions } from './constants'
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
    const validateIntegerLength = (rule, value, callback) => {
      const re = /^[0-9]{1,10}$/
      if (!re.test(value)) {
        if (value.length > 10) {
          callback(new Error('整数位长度不能超过10！'))
        } else {
          callback(new Error('请输入合法得整数！'))
        }
      } else {
        if (value <= 0) {
          callback(new Error('请输入大于0的整数！'))
          return
        }
        callback()
      }
    }
    return {
      formName: 'identityForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      genTypeOptions: genTypeOptions,
      defaultForm: {},
      identity: {
        name: '',
        alias: '',
        id: '',
        regulation: '{yyyy}{MM}{dd}{NO}',
        noLength: 5,
        initValue: 1,
        step: 1,
        genType: 0
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        alias: [{ required: true, validator: validateKey }],
        noLength: [
          { required: true, message: this.$t('validate.required') }
        ],
        initValue: [
          { required: true, validator: validateIntegerLength }
        ],
        step: [
          { required: true, validator: validateIntegerLength }
        ]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'preview', type: 'success', icon: 'ibps-icon-preview', label: '预览' },
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
    this.defaultForm = JSON.parse(JSON.stringify(this.identity))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'preview':
          this.handleSave(true)
          break
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
      save(this.identity).then(response => {
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
      test(this.identity).then(response => {
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
        this.identity = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.identity = response.data
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
.identity-edit-dialog{
  .el-dialog__body{
    height:  calc(100vh) !important;
  }
}
.identity-edit-readonly-dialog{
  .el-dialog__body{
    height:  calc(40vh) !important;
  }
}
</style>
