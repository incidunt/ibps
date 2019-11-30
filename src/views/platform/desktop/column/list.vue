<template>
  <div class="main-container">
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
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <rights-config
      :id="editId"
      :visible="dialogRightsVisible"
      title="桌面栏目权限配置"
      rights-key="desktopColumn"
      is-save
      @close="visible => dialogRightsVisible = visible"
    />
    <preview
      :id="editId"
      :visible="dialogPreviewVisible"
      title="预览"
      @close="visible => dialogPreviewVisible = visible"
    />

  </div>
</template>

<script>
import { queryPageList, remove, initTemplate, setEnable } from '@/api/platform/desktop/column'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions, statusOptions, dataModeOptions, booleanOptions } from './constants'
import Edit from './edit'
import RightsConfig from '@/business/platform/rights/config'
import Preview from './preview'

export default {
  components: {
    Edit,
    RightsConfig,
    Preview
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      dialogRightsVisible: false, // 权限
      dialogPreviewVisible: false, // 预览
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      title: '',
      loading: true,
      height: document.clientHeight,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
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
            key: 'initTemplate',
            icon: 'ibps-icon-codepen',
            label: '初始化栏目'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: '名称' },
            { prop: 'Q^ALIAS_^SL', label: '别名' },
            {
              prop: 'Q^COL_TYPE_^SN',
              label: '类型',
              fieldType: 'select',
              options: typeOptions
            },
            {
              prop: 'Q^IS_ENABLED_^S',
              label: '状态',
              fieldType: 'select',
              options: statusOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称' },
          { prop: 'alias', label: '别名' },
          { prop: 'dataMode', label: '数据方式', tags: dataModeOptions },
          { prop: 'colType', label: '类型', tags: typeOptions },
          { prop: 'isEnabled', label: '状态', tags: statusOptions },
          { prop: 'isPublic', label: '公共栏目', tags: booleanOptions },
          { prop: 'colUrl', label: '更多路径' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'preview',
              label: '预览',
              icon: 'ibps-icon-preview'
            },
            {
              key: 'rights',
              label: '授权',
              icon: 'ibps-icon-ra',
              hidden: (row, index) => {
                return row.isPublic === true
              }
            },
            {
              key: 'edit'
            }, {
              key: 'remove'
            }, {
              key: 'detail'
            }, {
              key: 'enable',
              label: '启用',
              icon: 'ibps-icon-toggle-right',
              hidden: (row, index) => {
                return row.isEnabled === 'Y'
              }
            }, {
              key: 'disable',
              label: '禁用',
              icon: 'ibps-icon-ban',
              hidden: (row, index) => {
                return row.isEnabled === 'N'
              }
            }]
        }
      }
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
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加桌面栏目'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑桌面栏目'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '桌面栏目明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'initTemplate':// 初始化模版
          this.handleInitTemplate()
          break
        case 'disable': // 禁用
          this.handleSetEnable(selection, 'N')
          break
        case 'enable': // 启用
          this.handleSetEnable(selection, 'Y')
          break
        case 'rights': // 授权
          this.dialogRightsVisible = true
          this.editId = selection
          break
        case 'preview': // 预览
          this.dialogPreviewVisible = true
          this.editId = selection
          break
        default:
          break
      }
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '', readonly = false) {
      this.editId = id
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ desktopColumnIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    handleInitTemplate() {
      this.$confirm('是否初始化栏目').then(() => {
        initTemplate().then(response => {
          this.$message.closeAll()
          this.$message.success('初始化栏目成功！')
          this.search()
        }).catch(() => {})
      }).catch(() => {
      })
    },
    handleSetEnable(id, isEnabled) {
      setEnable({
        desktopColumnId: id,
        isEnabled: isEnabled
      }).then(response => {
        this.$message.success('操作成功！')
        this.search()
      }).catch(() => {})
    }
  }
}
</script>

