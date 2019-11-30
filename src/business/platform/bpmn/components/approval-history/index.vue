<template>
  <div
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
  >
    <el-timeline v-if="opinions && opinions.length >0">
      <template v-if="hasApproval">
        <el-timeline-item
          v-for="(item, index) in opinions"
          :key="index"
          :type="item.status==='pending'?'success':'danger'"
          :hide-timestamp="true"
          placement="top"
          size="large"
          class="approval-history-timeline-item"
        >
          <div slot="dot" style="left:-15px;">
            <el-avatar v-if="$utils.isNotEmpty(item.userImg)&&getQualfieds(item.qualfieds).length===1" class="approval-history-photo">
              <img :src="getImage(item.userImg)">
            </el-avatar>
            <el-avatar v-else-if="getQualfieds(item.qualfieds).length>1" class="ibps-icon-users" />
            <el-avatar v-else icon="el-icon-user-solid" class="approval-history-disPhoto" />
          </div>
          <p class="el-timeline-item__timestamp is-top">
            {{ item.createTime|formatTime }}&nbsp;&nbsp;({{ item.createTime|dateFormat }})
          </p>
          <el-card>
            <div slot="header" class="ibps-clearfix">
              <span style="font-weight: bold;">{{ item.taskName }}</span>
              <div class="ibps-fr">审批状态:<el-tag style="border: 0;" :style="{'color':item.nodeColor}"> {{ item.statusName }}</el-tag></div>
            </div>
            <p />
            <div v-if="item.status !== 'pending'" class="ibps-clearfix">
              审批意见: {{ item.opinion||'无' }}
              <el-link v-if="item.batch" class="ibps-fr" type="primary" @click="handleMore(item.batch,item.taskName)">更多</el-link>
            </div>
            <el-link v-if="item.status === 'pending'&& item.batch" class="ibps-fr" type="primary" @click="handleMore(item.batch,item.taskName)">更多</el-link>
            <p />
            <div class="footer ibps-clearfix">
              <span v-if="item.batch">
                <span v-if="item.qualifiedExecutor&&item.status == 'pending'">
                  执行人: {{ getName(item.qualifiedExecutor) }}
                </span>
                <span v-else-if="item.qualifiedExecutor&&item.status != 'pending'">
                  执行人: {{ getName(item.qualifiedExecutor) }}
                </span>
                <span v-else>
                  未设置执行人
                </span>
              </span>
              <span v-else>
                <span v-if="item.auditor">
                  执行人:{{ item.auditorName }}<template v-if="item.interpose === 1"><span class="red">(干预审批)</span></template>
                </span>
                <span v-else-if="item.qualifiedExecutor">
                  待执行人: {{ getName(item.qualifiedExecutor) }}
                </span>
                <span v-else>
                  未设置执行人
                </span>
              </span>
              <div v-if="$utils.isNotEmpty(item.completeTime)" class="ibps-fr">
                审批时间:<el-tag type="warning"> {{ item.completeTime|dateFormat }}</el-tag>
              </div>
            </div>
          </el-card> </el-timeline-item>
      </template>
      <!--未有审批意见--->
      <template v-else>
        <el-timeline-item
          v-for="(item, index) in opinions"
          :key="index"
          :type="item.status==='pending'?'success':'danger'"
          :hide-timestamp="true"
          placement="top"
          size="large"
        >
          <el-card>
            <div class="footer ibps-clearfix">
              <p />
              <div>
                <span v-if="item.name">
                  <el-tooltip
                    content="暂定的有审批资格的用户及用户组，实际候选人要在产生任务以后才能确定"
                    placement="bottom"
                  >
                    <abbr> 暂定候选人</abbr>
                  </el-tooltip>:<el-tag :type="item.type| filterUserType">{{ item.name }}</el-tag>
                </span>
                <span v-else>
                  未设置候选人
                </span>
              </div>
              <p />
              <div>审批状态:<el-tag style="border: 0;" type="info">未执行任务</el-tag></div>

            </div>
          </el-card>
        </el-timeline-item>
      </template>
    </el-timeline>
    <el-alert
      v-else
      :closable="false"
      title="暂无审批历史"
      type="warning"
      show-icon
      style="height:50px;"
    />
    <!--流程历史-->
    <approval-history-sign
      :visible="approvalHistorySignVisible"
      :title="signTitle"
      :batch="signBatch"
      @close="visible => approvalHistorySignVisible= visible"
    />
    <!--流程历史-->
    <approval-history-call-sub
      :visible="approvalHistoryCallSubVisible"
      :title="callSubTitle"
      :node-id="callSubNodeId"
      @close="visible => approvalHistoryCallSubVisible= visible"
    />
  </div>
