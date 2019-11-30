<template>
  <div>
    <template v-if="!readonly">
      <ibps-tree-select
        v-if="treeData"
        v-model="selectData"
        :data="treeData"
        :props="props"
        :node-key="nodeKey"
        v-bind="$attrs"
        empty-text="暂无分类"
      />
    </template>
    <template v-else>
      <el-tag v-if="$utils.isNotEmpty(value)">{{ value|optionsFilter(treeDataOptions,'label') }}</el-tag>
    </template>
  </div></template>
<script>
import { findTreeData } from '@/api/platform/cat/type'
import TreeUtils from '@/utils/tree'

import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
  components: {
    IbpsTreeSelect
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    readonly: { // 是否多选
      type: Boolean,
      default: false
    },
    categoryKey: {
      type: String
    },
    nodeKey: {
      type: String
    }
  },
  data: function() {
    return {
      props: {
        children: 'children',
        label: 'name'
      },
      selectData: this.value,
      treeData: [],
      treeDataOptions: []
    }
  },
  watch: {
    selectData(val, oldVal) {
      this.$emit('input', val)
    },
    value: {
      handler(val, oldVal) {
        this.selectData = val
      },
      immediate: true
    }
  },
  created() {
    this.loadTreeData()
  },
  methods: {
    loadTreeData(categoryKey = this.categoryKey) {
      findTreeData({ categoryKey: categoryKey }).then(response => {
        const treeData = response.data.filter((d) => {
          return d.parentId !== '-1'
        })
        this.treeData = TreeUtils.transformToArrayFormat(treeData)
        this.treeDataOptions = treeData.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>

