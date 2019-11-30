<template>
  <div>
    <el-button v-if="!readonly" type="primary" icon="ibps-icon-add" @click="handleAdd">
      添加参数
    </el-button>
    <el-popover
      v-if="!readonly"
      :width="200"
      trigger="hover"
      placement="right"
    >
      <i slot="reference" class="ibps-icon-help" style="font-size: 13px;" />
      如果任务类是com.lc.ibps.cloud.timer.job.RevokeServiceJob，必须添加service-url参数
    </el-popover>
    <el-table
      :data="tableData"
      empty-text="请添加参数"
      height="200px"
      border
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column
        label="参数名称"
      >
        <template slot-scope="scope">
          <el-input v-if="!readonly" v-model="scope.row['paramsName']" @change="data => scope.row.paramsName = data" />
          <span v-else>{{ scope.row['paramsName'] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="参数值"
      >
        <template slot-scope="scope">
          <el-input v-if="!readonly" v-model="scope.row['paramValue']" @change="data => scope.row.paramValue = data" />
          <span v-else>{{ scope.row['paramValue'] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!readonly" label="管理" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="ibps-icon-delete"
            @click="handleDelete(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    jobDataMap: Array
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    jobDataMap: {
      handler: function(val, oldVal) {
        if (val !== []) {
          this.tableData = val
        }
      },
      deppl: true
    }
  },
  methods: {
    handleAdd() {
      const rowParams = {
        paramsName: '',
        paramValue: ''
      }
      this.tableData.push(rowParams)
    },
    getData() {
      return this.tableData
    },
    initData() {
      this.tableData = []
    },
    handleDelete(index, row) {
      row.splice(index, 1)
    }
  }
}
</script>
