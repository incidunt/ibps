<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog dictionary-sort-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-container
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
    >
      <el-main>
        <div v-for="option in data" :key="option.id">
          <el-checkbox v-model="option.checked" @change="onClick(option)">
            {{ option.name }}
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
import { sortSave, sortList } from '@/api/platform/cat/type'
import ActionUtils from '@/utils/action'
import { srtuOptions } from './constants'
import { moveUp, moveDown, moveTop, moveButtom } from '@/utils/move'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String

  },
  data() {
    return {
      formName: 'dictionaryForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      srtuOptions: srtuOptions,
      data: [],
      ids: [],
      sortForm: {
        name: '',
        typeKey: '',
        struType: '1'
      },
      rules: {},
      checkedIds: [],
      toolbars: [
        { key: 'save' },
        { key: 'cancel' }
      ]
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
        // 关闭清除数据，刷新树
        this.data = []
        this.checkedIds = []
      },
      immediate: true
    }
  },
  methods: {
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
      const data = this.data
      const ids = []
      data.forEach(function(v) { ids.push(v.id) })
      this.ids = ids

      this.saveData()
    },
    // 提交保存数据
    saveData() {
      sortSave({ 'typeIds': this.ids.join(',') }).then(response => {
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
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        return
      }
      this.dialogLoading = true
      sortList({
        typeId: this.formId
      }).then(response => {
        this.data = response.data
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    onClick(option) {
      const index = this.checkedIds.indexOf(option.id)
      if (index > -1) {
        this.checkedIds.splice(index, 1)
      } else {
        this.checkedIds.push(option.id)
      }
      console.log(this.checkedIds)
    },
    // 顶部
    top() {
      const data = this.data
      this.data = moveTop(data, this.checkedIds, 'id')
    },
    // 向上
    up() {
      const data = this.data
      this.data = moveUp(data, 1)
    },
    //  向下
    down() {
      const data = this.data
      this.data = moveDown(data, 1)
    },
    // 底部
    buttom() {
      const data = this.data
      this.data = moveButtom(data, this.checkedIds, 'id')
    }
  }

}
</script>
<style lang="scss">
.dictionary-sort-dialog{
  .el-dialog__body{
    height:  calc(27vh - 120px) !important;
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

