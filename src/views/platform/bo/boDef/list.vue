<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        :has-contextmenu="true"
        category-key="BO_TYPE"
        title="业务对象分类"
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
      :index-row="false"
      @row-click="handleRowClick"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
    >
      <div slot="versionCount" slot-scope="scope">
        默认：
        <el-link type="primary" @click="handleVersion(scope.row.id)">版本({{ scope.row.version }})</el-link>
        <el-link class="ibps-ml-5" type="primary" @click="handleVersionCount(scope.row.code)">更多版本({{ scope.row.versionCount }})</el-link>
      </div>
    </ibps-crud>
    <!-- 添加编辑明细 -->
    <edit
      :id="editId"
      :code="code"
      :type-id="typeId"
      :visible="dialogFormVisible"
      :readonly="readonly"
      title="业务对象添加"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 设置分类 -->
    <setting-type
      :visible="settingTypeFormVisible"
      title="设置流程分类"
      category-key="BO_TYPE"
      @save="saveSettingType"
      @close="visible => settingTypeFormVisible = visible"
    />
    <!-- 导入 -->
    <import-bo
      :id="editId"
      :visible="importFormVisible"
      @callback="search"
      @close="visible => importFormVisible = visible"
    />
    <!-- 导出 -->
    <export-bo
      :id="editId"
      title="导出业务对象数据配置"
      :visible="exportVisible"
      @callback="search"
      @close="visible => exportVisible = visible"
    />
    <!-- 更多版本 -->
    <more-versions
      :code="code"
      :visible="versionsFormVisible"
      @callback="search"
      @close="visible => versionsFormVisible = visible"
    />
    <!-- 复制 -->
    <copy
      :id="editId"
      :copy-data="copyData"
      :visible="copyFormVisible"
      @callback="search"
      @close="visible => copyFormVisible = visible"
    />
  </ibps-layout>
</template>
<script>
import { queryPageList, remove, synBoTable, genBoTable, setCategory, exportFile } from '@/api/platform/bo/boDef'
import { boTypeOptions, createTabelOptions, statusOptions } from './constants'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'

import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import SettingType from '@/business/platform/cat/type/setting-type'
import Edit from './edit'
import Copy from './copy'
import importBo from './import'
import exportBo from './export'
import MoreVersions from './more-versions'

