<template>
  <div>
    <ibps-card-list
      ref="crud"
      :title="title"
      :height="height"
      :data="listData"
      :pagination="pagination"
      :pk-key="pkKey"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :loading="loading"
      :create-text="createText"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template slot="east">
        <ibps-type-tree
          :width="width"
          :height="treeHeight"
          title="表单分类"
          position="east"
          category-key="FORM_TYPE"
          :has-contextmenu="true"
          @node-click="handleNodeClick"
          @expand-collapse="handleExpandCollapse"
        />
      </template>
      <template slot="item-symbol" slot-scope="scope">
        <i
          :key="scope.id"
          :class="'ibps-icon-table'"
          class="symbol-icon"
        />
      </template>
    </ibps-card-list>

    <create
      :title="createText"
      :type-id="typeId"
      :visible="dialogFormVisible"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 复制表单定义 -->
    <copy
      :id="editId"
      :visible="copyDialogFormVisible"
      @close="visible => copyDialogFormVisible = visible"
    />
    <form-builder
      :id="editId"
      :visible="formbuilderDialogVisible"
      @close="visible => formbuilderDialogVisible = visible"
    />
  </div>
</template>
<script>
import { queryPageList, remove } from '@/api/platform/form/formTemplate'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsCardList from '@/components/ibps-card-list'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import FormBuilder from '@/business/platform/form/formbuilder/dialog'
import Create from './create'
import Copy from './copy'

export default {
  components: {
    IbpsTypeTree,
    IbpsCardList,
    Create,
    Copy,
    FormBuilder
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: 500,
      title: '表单模版管理',
      createText: '创建表单模版',
      query: '',
      typeId: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      dialogFormVisible: false,
      formbuilderDialogVisible: false,
      copyDialogFormVisible: false,
      editId: '',
      listData: [],
      listConfig: {
        // 查询条件
        searchForm: { prop: 'Q^name_^SL', label: '表单名称' },
        // 工具栏
        toolbars: [
          { key: 'import' },
          { key: 'export' }
        ],

        // 表格字段配置
        columns: [
          { prop: 'name', label: '表单名称' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            { key: 'preview', label: '预览', icon: 'el-icon-view' },
            { key: 'edit', label: '编辑', icon: 'ibps-icon-edit' },
            { key: 'remove', label: '删除', icon: 'ibps-icon-remove' },
            { key: 'copy', label: '复制', icon: 'ibps-icon-copy' }
          ]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  computed: {
    treeHeight() {
      return this.height - 75
    }
  },
  created() {
    this.loadData()
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^TYPE_ID_^S'] = this.typeId
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
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.search()
          break
        case 'add':// 添加
          this.dialogFormVisible = true
          break
        case 'edit':// 编辑
          this.handleEdit(selection)
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'import':// 导入
          // this.handleImport()
          break
        case 'export':// 导出
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            // this.handleExport(ids)
          }).catch(() => { })
          break
        case 'preview':// 预览
          this.handlePreview()
          break
        case 'copy':// 复制
          this.handleCopy()
          break
      }
    },
    handleEdit(id) {
      this.formbuilderDialogVisible = true
      this.editId = id
    },
    handleCopy(id) {
      this.copyDialogFormVisible = true
      this.editId = id
    },

    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 30
    },
    handlePreview(id) {

    }
  }
}
</script>
