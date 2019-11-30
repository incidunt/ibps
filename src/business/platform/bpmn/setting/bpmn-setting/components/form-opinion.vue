<template>
  <el-dialog
    :title="'表单意见设置'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ibps-form-opinion"
    top="5%"
    width="65%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-table
      v-loading="loading"
      :element-loading-text="$t('common.loading')"
      :data="formData"
      border
      stripe
    >
      <el-table-column label="表单流程意见字段" prop="label" />
      <el-table-column label="绑定全局或节点" prop="nodeId">
        <template slot-scope="scope">
          <el-select v-model="scope.row.nodeId">
            <el-option label="全局" value="" />
            <template v-for="item of nodeList">
              <el-option
                v-if="item.nodeType==='userTask'"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </template>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否隐藏流程意见" prop="bpmOpinionHide">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.bpmOpinionHide"
            :disabled="$utils.isEmpty(scope.row.nodeId)"
            active-text="是"
            inactive-text="否"
          />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { findFormOptionField } from '@/api/platform/form/formDef'
export default {
  props: {
    defId: String,
    visible: {
      type: Boolean,
      default: false
    },
    formKey: String,
    data: Object

  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: true,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: []
    }
  },
  computed: {
    ...mapState({
      nodeList: state => state.ibps.bpmn.nodeList
    })
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    saveData() {
      // 检查有没有重复节点
      const nodeMap = {}
      const data = {}
      for (let i = 0; i < this.formData.length; i++) {
        const d = this.formData[i]
        const nodeId = d.nodeId
        if (this.$utils.isNotEmpty(nodeId)) {
          if (this.$utils.isNotEmpty(nodeMap[nodeId])) {
            this.$warning('每个节点只能绑定一个表单意见，请修正设置！')
            return
          } else {
            nodeMap[nodeId] = d
            data[d.name] = {
              bpmOpinionHide: d.bpmOpinionHide,
              nodeId: nodeId
            }
          }
        }
      }

      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.loading = true
      findFormOptionField({
        formKey: this.formKey
      }).then(response => {
        const opinionList = response.data
        const formData = []

        for (let i = 0; i < opinionList.length; i++) {
          const opinion = opinionList[i]
          const name = opinion.name
          let data = {
            bpmOpinionHide: true,
            nodeId: ''
          }
          if (this.$utils.isNotEmpty(this.data)) {
            data = this.data[name]
          }
          data.name = name
          data.label = opinion.label
          formData.push(data)
        }
        this.formData = formData

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

