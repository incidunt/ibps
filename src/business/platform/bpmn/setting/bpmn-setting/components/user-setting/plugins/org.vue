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
          <ibps-org-selector
            v-model="formData.orgKey"
            :disabled="formData.source!=='spec'"
            value-key="alias"
            placeholder="请选择指定组织"
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
      <tr>
        <td colspan="2">
          <span class="el-radio last-org" :style="{'textAlign':'center'}">
            是否包含其子组织：
            <el-tooltip effect="light" placement="bottom">
              <div slot="content">
                如果选中了，则会根据选中组织， 包含其组下面所有子组织
              </div>
              <i class="header-icon el-icon-info" />
            </el-tooltip>
          </span>
          <el-switch
            v-model="formData.containsSub"
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
/* 组织选择器*/
import IbpsOrgSelector from '@/business/platform/org/org/selector'
/** 表单变量树 */
import BpmnFormVar from '@/business/platform/bpmn/setting/bpmn-setting/components/form-var-select'
/** 相同节点 */
import BpmnSameNode from '@/business/platform/bpmn/setting/bpmn-setting/components/user-setting/components/same-node'

export default {
  components: {
    IbpsOrgSelector,
    BpmnFormVar,
    BpmnSameNode
  },
  mixins: [pluginMixin],
  data() {
    return {
      userTypeOptions: [
        { value: 'start', label: '发起人所在组织' },
        { value: 'prev', label: '上一步执行人所在组织' },
        { value: 'spec', label: '指定组织', colspan: 1 },
        { value: 'var', label: '组织变量', colspan: 1 },
        { value: 'node', label: '相同节点执行人所在组织', colspan: 1 }],
      defaultData: {
        source: '',
        orgKey: '',
        orgName: '',
        executorVar: '',
        nodeId: '',
        nodeName: '',
        containsSub: true
      }
    }
  },
  methods: {
    changeSource(source) {
      if (source !== 'spec') {
        this.formData.orgKey = ''
        this.formData.orgName = ''
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
        this.formData.orgKey = ''
        this.formData.orgName = ''
      } else {
        const orgName = []
        data.forEach(el => {
          orgName.push(el.name)
        })
        this.formData.orgName = orgName.join(',')
      }
    },
    // 表单变量
    handleVar(data) {
      const executorVar = {
        source: data.source,
        name: data.name,
        executorType: 'org',
        valType: 'orgId'
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
          if (this.$utils.isEmpty(this.formData.orgKey)) {
            return {
              result: false,
              message: '请选择指定组织'
            }
          }
          description += '【' + this.formData.orgName + '】'
          break
        case 'var':
          if (this.$utils.isEmpty(this.formData.executorVar) && this.$utils.isEmpty(this.formData.executorVar.name)) {
            return {
              result: false,
              message: '请选择组织变量'
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

