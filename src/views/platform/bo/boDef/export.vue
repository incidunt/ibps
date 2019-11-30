<template>
  <el-dialog
    ref="exportsDialog"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog export__dialog"
    fullscreen
    @open="loadByIdsData(id)"
    @close="closeDialog"
  >
    <el-row>
      <!-- 上级主对象 -->
      <el-col :span="8">
        <div class="header"><div><h4>上级主对象</h4></div></div>
        <el-table
          ref="bySidCrud"
          class="types-BySidList"
          border
          style="width:100%;"
          :height="753"
          :data="bySidListData"
          @selection-change="handerBySidEven"
          @row-click="handleBySidRowClick"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="对象名称" style="width:100%">
            <template slot-scope="scope">
              <label>{{ scope.row.name }}</label>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!-- 当前对象数据 -->
      <el-col :span="8">
        <ibps-crud
          ref="byIdsCrud"
          class="types-ByIdsList"
          :search-form="byIdslistConfig.searchForm"
          :toolbars="byIdslistConfig.toolbars"
          :height="height"
          selection-type="radio"
          :data="byIdsListData"
          :pk-key="pkKey"
          :index-row="false"
          :show-pagination="false"
          :columns="byIdslistConfig.columns"
          :loading="byIdsLoading"
          @selection-change="handerByIdsEven"
        >
          <template slot="rightTools">
            <el-tooltip placement="bottom" effect="light">
              <div slot="content">当前对象数据会全部导出.点击选中某一<br>条数据,可设置是否导出其父对象和子对象。</div>
              <h4 style="cursor:help;">当前对象数据</h4>
            </el-tooltip>
          </template>
        </ibps-crud>
      </el-col>
      <!-- 下级子对象 -->
      <el-col :span="8">
        <div class="header"><div><h4>下级子对象</h4></div></div>
        <el-table
          ref="byPidCrud"
          class="types-ByPidList"
          style="width:100%;"
          border
          :height="753"
          :data="byPidListData"
          @selection-change="handerByPidEven"
          @row-click="handleByPidRowClick"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="对象名称" style="width:100%">
            <template slot-scope="scope">
              <label>{{ scope.row.name }}</label>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { findBoDefBySid, queryBoDefByIds, findBoDefByPid, exportFile } from '@/api/platform/bo/boDef'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {},
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      height: '800',
      bySidLoading: false,
      bySidListData: [],

      byIdsLoading: false,
      byIdsListData: [],
      byIdslistConfig: {
        toolbars: [],
        searchForm: { },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '对象名称' }
        ]
      },
      byPidLoading: false,
      byPidListData: [],
      toolbars: [
        {
          key: 'export',
          label: '导出',
          icon: 'ibps-icon-export'
        },
        { key: 'cancel' }
      ],
      bySidData: [],
      byIdsData: '',
      byPidData: [],

      reserveSidOrPid: {},
      target: {}
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
      },
      immediate: true
    }
  },
  methods: {
    handleBySidRowClick(row, event, column) {
      this.$refs.bySidCrud.toggleRowSelection(row)
      console.log(event, 'handleBySidRowClick')
    },
    handleByPidRowClick(row, event, column) {
      this.$refs.byPidCrud.toggleRowSelection(row)
      console.log(event, 'handleByPidRowClick')
    },
    // 下级主对象
    loadByPidData(id) {
      this.byPidLoading = true
      findBoDefByPid({ boDefId: id }).then(response => {
        this.byPidListData = response.data
        this.byPidLoading = false

        let pid = this.reserveSidOrPid[this.byIdsData].pid || ''
        pid = pid.split(',')
        pid.forEach(i => {
          const index = this.byPidListData.findIndex(item => item.id === i)
          if (index > -1) {
            this.$nextTick(() => {
              this.$refs.byPidCrud.toggleRowSelection(this.byPidListData[index])
            })
          }
        })
      })
    },
    // 当前对象数据
    loadByIdsData(formId) {
      this.reserve(formId)
      this.byIdsLoading = true
      queryBoDefByIds({ boDefIds: formId }).then(response => {
        this.byIdsListData = response.data
        this.byIdsLoading = false
      })
    },
    // 上级主对象
    loadBySidData(id) {
      this.bySidLoading = true
      findBoDefBySid({ boDefId: id }).then(response => {
        this.bySidListData = response.data
        this.bySidLoading = false
        let sid = this.reserveSidOrPid[this.byIdsData].sid || ''
        sid = sid.split(',')
        sid.forEach(i => {
          const index = this.bySidListData.findIndex(item => item.id === i)
          if (index > -1) {
            this.$nextTick(() => {
              this.$refs.bySidCrud.toggleRowSelection(this.bySidListData[index])
            })
          }
        })
      })
    },
    reserve(formId) {
      const arr = formId.split(',')
      arr.forEach(i => {
        this.reserveSidOrPid[i] = []
      })
    },
    // 勾选数据
    handerByIdsEven(row) {
      this.byIdsData = row.id
      this.loadByPidData(row.id)
      this.loadBySidData(row.id)
    },
    // 勾选上级主对象
    handerBySidEven(selection) {
      const data = []
      const result = []
      const obj = {}
      selection.forEach(item => {
        data.push(item.id)
      })
      for (const i of data) {
        if (!obj[i]) {
          result.push(i)
        }
      }
      if (this.byIdsData === '') return
      this.reserveSidOrPid[this.byIdsData].sid = result.join(',')
      this.bySidData[this.byIdsData] = result.join(',')
    },
    // 勾选下级子对象
    handerByPidEven(selection) {
      const data = []
      const result = []
      const obj = {}
      selection.forEach(item => {
        data.push(item.id)
      })
      for (const i of data) {
        if (!obj[i]) {
          result.push(i)
        }
      }
      if (this.byIdsData === '') return
      this.reserveSidOrPid[this.byIdsData].pid = result.join(',')
      this.byPidData[this.byIdsData] = result.join(',')
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'export':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave() {
      const data = []
      this.formId.split(',').forEach((item, index) => {
        const tmp = item + ':' + (this.bySidData[item] || '') + ':' + (this.byPidData[item] || '')
        data.push(tmp.replace(',', ';'))
      })

      exportFile({ boDefIds: data.join(',') }).then((response) => {
        if (!response) {
          return
        }
        ActionUtils.exportFile(
          response.data,
          'boDef_' + fecha.formatDate('yyyyMMddHHmmss') + '.zip'
        )
      })

      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.byPidListData = []
      this.bySidListData = []
      this.byIdsData = ''
      this.reserveSidOrPid = {}
      this.$refs['bySidCrud'].clearSelection()
      this.$refs['byIdsCrud'].clearSelection()
      this.$refs['byPidCrud'].clearSelection()
    }
  }
}
</script>
<style lang="scss">
.export__dialog{
  .header{
    padding: 5px 0px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
    height: 35px;
    div{
      display:inline-block;
      margin-left:5px;
    }
    h4{
      margin: 10px 0;
    }
  }
  .el-dialog__body{
    height: 85%;
    min-height: 75%;
    .el-row{
      height:100%;
      .el-col{
        height:100%;
        .types-BySidList,
        .types-ByIdsList,
        .types-ByPidList{
          width:33%
        }
        .types-ByIdsList{
          left:33.5% !important;
        }
        .ibps-toolbar .tools{
          float: left;
          h4{
            margin:10px 0;
          }
        }
      }
    }
  }
  .el-dialog__footer{
    padding: 10px 20px 10px;
  }
}
</style>
