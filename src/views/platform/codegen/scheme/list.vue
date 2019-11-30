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
    <!-- 编辑明细 -->
    <edit
      :id="editId"
      ref="edit"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 添加菜单 -->
    <add-Resource
      :title="title"
      :url="url"
      :visible="addResourceVisible"
      @callback="search"
      @close="visible => addResourceVisible = visible"
    />
  </ibps-layout></template>
<script>
import { queryPageList, remove, genWorkspace, gen, copy } from '@/api/platform/codegen/scheme'
import ActionUtils from '@/utils/action'
import { downloadFile } from '@/business/platform/file/utils'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import Edit from './edit/index'
import AddResource from './add-resource/index'
export default {
  components: {
    IbpsTypeTree,
    Edit,
    AddResource
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      addResourceVisible: false,
      editId: '', // 编辑dialog需要使用
      url: '',
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
            { prop: 'Q^name_^SL', label: '方案名称' },
            { prop: 'Q^table_name_^SL', label: '表名' },
            { prop: 'Q^developer_^SL', label: '代码作者' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '方案名称' },
          { prop: 'tableName', label: '表名' },
          { prop: 'packageUrl', label: '包路径' },
          { prop: 'menuUrl', label: '菜单url' },
          { prop: 'doType', label: '生成类型' },
          { prop: 'genSub', label: '是否生成子表', tags: [{ value: 'Y', label: '是' }, { value: 'N', label: '否', type: 'danger' }] },
          { prop: 'developer', label: '代码作者' },
          { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            {
              key: 'add2Resource',
              icon: 'ibps-icon-telegram',
              label: '添加菜单资源'
            },
            // {
            //   key: 'genWorkspace',
            //   icon: 'ibps-icon-free-code-camp',
            //   label: '生成到工作目录'
            // },
            {
              key: 'gen',
              icon: 'ibps-icon-download',
              label: '下载'
            },
            {
              key: 'copy',
              icon: 'ibps-icon-copy',
              label: '复制'
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
        this.$refs['edit'].doTypeListJson()
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
     * 添加菜单资源
     */
    handleAddResource(url = '') {
      this.url = url || ''
      console.log(this.url)
      this.addResourceVisible = true
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.loadData()
          break
        case 'add': // 添加
          this.handleEdit()
          this.title = '添加生成方案'
          break
        case 'edit': // 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑生成方案'
          }).catch(() => { })
          break
        case 'detail': // 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '生成方案明细'
          }).catch(() => { })
          break
        case 'remove': // 删除
          ActionUtils.removeRecord(selection).then((id) => {
            this.handleRemove(id)
          }).catch(() => { })
          break
        case 'add2Resource': // 添加菜单资源
          ActionUtils.selectedRecord(selection).then((id) => {
            this.title = '添加菜单资源'
            this.handleAddResource(data.menuUrl)
          }).catch(() => { })
          break
        case 'genWorkspace': // 生成到工作目录
          ActionUtils.selectedRecord(selection).then((id) => {
            this.$confirm('是否生成代码到工作目录?', '信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleGenWorkspace(id)
            }).catch(() => {})
          }).catch(() => { })
          break
        case 'gen': // 下载
          this.$confirm('是否生成代码并下载?', '信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleDownload(selection, data)
          }).catch(() => {
            this.handleDownload(selection, data)
          })
          break
        case 'copy': // 复制
          ActionUtils.selectedRecord(selection).then((id) => {
            this.$confirm('是否复制生成方案?', '信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleCopy(id)
            }).catch(() => {})
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
     * 生成到工作目录
     */
    handleGenWorkspace(id) {
      genWorkspace({ id: id }).then(response => {
        this.$message.closeAll()
        this.$message({
          message: '生成到工作目录成功！',
          type: 'success'
        })
        this.search()
      }).catch(() => {})
    },
    /**
     * 复制生成方案
     */
    handleCopy(id) {
      copy({ id: id }).then(response => {
        this.$message.closeAll()
        this.$message({
          message: '复制成功！',
          type: 'success'
        })
        this.search()
      }).catch(() => {})
    },
    // 下载
    handleDownload(id, data) {
      gen({
        id: id
      }).then(response => {
        if (!response) {
          return
        }
        downloadFile({
          fileName: response.data.fileName,
          id: response.data.attachmentId
        })
      }).catch(() => {})
    },
    /**
     * 处理删除
     */
    handleRemove(id) {
      remove({ ids: id }).then(response => {
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
<style>
.el-button+.el-button{
  margin-left: 5px;
}
</style>
