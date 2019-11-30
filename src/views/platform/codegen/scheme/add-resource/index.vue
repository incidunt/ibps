<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="addResourceDialog"
    fullscreen
    @open="open"
    @close="closeDialog"
  >
    <el-row>
      <el-col :span="span===4?4:1">
        <ibps-tree
          ref="tree"
          :width="width"
          :height="height"
          :loading="loading"
          :data="treeData"
          :options="treeOptions"
          title="添加菜单"
          @action-event="handleTreeAction"
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
      </el-col>
      <el-col :span="span===20?23:20">
        <edit
          ref="resourcesForm"
          :url="authUrl"
          :parent-id="parentId"
          :system-id="systemId"
          @close="closeDialog()"
        />
      </el-col>
    </el-row>
    <!-- <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import { findAllSubsystem } from '@/api/platform/auth/subsystem'
import { getTreeData } from '@/api/platform/auth/resources'
import FixHeight from '@/mixins/height'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    url: String
  },
  data() {
    return {
      width: 230,
      span: 4,
      height: document.clientHeight,
      // 树配置
      loading: false,
      treeData: [],
      treeOptions: { 'rootPId': '-1', showIcon: true },
      subsystemList: [],
      parentId: '',
      systemId: '',
      dialogVisible: this.visible,
      dialogLoading: false,
      defaultForm: {}
    }
  },
  computed: {
    authUrl() {
      return this.url
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  mounted() {
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
    changeSystem(value) {
      this.systemId = value
      this.loadTreeData()
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.loadTreeData()
        }
      }
    },
    // 树点击
    handleNodeClick(data) {
      this.parentId = data.id
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
      this.span = isExpand ? 4 : 20
    },
    // 保存数据
    handleSave() {
      this.saveData()
    },
    // 提交保存数据
    saveData() {
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    open() {
      if (this.$utils.isEmpty(this.authUrl)) {
        this.$nextTick(() => {
          this.$refs['resourcesForm'].resetFields()
          this.parentId = ''
          this.$refs['resourcesForm'].formValidate()
        })
      }
    }
  }

}
</script>
<style lang="scss">
.addResourceDialog{
  .el-dialog__body{
    padding: 10px 20px;
    .el-row{
      min-height: 482px;
      .el-col{
        position: relative;
        min-height: 482px;
        .container-component{
          left: 1% !important;
        }
        .ibps-tree-search-form{
          border: 1px solid #e5e6e7{
            top:0;
            bottom: 0;
          }
          .el-select{
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
