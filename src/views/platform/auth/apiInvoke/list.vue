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
      :pagination="pagination"
      :loading="loading"
      :index-row="false"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template slot="authorization">
        <client-selector
          style="width:200px;"
          @input="getAuth"
        />
      </template>
      <!-- 授权用户 -->
      <template slot="user">
        <ibps-employee-selector
          value-key="account"
          style="width:200px;"
          @input="getUser"
        />
      </template>
    </ibps-crud>
  </div>
</template>
<script>
import { queryInvoke as queryPageList } from '@/api/platform/auth/api'
import clientSelector from '@/business/platform/auth/client/selector'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import ActionUtils from '@/utils/action'
export default {
  components: {
    clientSelector,
    IbpsEmployeeSelector
  },
  data() {
    const statusOptions = [{
      label: '是',
      value: 'Y'
    }, {
      label: '否',
      value: 'N'
    }]
    return {
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: true,
      formId: '',
      height: document.clientHeight,

      auth: '',
      user: '',

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^URI_^SL', label: '接口地址', itemWidth: 230 },
            { prop: 'Q^CLIENT_KEY_^SL', label: '授权标识', fieldType: 'slot', slotName: 'authorization', itemWidth: 200 },
            { prop: 'Q^ACCOUNT_^SL', label: '用户姓名', fieldType: 'slot', slotName: 'user', itemWidth: 200 },
            { prop: 'Q^ip_^SL', label: 'IP', itemWidth: 200, labelWidth: 60 },
            {
              prop: 'Q^STATUS_^SL',
              label: '状态',
              fieldType: 'select',
              options: statusOptions,
              itemWidth: 200,
              labelWidth: 70
            },
            { prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'], label: '调用时间', fieldType: 'daterange', itemWidth: 230 }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'uri', label: '接口地址' },
          { prop: 'clientKey', label: '授权标识' },
          { prop: 'fullName', label: '用户姓名' },
          { prop: 'ip', label: 'IP' },
          { prop: 'status', label: '状态', tags: statusOptions },
          { prop: 'createTime', label: '调用时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' },
          { prop: 'cause', label: '详情' }
        ]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    getAuth(val) {
      this.auth = val
    },
    getUser(val) {
      this.user = val
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
      params['Q^CLIENT_KEY_^SL'] = this.auth || ''
      params['Q^ACCOUNT_^SL'] = this.user || ''
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
        default:
          break
      }
    }
  }
}
</script>

