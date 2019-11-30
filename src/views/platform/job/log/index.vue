<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    class="log-dialog"
    @open="loadData"
    @close="closeDialog"
  >
    <div style="height:400px;">
      <ibps-crud
        ref="crud"
        :height="height"
        :data="listData"
        :toolbars="listConfig.toolbars"
        :search-form="listConfig.searchForm"
        :pk-key="pkKey"
        :columns="listConfig.columns"
        :row-handle="listConfig.rowHandle"
        :pagination="pagination"
        :loading="loading"
        style="margin-top:54px;"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      />
      <detail
        :id="editId"
        :visible="dialogFormVisible"
        @close="visible => dialogFormVisible = visible"
      />
    </div>
  </el-dialog>
</template>

<script>
import { queryPageList, remove } from '@/api/platform/job/jobLog'
import ActionUtils from '@/utils/action'
import { logStateOptions } from '../constants'
import Detail from './detail'

export default {
  components: {
    Detail
  },
  props: {
    id: [String, Number],
    height: Number,
    visible: {
      type: Boolean,
      default: false
    },
    jobName: {
      type: String
    },
    group: {
      type: String
    },
    trigName: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      title: '日志列表',
      loading: false,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }, {
            key: 'remove'
          },
          {
            key: 'close',
            label: '关闭',
            icon: 'ibps-icon-close'
          }
        ],
        searchForm: {
          forms: [
            {
              prop: ['Q^START_TIME_^DL', 'Q^START_TIME_^DG'],
              label: '开始时间',
              fieldType: 'daterange'
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'jobName', label: '任务名' },
          { prop: 'trigName', label: '触发器名称' },
          { prop: 'group', label: '任务分组' },
          { prop: 'endTime', label: '开始时间', dateFormat: 'yyyy-MM-dd' },
          { prop: 'state', label: '状态', tags: logStateOptions },
          { prop: 'runTime', label: '运行时长' }
        ],
        rowHandle: {
          actions: [{
            key: 'detail',
            icon: 'ibps-icon-detail'
          }, {
            key: 'remove',
            icon: 'ibps-icon-remove'
          }]
        }
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
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^JOB_NAME_^S'] = this.jobName
      params['Q^GROUP_^S'] = this.jobGroup
      params['Q^TRIG_NAME_^S'] = this.trigName || ''

      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
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
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadData()
          break
        case 'close':// 关闭
          this.closeDialog()
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
          }).catch(() => { })
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
    /**
     * 处理编辑
     */
    handleEdit(id = '') {
      this.editId = id
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.log-dialog{
  .el-dialog__body{
    height:  calc(67vh - 120px) !important;
  }
}
</style>

