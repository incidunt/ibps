<template>
  <div
    :style="{
      height:height
    }"
  >
    <el-form :model="form" :inline="true" @keyup.enter.native="onSearch">
      <el-form-item label="文件名" prop="name">
        <el-input v-model="form.name" placeholder="文件名" @keyup.enter.native="onSearch" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="elTable"
      :data="listData"
      :row-key="getRowKey"
      height="340"
      border
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!--选择列 多选-->
      <el-table-column
        v-if="(selectionRow || selectionRow === '') && selectionType === 'checkbox'"
        v-bind="typeof selectionRow === 'Object'?selectionRow:null"
        :label="handleAttribute(selectionRow.label, '')"
        :selectable="selectable"
        :reserve-selection="true"
        type="selection"
      />
      <!--选择列 单选-->
      <el-table-column
        v-if="(selectionRow || selectionRow === '') && selectionType === 'radio'"
        :label="selectionRow.label||''"
        :width="selectionRow.width||55"
      >
        <template slot-scope="scope">
          <el-radio v-model="selectionRadio" :label="scope.row[pkKey]">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" />
      <el-table-column label="扩展名" prop="ext" />
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-count="pagination[pageCountKey]"
      :total="pagination[totalKey]"
      @size-change="handlePaginationSizeChange"
      @current-change="handlePaginationCurrentChange"
      @prev-click="handlePaginationPrevClick"
      @next-click="handlePaginationNextClick"
    />
  </div>
</template>
<script>
import { queryPageList } from '@/api/platform/file/attachment'
import ActionUtils from '@/utils/action'
export default {
  props: {
    height: String,
    load: Boolean,
    multiple: Boolean,
    value: [Object, Array],
    limit: {
      type: Number
    },
    accept: String
  },
  data() {
    return {
      listData: [],
      pagination: {},
      sorts: {},
      selectionRadio: '',
      pkKey: 'id',
      currentPage: 0,
      pageSizes: [10, 20, 50, 100],
      pageSize: 20,
      totalKey: 'totalCount',
      pageKey: 'page',
      pageCountKey: 'totalPages',
      selectionRow: true,
      format: true,
      form: {
        name: ''
      },
      fileList: [],
      multipleSelection: []
    }
  },
  computed: {
    selectionType() {
      return this.multiple ? 'checkbox' : 'radio'
    }
  },
  watch: {
    load: {
      handler() {
        this.loadData()
      },
      immediate: true
    },
    selectionRadio(val, oldVal) {
      if (this.$utils.isNotEmpty(val)) {
        this.$emit('callback', this.listData.find((data) => {
          if (data.id === val) {
            return data
          }
        }))
      }
    }
  },
  methods: {
    getRowKey(row) {
      return row.id
    },
    handleSelectionChange(val) {
      if (this.limit === 0) {
        this.$message({
          message: '上传个数不能为0',
          type: 'warning'
        })
        return
      }
      this.multipleSelection = val
      this.$emit('callback', val)
    },
    selectable() {
      let boolean = true
      if (this.multipleSelection.length <= this.limit - 1 && this.limit !== 0) {
        boolean = true
      } else {
        if (this.limit === '') {
          boolean = true
        } else if (this.limit === 0 || this.multipleSelection.length > this.limit - 1) {
          boolean = false
        }
      }
      return boolean
    },
    /**
     * @description 行点击时触发的事件
     */
    handleRowClick(row, event, column) {
      if (this.limit === 0) {
        this.$message({
          message: '上传个数不能为0',
          type: 'warning'
        })
        return
      }
      const index = this.multipleSelection.findIndex(i => i.id === row.id)
      if ((this.multipleSelection.length > this.limit - 1) && index === -1) {
        this.$message({
          message: '超过规定文件上传个数',
          type: 'warning'
        })
        return
      }
      // 点击行，触发选中
      if (this.selectionType === 'radio') {
        this.selectionRadio = row[this.pkKey]
      } else {
        this.$refs.elTable.toggleRowSelection(row)
      }
      // if (this.accept !== '') {
      //   if (row.ext === 'jpeg' || row.ext === 'jpg' || row.ext === 'gif' || row.ext === 'png') {
      //     this.format = true
      //     this.$emit('row-click', row, event, column)
      //   }
      // else {
      //   this.format = false
      // }
      // } else {
      this.format = true
      this.$emit('row-click', row, event, column)
      // }
      this.$emit('format', this.format)
    },
    toggleRowSelection(row, selected) {
      if (this.selectionType === 'radio') {
        this.selectionRadio = row ? row[this.pkKey] : ''
      } else {
        this.$refs.elTable.toggleRowSelection(row, selected)
      }
    },
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getSearcFormData() {
      return ActionUtils.formatParams(
        {
          'Q^FILE_NAME_^SL': this.form.name
        },
        this.pagination,
        this.sorts)
    },
    onSearch() {
      this.loadData()
    },
    /**
     * @description 每页条数改变
     */
    handlePaginationSizeChange(pageSize) {
      this.handlePaginationChange({ pageSize: pageSize })
    },
    /**
     * @description 当前页码改变
     */
    handlePaginationCurrentChange(currentPage) {
      this.handlePaginationChange({ currentPage: currentPage })
    },
    /**
     * @description 上一页
     */
    handlePaginationPrevClick(currentPage) {
      this.handlePaginationChange({ currentPage: currentPage })
    },
    /**
     * @description 下一页
     */
    handlePaginationNextClick(currentPage) {
      this.handlePaginationChange({ currentPage: currentPage })
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange({ pageSize, currentPage }) {
      ActionUtils.setSorts(this.sorts)
      ActionUtils.setPagination(this.pagination, {
        limit: pageSize || this.pageSize,
        page: currentPage || this.currentPage
      })
      this.loadData()
    },
    /**
     * @description 组件属性默认值
     */
    handleAttribute(attribute, defaultValue) {
      if (attribute === false || attribute === 0 || attribute === '') {
        return attribute
      }
      return attribute || defaultValue
    }
  }

}
</script>
