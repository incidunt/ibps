<template>
  <div class="panel-body">
    <el-form label-width="120px" :label-position="labelPosition" :model="callActivity">
      <el-form-item label="子流程流程定义:">
        <el-input
          v-model="callActivity.flowName"
          placeholder="无定义"
          autocomplete="off"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="是否多实例:">
        <span v-if="callActivity.supportMuliInstance">是</span>
        <span v-else>否</span>
      </el-form-item>
      <el-form-item label="子流程设置:">
        <el-button type="primary" :style="{'width':'100%'}" @click="setDefinition">外部子流程设置</el-button>
      </el-form-item>
    </el-form>
    <!-- 流程设置-->
    <ibps-bpmn-def-setting
      :visible="settingFormVisible"
      :def-id="defId"
      :def-key="defKey"
      title="设置"
      @close="visible => settingFormVisible = visible"
    />
  </div>
</template>
<script>
import { getByDefKey } from '@/api/platform/bpmn/bpmDefinition'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Object
  },
  data() {
    return {
      labelPosition: 'right',
      settingFormVisible: false,
      defKey: '',
      defId: ''
    }
  },
  computed: {
    callActivity() {
      return this.data.callActivity
    }
  },
  methods: {
    setDefinition() {
      this.defKey = this.callActivity.flowKey
      // TODO:数据问题
      getByDefKey({
        defKey: this.defKey
      }).then(response => {
        const data = response.data
        this.defId = data.defId
        this.settingFormVisible = true
      }).catch(() => {
      })
    }

  }
}
</script>
