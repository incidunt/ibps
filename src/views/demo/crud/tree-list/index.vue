<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        :width="width"
        :height="height"
        :data="treeData"
        :options="treeOptions"
        :contextmenus="treeContextmenus"
        title="测试标题测试标题测试标题测试标题测试标题"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      >
        <el-select slot="searchForm" v-model="treeSelect" placeholder="请选择">
          <el-option
            v-for="item in treeSelectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </ibps-tree>

    </div>
    <ibps-crud
      ref="crud"
      :style="{ marginLeft: width+'px' }"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      @column-link-click="handleColumnLink"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template slot="status" slot-scope="scope">
        <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status|statusLabelFilter }}</el-tag>
      </template>
    </ibps-crud>
  </ibps-layout>
</template>
<script>
import { queryPageList, remove } from '@/api/demo/list'
import { getTreeData } from '@/api/demo/tree'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
// 状态
const statusOptions = [{
  value: 'draft',
  label: '草稿',
  type: 'gray'
}, {
  value: 'published',
  label: '发布',
  type: 'success'
}, {
  value: 'deleted',
  label: '删除',
  type: 'danger'
}]
const getStatus = (status) => {
  return statusOptions.find(x => x.value === status)
}

export default {
  filters: {
    statusTypeFilter(status) {
      const t = getStatus(status)
      return t ? t.type : status
    },
    statusLabelFilter(status) {
      const t = getStatus(status)
      return t ? t.label : status
    }
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'name', label: '名称' },
            { prop: ['start_display_time', 'end_display_time'], label: '时间', fieldType: 'daterange' },
            { prop: 'status', label: '状态',
              fieldType: 'select',
              options: statusOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'title', label: '标题', link: 'www.baidu.com' },
          { prop: 'author', label: '姓名' },
          { prop: 'status', label: '状态', tags: statusOptions },
          { prop: 'pageviews', label: '浏览量', sortable: 'custom' },
          { prop: 'display_time', label: '日期' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            { key: 'detail' },
            { key: 'edit' },
            { key: 'remove' }]
        }
      },
      pagination: {},
      sorts: {},

      statusOptions: statusOptions,

      // 树配置
      treeOptions: {},
      treeContextmenus: [
        { icon: 'add', label: '添加', value: 'add' },
        { icon: 'edit', label: '编辑', value: 'edit', rights: ['node'] }
      ],
      treeData: [],

      treeSelect: '',
      treeSelectOptions: [{
        value: '1',
        label: '分类1'
      }, {
        value: '2',
        label: '分类2'
      }, {
        value: '3',
        label: '分类3'
      }]
    }
  },
  created() {
    this.loadData()
    this.loadTreeData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      queryPageList(this.getFormatParams()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      return ActionUtils.formatParams(
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
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
    search() {
      ActionUtils.setPagination(this.pagination)
      this.loadData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 处理编辑
     */
    handleEdit(editId) {
      this.editId = editId || ''
      this.dialogFormVisible = true
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadData()
          break
        case 'add':// 添加
          this.handleEdit()
          break
        case 'edit':// 编辑
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
          }).catch(() => { })
          break
        case 'remove':// 添加
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    handleRemove(ids) {
      // 获取数据
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {

      })
    },

    /**
     * 前置事件
     *
     * @before-action-event="beforeActionEvent"
     */
    beforeActionEvent(key, position, data, callback) {
      callback(true)
    },
    /**
     * 处理点击链接
     */
    handleColumnLink(data, column) {
      this.handleEdit(data.id)
    },

    loadTreeData() {
      getTreeData().then(response => {
        const data = response.data
        data.unshift({
          id: 0,
          name: '测试分类',
          parentId: null
        })
        this.treeData = data
      })
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      } else {
        // 添加
        if (command === 'add') {
          alert('alert')
        } else if (command === 'edit') {
          alert('edit')
        }
      }
    },
    handleNodeClick() {
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 30
    }

  }
}
</script>
