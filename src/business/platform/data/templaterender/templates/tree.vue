<template>
  <div>
    <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
      <ibps-toolbar
        :actions="toolbars"
        type="icon"
        @action-event="handleTreeAction"
      />
    </div>
    <div ref="searchForm" class="ibps-tree-search-form">
      <el-input v-model="filterText" placeholder="请输入" clearable @keyup.enter.native="filter" />
    </div>
    <div
      :style="{ height: tableHeight + 'px'}"
    >
      <el-scrollbar
        style="height: 100%;"
        wrap-class="ibps-tree-wrapper"
      >
        <!-- 多选-->
        <el-tree
          v-if="multiple"
          ref="elTree"
          v-loading="loading"
          :data="treeData"
          :expand-on-click-node="false"
          :props="{ children: 'children', label: nameKey}"
          :show-checkbox="multiple"
          :check-strictly="true"
          :filter-node-method="filterNode"
          :node-key="pkKey"
          :pid-key="parentId"
          default-expand-all
          highlight-current
          check-on-click-node
          @check-change="handleCheckChange"
        />
        <!-- 单选-->
        <el-tree
          v-else
          ref="elTree"
          v-loading="loading"
          :data="treeData"
          :expand-on-click-node="false"
          :props="{ children: 'children', label: nameKey}"
          :show-checkbox="multiple"
          :node-key="pkKey"
          :pid-key="parentId"
          default-expand-all
          highlight-current
          @node-click="onNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <el-radio v-model="radio" :label="data[pkKey]" :disabled="data.disabled" @change="changeRadio(data)">{{ node.label }}</el-radio>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { queryDataTree } from '@/api/platform/data/dataTemplate'
import TreeUtils from '@/utils/tree'

export default {
  props: {
    template: Object,
    value: [String, Number, Array, Object],
    multiple: Boolean
  },
  data() {
    return {
      width: document.body.clientWidth - 570,
      height: 400,
      treeData: [],
      toolbars: [],
      contextmenus: [],
      options: {
        emptyText: '未设置显示字段'
      },
      radio: '',
      rootTreeName: '',
      pkKey: 'id',
      loading: false,
      parentId: 'parentId',
      nameKey: '',
      filterText: '',
      tableHeight: 400
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        if (!this.template) { return }
        const toolbarButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
        // 工具栏
        const toolbars = []
        toolbarButtons.forEach(button => {
          toolbars.push({
            key: button.button_type,
            label: button.label
          })
        })
        this.rootTreeName = this.template.name
        this.pkKey = this.template.display_columns.id_key
        this.parentId = this.template.display_columns.pid_key
        this.nameKey = this.template.display_columns.name_key
        this.toolbars = toolbars
        this.loadTreeData()
      },
      immediate: true
    },
    value(val, oldVal) {
      console.log(val, oldVal, 'value')
      if (this.$utils.isEmpty(val)) {
        // this.$refs['tree'].clearSelection()
        if (this.multiple) {
          oldVal.forEach(data => {
            this.$refs.elTree.setChecked(data[this.pkKey], false)
          })
        } else {
          this.$refs.elTree.setChecked(oldVal[this.pkKey], false)
          this.radio = ''
        }
      } else {
        if (this.multiple) {
          if (val.length < oldVal.length) {
            oldVal.forEach(row => {
              const index = val.find(item => { return item[this.pkKey] === row[this.pkKey] })
              if (!index) {
                this.$refs['elTree'].setChecked(row[this.pkKey], false)
              }
            })
          }
        }
        // if (!this.multiple) {
        //   const selectedValue = this.listData.find((data) => { return data[this.pkKey] === val[this.pkKey] })
        //   this.$refs['elTree'].toggleRowSelection(selectedValue)
        // } else {
        //   if (val.length < oldVal.length) {
        //     oldVal.forEach(row => {
        //       const index = val.find(item => { return item[this.pkKey] === row[this.pkKey] })
        //       if (!index) {
        //         this.$refs['elTree'].toggleRowSelection(row, false)
        //       }
        //     })
        //   } else {
        //     val.forEach(row => {
        //       const index = this.listData.find(item => { return item[this.pkKey] === row[this.pkKey] })
        //       if (index) {
        //         this.$refs['elTree'].toggleRowSelection(row, true)
        //       }
        //     })
        //   }
        // }
      }
    }
  },
  methods: {
    loadTreeData() {
      this.loading = true
      queryDataTree().then(response => {
        const data = response.data
        // data.unshift({
        //   [this.pkKey]: 0,
        //   [this.nameKey]: this.rootTreeName,
        //   [this.parentId]: null,
        //   disabled: true
        // })
        this.treeData = TreeUtils.transformToArrayFormat(data, { idKey: this.pkKey, pIdKey: this.parentId, nameKey: this.nameKey })
        // console.log(this.treeData)
        this.loading = false
        this.$nextTick(function() {
          this.initCheck()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 初始化默认选中状态
     */
    initCheck() {
      if (this.$utils.isNotEmpty(this.value)) {
        if (this.multiple) {
          Array.isArray(this.value) && this.value.forEach(data => {
            const pkKey = typeof data === 'string' ? data : data[this.pkKey]
            this.$refs.elTree.setChecked(pkKey, true)
          })
        } else {
          if (Array.isArray(this.value)) { return }
          const pkKey = typeof this.value === 'string' ? this.value : this.value[this.pkKey]
          this.$refs.elTree.setChecked(pkKey, true)
        }
      }
    },
    filter() {
      this.$refs.elTree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.nameKey].indexOf(value) !== -1
    },
    handleTreeAction(action, position, selection, data) {
      const command = action.key
      if (position === 'toolbar' && command === 'refresh') {
        this.loadTreeData()
      }
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    handleCheckChange(data, checked) {
      if (data.id === 0 || data.id === '0') return
      let val = JSON.parse(JSON.stringify(this.value))
      if (checked) {
        const index = val.find((v) => {
          return v[this.pkKey] === data[this.pkKey]
        })
        if (!index) { val.push(data) }
      } else {
        val = val.filter((v) => {
          return v[this.pkKey] !== data[this.pkKey]
        })
      }
      this.$emit('selected', val)
    },
    changeRadio(data) {
      if (data.id === 0 || data.id === '0') return
      this.$emit('selected', data)
    },
    onNodeClick(data, node, obj) {
      this.radio = data[this.pkKey]
      this.$emit('selected', data)
    }
  }
}
</script>

