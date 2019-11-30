<template>
  <div>
    <div v-sticky class="setting-title" @click="onTitle">
      全局设置
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="业务对象绑定" name="boSetting">
        <bo-setting :data="boData" @clean="cleanFormData" />
      </el-collapse-item>
      <el-collapse-item title="表单设置" name="formSeting">
        <form-setting
          :data="formData"
          :bo-data="boData"
          :def-key="defKey"
          :form-opinions.sync="formOpinions"
          form-type="flow"
          @change-form="changeForm"
        />
      </el-collapse-item>
      <el-collapse-item title="实例表单设置" name="instFormSetting">
        <form-setting
          :data="instFormData"
          :def-key="defKey"
          :bo-data="boData"
          form-type="inst"
        />
      </el-collapse-item>

      <el-collapse-item title="流程变量设置" name="varSetting">
        <variable-setting
          :data="variables"
        />
      </el-collapse-item>
      <!-- <el-collapse-item name="endNotify">
        <template slot="title">
          办结抄送设置
          <el-tooltip class="item" effect="light" content="进行设置流程结束时抄送给某批人！" placement="bottom">
            <i class="header-icon el-icon-info" />
          </el-tooltip>
        </template>
        <notify-setting :data="procNotify" />
      </el-collapse-item> -->
      <el-collapse-item title="其他设置" name="otherAttribute">
        <other-attribute :data="attributes" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import mixins from '../mixins/type'
export default {
  mixins: [mixins],
  props: {
    defKey: String
  },
  data() {
    return {
      activeNames: ['boSetting', 'formSeting', 'instFormSetting', 'varSetting', 'endNotify', 'otherAttribute']
    }
  },
  computed: {
    // 业务对象
    boData() {
      return this.data ? this.data.bo || {} : {}
    },
    boCode() {
      return this.boData ? this.boData.code || '' : ''
    },
    // 表单
    formData() {
      return this.data ? this.data.form || {} : {}
    },
    // 实例表单
    instFormData() {
      return this.data ? this.data.instForm || {} : {}
    },
    // 表单意见
    formOpinions: {
      get() {
        return this.data ? this.data.formOpinions || {} : {}
      },
      set(value) {
        this.data.formOpinions = value || {}
      }
    },
    // 流程变量
    variables() {
      return this.data ? this.data.variables || [] : []
    },
    // 抄送
    procNotify() {
      return this.data ? this.data.procNotify || [] : []
    },
    // 其它属性
    attributes() {
      return this.data ? this.data.attributes || {} : {}
    }
  },
  methods: {
    handleData(key, data) {
      this.$emit('input', data)
    },
    changeForm(key, value) {
      this.instFormData[key] = value
    },
    cleanFormData() {
      this.instFormData.formValue = ''
      this.formData.formValue = ''
      this.$emit('clean-form-data')
    }
  }
}
</script>

