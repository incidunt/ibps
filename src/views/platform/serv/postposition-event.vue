<template>
  <div v-if="dialogVisible" class="main-container">
    <ibps-container type="full" class="page">
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
        </template>
      </ibps-crud>
    </ibps-container>
    <!-- v-if="" -->
    <service-selector
      style="width:200px;"
      @input="getClient"
      @callback="data => formId= data.id"
    />
  </div>
</template>
<script>
import { queryPageList } from '@/api/platform/serv/postpositionEvent'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { defaultAllOptions, methodOptions, serviceTypeOptions, dataTypeOptions, typeOptions } from './constants'
import ServiceSelector from '@/business/platform/serv/service/selector'
export default {
  components: {
    ServiceSelector
  },
  mixins: [
    FixHeight
  ],
  props: {
    id: {
      type: String
    },
    parentData: Object, // 父类数据
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: document.clientHeight,
      formName: 'typeForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,

      defaultAllOptions: defaultAllOptions,
      methodOptions: methodOptions,
      serviceTypeOptions: serviceTypeOptions,
      dataTypeOptions: dataTypeOptions,
      typeOptions: typeOptions,
      // 数据字典列表
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: { // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' },
          { key: 'sort', label: '排序', icon: 'ibps-icon-cog' }
        ],
        searchForm: { // 查询条件
          forms: [
            {
              prop: 'Q^INGORE_EXCEPTION_^S',
              label: '忽略异常',
              fieldType: 'select',
              options: defaultAllOptions
            },
            {
              prop: 'Q^IS_EXECUTE_NEXT_^S',
              label: '是否执行后置',
              fieldType: 'select',
              options: defaultAllOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'sourceServiceName', label: '源服务' },
          { prop: 'serviceName', label: '服务' },
          { prop: 'ingoreException', label: '忽略异常', tags: defaultAllOptions, width: 80 },
          { prop: 'isExecuteNext', label: '是否执行后置', tags: defaultAllOptions, width: 120 },
          { prop: 'sn', label: '序号', width: 80 }
        ],
        rowHandle: {
          actions: [
            {
              key: 'edit',
              label: '编辑',
              icon: 'ibps-icon-edit',
              hidden: function(rowData, index) {
                return false
              }
            },
            {
              key: 'remove',
              hidden: function(rowData, index) {
                return false
              }
            }
          ]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) this.loadData()
      },
      immediate: true
    },
    formId() {
      this.getFormData()
      if (this.id) this.loadData()
    }
  },
  created() {
    // this.loadData()
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
    }
  }
}
</script>

<style scoped>
.lc-row-buttom-setting{
  margin-bottom: 10px;
}
/* .el-row {
    margin-bottom: 10px;
  } */
</style>
