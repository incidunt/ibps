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
      title="设置模板分类"
      category-key="TEMPLATE_TYPE"
      @save="saveSettingType"
      @close="visible => settingTypeFormVisible = visible"
    />
    <!-- 编辑明细 -->
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </ibps-layout></template>
<script>
import { queryPageList, remove, init, setCategory } from '@/api/platform/codegen/template'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import SettingType from '@/business/platform/cat/type/setting-type'
import Edit from './edit'

export default {
  components: {
    IbpsTypeTree,
    SettingType,
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      settingTypeFormVisible: false,
      editId: '', // 编辑dialog需要使用
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
          },
          {
            key: 'setCategory',
            label: '设置分类',
            icon: 'ibps-icon-cog'
          },
          {
            key: 'refresh',
            label: '初始化'
          }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^key_^SL', label: '模板key', link: 'dialog', labelWidth: 80, itemWidth: 200 },
            { prop: 'Q^name_^SL', label: '模板名称', labelWidth: 80, itemWidth: 200 }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'key', label: '模板key' },
          { prop: 'name', label: '模板名称' },
          { prop: 'filename', label: '文件名' },
          { prop: 'dir', label: '代码目录' },
          { prop: 'path', label: '模板路径' },
          { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            {
              key: 'edit'
            },
            {
              key: 'remove',
              hidden: function(row, index) {
                return row.isDef === 'Y'
              }
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
        templateIds: this.editId,
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
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadData()
          break
        case 'refresh': // 初始化
          this.init()
          break
        case 'add': // 添加
          this.handleEdit()
          this.title = '添加模板'
          break
        case 'edit': // 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑模板'
          }).catch(() => { })
          break
        case 'detail': // 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '模板明细'
          }).catch(() => { })
          break
        case 'remove': // 删除
          ActionUtils.removeRecord(selection).then((id) => {
            this.handleRemove(id)
          }).catch(() => { })
          break
        case 'setCategory': // 设置分类
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleSetCategory(id)
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
     * 初始化
     */
    init() {
      init().then(response => {
        this.$confirm('是否初始化模板?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.closeAll()
          this.$message({
            type: 'success',
            message: '初始化模板成功!'
          })
          this.search()
        }).catch(() => {})
      }).catch(() => {})
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
    }
  }
}
</script>
