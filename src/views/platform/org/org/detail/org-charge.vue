<template>
  <div :style="{height:height+'px'}">
    <ibps-crud
      v-if="visible"
      ref="crud"
      :data="listData"
      :height="tableHeight"
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
    >
      <template slot="status" slot-scope="scope">
        <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status|statusLabelFilter }}</el-tag>
      </template>
    </ibps-crud>
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      class="auth-charger-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>

</template>
<script>
import { queryOrgManager, addOrgManager, removeOrgManager } from '@/api/platform/org/employee' // 组织负责人
import ActionUtils from '@/utils/action'
import { employeeStatusOption } from '../constants'
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'

export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
  props: {
    id: [String, Number],
    height: Number,
    rightsArr: {
      type: Array,
      default: () => []
    },
    visible: Boolean
  },
  data() {
    return {
      pkKey: 'id',
      loading: true,

      selectorVisible: false,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'setting',
            label: '设置',
            icon: 'el-icon-circle-plus-outline',
            hidden: () => {
              if (this.rightsArr.includes('join')) return false
              if (this.rightsArr.includes('add')) return false
              return true
            }
          },
          {
            key: 'remove',
            label: '撤销',
            icon: 'el-icon-circle-close',
            hidden: () => {
              if (this.rightsArr.includes('delete')) return false
              if (this.rightsArr.includes('remove')) return false
              return true
            }
          }
        ],
        searchForm: {
          inline: true,
          forms: [
            { prop: 'Q^name_^SL', label: '姓名：' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名', width: '250px' },
          { prop: 'status', label: '状态', tags: employeeStatusOption },
          { prop: 'gender', label: '性别', tags: [{
            value: 'male',
            label: '男'
          },
          {
            value: 'female',
            label: '女',
            type: 'danger'
          }] },
          { prop: 'createTime', label: '创建时间' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove',
              label: '撤销',
              icon: 'el-icon-circle-close',
              hidden: () => {
                if (this.rightsArr.includes('delete')) return false
                if (this.rightsArr.includes('remove')) return false
                return true
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    tableHeight() {
      return this.height - 145
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loadData()
      }
    }
  },
  methods: {
    // 初始化数据
    loadData() {
      this.loading = true
      queryOrgManager(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^MANAGER_ORG_ID_^S'] = this.id
      // 和分页数据合并
      return ActionUtils.formatParams(params, this.pagination, this.sorts)
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
    search() {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    },
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        case 'search':// 查询
          this.loadData()
          break
        case 'setting':// 设置
          this.handleSetting()
          break
        case 'remove':// 撤销
          ActionUtils.removeRecord(selection, '确认撤销选择的组织负责人？').then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    // 处理负责人设置
    handleSetting() {
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
      addOrgManager({
        orgId: this.id,
        userIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        this.$message.closeAll()
        this.$message({
          message: '设置组织负责人成功!',
          type: 'success'
        })

        this.search()
      })
    },
    // 删除
    handleRemove(ids) {
      removeOrgManager({
        orgId: this.id,
        userIds: ids
      }).then(response => {
        ActionUtils.removeSuccessMessage('撤销成功')
        this.search()
      })
    }
  }
}
</script>
<style lang="scss">
// .auth-charger-dialog{
//   .el-dialog__body{
//     height:  calc(70vh - 120px) !important;
//   }
// }
</style>
