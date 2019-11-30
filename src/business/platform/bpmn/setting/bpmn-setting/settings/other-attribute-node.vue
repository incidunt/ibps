<template>
  <div class="panel-body">
    <el-form label-width="120px" label-position="left" :model="attribute">
      <el-form-item label="跳转类型:">
        <ibps-checkbox
          v-model="attribute.jumpType"
          :options="jumpTypes"
          value-key="type"
          label-key="title"
        />
      </el-form-item>
      <!-- <el-form-item label="隐藏意见:">
        <el-radio-group v-model="attribute.hideOpinion">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="隐藏路径:">
        <el-radio-group v-model="attribute.hidePath" :disabled="pathDisabled">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="允许执行人为空:">
        <el-radio-group v-model="attribute.allowExecutorEmpty">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="执行人为空时跳过任务:">
        <el-radio-group v-model="attribute.skipExecutorEmpty">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="驳回类型:">
        <el-radio-group v-model="attribute.rejectType">
          <el-radio label="forbidden">禁止</el-radio>
          <el-radio label="all">任意节点</el-radio>
          <el-radio label="section">指定范围</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="attribute.rejectType==='section'" label="驳回范围:">
        <el-button type="primary" size="mini" @click="dialogFormVisible = true">指定</el-button>
        <el-tooltip v-if="$utils.isNotEmpty(attribute.rejectSection)" class="item" effect="light" content="已设置范围" placement="bottom">
          <span :style="{'textAlign':'center'}">
            <i class="el-icon-info" style="color:#dd5a43" /></span>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="通知类型:">
        <ibps-checkbox
          v-model="attribute.notifyType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />
      </el-form-item>
    </el-form>
    <!-- 驳回指定范围弹窗 -->
    <reject-section
      :visible="dialogFormVisible"
      :node-name="curNode.node_name"
      :data="attribute.rejectSection"
      @callback="handleRejectSection"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RejectSection from './../components/reject-section'
export default {
  components: {
    RejectSection
  },
  props: {
    data: Object, // 数据
    curNode: Object // 当前节点
  },
  data() {
    return {
      jumpTypes: [{
        title: '正常跳转',
        type: 'common'
      }, {
        title: '选择路径跳转',
        type: 'select'
      }, {
        title: '自由跳转',
        type: 'free'
      }],
      dialogFormVisible: false,
      jumpDisabled: false,
      pathDisabled: false
    }
  },
  computed: {
    ...mapState({
      messageTypes: state => state.ibps.bpmn.messageTypes
    }),
    attribute() {
      return this.data || {}
    }
  },
  watch: {
    'attribute.jumpType': {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(val)) {
          return
        }
        const jumpType = val.split(',')
        if (jumpType.some(res => res === 'select' || res === 'free')) {
          this.data.hidePath = false
          this.pathDisabled = true
        } else {
          this.pathDisabled = false
        }
      },
      immediate: true,
      deep: true
    }

  },
  methods: {
    /**
     * 处理驳回范围
     */
    handleRejectSection(value) {
      this.attribute.rejectSection = value
    }
  }

}
</script>

