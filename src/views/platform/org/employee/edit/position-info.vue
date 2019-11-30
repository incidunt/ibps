<template>
  <el-row :gutter="10">
    <el-col v-if="!readonly" :span="8" border>
      <div class="grid-content">
        <tree
          ref="elTree"
          :height="height"
          :data="treeData"
          :check-strictly="checkStrictly"
          :default-expanded-keys="defaultTreeData"
          node-key="id"
          @check="handleCheck"
          @node-click="handleNodeClick"
          @action-event="handleTreeAction"
        />
      </div>
    </el-col>
    <el-col v-if="!readonly" :span="3">
      <el-button type="primary" icon="el-icon-d-arrow-right" @click="handleBelongTo">分配</el-button>
      <el-button type="primary" icon="el-icon-d-arrow-left" style="margin-top:10px;" @click="handleClear">清空</el-button>
    </el-col>
    <el-col :span="spanNumber" border>
      <el-table
        :data="posItemList"
        style="width: 100%"
      >
        <el-table-column
          label="岗位名称"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否主岗位"
          width="100"
        >
          <template slot-scope="scope">
            <el-radio
              :disabled="readonly"
              :value="check(scope.row, 'radio')"
              :label="scope.row.id"
              @change.native="changeMainPost(scope.$index,scope.row)"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="主负责人"
          width="100"
        >
          <template slot-scope="scope">
            <el-checkbox
              :disabled="readonly"
              :value="check(scope.row, 'checkbox')"
              :label="scope.row.id"
              @change.native="changeCharge(scope.$index,scope.row)"
            >
              &nbsp;
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column v-if="!readonly" label="管理" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index,posItemList)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
import { getTreeData } from '@/api/platform/org/position'
// import { findTreeData } from '@/api/platform/org/position'
import { concat } from '../utils'

import Tree from '../../components/tree'

export default {
  components: {
    Tree
  },
  props: {
    data: Array,
    readonly: {
      type: Boolean,
      default: false
    },
    orgId: [Number, String],
    span: [Number, String]
  },
  data() {
    return {
      pkKey: 'id',
      nameKey: 'name',
      treeData: [],
      posItemList: [],
      height: document.clientHeight,
      checkStrictly: true,
      defaultTreeData: []
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
        this.posItemList = val
        const arr = JSON.parse(JSON.stringify(val))
        arr.forEach(item => {
          this.defaultTreeData.push(item.id)
        })
        this.$refs.elTree ? this.$refs.elTree.setCheckedKeys(this.defaultTreeData, true) : null
      },
      deep: true
    },
    posItemList: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.handleEmitEvent()
        }
      },
      deep: true
    }
  },
  created() {
    this.initTreeData()
    // 初始化数据
  },
  methods: {
    init() {
      this.$refs.elTree ? this.$refs.elTree.setCheckedNodes([]) : null
      this.defaultTreeData = []
    },
    // 树[数据]获取
    initTreeData() {
      getTreeData().then(response => {
        const data = response.data
        data.unshift({
          id: '0',
          name: '岗位树',
          parentId: null,
          disabled: true
        })
        this.treeData = data
      }).catch(() => {
      })
      // findTreeData({
      //   type:'position',
      //   orgId:this.orgId||''
      // }).then(response => {
      //   const data = response.data
      //   data.unshift({
      //     id: '0',
      //     name: '岗位树',
      //     parentId: null,
      //     disabled: true
      //   })
      //   this.treeData = data
      // }).catch(() => {
      // })
    },
    // 树事件
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar' && command === 'refresh') {
        this.initTreeData()
      }
    },
    handleCheck(data, state) {
      console.log(data, state)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 属于
    handleBelongTo() {
      const tree = this.$refs.elTree
      const postInfo = tree.getCheckedNodes() // 勾选
      if (this.$utils.isEmpty(postInfo)) {
        this.hint()
        return
      }
      for (let i = 0; i < postInfo.length; i++) {
        if (postInfo[i].id === '0') {
          postInfo.splice(i, 1)
        }
      }
      this.posItemList = concat(this.posItemList, postInfo)
    },
    hint() {
      this.$alert('你还没有选择任何节点！', '信息', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {})
    },
    handleClear() {
      this.posItemList = []
    },
    deleteRow(index, row) {
      row.splice(index, 1)
    },
    changeMainPost(index, row) {
      this.radioSelection = row
      for (const item of this.posItemList) {
        item.isMainPost = 'N'
      }
      row.isMainPost = 'Y'
    },
    changeCharge(index, row) {
      this.checkBoxSelection = row
      if (row.isPrincipal === 'Y') {
        row.isPrincipal = 'N'
      } else {
        row.isPrincipal = 'Y'
      }
    },
    handleEmitEvent() {
      this.$emit('input', this.posItemList)
    },
    check(row, type) {
      if (type === 'radio') {
        return row.isMainPost === 'Y' ? row.id : false
      } else if (type === 'checkbox') {
        return row.isPrincipal === 'Y'
      }
    }
  }
}
</script>
