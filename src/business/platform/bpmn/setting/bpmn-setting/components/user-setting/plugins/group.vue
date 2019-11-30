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
          <ibps-group-selector
            v-model="formData.groupKey"
            :disabled="formData.source!=='spec'"
            value-key="groupAlias"
            placeholder="请选择指定组"
            multiple
            @callback="handleSpec"
          />
        </td>

        <td v-if="item.value === 'node'">
          <bpmn-same-node v-model="formData" :disabled="formData.source!=='node'" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import pluginMixin from '../mixins/plugin'
import IbpsGroupSelector from '@/business/platform/org/group/selector'
/** 相同节点 */
import BpmnSameNode from '@/business/platform/bpmn/setting/bpmn-setting/components/user-setting/components/same-node'

export default {
  components: {
    IbpsGroupSelector,
    BpmnSameNode
  },
  mixins: [pluginMixin],
  data() {
    return {
      userTypeOptions: [
        { value: 'start', label: '发起人所在组' },
        { value: 'prev', label: '上一步执行人所在组' },
        { value: 'spec', label: '指定组', colspan: 1 },
        // { value: 'var', label: '人员变量', colspan: 1 },
        { value: 'node', label: '相同节点执行人所在组', colspan: 1 }],
      defaultData: {
        source: '',
        groupKey: '',
        groupName: '',
        nodeId: '',
        nodeName: ''
      }
    }
  },
  methods: {
    changeSource(source) {
      if (source !== 'spec') {
        this.formData.groupKey = ''
        this.formData.groupName = ''
      }
      if (source !== 'node') {
        this.formData.nodeId = ''
        this.formData.nodeName = ''
      }
    },
    handleSpec(data) {
      if (this.$utils.isEmpty(data)) {
        this.formData.groupKey = ''
        this.formData.groupName = ''
      } else {
        const groupName = []
        data.forEach(el => {
          groupName.push(el.name)
        })
        this.formData.groupName = groupName.join(',')
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

      let description = this.userTypeMap[source].label
      switch (source) {
        case 'spec':
          if (this.$utils.isEmpty(this.formData.groupKey)) {
            return {
              result: false,
              message: '请选择指定组'
            }
          }
          description += '【' + this.formData.groupName + '】'
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

