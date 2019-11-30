<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    class="trigger-dialog"
    @open="loadData"
    @close="closeDialog"
  >
    <div style="height:400px;">
      <ibps-crud
        ref="crud"
        v-loading="dialogLoading"
        :element-loading-text="$t('common.loading')"
        :data="listData"
        :height="height"
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
    </div>

  </el-dialog>
</template>
<script>
import ActionUtils from '@/utils/action'
import { queryPageList, remove, start, stop } from '@/api/platform/job/trigger'
import { triggerStateOptions } from './../constants'
export default {
  props: {
    id: [String, Number],
    height: Number,
    visible: {
      type: Boolean,
      default: false
    },
    searchData: Boolean,
    jobName: {
      type: String
    },
    group: {
      type: String
    }
  },
  data() {
    return {
      title: '计划列表',
      dialogLoading: false,
      dialogVisible: this.visible,
      pkKey: 'trigName',
      loading: false,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'add'
          }, {
            key: 'remove'
          },
          {
            key: 'close',
            label: '关闭',
            icon: 'ibps-icon-close'
          }
        ],
        searchForm: {},
        // 表格字段配置
        columns: [
          { prop: 'group', label: '分组' },
          { prop: 'jobName', label: '任务名称' },
          { prop: 'trigName', label: '计划名称' },
          { prop: 'description', label: '计划描述' },
          { prop: 'state', label: '状态', tags: triggerStateOptions }
        ],
        rowHandle: {
          actions: [
            {
              key: 'paused',
              label: '禁用',
              icon: 'ibps-icon-ban',
              hidden: function(row, index) {
                return row.state !== 'NORMAL'
              }
            }, {
              key: 'enabled',
              label: '启用',
              icon: 'ibps-icon-circle',
              hidden: function(row, index) {
                return row.state !== 'PAUSED'
              }
            }, {
              key: 'log',
              label: '日志',
              icon: 'ibps-icon-calendar'
            }, {
              key: 'remove',
              label: '移除'
            }
          ]
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
    },
    searchData() {
      this.search()
    }
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    // 初始化数据
    loadData() {
      this.loading = true
      const page = {
        requestPage: {
          limit: this.pagination.limit || 20,
          pageNo: this.pagination.pageNo || 1
        }
      }
      queryPageList({
        jobName: this.jobName,
        group: this.group
      }, page).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
        case 'add':// 添加
          this.$emit('add', {
            jobName: this.jobName,
            group: this.group })
          break
        case 'close':// 关闭
          this.closeDialog()
          break
        case 'paused':// 暂停
          this.handleState(selection, false)
          break
        case 'enabled':// 启用
          this.handleState(selection, true)
          break
        case 'log':// 日志
          this.$emit('log', data)
          break
        case 'remove':// 删除
          // ActionUtils.removeRecord(selection).then((ids) => {
          // this.handleRemove(ids)
          //   this.rowRemove(position, selection, ids)
          //   console.log(ids)
          // }).catch(() => { })
          this.rowRemove(position, selection)
          break
        default:
          break
      }
    },
    rowRemove(position, selection, data) {
      console.log(this.listData)
      console.log(position, selection)
      const listData = this.listData
      if (position === 'manage') {
        this.handleRemove(selection)
      } else if (position === 'toolbar') {
        if (!selection) {
          this.$message({
            message: '请选择记录!',
            type: 'warning'
          })
        } else {
          let triggerNames = []
          let groups = []
          selection.forEach(i => {
            listData.forEach(l => {
              if (i === l.trigName) {
                triggerNames.push(l.trigName)
                groups.push(l.group)
              }
            })
          })
          triggerNames = triggerNames.join(',')
          groups = groups.join(',')
          this.handleRemove(triggerNames, groups)
        }
      }
    },
    handleRemove(triggerNames, group = this.group) {
      remove({ triggerNames: triggerNames, groups: group }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    },
    handleState(triggerName, enabled) {
      if (enabled) {
        start({ triggerName: triggerName, group: this.group }).then(response => {
          this.$message.closeAll()
          this.$message.success('启动成功!')
          this.search()
        })
      } else {
        stop({ triggerName: triggerName, group: this.group }).then(response => {
          this.$message.closeAll()
          this.$message.success('停止成功')
          this.search()
        })
      }
    },
    search() {
      this.loadData()
    }
  }
}
</script>
<style lang="scss">
.trigger-dialog{
  .el-dialog__body{
    height:  calc(57vh - 120px) !important;
  }
}
</style>
