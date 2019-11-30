<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%"
    title="人员列表"
    class="user-list-dialog"
    @open="loadData"
    @close="closeDialog"
  >
    <div
      style="height:400px;"
    >
      <ibps-crud
        ref="crud"
        v-loading="dialogLoading"
        :element-loading-text="$t('common.loading')"
        :style="{marginTop: '55px',marginBottom: '10px'}"
        :height="height"
        :data="listData"
        :toolbars="listConfig.toolbars"
        :columns="listConfig.columns"
        :row-handle="listConfig.rowHandle"
        :pagination="pagination"
        :loading="loading"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      />
    </div>
    <!-- 人员选择器 -->
    <ibps-employee-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      :is-tree-all="false"
      title="人员选择器"
      multiple
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </el-dialog>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import { queryByRoleId as queryPageList, addRoleUser, removeRoleUser } from '@/api/platform/org/employee'
import { statusOptions, genderOptions } from '../employee/constants'
import { sourceOptions } from './constants'
import ActionUtils from '@/utils/action'
export default {
  components: {
    IbpsEmployeeSelectorDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String
  },
  data() {
    return {
      selectorVisible: false,

      dialogLoading: false,
      dialogVisible: false,

      loading: false,
      height: document.clientHeight,
      pagination: {},
      sorts: {},
      listData: [],
      listConfig: {
        toolbars: [{
          key: 'add',
          label: '设置'
        }, {
          key: 'remove',
          label: '移除'
        }
        ],
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'account', label: '用户名' },
          { prop: 'orgName', label: '归属组织路径' },
          { prop: 'gender', label: '性别', tags: genderOptions },
          { prop: 'createTime', label: '创建时间' },
          { prop: 'status', label: '状态', tags: statusOptions },
          { prop: 'source', label: '用户来源', tags: sourceOptions }
        ]
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  mounted() {
    this.height = 500
    console.log(this.listData)
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      return ActionUtils.formatParams({
        roleId: this.id
      }, this.pagination, this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
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
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination)
      ActionUtils.setSorts(this.sorts)
      this.loadData()
    },
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'add':// 添加
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
      addRoleUser({
        roleId: this.id,
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
    /**
     * 处理删除
     */
    handleRemove(ids) {
      if (!this.$utils.isEmpty(ids)) {
        for (let i = 0, arr = ids.split(','); i < arr.length; i++) {
          for (let j = 0, listData = this.listData; j < listData.length; j++) {
            if (listData[j].id === arr[i] && listData[j].source !== 'role') {
              this.$message({
                message: '【' + listData[j].name + '】是非自有角色用户，不允许删除，需要移除请到对应来源移除用户',
                type: 'fail'
              })
              return
            }
          }
        }
      }
      removeRoleUser({ roleId: this.id, userIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