</template>
<script>
import { flowHistory, flowHistorySign, flowHistoryCallSub } from '@/api/platform/bpmn/bpmInst'
import { getFile } from '@/utils/avatar'
import util from '@/utils/util'
import { getNodeApproval } from '@/api/platform/bpmn/bpmTask'
import ApprovalHistorySign from './sign'
import ApprovalHistoryCallSub from './call-sub'
export default {
  components: {
    ApprovalHistorySign,
    ApprovalHistoryCallSub
  },
  filters: {
    filterUserType(value) {
      const statusMap = {
        user: '',
        org: 'success',
        position: 'warning',
        role: 'info'
      }
      return statusMap[value]
    }
  },
  props: {
    taskId: String,
    instId: String,
    nodeId: String,
    batch: String
  },
  data() {
    return {
      loading: false,
      active: -1,
      opinions: [],
      hasApproval: true,
      approvalHistorySignVisible: false,
      signBatch: '',
      signTitle: '',
      approvalHistoryCallSubVisible: false,
      callSubNodeId: '',
      callSubTitle: ''
    }
  },
  methods: {
    getImage(photo) {
      return getFile(photo)
    },
    getQualfieds(str) {
      return util.parseData(str)
    },
    getFormData() {
      this.loading = true
      flowHistory({
        taskId: this.taskId,
        instId: this.instId
      }).then(response => {
        this.loading = false
        this.hasApproval = true
        this.opinions = response.data
        this.setActive()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 会签审批历史
     */
    getSignFormData() {
      this.loading = true
      flowHistorySign({
        batch: this.batch
      }).then(response => {
        this.loading = false
        this.hasApproval = true
        this.opinions = response.data
        this.setActive()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 子流程审批历史
     */
    getCallSubFormData() {
      this.loading = true
      flowHistoryCallSub({
        instId: this.instId,
        nodeId: this.nodeId
      }).then(response => {
        this.loading = false
        this.hasApproval = true
        this.opinions = response.data
        this.setActive()
      }).catch(() => {
        this.loading = false
      })
    },
    getNodeFormData() {
      this.loading = true
      getNodeApproval({
        taskId: this.taskId,
        instId: this.instId,
        nodeId: this.nodeId
      }).then(response => {
        this.loading = false
        const data = response.data
        console.info(data)
        if (!data.data) {
          return
        }
        this.hasApproval = data.hasApproval
        this.opinions = data.data || []
        this.setActive()
      }).catch(() => {
        this.loading = false
      })
    },
    getName(obj) {
      if (!obj) return ''
      let name = ''
      for (var i = 0; i < obj.length; i++) {
        name += obj[i].executor + ' '
      }
      return name
    },
    getStatusType({ status }, index) {
      return 'status-' + status
    },
    setActive() {
      if (this.$utils.isEmpty(this.opinions)) {
        return
      }
      this.opinions.forEach((o, i) => {
        if (o.status === 'pending') {
          if (this.active < 0) { this.active = i }
        }
      })
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleMore(batch, taskName) {
      this.signBatch = batch
      this.signTitle = taskName
      this.approvalHistorySignVisible = true
    }

  }
}
</script>
<style lang="scss">
  .approval-history{
    .el-card__body{
      padding-top:5px;
    }
  }
  .approval-history-timeline-item{
    .el-timeline-item__dot{
      left:-15px;
      top:-10px;
    }
  }
</style>

