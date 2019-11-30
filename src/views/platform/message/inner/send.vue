<template>
  <ibps-container type="full" header-background-color class="page send send-form">
    <div slot="header">
      <ibps-toolbar
        :actions="toolbars"
        :socpe="thatSocpe"
        @action-event="handleActionEvent"
      />
    </div>
    <el-row class="send-form-row">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-form">
        <el-form-item label="主题：" prop="subject">
          <el-input v-model="form.subject" />
        </el-form-item>
        <el-form-item label="收件人：" prop="receiverId">
          <ibps-employee-selector
            :value="form.receiverId"
            @input="handleInput"
          />
        </el-form-item>
        <el-form-item label="收件组织：" prop="groupId">
          <ibps-org-selector
            :value="form.groupId"
            :multiple="true"
            @input="depNameInput"
          />
        </el-form-item>
        <el-form-item label="是否回复：" prop="canreply">
          <el-radio-group v-model="form.canreply">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="附件：" prop="fileMsg">
          <ibps-attachment-selector
            v-model="form.fileMsg"
            accept="*"
            multiple
          />
        </el-form-item>
        <el-form-item label="正文：" prop="content" class="demo-form-content">
          <ibps-ueditor v-model="form.content" />
        </el-form-item>
      </el-form>
    </el-row>
  </ibps-container>
</template>
<script>
import { save } from '@/api/platform/message/innerMessage'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import IbpsOrgSelector from '@/business/platform/org/org/selector'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'

export default {
  components: {
    IbpsUeditor,
    IbpsEmployeeSelector,
    IbpsOrgSelector,
    IbpsAttachmentSelector
  },
  data() {
    return {
      formName: 'form',
      toolbars: [{ key: 'send', label: '发送消息', icon: 'ibps-icon-send' }],
      form: {
        subject: '',
        receiverId: '',
        receiver: '',
        groupId: '',
        groupName: '',
        canreply: '1',
        fileMsg: '',
        content: '',
        id: '',
        editorValue: ''
      },
      rules: {
        subject: [{ required: true, message: this.$t('validate.required') }],
        receiverId: [{ required: false }],
        groupId: [{ required: false }],
        canreply: [{ required: false }],
        fileMsg: [{ required: false }],
        content: [{ required: false }]
      }
    }
  },
  computed: {
    thatSocpe() {
      return this
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs[this.formName].validate(() => {})
    })
  },
  methods: {
    handleInput(data) {
      this.form.receiverId = data
    },
    depNameInput(data) {
      this.form.groupId = data
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'send':// 发送信息
          this.handSend()
          break
        default:
          break
      }
    },
    handSend() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.sendNews()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    sendNews() {
      if (this.form.receiverId === '' && this.form.groupId === '') {
        this.$message.error('至少选择一种收件人或收件组织!')
        return
      }
      // this.form.ownerName = this.$store.getters.name
      // this.form.ownerId = this.$store.getters.userId
      save(this.form).then(response => {
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.$refs[this.formName].resetFields()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    }
  }
}
</script>
<style lang="scss">
.send{
  .ibps-container-full__body{
    padding: 15px !important;
  }
.send-form{
  .send-form-row{
    padding: 10px;
    .demo-form-content{
      .edui-editor-iframeholder{
        height: 100% !important;
      }
    }
  }
}
}
</style>
