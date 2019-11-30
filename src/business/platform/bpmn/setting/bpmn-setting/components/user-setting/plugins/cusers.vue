<template>
  <table class="table table-striped table-bordered table-hover">
    <tbody>
      <tr
        v-for="item in userTypeOptions"
        :key="item.value"
      >
        <td :colspan="item.colspan?item.colspan:2">
          <el-radio
            v-model="formData.source"
            :label="item.value"
            @change="changeSource"
          >{{ item.label }}
          </el-radio>
        </td>
        <td v-if="item.value === 'spec'">
          <ibps-employee-selector
            v-model="formData.account"
            :disabled="formData.source!=='spec'"
            value-key="account"
            placeholder="请选择指定人"
            multiple
            @callback="handleSpec"
          />
        </td>
        <td v-if="item.value === 'var'">
          <bpmn-form-var :value="executorVar" :disabled="formData.source!=='var'" @input="handleVar" />
        </td>

        <td v-if="item.value === 'node'">
          <bpmn-same-node v-model="formData" :disabled="formData.source!=='node'" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import plugin from '../mixins/plugin'
/* 用户选择器*/
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
/** 表单变量树 */
import BpmnFormVar from '@/business/platform/bpmn/setting/bpmn-setting/components/form-var-select'
/** 相同节点 */
import BpmnSameNode from '@/business/platform/bpmn/setting/bpmn-setting/components/user-setting/components/same-node'

export default {
  components: {
    IbpsEmployeeSelector,
    BpmnFormVar,
    BpmnSameNode
  },
  mixins: [plugin],
  data() {
    return {
      userTypeOptions: [
        { value: 'start', label: '发起人' },
        { value: 'prev', label: '上一步执行人' },
        { value: 'spec', label: '指定人', colspan: 1 },
        { value: 'var', label: '人员变量', colspan: 1 },
        { value: 'node', label: '相同节点执行人', colspan: 1 }],
      defaultData: {
        source: '',
        account: '',
        fullName: '',
        executorVar: '',
        nodeId: '',
        nodeName: ''
      }
    }
  },
  methods: {
    changeSource(source) {
      if (source !== 'spec') {
        this.formData.account = ''
        this.formData.fullName = ''
      }
      if (source !== 'var') {
        this.formData.executorVar = ''
      }
      if (source !== 'node') {
        this.formData.nodeId = ''
        this.formData.nodeName = ''
      }
    },
    handleSpec(data) {
      if (this.$utils.isEmpty(data)) {
        this.formData.account = ''
        this.formData.fullName = ''
      } else {
        const fullName = []
        data.forEach(el => {
          fullName.push(el.name)
        })
        this.formData.fullName = fullName.join(',')
      }
    },
    // 表单变量
    handleVar(data) {
      const executorVar = {
        source: data.source,
        name: data.name,
        executorType: 'user',
        valType: 'userId'
      }
      this.formData.executorVar = executorVar
    },
    getData() {
      const source = this.formData.source
      if (this.$utils.isEmpty(source)) {
        return {
          result: false,
          message: '请选择来源！'
        }
      }

      let description = this.userTypeMap[source].label
      switch (source) {
        case 'spec':
          if (this.$utils.isEmpty(this.formData.account)) {
            return {
              result: false,
              message: '请选择指定人员'
            }
          }
          description += '【' + this.formData.fullName + '】'
          break
        case 'var':
          if (this.$utils.isEmpty(this.formData.executorVar) && this.$utils.isEmpty(this.formData.executorVar.name)) {
            return {
              result: false,
              message: '请选择人员变量'
            }
          }
          description += '【' + this.formData.executorVar.name + '】'
          break
        case 'node':
          if (this.$utils.isEmpty(this.formData.nodeId)) {
            return {
              result: false,
              message: '请指定节点'
            }
          }
          description += '【' + this.formData.nodeName + '】'
          break
        default:
          break
      }

      this.formData['description'] = description
      return {
        data: this.formData,
        result: true
      }
    }
  }
}
</script>

