<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog service-sort-dialog"
    @close="closeDialog"
  >
    <el-container>
      <el-main>
        <div v-for="option in formData" :key="option.id">
          <el-checkbox v-model="option.checked" @change="onClick(option)">
            {{ option.serviceName }}
          </el-checkbox>
        </div>

      </el-main>
      <el-aside width="150px">
        <el-button type="primary" @click="top">顶部</el-button><br>
        <div class="button-padding" />
        <el-button type="primary" @click="up">向上</el-button><br>
        <div class="button-padding" />
        <el-button type="primary" @click="down">向下</el-button><br>
        <div class="button-padding" />
        <el-button type="primary" @click="buttom">底部</el-button><br>
      </el-aside>
    </el-container>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { saveSort, queryPageList } from '@/api/platform/serv/postpositionEvent'
import ActionUtils from '@/utils/action'
import { moveUp, moveDown, moveTop, moveButtom } from '@/utils/move'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    sourceServiceId: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      formData: [],
      ids: [],
      checkedIds: [],
      toolbars: [
        { key: 'save' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.loadData()
        this.checkedIds = []
      },
      immediate: true
    }
  },
  methods: {
    loadData() {
      this.loading = true
      const params = ActionUtils.formatParams({ 'sourceServiceId': this.sourceServiceId }, null, null)
      queryPageList(params).then(response => {
        // ActionUtils.handleListData(this, response.data)
        if (response.data && response.data.dataResult) {
          const data = response.data.dataResult
          this.formData = data.map((d) => {
            d.checked = false
            return d
          })
          this.formData = response.data.dataResult
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave() {
      const data = this.formData
      const ids = []
      data.forEach(function(v) { ids.push(v.id) })
      this.ids = ids

      this.saveData()
    },
    // 提交保存数据
    saveData() {
      saveSort({ postpositionEventIds: this.ids.join(',') }).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    onClick(option) {
      const index = this.checkedIds.indexOf(option.id)
      if (index > -1) {
        this.checkedIds.splice(index, 1)
      } else {
        this.checkedIds.push(option.id)
      }
    },
    hasTip() {
      if (this.checkedIds.length === 0) {
        this.$message.closeAll()
        this.$message.warning('请选择要移动的节点！')
        return true
      }
      return false
    },
    // 顶部
    top() {
      if (this.hasTip()) {
        return
      }
      const data = this.formData
      this.formData = moveTop(data, this.checkedIds, 'id')
    },
    // 向上
    up() {
      if (this.hasTip()) {
        return
      }
      const data = this.formData
      this.formData = moveUp(data, 1)
    },
    //  向下
    down() {
      if (this.hasTip()) {
        return
      }
      const data = this.formData
      this.formData = moveDown(data, 1)
    },
    // 底部
    buttom() {
      if (this.hasTip()) {
        return
      }
      const data = this.formData
      this.formData = moveButtom(data, this.checkedIds, 'id')
    }
  }

}
</script>
<style lang="scss" scoped>
.service-sort-dialog{
  .el-dialog__body{
    height:  calc(36vh - 120px) !important;
  }
}
.button-padding{
  height: 5px;
}
.el-main{
  border: 1px #d4d4de solid;
}
.el-aside{
  padding-left: 20px;
}
</style>

