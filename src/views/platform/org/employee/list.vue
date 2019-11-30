<template>
  <ibps-container type="full" class="page">
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
      :show-field="false"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <!-- 新增、编辑、明细 -->
    <edit
      :id="editId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      :span="span"
      @dialog-callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 重置密码 -->
    <change-password
      :ids="changePasswordIds"
      :visible="changePasswordVisible"
      title="重置密码"
      is-reset
      :reg-open="true"
      @dialog-callback="search"
      @close="visible => changePasswordVisible = visible"
    />
  </ibps-container>
</template>

<script>
import { queryPageList, remove, active, disable } from '@/api/platform/org/employee'
import ActionUtils from '@/utils/action'
import { statusOptions, genderOptions } from './constants'
import { mapActions, mapMutations } from 'vuex'
import Edit from './edit/index'
import ChangePassword from './change-password'

export default {
  components: {
    Edit,
    ChangePassword
  },
  data() {
    return {
      height: document.clientHeight,
      title: '',
      loading: true,
      // 编辑dialog需要使用
      editId: '',
      span: '',
      dialogFormVisible: false,
      readonly: false, // 是否只读

      changePasswordIds: '',
      changePasswordVisible: false,
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listData: [],
      listConfig: {
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' },
          { key: 'changePassword', label: '重置密码', icon: 'el-icon-refresh' }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: '姓名', labelWidth: 60, itemWidth: 200 },
            { prop: 'Q^ACCOUNT_^SL', label: '用户名', labelWidth: 80, itemWidth: 200 },
            {
              prop: 'Q^STATUS_^SL',
              label: '状态',
              fieldType: 'select',
              options: statusOptions.filter((status) => {
                return status.value !== 'deleted'
              }),
              labelWidth: 65,
              itemWidth: 200
            },
            {
              prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
              label: '创建时间',
              fieldType: 'daterange',
              labelWidth: 80,
              itemWidth: 220
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'account', label: '用户名' },
          { prop: 'wcAccount', label: '微信账号' },
          { prop: 'orgName', label: '归属组织路径', sortable: false },
          { prop: 'gender', label: '性别', tags: genderOptions },
          { prop: 'createTime', label: '创建时间' },
          { prop: 'status', label: '状态', tags: statusOptions }
        ],
        rowHandle: {
          actions: [
            {
              key: 'changePassword',
              label: '重置密码',
              icon: 'el-icon-refresh',
              hidden: (rowData, index) => {
                if (rowData.status === 'deleted') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (this.$store.getters.isSuper) { return false }
              }
            },
            {
              key: 'edit',
              hidden: (rowData, index) => {
                if (rowData.status === 'deleted') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (this.$store.getters.isSuper) { return false }
              }
            },
            {
              key: 'remove',
              hidden: (rowData, index) => {
                if (rowData.status === 'deleted') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (this.$store.getters.isSuper) { return false }
              }
            },
            {
              key: 'detail'
            },
            {
              key: 'actived',
              label: '激活',
              icon: 'ibps-icon-unlock',
              hidden: (rowData, index) => {
                if (rowData.status === 'actived') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (!this.$store.getters.isSuper) { return true }
              }
            },
            {
              key: 'disable',
              label: '禁用',
              icon: 'ibps-icon-ban',
              hidden: function(rowData, index) {
                if (rowData.status !== 'actived') { return true }
                if (this.$store.getters.userId === rowData.id) { return true }
                if (!this.$store.getters.isSuper) { return true }
              }
            },
            {
              key: 'switchUser',
              label: '切换用户',
              icon: 'el-icon-sort',
              hidden: function(rowData, index) {
                const userId = this.$store.getters.userId
                const isSuper = this.$store.getters.isSuper
                return rowData.status !== 'actived' || userId === rowData.id || !isSuper
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
    ...mapMutations({
      pageKeepAliveClean: 'ibps/page/keepAliveClean'
    }),
    ...mapActions({
      switchUser: 'ibps/user/switchUser'
    }),
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
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        case 'search':// 查询
          this.loadData()
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加员工'
          this.span = 13
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑员工'
            this.span = 13
          }).catch(() => { })
          break
        case 'changePassword':// 重置密码
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handlereChangePassword(ids)
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.span = 24
            this.title = '员工明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'actived':// 激活
          this.handleActived(selection)
          break
        case 'disable':// 禁用
          this.handleDisable(selection)
          break
        case 'switchUser':// 切换用户
          this.handleSwitchUser(data.account)
          break
        default:
          break
      }
    },
    /**
     * 处理编辑
     */
    handleEdit(editId, readonly = false) {
      this.editId = editId || ''
      this.dialogFormVisible = true
      this.readonly = readonly
    },
    /**
     * 处理重置密码
     */
    handlereChangePassword(ids) {
      this.changePasswordIds = ids
      this.changePasswordVisible = true
    },
    handleRemove(ids) {
      // 删除数据
      remove({ employeeIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    },
    handleActived(id) {
      active({ employeeId: id }).then(response => {
        ActionUtils.successMessage('激活成功！')
        this.search()
      })
    },
    handleDisable(id) {
      disable({ employeeId: id }).then(response => {
        ActionUtils.successMessage('禁用成功!')
        this.search()
      })
    },
    handleSwitchUser(username) {
      this.switchUser(username).then(() => {
        ActionUtils.successMessage('切换用户成功!')
        // 由于已经加载过设置 需要清空缓存设置
        this.pageKeepAliveClean()
        // 由于已经加载过设置 需要刷新此页面
        this.$router.replace('/')
      })
    }

  }
}
</script>

