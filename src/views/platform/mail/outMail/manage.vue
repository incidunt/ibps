<template>
  <ibps-layout ref="layout">
    <!--  -->
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :data="treeData"
        :options="treeOptions"
        :toolbars="toolbars"
        class="outMail-tree"
        title="外部邮件"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      >
        <el-select slot="searchForm" v-model="treeSelect" @change="changeID">
          <el-option
            v-for="item in treeSelectOptions"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          />
        </el-select>
      </ibps-tree>
    </div>
    <ibps-container
      :margin-left="width+'px'"
      class="page"
    >
      <el-alert
        v-show="!show"
        :closable="false"
        type="warning"
        show-icon
        style="height:50px;font-size:14px;"
      >
        请先"<span style="color:#337ab7;cursor:pointer" @click="handEdit()">邮箱配置</span>"配置外部邮件！
      </el-alert>
      <ibps-crud
        v-if="show"
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
        :index-row="false"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      >
        <template slot="handIcon" slot-scope="scope">
          <el-tooltip v-if="!scope.row.receiverTime" class="item" effect="dark" content="已读" placement="bottom">
            <i class="ibps-icon-envelope-o" />
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="未读" placement="bottom">
            <i class="ibps-icon-envelope" />
          </el-tooltip>
          <el-tooltip v-if="scope.row.fileMsg" class="item" effect="dark" content="含附件" placement="bottom">
            <i class="ibps-icon-paperclip" />
          </el-tooltip>
        </template>
      </ibps-crud>
    </ibps-container>
    <config
      :id="editId"
      :visible="configFormVisible"
      title="邮箱用户添加"
      @callback="search"
      @close="visible => configFormVisible = visible"
    />
    <!-- 编辑明细 -->
    <edit
      :id="setId"
      :visible="dialogFormVisible"
      :readonly="readonly"
      :type="nodeType"
      :title="title"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </ibps-layout>
</template>
<script>
import { queryPageList as findConfigList } from '@/api/platform/mail/config'
import { queryPageList, deleted, remove, sync } from '@/api/platform/mail/outMail'
import { treeDatas, renderHeader } from './constants'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Config from '../config/edit'
import Edit from './edit'

