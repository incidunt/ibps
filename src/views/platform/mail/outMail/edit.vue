<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="config-dialog"
    top="0"
    width="65%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-row v-loading="dialogLoading" :gutter="5" :style="{height:height+'px'}" class="outMail-form">
      <el-col :span="19">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-form">
          <el-form-item v-if="readonly" label="日期：" prop="mailDate">
            <span>{{ form.mailDate }}</span>
          </el-form-item>
          <el-form-item label="收件人：" prop="receiverNames">
            <el-select
              v-if="!readonly"
              ref="receiver"
              v-model="form.receiverNames"
              :autofocus="isReceiverFocus"
              clearable
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择收件人"
              style="width:100%;"
              @input="selectReceiver"
              @clear="selectCleart"
              @focus="isProp('receiverNames')"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.linkName"
                :value="item.id"
              />
            </el-select>
            <span v-for="(item,index) in form.receiverNames" v-else :key="index">{{ item }} <span />
            </span></el-form-item>
          <el-form-item v-if="ccNames" label="抄送人：" prop="ccNames">
            <el-select
              v-if="!readonly"
              v-model="form.ccNames"
              clearable
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择抄送人"
              style="width:100%;"
              @input="selectCcNames"
              @clear="selectCleart"
              @focus="isProp('ccNames')"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.linkName"
                :value="item.id"
              />
            </el-select>
            <span v-for="(item,index) in form.ccNames" v-else :key="index">{{ item }} <span />
            </span></el-form-item>
          <el-form-item v-if="bccNames" label="密送人：" prop="bccNames">
            <el-select
              v-if="!readonly"
              v-model="form.bccNames"
              clearable
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择密送人"
              style="width:100%;"
              @input="selectBccNames"
              @clear="selectCleart"
              @focus="isProp('bccNames')"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.linkName"
                :value="item.id"
              />
            </el-select>
            <span v-for="(item,index) in form.bccNames" v-else :key="index">{{ item }}</span>
          </el-form-item>
          <el-form-item v-if="readonly" label="发件人：" prop="senderName">
            <span>{{ form.senderName }}《{{ form.senderAddresses }}》</span></el-form-item>
          <el-form-item v-if="!readonly" style="margin-bottom:5px;" prop="isAdd">
            <label class="addCcNames" @click="addCcNames()">{{ addCc }}</label>-
            <label class="addBccNames" @click="addBccNames()">{{ addBcc }}</label>
          </el-form-item>
          <el-form-item label="主题：" prop="title">
            <el-input v-if="!readonly" v-model="form.title" />
            <span v-else>{{ form.title }}</span>
          </el-form-item>
          <el-form-item v-if="!readonly" label="是否回复：" prop="isReply">
            <el-radio-group v-model="form.isReply">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="fileIds" label="附件：" prop="fileIds">
            <ibps-attachment-selector
              v-model="form.fileIds"
              store="json"
              multiple
            />
          </el-form-item>
          <el-form-item label="内容：" prop="content" class="demo-form-content">
            <ibps-ueditor
              v-model="form.content"
              :readonly="readonly"
            />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col v-if="!readonly" :span="5" class="outMail-form-linkManTree">
        <ibps-tree
          :height="height"
          :data="treeData"
          :options="treeOptions"
          :toolbars="toolbars"
          :angle-double="false"
          class="linkManTree"
          title="最近联系人"
          @node-click="handleNodeClick"
        />
      </el-col>
    </el-row>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { save, get } from '@/api/platform/mail/outMail'
