<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
        <ibps-toolbar
          :actions="toolbars"
          type="icon"
          @action-event="handleTreeAction"
        />
      </div>
      <div
        :style="{ height:(tableHeight)+'px'}"
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
            :props="{ children: 'children', label: 'name'}"
            :show-checkbox="multiple"
            :check-strictly="true"
            :filter-node-method="filterNode"
            node-key="id"
            pid-key="parentId"
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
            :props="{ children: 'children', label: 'name'}"
            :filter-node-method="filterNode"
            node-key="id"
            pid-key="parentId"
            default-expand-all
            highlight-current
            @node-click="onNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <el-radio
                v-model="radio"
                :label="data[pkKey]"
                :disabled="data.disabled?data.disabled:data.id==='0'?true:null"
                @change="changeRadio(data)"
              >
                {{ node.label }}
              </el-radio>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <ibps-container
      :margin-left="width+'px'"
      class="page"
    >
      <!-- <edit
        :id="editId"
        ref="editForm"
        :visible="formVisible"
        :readonly="readonly"
        :parent-data="nodeData"
        display-type="edit"
        @callback="loadTreeData"
        @close="visible => formVisible = visible"
      /> -->
    </ibps-container>
  </ibps-layout>
</template>
<script>
import { findTreeData } from '@/api/platform/serv/service'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'

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
      width: 200,
      radio: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      // 树配置
      treeData: [],
      toolbars: [{
        key: 'refresh'
      }, {
        key: 'expand'
      }, {
        key: 'compress'
      }]

    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {

  },
  created() {
    this.loadTreeData()
  },
  methods: {
    setChecked(data, selected) {
      if (data !== undefined) {
        this.$refs['elTree'].setChecked(data, selected)
      } else {
        this.radio = ''
      }
    },
    cleanData(multiple) {
      if (multiple) {
        this.$refs['elTree'].setCheckedKeys([])
      } else {
        this.radio = ''
      }
    },
    // 加载组织树
    loadTreeData() {
      this.loading = true
      findTreeData({
        type: 1
      }).then(response => {
        const data = response.data
        this.treeData = TreeUtils.transformToArrayFormat(data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
     * 查询
     */
    search() {
      ActionUtils.setPagination(this.pagination)
      this.loadListData()
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
          this.loadListData()
          break

        default:
          break
      }
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
      if (data.id === 0 || data.id === '0' || data.id === 1 || data.id === '1' || data.id === 2 || data.id === '2') return
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
      if (data.id === 0 || data.id === '0' || data.id === 1 || data.id === '1' || data.id === 2 || data.id === '2') return
      this.$emit('selected', data)
    },
    onNodeClick(data, node, obj) {
      if (data.id === 0 || data.id === '0' || data.id === 1 || data.id === '1' || data.id === 2 || data.id === '2') return
      this.radio = data[this.pkKey]
      this.$emit('selected', data)
    }
  }
}
</script>

<style lang="scss" scoped>
$border-color: #e5e6e7;
.ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 30px;
    padding: 5px;
  }
  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree > .el-tree-node {
      display: inline-block;
    }
  }
</style>