export default {
  components: {
    IbpsTypeTree,
    SettingType,
    MoreVersions,
    Edit,
    exportBo,
    importBo,
    Copy
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      settingTypeFormVisible: false, // 弹窗
      dialogFormVisible: false,
      versionsFormVisible: false,
      importFormVisible: false,
      exportVisible: false,
      copyFormVisible: false,
      readonly: false,
      editId: '', // 编辑dialog需要使用
      code: '',
      typeId: '',
      copyData: {},
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' },
          {
            key: 'setCategory',
            label: '设置分类',
            icon: 'ibps-icon-cog'
          },
          {
            key: 'export',
            label: '导出',
            icon: 'ibps-icon-export'
          },
          {
            key: 'import',
            label: '导入',
            icon: 'ibps-icon-import'
          }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: '名称' },
            { prop: 'Q^CODE_^SL', label: '编码' },
            {
              prop: 'Q^IS_CREATE_TABLE_^S',
              label: '是否生成表',
              fieldType: 'select',
              options: createTabelOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称', width: 150 },
          { prop: 'code', label: '编码', width: 150 },
          { prop: 'versionCount', label: '版本信息', fieldType: 'slot', slotName: 'versionCount' },
          { prop: 'status', label: '状态', width: 100, tags: statusOptions },
          { prop: 'boType', label: '对象类型', width: 100, tags: boTypeOptions },
          { prop: 'isCreateTable', label: '生成表', tags: createTabelOptions, width: 80 }
        ],
        // 管理列
        rowHandle: {
          actions: [
            {
              key: 'genBoTable',
              label: '生成表',
              icon: 'ibps-icon-cog',
              hidden: (row, index) => {
                return !(row.boType === 'object' && row.isCreateTable === 'N')
              }
            },
            {
              key: 'synBoTable',
              label: '同步表结构',
              icon: 'ibps-icon-exchange',
              hidden: (row, index) => {
                return row.boType !== 'out'
              }
            },
            {
              key: 'copy',
              label: '复制',
              icon: 'ibps-icon-copy',
              hidden: (row, index) => {
                return row.boType === 'out'
              }
            },
            { key: 'edit' },
            { key: 'remove' },
            { key: 'detail' }
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
    loadData(id = '') {
      this.loading = true
      queryPageList(this.getFormatParams(id)).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams(id = '') {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^TYPE_ID_^S'] = id
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
        boDefIds: this.editId,
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
     * 添加
     */
    handleEdit(editId = '', readonly = false) {
      this.editId = editId || ''
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 更多版本
     */
    handleVersions(code = '') {
      this.code = code || ''
      this.versionsFormVisible = true
    },
    // 获取code
    handleRowClick(row, event, column) {
      this.code = row.code
    },
    /**
     * 点击表格
     */
    handleLinkClick(data, columns) {
      console.log(data.id)
    },
    /**
     * 复制
     */
    handleCopy(editId = '') {
      this.editId = editId || ''
      this.copyFormVisible = true
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
        case 'edit': // 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.code = data.code
          }).catch(() => { })
          break
        case 'remove': // 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'detail': // 明细
          ActionUtils.selectedRecord(selection).then((ids) => {
            this.handleEdit(ids, true)
          }).catch(() => { })
          break
        case 'setCategory': // 设置分类
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleSetCategory(id)
          }).catch(() => { })
          break
        case 'export': // 导出
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleExport(ids)
          }).catch(() => { })
          break
        case 'import': // 导入
          this.handleImport()
          break
        case 'copy': // 复制
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleCopy(id)
            this.copyData = data
          }).catch(() => { })
          break
        case 'genBoTable': // 生成表
          ActionUtils.selectedRecord(selection).then((id) => {
            this.$confirm('确定生成表吗？表名自动添加【T_】业务前缀。', '消息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleGenBoTable(id)
              this.$message.closeAll()
              this.$message({
                type: 'success',
                message: '生成表成功！'
              })
            }).catch(() => {})
          }).catch(() => { })
          break
        case 'synBoTable': // 同步表结构
          ActionUtils.selectedRecord(selection).then((id) => {
            this.$confirm('是否同步表结构?', '消息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handlesynBoTable(id)
              this.$message.closeAll()
            }).catch(() => {})
          }).catch(() => {})
          break
        default:
          break
      }
    },
    handleExport(ids) {
      this.$confirm('是否进一步配置导出数据？否，则直接导出当前业务对象。', '业务导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editId = ids
        this.exportVisible = true
      }).catch(() => {
        exportFile({ boDefIds: ids }).then((response) => {
          if (!response) {
            return
          }
          ActionUtils.exportFile(
            response.data,
            'boDef_' + fecha.formatDate('yyyyMMddHHmmss') + '.zip'
          )
        })
      })
    },
    handleImport() {
      this.importFormVisible = true
    },
    handleRemove(id) {
      remove({
        boDefIds: id,
        rmType: 'all',
        clean: true
      }).then(response => {
        this.loadData()
      })
    },
    handlesynBoTable(id) {
      synBoTable({
        boDefId: id
      }).then(response => {
        this.$message({
          type: 'success',
          message: '同步外部数据表结构成功！'
        })
        this.loadData()
      })
    },
    handleGenBoTable(id) {
      genBoTable({
        boDefId: id
      }).then(response => {
        this.loadData()
      })
    },
    handleVersion(id) {
      this.handleEdit(id, true)
    },
    handleVersionCount(code) {
      this.handleVersions(code)
    },
    handleNodeClick(id) {
      this.typeId = id
      this.loadData(id)
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    }
  }
}
</script>
