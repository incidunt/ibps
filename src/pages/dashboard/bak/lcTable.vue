<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>

    </div>
    <div class="text item">
      <el-table :data="list" :height="getHeight()" stripe>
        <el-table-column label="订单号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.order_no }}
          </template>
        </el-table-column>
        <el-table-column label="价格" width="195" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>Q
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter"> {{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>

</template>

<script>
import { getData } from '@/api/platform/desktop/column'

export default {
  name: 'lc-table',
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    alias: {
      type: String,
      default: 'table'
    },
    height: {
      type: Number,
      default: 300
    },
    options: {
      type: Object,
      defaul: () => {}
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      title: '',
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getData({ alias: this.alias }).then(response => {
        var data = response.data
        this.title = data.title
        this.list = data.items.slice(0, 10)
      })
    },
    getHeight() {
      // 高度 - header - 边框
      return (this.height - 60 - 20) + 'px'
    },
    removeLayout() {
      if (this.id) {
        this.$emit('remove-layout', this.id)
      }
    }
  }
}
</script>
