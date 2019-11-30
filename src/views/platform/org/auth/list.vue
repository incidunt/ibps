<template>
  <div :style="{height:height+'px'}">
    <ibps-crud
      v-if="visible"
      ref="crud"
      :data="listData"
      :height="tableHeight"
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
    >
      <template slot="orgPerms" slot-scope="scope">
        <el-tag
          v-for="(item,index ) in dataConvert(scope.row.orgPerms)"
          :key="index"
        >
          {{ item|optionsFilter(permsOptions) }}
        </el-tag>
      </template>
      <template slot="userPerms" slot-scope="scope">
        <el-tag
          v-for="(item,index ) in dataConvert(scope.row.userPerms)"
          :key="index"
        >
          {{ item|optionsFilter(permsOptions) }}
        </el-tag>
      </template>
    </ibps-crud>
    <edit
      :id="editId"
      :visible="dialogFormVisible"
      :org-id="orgId"
      :org-name="orgName"
      @callback="search"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>
import { queryPageList, remove } from '@/api/platform/org/auth'
import { permsOptions } from './constants'
import ActionUtils from '@/utils/action'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  props: {
    orgId: [String, Number],
    rightsArr: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    orgName: String,
    height: Number,
    visible: Boolean
  },
  data() {
    return {
      dialogFormVisible: false,
      pkKey: 'id',
      editId: '',
      loading: false,
      permsOptions: permsOptions,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'add',
            hidden: () => {
              if (this.rightsArr.includes('add')) return false
              if (this.rightsArr.includes('join')) return false
              return true
            }
          },
          {
            key: 'edit',
            hidden: () => {
              if (this.isEdit) return false
              if (this.rightsArr.includes('edit')) return false
              return true
            }
          },
          {
            key: 'remove',
            label: '删除',
            icon: 'el-icon-delete',
            hidden: () => {
              if (this.rightsArr.includes('remove')) return false
              if (this.rightsArr.includes('delete')) return false
              return true
            }
          }
        ],
        searchForm: {
          inline: true,
          forms: [
            { prop: 'Q^MANAGER_NAME_^SL', label: '用户姓名:' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'managerName', label: '用户姓名' },
          { prop: 'orgName', label: '组织名称' },
          { prop: 'orgPerms', label: '组织操作权限', slotName: 'orgPerms' },
          { prop: 'userPerms', label: '子组织操作权限', slotName: 'userPerms' },
          { prop: 'createTime', label: '创建时间' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'edit',
              hidden: () => {
                if (this.rightsArr.includes('edit')) return false
                if (this.rightsArr.includes('join')) return false
                return true
              }
            },
            {
              key: 'remove',
              hidden: () => {
                if (this.rightsArr.includes('remove')) return false
                if (this.rightsArr.includes('join')) return false
                return true
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    tableHeight() {
      return this.height - 145
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loadListData()
      }
    }
  },
  methods: {
    dataConvert(data) {
      if (this.$utils.isEmpty(data)) return []
      return data.split(',')
    },
    // 初始化数据
    loadListData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    getSearcFormData() {
      const formParams = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}

      formParams['Q^ORG_ID_^S:'] = this.orgId
      // 和分页数据合并
      return ActionUtils.formatParams(formParams, this.pagination, this.sorts)
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, page)
      this.loadListData()
    },
    search() {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
    },
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        // 组织负责人
        case 'search':// 查询
          this.search()
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加分级管理员'
          break
        case 'edit':// 设置
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑分级管理员'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
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
    handleRemove(ids) {
      remove({ orgAuthIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    }
  }
}
</script>
