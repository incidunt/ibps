<template>
  <ibps-tree-select
    v-if="treeData"
    v-model="selectData"
    v-bind="$attrs"
    :data="treeData"
    :props="props"
    :node-key="valueKey"
    :empty-text="emptyText"
    @change="(value,data) => $emit('change',value,data)"
  />
</template>
<script>
import IbpsTreeSelect from '@/components/ibps-tree-select'
import TreeUtils from '@/utils/tree'

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
    emptyText: {
      type: String,
      default: '无业务对象属性'
    },
    data: {
      type: Array
    },
    valueKey: {
      type: String,
      default: 'key'
    }
  },
  data: function() {
    return {
      props: {
        children: 'children',
        label: 'name'
      },
      selectData: this.value,
      treeData: []
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
    },
    data(val, oldVal) {
      if (this.$utils.isNotEmpty(val)) {
        this.handlerData(val)
      } else {
        this.treeData = []
      }
    }
  },
  mounted() {
    this.handlerData(this.data)
    this.selectData = this.value
  },
  methods: {
    handlerData(d) {
      if (this.$utils.isEmpty(d)) {
        this.treeData = []
        return
      }
      const data = JSON.parse(JSON.stringify(d))
      const treeData = data.filter((d) => {
        return d.parentId !== '0'
      })
      this.treeData = TreeUtils.transformToArrayFormat(treeData)
    }
  }
}
</script>

