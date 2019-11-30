<template>
  <ibps-layout ref="layout">
    <ibps-crud
      ref="crud"
      :height="tableHeight"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :loading="loading"
      :show-pagination="false"
      :selection-type="multiple?'checkbox':'radio'"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
    >
      <template slot="dsAliasSelect">
        <el-select v-model="targetDsAlias" clearable placeholder="请选择">
          <el-option
            v-for="item in dsAliasOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </ibps-crud>
  </ibps-layout>
</template>
<script>
import { queryTable } from '@/api/platform/bo/boDef'
import { queryDataSource } from '@/api/platform/data/dataset'
import ActionUtils from '@/utils/action'

export default {
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      pkKey: 'name', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      dsAliasOptions: [],
      targetDsAlias: '',
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          labelWidth: 100,
          forms: [
            { prop: 'tableName', label: '表名', itemWidth: '200' },
            { prop: 'dsAlias', label: '数据源', fieldType: 'slot', slotName: 'dsAliasSelect' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '表名' },
          { prop: 'comment', label: '描述' }
        ]
      }
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {
    value(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        this.$refs['crud'].clearSelection()
      } else {
        if (!this.multiple) {
          const selectedValue = this.listData.find((data) => { return data[this.pkKey] === val[this.pkKey] })
          this.$refs['crud'].toggleRowSelection(selectedValue)
        } else {
          if (val.length < oldVal.length) {
            oldVal.forEach(row => {
              const index = val.find(item => { return item[this.pkKey] === row[this.pkKey] })
              if (!index) {
                this.$refs['crud'].toggleRowSelection(row, false)
              }
            })
          } else {
            val.forEach(row => {
              const index = this.listData.find(item => { return item[this.pkKey] === row[this.pkKey] })
              if (index) {
                this.$refs['crud'].toggleRowSelection(row, true)
              }
            })
          }
        }
      }
    },
    dsAliasOptions: {
      handler: function(val, oldVal) {
        this.targetDsAlias = val[0].label
        this.$emit('callback', val[0])
      },
      deer: true
    }
  },
  created() {
    this.dataSource()
    this.loadData()
  },
  methods: {
    // 数据源
    dataSource() {
      queryDataSource().then(response => {
        const data = response.data['dataResult']
        this.dsAliasOptions = data.map(item => {
          return {
            label: item.name,
            value: item.alias
          }
        })
      })
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      this.dsAliasOptions.forEach(item => {
        params.dsAlias = item.label === this.targetDsAlias ? item.value : this.targetDsAlias
      })
      queryTable({
        dsAlias: params.dsAlias,
        tableName: params.tableName
      }).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 查询
     */
    search() {
      this.loadData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
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
    },
    handleSelectionChange(selection) {
      if (this.multiple) {
        // 是否在原来 列表里面
        const noListData = []
        this.value.forEach((item) => {
          const index = this.listData.find((data) => { return data[this.pkKey] === item[this.pkKey] })
          if (!index) { noListData.push(item) }
        })

        this.$emit('selected', noListData.concat(selection))
      } else {
        this.$emit('selected', selection)
      }
    }

  }
}
</script>
