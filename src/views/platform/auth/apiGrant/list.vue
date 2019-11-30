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
      :style="dialog?'margin-top:54px;':'0px'"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <!-- 搜索栏插槽 -->
      <el-input v-if="dialog" slot="searchFormGrantType" v-model="targetGrantType" disabled clearable />
      <el-input v-if="dialog" slot="searchFormClient" v-model="searchClient" disabled clearable />
      <template slot="grantTypesSelect">
        <el-select
          v-model="targetGrantType"
          :disabled="!$store.getters.isSuper"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in grantTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <el-input v-if="dialog&&grantType==='user'" slot="searchFormGrantKey" v-model="appKey" disabled clearable />
      <el-input v-else-if="dialog&&grantType==='client'" slot="searchFormGrantKey" v-model="clientKey" disabled clearable />
      <template v-if="grantType!=='user'" slot="appSelect">
        <app-key-selector
          style="width:200px;"
          @input="getAppKey"
          @callback="data => formId= data.id"
        />
      </template>
      <template v-if="!dialog" slot="clientSelect">
        <!-- 授权客户端 -->
        <client-selector
          v-if="targetGrantType==='client'||targetGrantType===''"
          style="width:200px;"
          @input="getClient"
          @callback="data => formId= data.id"
        />
        <!-- 授权角色 -->
        <role-selector
          v-if="targetGrantType==='role'"
          :multiple="false"
          value-key="roleAlias"
          style="width:200px;"
          @input="getClient"
          @callback="data => formId= data.id"
        />
        <!-- 授权资源 -->
        <assign-selector
          v-if="targetGrantType==='res'"
          style="width:200px;"
          value-key="alias"
          @input="getClient"
          @callback="data => formId= data.id"
        />
        <!-- 授权用户 -->
        <ibps-employee-selector
          v-if="targetGrantType==='user'"
          :value="searchClient"
          :disabled="!$store.getters.isSuper"
          value-key="account"
          style="width:200px;"
          @input="getClient"
        />
      </template>
      <template slot="statusSelect">
        <el-select v-model="targetStatus" clearable placeholder="请选择">
          <el-option
            v-for="item in statusTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <!-- 表格字段插槽 -->
      <template slot="grantTypeColumns" slot-scope="scope">
        <el-tag>{{ scope.row.grantType|optionsFilter(grantTypes,'label') }}</el-tag>
      </template>
      <template slot="statusTypeColumns" slot-scope="scope">
        <el-tag :color="scope.row.status|optionsFilter(statusTypeOptions,'color')" style="color:#ffffff;">{{ scope.row.status|optionsFilter(statusTypeOptions,'label') }}</el-tag>
      </template>
    </ibps-crud>
    <!-- 接口选择器 -->
    <api-selector-dialog
      ref="apiSelector"
      :visible="selectorApiVisible"
      :default-params="defaultParams"
      :value="[]"
      multiple
      @close="visible => selectorApiVisible = visible"
      @action-event="handleSelectorApiEvent"
    />
    <!-- 编辑 明细 -->
    <edit
      :id="editId"
      :title="title"
      :audit="audit"
      :constant="constantInfo(grantTypes,statusTypeOptions)"
      :visible="dialogFormVisible"
      :readonly="editReadonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, doAuditBatch, remove, grant } from '@/api/platform/auth/apiGrant'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import ApiSelectorDialog from '@/business/platform/auth/api/dialog'
import AppKeySelector from '@/business/platform/auth/app/selector'

import clientSelector from '@/business/platform/auth/client/selector'
import roleSelector from '@/business/platform/org/role/selector'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import assignSelector from '@/business/platform/system/assign/selector'

import Edit from './edit'
import { findApiGrantTypes, findClientStatus } from '@/api/platform/info/find'

