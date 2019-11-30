<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    fullscreen
    append-to-body
    class="resources-add-menu"
    @open="getFormData"
    @close="closeDialog"
  >
    <ibps-layout ref="layout">
      <template slot="west">
        <ibps-tree
          ref="tree"
          :width="width"
          :height="height"
          :loading="loading"
          :data="treeData"
          :options="treeOptions"
          title="菜单管理"
          @node-click="handleNodeClick"
          @expand-collapse="handleExpandCollapse"
        >
          <el-select
            slot="searchForm"
            v-model="systemId"
            placeholder="请先设置子系统"
            @change="changeSystem"
          >
            <el-option
              v-for="item in subsystemList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </ibps-tree>

      </template>
      <edit
        :parent-id="parentId"
        :system-id="systemId"
        :default-url="defaultUrl"
        type="addMenu"
        @callback="handleCallback"
      />
    </ibps-layout>
  </el-dialog>
</template>

<script>
import { getTreeData } from '@/api/platform/auth/resources'
import { findAllSubsystem } from '@/api/platform/auth/subsystem'
// import ActionUtils from '@/utils/action'
import Edit from '@/views/platform/auth/resources/edit'

export default {
  components: {
    Edit
  },
  props: {
    visible: Boolean,
    editId: String
  },
  data() {
    return {
      title: '添加菜单',
      height: document.clientHeight,
      width: 230,
      dialogVisible: false,
      dialogLoading: false,
      loading: false,

      systemId: '',
      subsystemList: [],
      parentId: '',
      defaultUrl: '',
      treeOptions: { 'rootPId': '-1', showIcon: true },
      treeData: []
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.height = document.documentElement.offsetHeight - 55
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadSubsystemData()
  },
  methods: {
    loadSubsystemData() {
      findAllSubsystem().then(response => {
        this.subsystemList = response.data
        this.systemId = this.subsystemList && this.subsystemList.length > 0 ? this.subsystemList[0].id : ''
        this.loadTreeData()
      })
    },
    changeSystem(value) {
      this.systemId = value
      this.loadTreeData()
    },
    loadTreeData() {
      this.loading = true
      getTreeData({
        systemId: this.systemId
      }).then(response => {
        this.loading = false
        this.treeData = response.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    search() {
      this.loadTreeData()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.defaultUrl = '/d/' + this.editId
    },
    // 树点击
    handleNodeClick(data) {
      if (!(data.id === '0' || data.id === 0) && data.resourceType !== 'request') {
        this.parentId = data.id
      } else {
        this.parentId = ''
      }
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    handleCallback() {
      this.$message({
        message: '保存菜单成功',
        type: 'success'
      })
    }
  }
}
</script>
<style lang="scss">
  .resources-add-menu{
    .el-dialog__body{
      padding: 0;
    }
    .ibps-container-full__header{
      padding: 10px;
      border-bottom: 1px solid #cfd7e5;
      background: #FFF;
    }
    .ibps-container-full__body{
      padding: 10px;
    }
  }
</style>
