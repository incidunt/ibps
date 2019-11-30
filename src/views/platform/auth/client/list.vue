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
    >
      <!-- 搜索栏插槽 -->
      <template slot="scope">
        <el-select v-model="scope" clearable placeholder="请选择">
          <el-option
            v-for="item in scopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template slot="grantTypes">
        <el-select v-model="type" clearable placeholder="请选择">
          <el-option
            v-for="item in grantTypesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template slot="status">
        <el-select v-model="status" clearable placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <!-- 表格字段插槽 -->
      <template slot="scopeColumns" slot-scope="scopeColumns">
        <label v-for="(item,i) in dataConvert(scopeColumns.row.scope)" :key="i">
          <el-tag> {{ item|optionsFilter(scopeOptions,'label') }}</el-tag>
        </label>
      </template>
      <template slot="grantTypesColumns" slot-scope="grantTypesColumns">
        <label v-for="(item,i) in dataConvert(grantTypesColumns.row.grantTypes)" :key="i">
          <el-tag> {{ item|optionsFilter(grantTypesOptions,'label') }}</el-tag>
        </label>
      </template>
      <template slot="statusColumns" slot-scope="statusColumns">
        <el-tag :color="statusColumns.row.status|optionsFilter(statusOptions,'color')" style="color:#ffffff;">{{ statusColumns.row.status|optionsFilter(statusOptions,'label') }}</el-tag>
      </template>
    </ibps-crud>
    <!-- 编辑 明细 -->
    <edit
      :id="editId"
      :title="title"
      :constant="constantInfo(scopeOptions,grantTypesOptions)"
      :visible="dialogFormVisible"
      :readonly="readonly"
      :audit="audit"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- API 授权申请 -->
    <api-grant
      :title="title"
      :client-key="clientKey"
      :grant-type="grantType"
      :visible="apiGrantVisible"
      @callback="search"
      @close="visible => apiGrantVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove, reset, doAuditBatch } from '@/api/platform/auth/client'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import edit from './edit'
import apiGrant from './grant/index'

import { findScopes, findGrantTypes, findClientStatus } from '@/api/platform/info/find'