export default {
  components: {
    AppKeySelector,
    ApiSelectorDialog,
    clientSelector,
    roleSelector,
    IbpsEmployeeSelector,
    assignSelector,
    Edit
  },
  mixins: [FixHeight],
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    appKey: String,
    clientKey: String,
    grantType: String
  },
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      audit: true,
      editReadonly: false,
      selectorApiVisible: false,
      targetGrantType: '',
      targetStatus: '',
      searchAppKey: '',
      searchClient: '',
      defaultParams: {},

      statusTypeOptions: [],
      grantTypes: [],

      title: '',
      loading: true,
      height: document.clientHeight,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'choose',
            label: '选择',
            icon: 'ibps-icon-filter',
            hidden: () => {
              return !this.dialog
            }
          },
          {
            key: 'remove',
            label: '删除',
            icon: 'ibps-icon-delete',
            hidden: () => {
              return !this.dialog
            }
          },
          {
            key: 'back',
            label: '返回',
            icon: 'ibps-icon-back',
            hidden: () => {
              return !this.dialog
            }
          },
          {
            key: 'pass',
            label: '通过',
            icon: 'ibps-icon-legal',
            hidden: () => {
              if (!this.$store.getters.isSuper) return true
              if (this.dialog) return true
            }
          },
          {
            key: 'noPass',
            label: '不通过',
            icon: 'ibps-icon-legal',
            hidden: () => {
              if (!this.$store.getters.isSuper) return true
              if (this.dialog) return true
            }
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^GRANT_TYPE_^S', label: '授权类型', fieldType: 'slot', slotName: 'grantTypesSelect' },
            { prop: 'Q^GRANT_KEY_^SL', label: '授权标识', fieldType: 'slot', slotName: 'clientSelect' },
            { prop: 'Q^APP_KEY_^SL', label: '应用标识', fieldType: 'slot', slotName: 'appSelect' },
            { prop: 'Q^API_KEY_^SL', label: '接口标识' },
            { prop: 'Q^STATUS_^S', label: '状态', fieldType: 'slot', slotName: 'statusSelect' },
            { prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'], label: '申请时间', fieldType: 'daterange' },
            { prop: ['Q^EXPIRE_TIME_^DL', 'Q^EXPIRE_TIME_^DG'], label: '过期时间', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'grantType', label: '授权类型', slotName: 'grantTypeColumns' },
          { prop: 'grantKey', label: '授权标识' },
          { prop: 'appKey', label: '应用标识' },
          { prop: 'apiKey', label: '接口标识' },
          { prop: 'limit', label: '频次' },
          { prop: 'testLimit', label: '测试频次' },
          { prop: 'status', label: '状态', slotName: 'statusTypeColumns' },
          { prop: 'expireTime', label: '过期时间' }
        ],
        rowHandle: {
          actions: [{
            key: 'audit',
            label: '审核',
            icon: 'ibps-icon-legal',
            hidden: (row, index) => {
              if (row.status !== 'pendding') return true
              if (this.$store.getters.isSuper && !this.dialog) return false
              if (this.$store.getters.userId === row.createBy) return true
              return false
            }
          }, {
            key: 'edit',
            hidden: (row, index) => {
              if (!this.dialog) return true
              if (row.status === 'effect') return true
              if (this.grantType === '') return true
              if (this.$store.getters.userId !== row.createBy) return true
              return false
            }
          }, {
            key: 'remove',
            hidden: (row, index) => {
              // if (!this.dialog) return true
              // if (row.status === 'effect') return true
              if (this.grantType === '') return true
              // if (this.$store.getters.userId !== row.createBy) return true
              return false
            }
          }, {
            key: 'detail'
          }]
        }
      }
    }
  },
  watch: {
    dialog: {
      handler: function(val, oldVal) {
        if (val) {
          this.listConfig.searchForm.forms[0] = { prop: 'Q^GRANT_TYPE_^S', label: '授权类型', fieldType: 'slot', slotName: 'searchFormGrantType' }
          if (this.grantType !== 'user') {
            this.listConfig.searchForm.forms[1] = {
              prop: 'Q^GRANT_KEY_^SL',
              label: this.grantType === 'client' ? '授权标识' : this.grantType === 'res' ? '资源标识' : '角色标识',
              fieldType: 'slot',
              slotName: 'searchFormClient'
            }
            this.searchClient = this.clientKey
          } else {
            this.listConfig.searchForm.forms.splice(1, 1)
            this.listConfig.searchForm.forms[1] = { prop: 'Q^APP_KEY_^SL', label: '应用标识', fieldType: 'slot', slotName: 'searchFormGrantKey' }
          }
          let grantTypes = []
          findApiGrantTypes().then(response => {
            grantTypes = response.data
            grantTypes.forEach(item => {
              if (item.value === this.grantType) {
                this.targetGrantType = item.label
              }
            })
          }).catch(() => {})
        }
      },
      immediate: true
    }
  },
  created() {
    this.constant()
    this.targetGrantType = this.$store.getters.isSuper === true ? 'client' : 'user'
    this.searchClient = !this.dialog ? this.$store.getters.isSuper !== true ? this.$store.getters.account : '' : this.clientKey
    this.loadData()
  },
  methods: {
    constantInfo(...params) {
      return { ...params }
    },
    constant() {
      findClientStatus().then(response => { this.statusTypeOptions = response.data }).catch(() => {})
      findApiGrantTypes().then(response => {
        this.grantTypes = response.data
        console.log(this.grantTypes)
      }).catch(() => {})
    },
    getAppKey(getValue) {
      this.searchAppKey = getValue
    },
    getClient(getValue) {
      this.searchClient = getValue
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
      params['Q^GRANT_KEY_^SL'] = this.searchClient || ''
      params['Q^STATUS_^S'] = this.targetStatus || ''
      if (!this.dialog) {
        params['Q^APP_KEY_^SL'] = this.searchAppKey
        params['Q^GRANT_TYPE_^S'] = this.targetGrantType
      }
      if (this.grantType === 'user') {
        params['Q^GRANT_TYPE_^S'] = this.grantType
        params['Q^APP_KEY_^SL'] = this.appKey
        this.defaultParams = { 'grantType': this.grantType, 'grantKey': this.$store.getters.account }
      } else if (this.grantType === 'client' || this.grantType === 'role') {
        params['Q^APP_KEY_^SL'] = this.searchAppKey
        params['Q^GRANT_TYPE_^S'] = this.grantType
        params['Q^GRANT_KEY_^SL'] = this.searchClient
        this.defaultParams = { 'grantType': this.grantType, 'grantKey': this.clientKey }
      }
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts
      )
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
        case 'choose':// 选择
          this.handleApiSelector()
          break
        case 'back':// 返回
          this.closeDialog()
          break
        case 'pass':// 通过
        case 'noPass':// 不通过
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleBatchAudit(id, command === 'noPass')
          }).catch(() => { })
          break
        case 'audit':// 审核
          ActionUtils.selectedMultiRecord(selection).then((id) => {
            this.handleEdit(id, true, true)
            this.title = '接口授权审核'
          }).catch(() => { })
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '接口授权编辑'
          }).catch(() => {})
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((id) => {
            this.handleRemove(id)
          }).catch(() => {})
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = '接口授权明细'
          }).catch(() => { })
          break
        default:
          break
      }
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
        authApiGrantIds: ids,
        nopass: nopass || null,
        cause: cause || null
      }).then(response => {
        this.loadData()
      })
    },

    /**
     * 处理编辑
     */
    handleEdit(id = '', editReadonly = false, audit = false) {
      this.dialogFormVisible = true
      this.editId = id
      this.audit = audit
      this.editReadonly = editReadonly
    },
    /**
     * 选择
     */
    handleApiSelector() {
      this.selectorApiVisible = true
    },
    /**
     * 关闭
     */
    closeDialog() {
      this.$emit('close')
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      // 获取数据
      remove({ authApiGrantIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    // 接口确定
    handleSelectorApiEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      const apiArray = []
      data.forEach(d => {
        apiArray.push({
          'appKey': d.appKey,
          'apiKey': d.apiKey,
          'apiUri': d.apiUri,
          'limit': d.limit,
          'testLimit': d.testLimit
        })
      })
      grant({
        grantKey: this.clientKey,
        grantType: this.grantType,
        apiArrayStr: JSON.stringify(apiArray)
      }).then(response => {
        this.$refs['apiSelector'].handlerListData()
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.selectorApiVisible = false
          }
        })
        this.loadData()
      })
    }
  }
}
</script>

