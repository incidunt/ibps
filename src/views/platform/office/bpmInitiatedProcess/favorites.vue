<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        :has-contextmenu="true"
        title="流程分类"
        category-key="FLOW_TYPE"
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
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
    >
      <template slot="favoritesIcon" slot-scope="scope">
        <el-tooltip v-if="scope.row.favorites" class="item" effect="dark" content="已收藏" placement="bottom">
          <i class="ibps-icon-star" style="margin-left:7px;" @click="handleTips(scope.row.favorites,scope.row.id)" />
        </el-tooltip>
        <el-tooltip v-else class="item" effect="dark" content="未收藏" placement="bottom">
          <i class="ibps-icon-star-o" style="margin-left:7px;" @click="handleTips(scope.row.favorites,scope.row.id)" />
        </el-tooltip>
      </template>
      <template slot="statusCloum" slot-scope="scope">
        <el-tag>{{ scope.row.status|optionsFilter(statusOptions,'value','key') }}</el-tag>
      </template>
    </ibps-crud>
    <bpmn-formrender
      :visible="dialogFormVisible"
      :def-id="defId"
      @close="visible => dialogFormVisible = visible"
    />
  </ibps-layout>
</template>
<script>
import { favorited, sortFavorites, saveFavorites, removeFavorites } from '@/api/platform/office/bpmInitiated'
import { findBpmDefinitionState } from '@/api/platform/bpmn/bpmInfo'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

export default {
  components: {
    IbpsTypeTree,
    BpmnFormrender
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      defId: '', // 编辑dialog需要使用

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeId: '',
      loading: false,
      listData: [],
      statusOptions: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          {
            key: 'first',
            label: '移至第一条',
            icon: 'ibps-icon-angle-double-up'
          },
          {
            key: 'up',
            label: '上移',
            icon: 'ibps-icon-angle-up'
          },
          {
            key: 'down',
            label: '下移',
            icon: 'ibps-icon-angle-down'
          },
          {
            key: 'last',
            label: '移至最后一条',
            icon: 'ibps-icon-angle-double-down'
          },
          {
            key: 'removeFavorites',
            label: '取消',
            icon: 'ibps-icon-star-o'
          }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^name_^SL', label: '流程名称' }
          ]
        },
        // 表格字段配置.
        columns: [
          { prop: 'favorites', label: '收藏', slotName: 'favoritesIcon', width: '50' },
          { prop: 'name', label: '流程名称', link: 'dialog' },
          { prop: 'createTime', label: '收藏时间' },
          { prop: 'typeName', label: '所属分类' },
          { prop: 'status', label: '状态', slotName: 'statusCloum' },
          { prop: 'version', label: '版本号' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            {
              key: 'first',
              label: '移至第一条',
              icon: 'ibps-icon-angle-double-up'
            },
            {
              key: 'up',
              label: '上移',
              icon: 'ibps-icon-angle-up'
            },
            {
              key: 'down',
              label: '下移',
              icon: 'ibps-icon-angle-down'
            },
            {
              key: 'last',
              label: '移至最后一条',
              icon: 'ibps-icon-angle-double-down'
            },
            {
              key: 'removeFavorites',
              label: '取消',
              icon: 'ibps-icon-star-o'
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
    this.findBpmDefinitionState()
  },
  methods: {
    findBpmDefinitionState() {
      findBpmDefinitionState().then(response => {
        this.statusOptions = response.data
      })
    },
    handleTips(favorites, id) {
      if (favorites) {
        this.tips('removeFavorites', '确认取消流程收藏吗？', id)
      } else {
        this.tips('saveFavorites', '确认流程收藏吗？', id)
      }
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      favorited(this.getFormatParams()).then(response => {
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
     * 点击表格
     */
    handleLinkClick(data) {
      this.defId = data.id || ''
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
        case 'first':
        case 'up':
        case 'down':
        case 'last':
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleSortFavorites(command, ids)
          }).catch(() => { })
          break
        case 'removeFavorites':// 取消
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.tips('removeFavorites', '确认取消流程收藏吗？', id)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    tips(tip, title, id) {
      this.$confirm(title, '消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (tip === 'saveFavorites') {
          saveFavorites({ defIds: id }).then(response => {
            ActionUtils.successMessage('收藏成功！')
            this.loadData()
          })
        } else {
          removeFavorites({ defIds: id }).then(response => {
            ActionUtils.successMessage('取消收藏成功！')
            this.loadData()
          })
        }
      }).catch(() => {})
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    handleSortFavorites(sort, defIds) {
      this.loading = true
      sortFavorites({
        sort: sort,
        defIds: defIds
      }).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.search()
        this.loading = false
        ActionUtils.successMessage('流程收藏排序成功！')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