export default {
  components: {
    edit,
    apiGrant
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      apiGrantVisible: false,
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      audit: true,
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      title: '',
      clientKey: '',
      grantType: '',
      loading: true,
      height: document.clientHeight,
      userId: this.$store.getters.userId,
      isSuper: '',
      pagination: {},
      sorts: {},
      listData: [],

      scopeOptions: [],
      scope: '',
      grantTypesOptions: [],
      type: '',
      statusOptions: [],
      status: '',

      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'add'
          },
          {
            key: 'pass',
            label: '通过',
            icon: 'ibps-icon-legal',
            hidden: function() {
              return !this.$store.getters.isSuper
            }
          },
          {
            key: 'nopass',
            label: '不通过',
            icon: 'ibps-icon-legal',
            hidden: function() {
              return !this.$store.getters.isSuper
            }
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^CLIENT_KEY_^SL', label: '标识' },
            { prop: 'Q^CLIENT_NAME_^SL', label: '名称' },
            { prop: 'Q^CLIENT_URI_^SL', label: 'Domain' },
            { prop: 'Q^SCOPE_^SL', label: '作用域', fieldType: 'slot', slotName: 'scope' },
            { prop: 'Q^GRANT_TYPES_^SL', label: '授权类型', fieldType: 'slot', slotName: 'grantTypes' },
            { prop: 'Q^STATUS_^S', label: '状态', fieldType: 'slot', slotName: 'status' },
            { prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'], label: '申请时间', fieldType: 'daterange' },
            { prop: ['Q^EXPIRE_TIME_^DL', 'Q^EXPIRE_TIME_^DG'], label: '过期时间', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'createTime', label: '申请时间' },
          { prop: 'clientKey', label: '标识' },
          { prop: 'clientName', label: '名称' },
          { prop: 'clientUri', label: 'Domain' },
          { prop: 'scope', label: '作用域', slotName: 'scopeColumns' },
          { prop: 'grantTypes', label: '授权类型', slotName: 'grantTypesColumns' },
          { prop: 'status', label: '状态', slotName: 'statusColumns' },
          { prop: 'creator', label: '创建人' },
          { prop: 'expireTime', label: '过期时间' }
        ],
        rowHandle: {
          actions: [{
            key: 'edit',
            hidden: function(row, index) {
              if (row.status === 'effect') return true
              if (this.$store.getters.userId !== row.createBy) return true
              return false
            }
          }, {
            key: 'detail'
          }, {
            key: 'audit',
            label: '审核',
            icon: 'ibps-icon-legal',
            hidden: function(row, index) {
              if (row.status !== 'pendding') return true
              if (this.$store.getters.userId === row.createBy) return true
              if (!this.$store.getters.isSuper) return true
              return false
            }
          }, {
            key: 'remove',
            hidden: function(row, index, _this) {
              if (row.status === 'effect' && (this.$store.getters.userId !== row.createBy || !this.$store.getters.isSuperper)) {
                return true
              } else {
                return false
              }
            }
          }, {
            key: 'reset',
            label: '重置密匙',
            icon: 'ibps-icon-lock',
            hidden: function(row, index, _this) {
              if (row.status !== 'effect') return true
              if (this.$store.getters.isSuper) return false
              if (this.$store.getters.userId !== row.createBy) return true
              return false
            }
          }, {
            key: 'authApiGrant',
            label: '接口授权',
            icon: 'ibps-icon-ticket',
            hidden: function(row, index) {
              if (row.status === 'effect' && (row.scope.indexOf('api') > -1 || row.scope.indexOf('API') > -1) && this.$store.getters.userId === row.createBy) return false
              return true
            }
          }]
        }
      }
    }
  },
  created() {
    this.loadData()
    this.constant()
    this.userId = this.$store.getters.userId
    this.isSuper = this.$store.getters.isSuper
  },
  methods: {
    constantInfo(...params) {
      return { ...params }
    },
    constant() {
      findScopes().then(response => { this.scopeOptions = response.data }).catch(() => {})
      findGrantTypes().then(response => { this.grantTypesOptions = response.data }).catch(() => {})
      findClientStatus().then(response => { this.statusOptions = response.data }).catch(() => {})
    },
    dataConvert(data) {
      return data.split(',')
    },
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^SCOPE_^SL'] = this.scope
      params['Q^GRANT_TYPES_^SL'] = this.type
      params['Q^STATUS_^S'] = this.status
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
        case 'pass':// 通过
        case 'nopass':// 不通过
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleBatchAudit(id, command === 'nopass')
          }).catch(() => { })
          break
        case 'authApiGrant':// API授权申请
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleApiGrant(id)
            this.title = '接口授权申请'
            this.clientKey = data.clientKey
            this.grantType = 'client'
          }).catch(() => { })
          break
        case 'reset':// 重置密匙
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleResetPassword(id, data.clientSecret)
          }).catch(() => { })
          break
        case 'audit': // 审核
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleEdit(id, true, true)
            this.title = '审核'
          }).catch(() => { })
          break
        case 'add':// 添加
          this.handleEdit()
          this.title = '添加第三方接入'
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '编辑第三方接入'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((id) => {
            this.handleRemove(id)
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '第三方接入明细'
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '', readonly = false, audit = false) {
      this.editId = id
      this.readonly = readonly
      this.audit = audit
      this.dialogFormVisible = true
    },
    /**
     * API授权申请
     */
    handleApiGrant(id = '') {
      this.editId = id
      this.apiGrantVisible = true
    },
    //
    /**
     * 重置密码
     */
    handleResetPassword(id, value) {
      reset({
        authClientId: id,
        clientSecret: value
      }).then(response => {
        this.search()
        this.$message.closeAll()
        this.$message({
          message: '密码重置成功',
          type: 'success'
        })
      })
    },
    /**
     * 批量审核第三方授权
     */
    handleBatchAudit(ids, nopass) {
      if (nopass) {
        this.$prompt('请输入理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
          inputErrorMessage: this.$t('validate.required')
        }).then(({ value }) => {
          this.batchAudit(ids, nopass, value)
        })
      } else {
        this.batchAudit(ids)
      }
    },
    batchAudit(ids, nopass, cause) {
      doAuditBatch({
        authClientIds: ids,
        nopass: nopass || null,
        cause: cause || null
      }).then(response => {
        this.loadData()
      })
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      // 获取数据
      remove({ authClientIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
