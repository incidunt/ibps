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
      />
    </ibps-container>

    <!-- 服务选择器 -->
    <ibps-service-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      :multiple="true"
      class="position-org-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />

    <!-- 编辑后置事件 -->
    <post-edit
      :id="editId"
      title="编辑后置事件"
      :visible="dialogFormVisible"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />

    <post-sort
      :source-service-id="formId"
      :visible="nodeSortVisible"
      title="后置事件排序"
      @close="visible => nodeSortVisible = visible"
      @callback="search"
    />
  </div>
</template>
<script>
import { queryPageList, add, remove } from '@/api/platform/serv/postpositionEvent'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { defaultAllOptions } from '../constants'
import IbpsServiceSelectorDialog from '@/business/platform/serv/service/dialog'
import PostEdit from './edit'
import PostSort from './sort'
export default {
  components: {
    IbpsServiceSelectorDialog,
    PostEdit,
    PostSort
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
      selectorVisible: false,
      dialogFormVisible: false,
      editId: '', // 编辑dialog需要使用

      // 排序参数
      nodeSortVisible: false,
      sourceServiceId: '',
      sortData: '',

      defaultAllOptions: defaultAllOptions,
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
      params['sourceServiceId'] = this.formId
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
    // 处理选择器显示
    handleAssign() {
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      if (this.$utils.isEmpty(data)) {
        return
      }
      const serviceIds = data.map(item => {
        return item.id
      })
      add({
        sourceServiceId: this.formId,
        serviceIds: serviceIds.join(',')
      }).then(response => {
        this.selectorVisible = false
        this.$message.closeAll()
        this.$message({
          message: '添加服务成功!',
          type: 'success'
        })
        this.search()
      })
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '') {
      this.editId = id
      this.dialogFormVisible = true
    },
    handleRemove(ids) {
      remove({ postpositionEventIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理排序
     */
    handleSort() {
      this.nodeSortVisible = true
      this.sortData = this.listData
      // if (data.children && data.children.length > 0) {
      //   if (data.children.length === 1) {
      //     this.$message.closeAll()
      //     this.$message.warning('只有一个节点无需排序')
      //   } else {
      //   }
      // } else {
      //   this.$message.closeAll()
      //   this.$message.warning('无子节点排序')
      // }
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.search()
          break
        case 'add':// 复制
          this.handleAssign()
          break
        case 'edit':// 发布
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'sort':// 设置
          this.handleSort()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lc-row-buttom-setting{
  margin-bottom: 10px;
}
.position-org-dialog {
  .el-dialog__body{
    height:  calc(70vh - 120px) !important;
  }
}
/* .el-row {
    margin-bottom: 10px;
  } */
</style>
