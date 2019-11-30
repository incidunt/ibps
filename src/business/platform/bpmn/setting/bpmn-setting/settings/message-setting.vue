<template>
  <div class="panel-body ibps-bpm-message-setting">
    <el-form label-width="120px" :label-position="labelPosition" :model="message">
      <el-form-item label="通知类型:">
        <ibps-checkbox
          v-model="message.notifyType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />
      </el-form-item>
      <el-form-item label="主题/标题:">
        <el-input v-model="message.subject" placeholder="请输入主题" />
      </el-form-item>
      <el-form-item label="接收人:">
        <div :style="{'width':'100%'}">
          <el-button class="ibps-fr" type="success" size="mini" icon="el-icon-circle-plus-outline" plain @click="dialogFormVisible=true">添加人员</el-button>
        </div>
      </el-form-item>
      <el-form-item class="message-content">
        <el-table :data="message.users" border style="width: 100%">
          <el-table-column
            type="index"
            width="50"
            label="序号"
          />
          <el-table-column prop="description" label="条件" />
          <el-table-column align="center" prop="groupNo" width="80" label="批次">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.groupNo"
                type="number"
                placeholder="批次"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="管理" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editUser(scope.$index)">编辑</el-button>
              <el-button type="text" size="small" @click="removeUser(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="富文本设置:" class="message-left" />
      <el-form-item class="message-content">
        <ibps-ueditor v-model="message.html" />
      </el-form-item>

      <el-form-item label="普通文本内容(一般用于短信类型):" class="message-left" />
      <el-form-item class="message-content">
        <el-input
          v-model="message.plainText"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
        />

      </el-form-item>
    </el-form>
    <user-condition-setting
      :title="title"
      :data="editData"
      :visible="dialogFormVisible"
      @callback="handleData"
      @close="visible => dialogFormVisible = false"
    /></div>
</template>
<script>
import { mapState } from 'vuex'
import _defaultsDeep from 'lodash.defaultsdeep'
import IbpsUeditor from '@/components/ibps-ueditor'
import UserConditionSetting from './../components/user-condition-setting'
export default {
  components: {
    IbpsUeditor,
    UserConditionSetting
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogFormVisible: false,
      editIndex: -1,
      editData: {},
      title: '人员设置',
      labelPosition: 'left',
      notifyType: []
    }
  },
  computed: {
    ...mapState({
      messageTypes: state => state.ibps.bpmn.messageTypes
    }),
    message() {
      return this.data
    }
  },
  methods: {
    // 新增编辑人员设置
    editUser(index) {
      const data = this.$utils.isNotEmpty(index) ? this.message.users[index] : {}
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.title = this.$utils.isNotEmpty(index) ? '人员设置' : '人员设置'
      this.dialogFormVisible = true
    },
    // 删除单行人员设置
    removeUser(index) {
      this.message.users.splice(index, 1)
    },
    // 清空人员设置
    cleanUser() {
      this.$confirm('是否清空人员设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.message.users.splice(0, this.message.users.length)
      })
    },
    /**
     * 处理数据
     */
    handleData(data) {
      if (!this.message.users) {
        this.message.users = []
      }
      if (this.editIndex > -1) {
        this.message.users.splice(this.editIndex, 1, data)
      } else {
        this.message.users.push(data)
      }
    }

  }
}
</script>
<style lang="scss">
.ibps-bpm-message-setting{
  .message-content{
    .el-form-item__content{
      margin-left: 0!important;
    }
  }
  .el-form--label-left{
    .message-left{
      .el-form-item__label{
      width: 100%!important;
      text-align: left
      }
    }
  }
}
</style>
