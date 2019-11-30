<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        title="流程分类"
        category-key="FLOW_TYPE"
        :has-contextmenu="true"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
    </div>
    <ibps-container :margin-left="width+'px'" class="page">
      <ibps-crud
        ref="crud"
        :height="height"
        :data="listData"
        :index-row="false"
        :toolbars="listConfig.toolbars"
        :row-handle="listConfig.rowHandle"
        :search-form="listConfig.searchForm"
        :pk-key="pkKey"
        :columns="listConfig.columns"
        :pagination="pagination"
        :loading="loading"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      >
        <template v-slot:defName="{value,row}">
          <el-link
            v-if="(row.authorizeRight && row.authorizeRight.managementSet === 'Y' && row.status !== 'draft')"
            :underline="false"
            type="primary"
            @click="handleSetting(row.defId,row.defKey)"
          >
            {{ value }}
          </el-link>
          <span v-else>{{ value }}</span>
        </template></ibps-crud>
    </ibps-container>
    <!-- 导入定义 -->
    <import-def
      :id="editId"
      :visible="importFormVisible"
      @callback="search"
      @close="visible => importFormVisible = visible"
    />
    <!-- 设计 -->
    <design
      :id="editId"
      :type-id="typeId"
      :visible="designFormVisible"
      title="设计流程建模"
      @callback="search"
      @close="visible => designFormVisible = visible"
    />
    <!-- 设置分类 -->
    <setting-type
      :visible="settingTypeFormVisible"
      title="设置流程分类"
      category-key="FLOW_TYPE"
      @save="saveSettingType"
      @close="visible => settingTypeFormVisible = visible"
    />
    <!-- 流程设置 -->
    <ibps-bpmn-def-setting
      :visible="settingFormVisible"
      :def-id="editId"
      :def-key="defKey"
      title="流程设置"
      @callback="search"
      @close="visible => settingFormVisible = visible"
    />

    <!-- 流程启动 -->
    <bpmn-formrender
      :visible="startFormVisible"
      :def-id="editId"
      @close="visible => startFormVisible = visible"
    />
    <!-- 复制流程 -->
    <copy
      :id="editId"
      :data="data"
      :visible="copyFormVisible"
      :title="title"
      @callback="search"
      @close="visible => copyFormVisible = visible"
    />
    <!-- 编辑指南 -->
    <edit-guide
      :def-id="editId"
      :data="data"
      :visible="editGuideFormVisible"
      :title="title"
      @callback="search"
      @close="visible => editGuideFormVisible = visible"
    />

  </ibps-layout>
</template>
<script>
import { queryPageList, setCategory } from '@/api/platform/bpmn/bpmDefinition'
import { statusOptions, testStatusOptions } from './constants'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Handle from './mixin/handle'

import IbpsTypeTree from '@/business/platform/cat/type/tree'
import SettingType from '@/business/platform/cat/type/setting-type'
import Design from './design'
import ImportDef from './import'
import Copy from './copy'
import EditGuide from './edit-guide'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

import Vue from 'vue'
Vue.component('IbpsBpmnDefSetting', () => import('@/business/platform/bpmn/setting'))

