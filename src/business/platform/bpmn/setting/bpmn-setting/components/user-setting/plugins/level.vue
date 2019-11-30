<template>
  <table class="table table-striped table-bordered table-hover">
    <tbody>
      <tr>
        <td colspan="2">
          等级类型：
          <el-radio v-model="formData.levelType" label="position">岗位</el-radio>
          <el-radio v-model="formData.levelType" label="org">组织</el-radio>
        </td>
      </tr>
      <tr
        v-for="item in userTypeOptions"
        :key="item.value"
      >
        <td :colspan="item.colspan?item.colspan:2">
          <el-radio
            v-model="formData.source"
            :label="item.value"
            @change="changeSource"
          >{{ item.label | filterLabel(formData.levelType) }}
          </el-radio>
        </td>
        <td v-if="item.value === 'spec'">
          <ibps-employee-selector
            v-model="formData.levelValue"
            :disabled="formData.source!=='spec'"
            value-key="levelValue"
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
      <tr v-if="formData.levelType ==='position'">
        <td colspan="2">
          <span class="el-radio last-org">
            是否主岗位：
          </span>
          <el-switch
            v-model="formData.mainPost"
            active-text="是"
            inactive-text="否"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import pluginMixin from '../mixins/plugin'
/* 用户选择器*/
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
/** 表单变量树 */
import BpmnFormVar from '@/business/platform/bpmn/setting/bpmn-setting/components/form-var-select'
/** 相同节点 */
import BpmnSameNode from '@/business/platform/bpmn/setting/bpmn-setting/components/user-setting/components/same-node'

function filterLabel(value, levelType) {
  return value.replace('\{levelType\}', levelType === 'position' ? '岗位' : '组织')
}

export default {
  components: {
    IbpsEmployeeSelector,
    BpmnFormVar,
    BpmnSameNode
  },
  filters: {
    filterLabel(value, levelType) {
      return filterLabel(value, levelType)
    }
  },
  mixins: [pluginMixin],
  data() {
    return {
      userTypeOptions: [
        { value: 'start', label: '发起人所在{levelType}等级' },
        { value: 'prev', label: '上一步执行人所在{levelType}等级' },
        { value: 'spec', label: '指定等级', colspan: 1 },
        // { value: 'var', label: '人员变量', colspan: 1 },
        { value: 'node', label: '相同节点执行人所在{levelType}等级', colspan: 1 }],
      defaultData: {
        source: '',
        levelType: 'position',
        mainPost: 'Y',
        levelValue: '',
        levelName: '',
        executorVar: '',
        nodeId: '',
        nodeName: ''
      }
    }
  },
  methods: {
    changeSource(source) {
      if (source !== 'spec') {
        this.formData.levelValue = ''
        this.formData.levelName = ''
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
        this.formData.levelValue = ''
        this.formData.levelName = ''
      } else {
        const levelName = []
        data.forEach(el => {
          levelName.push(el.name)
        })
        this.formData.levelName = levelName.join(',')
      }
    },
    getData() {
      const source = this.formData.source
      if (this.$utils.isEmpty(source)) {
        return {
          result: false,
          message: '请选择来源！'
        }
      }

      let description = filterLabel(this.userTypeMap[source].label, this.formData.levelType)
      switch (source) {
        case 'spec':
          if (this.$utils.isEmpty(this.formData.levelValue)) {
            return {
              result: false,
              message: '请选择指定人员'
            }
          }
          description += '【' + this.formData.levelName + '】'
          break
        case 'var':
          if (this.$utils.isEmpty(this.formData.executorVar) && this.$utils.isEmpty(this.formData.executorVar.name)) {
            return {
              result: false,
              message: '请选择等级变量'
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

