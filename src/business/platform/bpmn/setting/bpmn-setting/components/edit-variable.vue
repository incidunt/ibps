<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="var-set-dialog"
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
      <el-form-item label="节点:" prop="nodeId">
        <el-select v-model="form.nodeId" placeholder="请选择节点">
          <el-option label="全局变量" value="" />
          <el-option
            v-for="item of nodeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变量名称:" prop="name">
        <el-input v-model="form.name" v-pinyin="{vm:form}" />
      </el-form-item>
      <el-form-item label="变量key(唯一):" prop="key">
        <el-input v-model="form.key" />
      </el-form-item>
      <el-form-item label="数据类型:" prop="dataType">
        <el-select v-model="form.dataType" placeholder="请选择数据类型">
          <el-option label="字符串" value="string" />
          <el-option label="整型" value="int" />
          <el-option label="浮点型" value="float" />
          <el-option label="双精型" value="double" />
        </el-select>
      </el-form-item>
      <el-form-item label="必填:" prop="isRequired">
        <el-switch
          v-model="form.isRequired"
          :active-value="'true'"
          :inactive-value="'false'"
        />
      </el-form-item>
      <el-form-item label="默认值:" prop="defaultVal">
        <el-input v-model="form.defaultVal" />
      </el-form-item>
      <el-form-item label="描述:" prop="description">
        <el-input v-model="form.description" type="textarea" />
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
import { mapState } from 'vuex'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    data: Object // 表单数据
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      form: {
        nodeId: '',
        name: '',
        key: '',
        isRequired: 'false',
        dataType: 'string',
        defaultVal: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }, { validator: validateKey, trigger: 'blur' }],
        dataType: [{ required: true, message: this.$t('validate.required') }],
        isRequired: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },

  computed: {
    ...mapState({
      nodeList: state => state.ibps.bpmn.userNodeList
    })
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
          this.handleConfirm()
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
    handleConfirm() {
      // TODO: 数据类型不对，默认值的验证
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.confirmData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    confirmData() {
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
    }
  }

}
</script>
<style lang='scss' >
.var-set-dialog{
  .el-select{
    width: 100%;
  }
.el-dialog__header{
  height: 30px;
  line-height: 30px;
  padding: 10px;
}
.el-dialog__body{
  padding: 10px 50px 10px 10px!important;
}
.el-dialog__footer{
  border: none
}
}
</style>
