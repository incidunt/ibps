<template>
  <div class="params">
    <label>参数列表</label>
    <!-- 编辑 -->
    <el-button v-if="!readonly" class="add" type="primary" icon="ibps-icon-add" @click="handleAdd">添加</el-button>
    <el-table
      v-if="!readonly"
      key="editTable"
      :data="tableData"
      empty-text="请添加参数"
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column
        label="参数名称"
      >
        <template slot-scope="scope">
          <ibps-dictionary key="key" v-model="scope.row.key" type-key="schemeParam" class="dictionary" />
        </template>
      </el-table-column>
      <el-table-column
        label="值"
      >
        <template slot-scope="scope">
          <el-input key="value" v-model="scope.row.value" @change="data => scope.row.value = data" />
        </template>
      </el-table-column>
      <el-table-column label="管理" width="78">
        <template slot-scope="scope">
          <el-button
            key="button"
            size="mini"
            type="danger"
            icon="ibps-icon-delete"
            @click="handleDelete(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 明细 -->
    <el-table
      v-if="readonly"
      key="detailTable"
      :data="tableData"
      empty-text="请添加参数"
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        label="参数名称"
      >
        <template slot-scope="scope">
          <span key="key">{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="值"
      >
        <template slot-scope="scope">
          <span key="value">{{ scope.row.value }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
export default {
  components: {
    IbpsDictionary
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    handleAdd() {
      const rowParams = {
        key: '',
        value: ''
      }
      this.tableData.push(rowParams)
    },
    save() {
      return this.tableData
    },
    handleDelete(index, row) {
      row.splice(index, 1)
    },
    callback(value) {
      this.tableData = value
    },
    clear() {
      this.tableData = []
    }
  }
}
</script>
<style lang="scss">
.schemeDialog{
  .params{
    overflow: hidden;
  }
  .add{
    float: right;
    margin-bottom: 10px;
  }
}
</style>
