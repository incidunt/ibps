<template>
  <div>
    <el-button
      size="mini"
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom:10px;"
      @click="handleAdd"
    >
      添加
    </el-button>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column label="值">
        <template v-slot="scope">
          <el-input v-model="scope.row.val" placeholder="请输入值" />
        </template>
      </el-table-column>
      <el-table-column label="标签">
        <template v-slot="scope">
          <el-input v-model="scope.row.label" placeholder="请输入标签" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [{
        val: '',
        label: ''
      }]
    }
  },
  data() {
    return {
      tableData: this.value
    }
  },
  watch: {
    value(val) {
      this.tableData = val
    },
    tableData: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    handleAdd() {
      this.tableData.push({
        val: '',
        label: ''
      })
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>

