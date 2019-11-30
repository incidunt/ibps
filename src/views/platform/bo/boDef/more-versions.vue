<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    top="8vh"
    class="more-versions-dialog"
    @open="loadData"
    @close="closeDialog"
  >
    <div style="height:400px;">
      <ibps-crud
        ref="crud"
        v-loading="dialogLoading"
        :element-loading-text="$t('common.loading')"
        :data="listData"
        :height="height"
        :pk-key="pkKey"
        :columns="listConfig.columns"
        :row-handle="listConfig.rowHandle"
        :pagination="pagination"
        :loading="loading"
        :index-row="false"
        style="margin-top:54px;"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      />
    </div>
    <!-- 编辑明细 -->
    <edit
      :id="editId"
      :code="code"
      :visible="dialogFormVisible"
      :readonly="readonly"
      title="editTitle"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <div slot="footer" class="el-dialog--center">
      <el-button icon="ibps-icon-close" @click="closeDialog">返回</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ActionUtils from '@/utils/action'
import { queryVersionsList, remove, genBoTable, setMainVersion } from '@/api/platform/bo/boDef'
import { createTabelOptions, statusOptions, boTypeOptions } from './constants'
import Edit from './edit'
export default {
  components: {
    Edit
  },
  props: {
    code: String,
    id: String,
    height: Number,
    visible: {
      type: Boolean,
      default: false
    },
    searchData: Boolean
  },
  data() {
    return {
      title: '更多版本',
      editTitle: '',
      dialogLoading: false,
      dialogFormVisible: false,
      dialogVisible: this.visible,
      editId: '',
      readonly: false,
      pkKey: 'id',
      loading: false,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称' },
          { prop: 'code', label: '编码' },
          { prop: 'version', label: '版本号' },
          { prop: 'isMain', label: '主版本', tags: createTabelOptions },
          { prop: 'status', label: '状态', tags: statusOptions },
          { prop: 'boType', label: '对象管理', tags: boTypeOptions },
          { prop: 'isCreateTable', label: '生成表', tags: createTabelOptions }
        ],
        rowHandle: {
          actions: [
            {
              key: 'setMainVersion',
              label: '设置为主版本',
              icon: 'ibps-icon-cog',
              hidden: (row, index) => {
                return row.isMain === 'Y'
              }
            },
            {
              key: 'genBoTable',
              label: '生成表',
              icon: 'ibps-icon-cog',
              hidden: (row, index) => {
                return !(row.boType === 'object' && row.isCreateTable === 'N')
              }
            },
            { key: 'edit' },
            { key: 'remove',
              hidden: (row, index) => {
                return row.isMain === 'Y'
              }
            },
            { key: 'detail' }
          ]
        }
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    searchData() {
      this.search()
    }
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    // 初始化数据
    loadData() {
      this.loading = true
      this.$emit('callback')
      queryVersionsList(this.getFormatParams()).then(response => {
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
        {
          code: this.code
        }, this.pagination, this.sorts)
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
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        case 'setMainVersion': // 设置主版本
          ActionUtils.selectedRecord(selection).then((id) => {
            this.$confirm('确定设置为主版本吗？', '消息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleSetMainVersion(id)
              this.$message.closeAll()
              this.$message({
                type: 'success',
                message: '设置为主版本成功！'
              })
            }).catch(() => {})
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
        case 'edit':// 编辑
          this.editTitle = '业务对象编辑'
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection, '是否确定删除该数据？').then((ids) => {
            this.handleRemove(ids)
          }).catch(() => {})
          break
        case 'detail':// 明细
          this.editTitle = '明细业务对象'
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 编辑明细
     */
    handleEdit(editId = '', readonly = false) {
      this.editId = editId || ''
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    /**
     * 设置主版本
     */
    handleSetMainVersion(id) {
      setMainVersion({
        boDefId: id
      }).then(response => {
        this.loadData()
      })
    },
    /**
     * 生成表
     */
    handleGenBoTable(id) {
      genBoTable({
        boDefId: id
      }).then(response => {
        this.loadData()
      })
    },
    handleRemove(id) {
      remove({
        boDefIds: id,
        rmType: 'signle',
        clean: true
      }).then(response => {
        this.loadData()
      })
    },
    search() {
      this.loadData()
    }
  }
}
</script>
<style lang="scss">
.more-versions-dialog{
  .toolbar-header{
    display: none;
  }
}
</style>
