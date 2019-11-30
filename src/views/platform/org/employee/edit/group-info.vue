<template>
  <div>
    <el-row v-if="!readonly" class="ibps-mb-5">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-button type="primary" icon="ibps-icon-add" @click="handleAddGroup">添加</el-button>
          <el-button type="primary" icon="ibps-icon-clean" @click="handleCleanGroup">清空</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 用户组添加 -->
    <ibps-group-selector-dialog
      v-if="!readonly"
      :visible="selectorVisible"
      :value="[]"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleActionEvent"
    />
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark from-name group-info">
          <el-table
            :data="userGroupItemList"
            style="width: 100%;height:400px;"
            border
          >
            <el-table-column
              type="index"
            />
            <el-table-column
              label="组名称"
            >
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column v-if="!readonly" label="管理" width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click.native.prevent="deleteRow(scope.$index,userGroupItemList)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import IbpsGroupSelectorDialog from '@/business/platform/org/group/dialog'
export default {
  components: {
    IbpsGroupSelectorDialog
  },
  props: {
    data: Array,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectorVisible: false,
      userGroupItemList: []
    }
  },
  watch: {
    data() {
      this.userGroupItemList = this.data
    },
    userGroupItemList: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.handleEmitEvent()
        }
      },
      deep: true
    }
  },
  methods: {
    handleAddGroup() {
      this.selectorVisible = true
    },
    handleCleanGroup() {
      this.userGroupItemList = []
    },
    deleteRow(index, row) {
      row.splice(index, 1)
    },
    handleEmitEvent() {
      this.$emit('input', this.userGroupItemList)
    },
    handleActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleOk(data)
          break
      }
    },
    handleOk(data) {
      if (this.$utils.isEmpty(data)) {
        this.$message({
          message: '请选择记录!',
          type: 'warning'
        })
        return
      }
      // 合并
      const list = []
      data.forEach((item) => {
        const index = this.userGroupItemList.find((d) => d.id === item.id)
        if (!index) {
          list.push(item)
        }
      })
      this.userGroupItemList = this.userGroupItemList.concat(list)
      this.selectorVisible = false
    }
  }
}
</script>
