<template>
  <div :style="{height:height+'px'}" class="position-content">
    <el-row>
      <el-col :span="24">
        <div class="position-btn">
          <el-button type="primary" icon="ibps-icon-add" @click="handleAssign">指定组织</el-button>
          <el-button v-if="hasOrg" type="primary" icon="ibps-icon-trash-o" @click="handleClear">清除组织</el-button>
        </div>
      </el-col>
      <el-col v-if="hasOrg" :span="24" class="detail">
        <el-row>
          <el-col :span="3">
            <div class="grid-content">
              <label>组织名称:</label>
            </div>
          </el-col>
          <span>{{ form.orgName }}</span>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content">
              <label>等级:</label>
            </div>
          </el-col>
          <span>{{ form.level }}</span>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content">
              <label>状态:</label>
            </div>
          </el-col>
          <el-tag :type="form.status|optionsFilter(statusOption,'type')">
            {{ form.status|optionsFilter(statusOption,'label') }}
          </el-tag>
        </el-row>
      </el-col>
      <el-alert
        v-else
        :closable="false"
        title="尚未指定组织"
        type="warning"
        show-icon
        style="height:50px;"
      />
    </el-row>
    <!-- 组织选择器 -->
    <ibps-org-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      class="position-org-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import { getOrgInfo, assignOrg, removeOrg } from '@/api/platform/org/position'
import IbpsOrgSelectorDialog from '@/business/platform/org/org/dialog'
import { statusOption } from '../constants'

export default {
  components: {
    IbpsOrgSelectorDialog
  },
  props: {
    id: [String, Number],
    height: Number,
    visible: Boolean
  },
  data() {
    return {
      selectorVisible: false,
      hasOrg: false,
      statusOption: statusOption,
      form: {
        orgName: '',
        level: '',
        status: ''
      }
    }
  },
  computed: {
    tableHeight() {
      return this.height - 145
    }
  },
  watch: {
    visible: {
      handler() {
        if (this.visible && this.$utils.isNotEmpty(this.id)) {
          this.getFormData()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取数据
    getFormData() {
      getOrgInfo({ positionId: this.id }).then(response => {
        const data = response.variables
        if (this.$utils.isEmpty(data.partyOrg)) {
          this.hasOrg = false
          this.form = {}
        } else {
          this.hasOrg = true
          this.form = {
            orgName: data.partyOrg.name,
            level: data.level.name,
            status: data.partyOrg.status
          }
        }
      }).catch(() => {
      })
    },
    search() {
      this.getFormData()
    },
    // 处理 设置组织
    handleAssign() {
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      assignOrg({
        positionIds: this.id,
        orgId: data.id
      }).then(response => {
        this.selectorVisible = false
        this.$message.closeAll()
        this.$message({
          message: '设置组织成功!',
          type: 'success'
        })

        this.search()
      })
    },
    handleClear() {
      removeOrg({
        positionIds: this.id
      }).then(response => {
        this.$message({
          message: '清除成功！',
          type: 'success'
        })
        this.search()
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.position-content{
  .detail{
    padding:15px 15px;
    border: 1px solid #ddd;
    background:white;
    .grid-content{
      padding: 5px;
      margin-bottom: 10px;
      text-align:right;
      font-size: 14px;
    }
    span{
      padding-top:5px;
      display: inline-block;
      height: 36px;
    }
  }
  .position-btn{
    padding:5px;
    margin-bottom: 5px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
  }
}
</style>
<style lang="scss">
.position-org-dialog{
  .el-dialog__body{
    height:  calc(70vh - 120px) !important;
  }
}
</style>
