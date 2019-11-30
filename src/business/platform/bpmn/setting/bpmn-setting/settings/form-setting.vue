<template>
  <div class="panel-body">
    <el-form ref="formSet" v-model="form" label-width="100px">
      <el-form-item label="" prop="type">
        <template slot="label">
          表单类型：<ibps-help
            title="关于表单类型"
            :content="`在线表单：加载自定义表单设计的表单；
          </br>内嵌URL表单：表单加载iframe内嵌一个表单或者平台url的组件，所有操作按钮操作由系统的按钮规则进行操作,eg：/demo/url-form/index；
          </br>URL表单：表单加载iframe内嵌一个表单，所有操作按钮操作由嵌套的表单自己操作和调用接口,eg：/demo/url-form/index`"
          />
        </template>
        <el-radio-group v-model="form.type" @change="changeFormType">
          <el-radio label="inner">在线表单</el-radio>
          <!-- <el-radio label="urlLoad">内嵌URL表单</el-radio>
          <el-radio label="frame">URL表单</el-radio> -->
        </el-radio-group>
        <!-- <el-select v-model="form.type" placeholder="请选择" style="width:100%;" @change="changeFormType">
          <el-option
            v-for="item in formTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item label="表单：" prop="formValue">
        <form-def-selector
          v-if="form.type=='inner'||form.type==''"
          v-model="form.formValue"
          :value-key="'key'"
          :bo-code="boCode"
          :toolbar="formToolbar"
          :flow-key="flowKey"
          :node-id="nodeId"
          :parent-flow-key="parentFlowKey"
          :is-inst="formType==='inst'"
          :rights-type="rightsType"
          :disabled="$utils.isEmpty(form.type)"
          data-type="bo"
          @change="changeFormKey"
          @action-event="handleFormActionEvent"
          @rights-callback="handleRightsData"
        />
        <el-input
          v-if="form.type=='frame'||form.type=='urlLoad'"
          v-model="form.formValue"
          placeholder="表单URL"
        />
        <el-input
          v-if="form.type=='frame'"
          v-model="form.editUrl"
          placeholder="明细URL"
          class="ibps-pt-5"
        />
      </el-form-item>
      <!-- <el-form-item label="打印模版：" prop="formPrint">
        <form-print-selector v-model="form.formPrint" :disabled="$utils.isEmpty(form.formValue)" />
      </el-form-item>
-->
      <template v-if="formType==='flow' || formType==='node' ">
        <el-form-item label="前置处理器：" prop="prevHandler">
          <el-input v-model="form.prevHandler" placeholder="前置处理器" type="textarea" rows="2" autosize />
        </el-form-item>
        <el-form-item label="后置处理器：" prop="postHandler">
          <el-input v-model="form.postHandler" placeholder="后置处理器" type="textarea" rows="2" autosize />
        </el-form-item>
      </template>
    </el-form>
    <!-- 表单意见-->
    <form-opinion
      :form-key="formKey"
      :data="formOpinionsData"
      :visible="formOpinionVisible "
      @callback="handleFormOpinions"
      @close="visible => formOpinionVisible = visible"
    />

  </div>
</template>
<script>
import FormDefSelector from '@/business/platform/form/form-def/selector'
// import FormPrintSelector from '@/business/platform/form/form-print/selector'
import FormOpinion from '../../bpmn-setting/components/form-opinion'

export default {
  components: {
    FormDefSelector,
    // FormPrintSelector,
    FormOpinion
  },
  props: {
    formType: {// 表单类型，form：表单,inst：实例表单
      type: String,
      default: 'flow'
    },
    data: Object, // 表单数据
    formOpinions: Object, // 表单意见的数据
    boData: Object, // 数据对象code
    defKey: String, // 流程定义key
    nodeId: String, // 节点ID
    parentFlowKey: String
  },
  data() {
    return {
      formOpinionVisible: false,
      formTypeOptions: [
        { value: 'inner', label: '在线表单' },
        { value: 'urlLoad', label: '内嵌URL表单' },
        { value: 'frame', label: 'URL表单' }
      ],
      formOpinionsData: {}
    }
  },
  computed: {
    // 工具栏
    formToolbar() {
      const toolbar = [{
        key: 'rechoose',
        type: 'primary',
        label: '重选'
      }, {
        key: 'remove',
        type: 'danger',
        label: '删除'
      }, {
        key: 'rights',
        type: 'success',
        label: '权限'
      }]
      if (this.formType === 'flow') {
        toolbar.push({
          key: 'opinion',
          type: 'warning',
          label: '意见'
        })
      }
      return toolbar
    },
    form() {
      return this.data
    },
    // 业务对象编码
    boCode() {
      return this.boData ? this.boData.code || '' : ''
    },
    boVersion() {
      return this.boData ? this.boData.version || '' : ''
    },
    rightsType() {
      return this.formType
    },
    formKey() {
      return this.form.formValue
    },
    flowKey() {
      return this.defKey
    }
  },
  watch: {
    boCode(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        if (this.form.type === 'inner') {
          this.form.formValue = ''
        }
      }
    },
    formOpinions(val) {
      this.formOpinionsData = val
    },
    formOpinionsData: {
      handler(val) {
        this.$emit('update:formOpinions', val)
      },
      deep: true
    }
  },
  methods: {
    changeFormType(value) {
      if (this.formType === 'flow') {
        this.$emit('change-form', 'type', value)
      }
      this.form.formValue = ''
      this.form.editUrl = ''
    },
    changeFormKey(value) {
      if (this.formType === 'flow') {
        this.$emit('change-form', 'formValue', this.$utils.isEmpty(value) ? '' : value.key)
      }
    },
    handleFormActionEvent(key) {
      if (key === 'opinion') {
        this.formOpinionVisible = true
      }
    },
    handleRightsData(data) {
      this.form.editFormRights = data
    },
    handleFormOpinions(data) {
      this.formOpinionsData = data
    }
  }
}
</script>

