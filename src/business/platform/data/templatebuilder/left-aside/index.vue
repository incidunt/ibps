<template>
  <div :style="{ width:`${width}px`,height:`${height}px`}" class="left-aside">
    <el-header :height="'40px'" class="layout-header">
      <div class="layout-header-title">
        数据集
      </div>
    </el-header>
    <ibps-tree
      :data="datesetTreeData"
      :options="treeOptions"
      :width="width"
      :height="height"
      :toolbars="false"
      :contextmenus="treeContextmenus"
      @action-event="handleTreeAction"
    />
    <setting-field
      :visible="settingFieldDialogVisible"
      :dataset-key="datasetKey"
      :datasets="datasets"
      @callback="handleDatasets"
      @close="(visible)=>settingFieldDialogVisible=visible"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import SettingField from '@/business/platform/data/dataset/setting-field'

export default {
  components: {
    SettingField
  },
  props: {
    datasetKey: String
  },
  data() {
    return {
      settingFieldDialogVisible: false,
      width: 220,
      height: 500,
      treeOptions: {
        props: {
          children: 'children',
          label: 'label'
        }
      },
      treeContextmenus: [
        { icon: 'setting', label: '设置字段控件', value: 'setting'
          // rights: function(menu, data, isRoot) {
          //   return data.parentId === '0'
          // }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    }),
    datesetTreeData() {
      return JSON.parse(JSON.stringify(this.datasets))
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.height = window.outerHeight - 80
    })
  },
  methods: {

    /**
     * 处理节点右键菜单
     */
    handleTreeAction(command, position, selection, data) {
      if (command === 'setting') {
        this.settingFieldDialogVisible = true
      }
    },
    handleDatasets(data) {
      this.$emit('update-datasets', data)
    }
  }
}
</script>

