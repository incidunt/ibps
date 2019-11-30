<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="dialog app-api-import-dialog"
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
      <el-form-item label="Swagger地址:" prop="url">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-form-item label="导入模式:" prop="mode">
        <el-select v-model="form.mode" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in modeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span class="demonstration" style="display:block;padding-left:30px;">
      <p> 目前支持springfox-swagger2；</p>
      <p> 导入接口会级联导入应用；</p>
      <p> 导入模式</p>
      <p> 1、普通模式：存在的接口不会重复导入，只能导入新增的接口；</p>
      <p> 2、覆盖模式：会删除本次导入的所有应用及对应接口，再全量导入；</p>
    </span>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { importApi } from '@/api/platform/auth/api'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      modeOptions: [{
        value: 'normal',
        label: '普通模式'
      }, {
        value: 'cover',
        label: '覆盖模式'
      }],
      defaultForm: {},
      form: {
        url: '',
        mode: 'normal'
      },
      rules: {
        url: [
          { required: true, type: 'url', message: '请填写正确的Swagger URL地址!' }
        ],
        mode: [{ required: true, message: this.$t('validate.required') }]
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
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      importApi(this.form).then(response => {
        loading.close()
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
        loading.close()
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
    }
  }

}
</script>
<style lang="scss">
.app-api-import-dialog{
  .el-dialog__body{
    height:  calc(37vh - 100px) !important;
  }
}
</style>