import { getLinkManTreeData } from '@/api/platform/mail/outMail'
import ActionUtils from '@/utils/action'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import IbpsUeditor from '@/components/ibps-ueditor'
export default {
  components: {
    IbpsUeditor,
    IbpsAttachmentSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String,
    type: String
  },
  data() {
    return {
      dialogLoading: false,
      dialogVisible: this.visible,
      formName: 'form',
      height: 478,
      addCc: '添加抄送',
      addBcc: '添加密送',
      ccNames: false,
      bccNames: false,
      fileIds: true,
      // files: true,
      isReceiverFocus: true,
      linkManData: [],
      arr: [],
      options: [],
      focus: 'receiverNames',
      form: {
        receiverNames: [],
        receiverAddresses: '',
        ccNames: [],
        ccAddresses: '',
        bccNames: [],
        bccAddresses: '',
        title: '',
        isReply: 'true',
        fileIds: '',
        content: '',
        setId: '',
        types: '',
        id: '',
        editorValue: ''
      },
      rules: {
        receiverNames: [{ required: true, message: this.$t('validate.required') }]
      },
      // 树配置
      treeData: [],
      treeOptions: { 'rootPId': '-1', showIcon: true, props: { children: 'children', label: 'linkName' }},
      toolbars: false,
      defaultForm: {},
      actions: [
        { key: 'send', icon: 'ibps-icon-send', label: '发送', hidden: () => { return this.readonly } },
        { key: 'save', icon: 'ibps-icon-save', label: '存为草稿', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    nodeType() {
      return this.type
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
    // this.loadTreeData()
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'send':
          this.handleSave('outbox')
          break
        case 'save':
          this.handleSave('drafts')
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 发送信息
    handleSave(types) {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (this.form.title === '') {
            this.$confirm('你得邮件尚未填写主题，确定继续发送嘛?', '确认', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.save(types)
            }).catch(() => {})
          } else {
            this.save(types)
          }
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    save(types) {
      const data = JSON.parse(JSON.stringify(this.form))
      data.receiverNames = data.receiverNames.join(',')
      data.ccNames = data.ccNames.join(',')
      data.bccNames = data.bccNames.join(',')
      data.receiverAddresses = data.receiverNames
      data.ccAddresses = data.ccNames
      data.bccAddresses = data.bccNames
      data.types = SVGUnitTypes
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          }
        })
      })
    },
    // 联系人树
    loadTreeData(id) {
      getLinkManTreeData({ userId: this.id }).then(response => {
        const data = JSON.parse(JSON.stringify(response.data))
        this.options = response.data['dataResult']
        data['dataResult'].unshift({
          id: 0,
          linkName: '最近联系人',
          parentId: null
        })
        this.treeData = data['dataResult']
        console.log(this.treeData)
      })
    },
    // 添加/删除---抄送/密送
    addCcNames() {
      this.ccNames = !this.ccNames
      if (this.ccNames) {
        this.addCc = '删除抄送'
        this.form.ccNames = []
      } else {
        this.addCc = '添加抄送'
      }
    },
    addBccNames() {
      this.bccNames = !this.bccNames
      if (this.bccNames) {
        this.addBcc = '删除密送'
        this.form.bccNames = []
      } else {
        this.addBcc = '添加密送'
      }
    },
    selectCleart() {
      this.linkManData = []
    },
    selectReceiver(vId) {
      this.linkManData = vId
    },
    selectCcNames(vId) {
      if (this.focus === 'receiverNames') return
      if (this.focus === 'bccNames') return
      this.linkManData = vId
    },
    selectBccNames(vId) {
      if (this.focus === 'receiverNames') return
      if (this.focus === 'ccNames') return
      this.linkManData = vId
    },
    isProp(value) {
      if (value === 'receiverNames') {
        this.focus = 'receiverNames'
        this.linkManData = this.form.receiverNames
      }
      if (value === 'ccNames') {
        this.focus = 'ccNames'
        this.linkManData = this.form.ccNames
      }
      if (value === 'bccNames') {
        this.focus = 'bccNames'
        this.linkManData = this.form.bccNames
      }
    },
    handleNodeClick(data) {
      if (data.id === 0 || data.id === '0') {
        return []
      }
      this.linkManData.push(data.id)
      this.arr = [this.linkManData[0]]
      for (let i = 1; i < this.linkManData.length; i++) {
        if (this.arr.indexOf(this.linkManData[i]) === -1) {
          this.arr.push(this.linkManData[i])
        }
      }
      switch (this.focus) {
        case 'receiverNames':
          this.form.receiverNames = this.arr
          break
        case 'ccNames':
          this.form.ccNames = this.arr
          break
        case 'bccNames':
          this.form.bccNames = this.arr
          break
        default:
          break
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    getFormData() {
      this.loadTreeData(this.formId)
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.ccNames = false
        this.fileIds = true
        this.bccNames = false
        this.linkManData = []
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        outMailId: this.formId
      }).then(response => {
        const data = response.data
        data.receiverNames = data.receiverNames.split(';')
        data.ccNames = data.ccNames.split(';')
        data.bccNames = data.bccNames.split(';')
        this.form = data
        this.linkManData = data.receiverNames
        if (this.$utils.isEmpty(this.form.fileIds) && this.readonly) {
          this.fileIds = false
        } else {
          this.fileIds = true
        }
        if (this.$utils.isEmpty(this.form.ccNames)) {
          this.ccNames = false
          this.addCc = '添加抄送'
        } else {
          this.ccNames = true
          this.addCc = '删除抄送'
        }
        if (this.$utils.isEmpty(this.form.bccNames)) {
          this.bccNames = false
          this.addBcc = '添加密送'
        } else {
          this.bccNames = true
          this.addBcc = '删除密送'
        }
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.addCc = '添加抄送'
      this.addBcc = '添加密送'
      this.focus = 'receiverNames'
      this.$emit('close', false)
      this.$refs['fileAttach'] ? this.$refs['fileAttach'].clear() : null
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss">
.outMail-form{
  padding-top: 10px;
  .addCcNames,
  .addBccNames{
    color: #337ab7;
    cursor: pointer;
  }
  .edui-editor-iframeholder{
    height: 190px!important;
  }
  .outMail-form-linkManTree{
    .linkManTree{
      width: 100% !important;
      .ibps-tree-main{
        border:1px solid #d4d4d4;
        border-top:0px;
        border-left:0px;
        border-right:0px;
      }
      .ibps-tree-wrapper{
        border: 1px solid #d4d4d4;
      }
    }

  }
}
</style>
