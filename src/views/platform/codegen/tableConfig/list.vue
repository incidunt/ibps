<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        title="模板分类"
        category-key="TEMPLATE_TYPE"
        :has-contextmenu="true"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
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
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <!-- 设置分类 -->
    <setting-type
      :visible="settingTypeFormVisible"
      title="设置分类"
      category-key="FLOW_TYPE"
      @save="saveSettingType"
      @close="visible => settingTypeFormVisible = visible"
    />

    <!-- 编辑明细 -->
    <edit
      :id="editId"
      :datas="listData"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 表单设置 -->
    <form-builder
      :visible="formbuilderDialogVisible"
      :data="formDefData"
      @callback="search"
      @close="visible => formbuilderDialogVisible = visible"
    />
  </ibps-layout>
</template>
<script>
import { queryPageList, remove, setCategory } from '@/api/platform/codegen/tableConfig'
import SettingType from '@/business/platform/cat/type/setting-type'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import Edit from './edit/index'
import FormBuilder from '@/business/platform/form/formbuilder/dialog'

export default {
  components: {
    IbpsTypeTree,
    SettingType,
    Edit,
    FormBuilder
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      settingTypeFormVisible: false,
      editId: '', // 编辑dialog需要使用
      formbuilderDialogVisible: false,
      formDefData: {},
      readonly: false,
      title: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeId: '',
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          {
            key: 'add'
          },
          {
            key: 'edit'
          },
          {
            key: 'remove'
          }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^table_name_^SL', label: '表名：', labelWidth: 80, itemWidth: 200 },
            { prop: 'Q^table_comment_^SL', label: '表注释', labelWidth: 80, itemWidth: 200 },
            { prop: 'Q^class_name_^SL', label: '类名', labelWidth: 80, itemWidth: 200 },
            { prop: 'Q^parent_table_name_^SL', label: '主表表名', labelWidth: 80, itemWidth: 200 }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'tableName', label: '表名' },
          { prop: 'tableComment', label: '表注释' },
          { prop: 'className', label: '类名' },
          { prop: 'parentTableName', label: '主表表名' },
          { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            {
              key: 'design',
              label: '布局',
              icon: 'ibps-icon-edit'
            },
            {
              key: 'edit'
            },
            {
              key: 'remove'
            },
            {
              key: 'detail'
            }
          ]
        }
      },
      pagination: {},
      sorts: {}

    }
  },
  created() {
    this.loadData()
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^TYPE_ID_^S'] = this.typeId
      }
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
    handleEdit(editId = '', readonly = false) {
      this.editId = editId || ''
      this.readonly = readonly
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
        case 'design': // 布局
          this.handleDesign(data)
          break
        case 'add': // 添加
          this.handleEdit()
          this.title = '添加表配置'
          break
        case 'edit': // 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑表配置'
          }).catch(() => { })
          break
        case 'detail': // 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '表配置明细'
          }).catch(() => { })
          break
        case 'remove': // 删除
          ActionUtils.removeRecord(selection).then((id) => {
            this.handleRemove(id)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    /**
     * 设置分类
     */
    handleSetCategory(editId) {
      this.editId = editId || ''
      this.settingTypeFormVisible = true
    },
    /**
     * 保存分类
     */
    saveSettingType(typeId) {
      setCategory({
        defIds: this.editId,
        typeId: typeId
      }).then(response => {
        ActionUtils.successMessage('保存成功')
        this.settingTypeFormVisible = false
        this.search()
      }).catch((err) => {
        console.info(err)
      })
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
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    /**
     * 布局设计
     */
    handleDesign({ tableName }) {
      this.formDefData = {
        code: tableName,
        mode: 'codeGen'
      }
      this.formbuilderDialogVisible = true
    }
  }
}
</script>
