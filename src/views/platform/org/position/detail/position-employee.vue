<template>
  <div :style="{height:height+'px'}">
    <ibps-crud
      v-if="visible"
      ref="crud"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      :is-tree-all="false"
      :type-id="id"
      :module-type="moduleType"
      title="人员选择器"
      multiple
      class="position-employee-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'

import { queryWithOrg as queryPageList, addPositionUser, removePositionUser } from '@/api/platform/org/employee'

import ActionUtils from '@/utils/action'
import { statusOption } from '../constants'

export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
  props: {
    id: [String, Number],
    moduleType: String,
    height: Number,
    visible: Boolean
  },
  data() {
    return {
      selectorVisible: false,

      pkKey: 'id',
      loading: false,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'add',
            label: '加入',
            icon: 'el-icon-plus'
          },
          {
            key: 'remove',
            label: '移除',
            icon: 'el-icon-delete'
          }
        ],
        searchForm: {
          inline: true,
          forms: [
            { prop: 'Q^NAME_^SL', label: '姓名：' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'orgName', label: '归属组织' },
          { prop: 'gender', label: '性别', options: [{
            value: 'male',
            label: '男'
          },
          {
            value: 'female',
            label: '女',
            type: 'danger'
          }] },
          { prop: 'createTime', label: '创建时间' },
          { prop: 'status', label: '状态', tags: statusOption }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove',
              label: '移除',
              icon: 'el-icon-delete'
            }
          ]
        }
      },
      statusOptions: statusOption
    }
  },
  watch: {
    visible: {
      handler() {
        if (this.visible && this.$utils.isNotEmpty(this.id)) {
          this.loadData()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^POSITIONS_^SL'] = this.id
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        // 组织负责人
        case 'search':// 查询
          this.loadData()
          break
        case 'add':// 设置
          this.handleAdd()
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    // 处理 加入人员
    handleAdd() {
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
      this.selectorVisible = false
      addPositionUser({
        positionId: this.id,
        userIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        this.$message.closeAll()
        this.$message({
          message: '加入人员成功!',
          type: 'success'
        })

        this.search()
      })
    },
    handleRemove(ids) {
      removePositionUser({
        positionId: this.id,
        userIds: ids
      }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    },
    search() {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    }
  }
}
</script>
<style lang="scss">
.position-employee-dialog{
  .el-dialog__body{
    height:  calc(70vh - 190px) !important;
  }
}
</style>
