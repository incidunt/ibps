<template>
  <el-row :gutter="10">
    <el-col v-if="!readonly" :span="8" border>
      <div class="grid-content">
        <tree
          ref="elTree"
          :height="height"
          :data="treeData"
          :multiple="false"
          :check-strictly="false"
          :check-on-click-node="true"
          node-key="id"
          @action-event="handleTreeAction"
        />
      </div>
    </el-col>
    <el-col v-if="!readonly" :span="3">
      <el-button type="primary" icon="el-icon-d-arrow-right" @click="handleBelongTo">属于</el-button>
      <el-button type="primary" icon="el-icon-d-arrow-left" style="margin-top:10px;" @click="handleClear">清空</el-button>
    </el-col>
    <el-col :span="spanNumber" border>
      <div class="grid-content">
        <div>
          <ul style="padding-left:0;">
            <li>
              <span>
                <h4>组织名称：{{ orgData.name }}</h4>
                <p />
              </span>
            </li>
            <li>
              <span>
                <h4>组织路径：{{ orgData.pathName }}</h4>
                <p />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { findTreeData } from '@/api/platform/org/org'

import Tree from '../../components/tree'

export default {
  components: {
    Tree
  },
  props: {
    data: [Object, String],
    readonly: {
      type: Boolean,
      default: false
    },
    span: [Number, String]
  },
  data() {
    return {
      pkKey: 'id',
      nameKey: 'name',
      treeData: [],
      orgData: {
        name: '',
        pathName: ''
      },
      height: document.clientHeight
    }
  },
  computed: {
    spanNumber() {
      return this.span
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.orgData = val
        if (val !== {}) {
          const tree = this.$refs.elTree ? this.$refs.elTree : null
          if (tree !== null) {
            tree.radio = val.id
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.initTreeData()
  },
  methods: {
    init() {
      this.orgData = {}
      this.$refs.elTree ? this.$refs.elTree.setCheckedNodes([]) : null
    },
    // 树[数据]获取
    initTreeData() {
      findTreeData({
        type: 1
      }).then(response => {
        const data = response.data
        this.treeData = data
      }).catch(() => {
      })
    },
    // 组织树事件
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.initTreeData()
        }
      }
    },
    // 属于
    handleBelongTo() {
      const tree = this.$refs.elTree
      const checkedId = tree.getCheckedId()
      if (this.$utils.isEmpty(checkedId)) {
        this.$message.closeAll()
        this.$message({
          message: '请选择节点后操作 ！',
          type: 'warning'
        })
      }
      const curNode = tree.getNode(checkedId)
      if (curNode === null || curNode.parent.key === undefined) { return }
      this.orgData = {
        id: curNode.data[this.pkKey],
        name: curNode.data[this.nameKey],
        pathName: this.getPathName(curNode)
      }
      this.$emit('input', this.orgData)
    },
    getPathName(curNode) {
      const nameKey = this.nameKey
      const namePrefix = []
      const push = function(node) {
        const name = node.data[nameKey]
        if (node.parent && name) {
          namePrefix.unshift(name)
          push(node.parent)
        }
      }
      push(curNode)
      if (namePrefix.length > 0) {
        namePrefix.splice(0, 1)
      }
      return namePrefix.join('.')
    },
    handleClear() {
      this.orgData = {}
      this.$emit('input', '')
    }
  }
}
</script>