export default {
  components: {
    Config,
    Edit
  },
  mixins: [FixHeight],
  data() {
    return {
      configFormVisible: false,
      dialogFormVisible: false,
      title: '',
      width: 200,
      height: document.clientHeight,
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      loading: false,
      // 树配置
      treeOptions: { 'rootPId': '-1', showIcon: true },
      toolbars: [{
        key: 'refresh'
      }, {
        key: 'expand'
      }, {
        key: 'compress'
      }, {
        key: 'exchange',
        label: '收取邮件',
        icon: 'ibps-icon-exchange'
      }],
      treeData: treeDatas,
      nodeType: 'inbox',
      setId: '',
      isPrivate: false,
      type: {},
      treeSelect: '',
      treeSelectOptions: [],
      show: false,
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'send', label: '写信', icon: 'ibps-icon-send' },
          { key: 'remove', label: '删除', icon: 'ibps-icon-remove' },
          { key: 'deleted', label: '彻底删除', icon: 'ibps-icon-delete' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^sender_name_^SL', label: '发件人' },
            { prop: 'Q^title_^SL', label: '主题' },
            { prop: ['Q^mail_date_^DL', 'Q^mail_date_^DG'], label: '日期', fieldType: 'daterange' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: '', label: '', slotName: 'handIcon', renderHeader: renderHeader, width: '50' },
          { prop: 'senderName', label: '发件人' },
          { prop: 'title', label: '主题' },
          { prop: 'mailDate', label: '时间' }
        ],
        rowHandle: {
          actions: [{
            key: 'edit',
            hidden: (row, index) => {
              if (row.types === 'inbox' || row.types === 'deleted') return true
              if (row.types === 'outbox' || row.types === 'drafts') return false
              return true
            }
          },
          {
            key: 'remove',
            label: '删除',
            hidden: (row, index) => {
              return row.types === 'deleted'
            }
          },
          {
            key: 'deleted',
            label: '彻底删除',
            icon: 'ibps-icon-delete'
          }, {
            key: 'detail'
          }, {
            key: 'release',
            label: '恢复',
            icon: 'ibps-icon-release',
            hidden: (row, index) => {
              return row.types === 'inbox' || row.types === 'outbox' || row.types === 'drafts'
            }
          }]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  watch: {
    treeSelectOptions: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.show = true
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadData()
    this.loadCategooryData()
  },
  methods: {
    // 加载下拉框 分类标识数据
    loadCategooryData() {
      findConfigList({
        parameters: [],
        requestPage: {}
      }).then(response => {
        this.treeSelectOptions = response.data.dataResult
        this.treeSelect = this.treeSelectOptions[0]
        this.setId = this.treeSelectOptions[0].id
      }).catch(() => {})
    },
    // 获取下拉选项ID
    changeID(valueId) {
      let obj = {}
      obj = this.treeSelectOptions.find((item) => {
        return item.id === valueId
      })
      this.setId = obj.id
      this.loadData()
    },
    // 根据ID加载发送信息具体列表数据
    loadData(setId, nodeType) {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        this.loading = false
        const data = response.data['dataResult']
        this.listData = data
        this.show = true
      }).catch(() => {
        this.loading = false
      })
    },
    getSearcFormData() {
      const params = {
        'Q^set_Id_^S': this.setId,
        'Q^types_^S': this.nodeType || 'inbox'
      }
      Object.assign(params,
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {})
      return ActionUtils.formatParams(params,
        this.pagination,
        this.sorts)
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadCategooryData()
        }
        if (command === 'exchange') {
          this.handleSync(this.setId)
        }
      }
    },
    handleSync(ids) {
      sync({ setId: ids }).then(response => {
        this.$message.closeAll()
        this.$message({
          message: '同步外部邮件成功!',
          type: 'success'
        })
        this.search()
      }).catch(() => {
        this.$message.closeAll()
        this.$message({
          message: '同步外部邮件失败!',
          type: 'danger'
        })
      })
    },
    handleNodeClick(data) {
      if (data.depth === 0 || data.parentId === '-1') return
      this.nodeType = data.type
      if (this.nodeType === 'dustbin' || this.nodeType === 'deleted') {
        this.listConfig.toolbars = [
          { key: 'search' },
          { key: 'deleted', label: '彻底删除', icon: 'ibps-icon-delete' }
        ]
      } else {
        this.listConfig.toolbars = [
          { key: 'search' },
          { key: 'send', label: '写信', icon: 'ibps-icon-send' },
          { key: 'remove', label: '删除', icon: 'ibps-icon-remove' },
          { key: 'deleted', label: '彻底删除', icon: 'ibps-icon-delete' }
        ]
      }
      this.loadData(this.setId, this.nodeType)
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 50
    },
    handTreeEdit(editId) {
      this.editId = editId || ''
      this.show = true
    },
    search() {
      this.loadData()
    },
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.search()
          break
        case 'send':// 写信
          this.title = '写信'
          this.handSend()
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handSend(id)
            this.title = '编辑外部邮箱'
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handSend(id, true)
            this.title = '外部邮箱明细'
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection, '确定删除？删除后将移入垃圾箱。').then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'deleted':// 彻底删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleDeleted(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    handEdit(editId) {
      this.editId = editId || ''
      this.configFormVisible = true
    },
    handSend(editId, readonly = false) {
      this.readonly = readonly
      this.editId = editId || ''
      this.dialogFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ id: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理彻底删除
     */
    handleDeleted(ids) {
      deleted({ id: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
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
    getSelectedData(id, list) {
      for (let index = 0; index < list.length; index++) {
        if (list[index].id === id) {
          return list[index]
        }
      }
    },
    callback(data) {
      console.log('callback: ', data)
    }

  }
}
</script>
<style lang="scss">
.outMail-tree{
  .el-tree-node{
    width: 100%;
  }
}
</style>