export default {
  components: {
    IbpsTypeTree,
    ImportDef,
    Design,
    SettingType,
    Copy,
    EditGuide,
    BpmnFormrender
  },
  mixins: [
    Handle,
    FixHeight
  ],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dicFormVisible: false, // 弹窗
      importFormVisible: false,
      sortFormVisible: false,
      designFormVisible: false, // 设计流程弹窗
      settingFormVisible: false, // 设置弹窗
      settingTypeFormVisible: false, // 设置分类弹窗
      startFormVisible: false, // 启动流程表单弹窗
      copyFormVisible: false, // 复制流程弹窗
      editGuideFormVisible: false, // 编辑指南弹窗

      title: '', // 编辑框标题
      editId: '', // 编辑dialog需要使用
      defKey: '',
      data: {},
      typeId: '',
      // 数据字典列表
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: { // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'design', label: '在线流程建模', icon: 'ibps-icon-share-alt' },
          { key: 'remove' },
          { key: 'setCategory', label: '设置分类', icon: 'ibps-icon-cog' },
          { key: 'export', label: '导出' },
          { key: 'import', label: '导入' },
          { key: 'more', label: '更多', mode: 'dropdown', rightIcon: true, menus: [
            { key: 'batchSuspend', label: '挂起', icon: 'ibps-icon-ioxhost' },
            { key: 'batchRecover', label: '恢复', icon: 'ibps-icon-ioxhost' }
          ] }
        ],
        searchForm: { // 查询条件
          forms: [
            { prop: 'Q^name_^SL', label: '流程名称' },
            { prop: 'Q^def_key_^SL', label: '流程业务主键' },
            {
              prop: 'Q^status_^S',
              label: '流程状态',
              fieldType: 'select',
              options: statusOptions
            },
            {
              prop: 'Q^test_status_^S',
              label: '测试状态',
              fieldType: 'select',
              options: testStatusOptions
            },
            {
              prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
              label: '创建时间',
              fieldType: 'daterange'
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '流程名称', slotName: 'defName' },
          { prop: 'defKey', label: '流程业务主键', width: 150 },
          { prop: 'status', label: '流程状态', tags: statusOptions, width: 80 },
          { prop: 'testStatus', label: '测试状态', tags: testStatusOptions, width: 80 },
          { prop: 'updateTime', label: '更新时间', width: 150 },
          { prop: 'version', label: '版本号', width: 90 }
        ],
        rowHandle: {
          actions: [
            {
              key: 'start',
              label: '启动',
              icon: 'ibps-icon-send',
              hidden: (rowData, index) => {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementStart === 'Y' && rowData.status === 'deploy')
              }
            },
            {
              key: 'copy',
              label: '复制',
              icon: 'ibps-icon-copy'
            },
            {
              key: 'deploy',
              label: '发布',
              icon: 'ibps-icon-paper-plane',
              hidden: (rowData, index) => {
                return !(rowData.status === 'draft')
              }
            },
            {
              key: 'suspend',
              label: '挂起',
              icon: 'ibps-icon-square',
              hidden: function(rowData, index) {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementStart === 'Y' &&
                rowData.status === 'deploy')
              }
            },
            {
              key: 'recover',
              label: '恢复',
              icon: 'ibps-icon-reply',
              hidden: function(rowData, index) {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementStart === 'Y' && rowData.status === 'suspend')
              }
            },
            {
              key: 'setting',
              label: '设置',
              icon: 'ibps-icon-cogs',
              hidden: function(rowData, index) {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementSet === 'Y' && rowData.status !== 'draft')
              }
            },
            {
              key: 'design',
              label: '设计',
              icon: 'ibps-icon-share-alt',
              hidden: function(rowData, index) {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementEdit === 'Y')
              }
            },
            {
              key: 'remove',
              hidden: function(rowData, index) {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementDel === 'Y')
              }
            },
            // {
            //   key: 'getGuide',
            //   label: '查看指南',
            //   icon: 'ibps-icon-detail',
            //   hidden: function(rowData, index) {
            //     if (rowData.hasGuide === true || rowData.hasGuide === 'true') {
            //       return false
            //     }
            //     return true
            //   }
            // },
            {
              key: 'editGuide',
              label: '编辑指南',
              icon: 'ibps-icon-edit',
              hidden: function(rowData, index) {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementClean === 'Y')
              }
            },
            {
              key: 'clear',
              label: '清除数据',
              icon: 'ibps-icon-trash',
              hidden: function(rowData, index) {
                return !(rowData.authorizeRight && rowData.authorizeRight.managementClean === 'Y')
              }
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
      ActionUtils.setSorts(this.sorts)
      this.loadData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
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
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.search()
          break
        case 'design':// 设计
          this.handleDesign(position === 'toolbar' ? '' : selection)
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'setCategory':// 设置分类
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleSetCat(ids)
          }).catch(() => { })
          break
        case 'export':// 导出
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleExport(ids)
          }).catch(() => { })
          break
        case 'import': // 导入
          this.handImport()
          break
        case 'batchSuspend':// 挂起
        case 'suspend':// 挂起
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleBatchSuspend(ids)
          }).catch(() => { })
          break
        case 'batchRecover':// 恢复
        case 'recover':// 恢复
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleBatchRecover(ids)
          }).catch(() => { })
          break
        case 'start':// 启动
          this.handleStart(selection)
          break
        case 'copy':// 复制
          this.title = '复制流程'
          this.data = data
          this.handleCopy(selection)
          break
        case 'deploy':// 发布
          this.handleDeploy(selection)
          break
        case 'setting':// 设置
          this.handleSetting(selection, data.defKey)
          break
        case 'editGuide':// 编辑指南
          this.handleEditGuide(selection)
          break
        case 'clear':// 清除数据
          this.handleClear(selection)
          break
        default:
          break
      }
    },
    handleCopy(id) {
      this.copyFormVisible = true
      this.editId = id
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 30
    },
    getSelectedData(id) {
      const data = this.listData
      for (let index = 0; index < data.length; index++) {
        if (data[index].id === id) {
          return data[index]
        }
      }
    },
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
    }

  }
}
</script>
