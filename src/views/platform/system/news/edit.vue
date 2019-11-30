<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="65%"
    top="0"
    class="dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-row>
      <el-col :span="7">
        <div style="padding-left:65px;">
          <img v-if="form.picture" :src="image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" @click="() => { dialogPictureVisible = !readonly }" />
        </div>
        <ibps-uploader
          :visible="dialogPictureVisible"
          :accept="accept"
          @action-event="uploaderPictureAction"
          @close="visible => dialogPictureVisible = visible"
        />
      </el-col>
      <el-col :span="15" style="margin-left:25px;">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
          <el-form-item label="发布选项：" prop="publicItem">
            <el-radio-group v-model="form.publicItem">
              <el-radio label="notices">发布公告</el-radio>
              <el-radio label="important">重要公告,需关注</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="公告分类：" prop="type">
            <ibps-type-select v-model="form.typeId" category-key="NOTICE_TYPE" clearable />
          </el-form-item>
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="发布人：" prop="userId">
            <ibps-employee-selector
              :value="form.userId"
              @callback="handleInput"
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否公共：" prop="isPublic">
                <el-radio-group v-model="form.isPublic" @change="change">
                  <el-radio label="yes">是</el-radio>
                  <el-radio label="no">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="show==='no'" label="是否包含子集" prop="isPublic">
                <el-radio-group v-model="form.isIncludeChild">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="show==='no'" label="发布范围：" prop="depName">
            <ibps-org-selector
              :value="form.depName"
              :multiple="true"
              @input="depNameInput"
              @callback="data => formId = data.id"
            />
          </el-form-item>
          <el-form-item label="作者：" prop="author">
            <el-input v-model="form.author" />
          </el-form-item>
          <el-form-item label="关键字：" prop="key">
            <el-input v-model="form.key" />
          </el-form-item>
          <el-form-item label="发布时间：" prop="publicDate">
            <el-date-picker
              v-model="form.publicDate"
              type="date"
              style="width:100%;"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="失效时间：" prop="loseDate">
            <el-date-picker
              v-model="form.loseDate"
              type="date"
              style="width:100%;"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="附件：" prop="fileAttach">
            <ibps-attachment-selector
              v-model="form.fileAttach"
              accept="*"
              multiple
            />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <ibps-ueditor v-model="form.content" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <ibps-uploader
      :visible="dialogFormVisible"
      @action-event="uploaderAction"
      @close="visible => dialogFormVisible = visible"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { fileUrl } from '@/api/platform/file/attachment'
import { save, get } from '@/api/platform/system/news'
import { typeOptions } from './constants'
import ActionUtils from '@/utils/action'
import { getFile } from '@/utils/avatar'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import IbpsOrgSelector from '@/business/platform/org/org/selector'
import IbpsUploader from '@/business/platform/file/uploader'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'

export default {
  components: {
    IbpsUeditor,
    IbpsTypeSelect,
    IbpsEmployeeSelector,
    IbpsOrgSelector,
    IbpsUploader,
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
    status: String
  },
  data() {
    return {
      accept: '.jpeg,.gif,.png,.jpg', // 规定上传类型
      formName: 'form',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogFormVisible: false, // 弹窗
      dialogPictureVisible: false, // 弹窗
      typeOptions: typeOptions,
      defaultForm: {},
      show: '',
      isPublic: '',
      formsId: this.id,
      form: {
        author: '',
        content: '',
        createBy: '',
        createOrgId: '',
        createTime: '',
        dataStatus: '',
        dbtype: '',
        depId: '',
        depName: '',
        fileAttach: '',
        id: '',
        ip: '',
        isPublic: 'yes',
        isIncludeChild: 'Y',
        key: '',
        loseDate: '',
        name: '',
        picture: '',
        pk: '',
        publicDate: '',
        publicItem: 'notices',
        status: '',
        tenantId: '',
        title: '',
        type: '',
        typeId: '',
        updateBy: '',
        updateTime: '',
        userId: '',
        userName: ''
      },
      rules: {
        title: [{ required: true, message: this.$t('validate.required') }],
        userId: [{ required: true, message: this.$t('validate.required') }],
        publicDate: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save',
          icon: 'ibps-icon-send',
          label: '发布',
          type: 'success',
          hidden: () => {
            return this.readonly
          } },
        { key: 'drafts',
          icon: 'ibps-icon-save',
          label: '存为草稿',
          hidden: () => {
            return this.status === 'drafts'
          } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    image() {
      return getFile(this.form.picture)
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
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
    this.form.userId = this.$store.getters.userId
    this.form.userName = this.$store.getters.name
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'drafts':
          this.handleDrafts()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 选择图片附件区
    /**
     * 上传
     */
    handleUpload() {
      this.dialogFormVisible = true
    },
    uploaderAction(buttonKey, data) {
      this.dialogFormVisible = false
      this.form.fileAttach = data.id
    },
    uploaderPictureAction(buttonKey, data) {
      this.dialogPictureVisible = false
      this.form.picture = fileUrl(data.id || data[0].id)
    },
    beforeAvatarUpload(file) {
      return true
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw)
    },
    // 填写编辑区
    handleInput(data) {
      this.form.userId = data.id
      this.form.userName = data.name
    },
    depNameInput(data) {
      this.form.depName = data
    },
    change(data) {
      this.show = data
    },
    // 发布
    handleSave() {
      this.form.status = 'publish'
      this.rules = {
        title: [{ required: true, message: this.$t('validate.required') }],
        userId: [{ required: true, message: this.$t('validate.required') }],
        publicDate: [{ required: true, message: this.$t('validate.required') }]
      }
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 保存草稿
    handleDrafts() {
      this.form.status = 'drafts'
      this.rules = {}
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 保存数据
    saveData() {
      const data = JSON.parse(JSON.stringify(this.form))
      data.publicDate = new Date(this.form.publicDate).getTime() || ''
      data.loseDate = new Date(this.form.loseDate).getTime() || ''
      // 检测失效日期是否发布日期在之前。
      if (data.publicDate > data.loseDate && data.loseDate !== '') {
        this.$message.closeAll()
        this.$message.error('发布时间与失效时间范围不合法！')
        return
      }
      save(this.form).then(response => {
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
      this.show = ''
      this.$refs[this.formName].resetFields()
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
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        const firstDate = new Date()
        this.form.publicDate = firstDate.setDate(1)
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        newsId: this.formId
      }).then(response => {
        this.form = response.data
        this.show = this.form.isPublic
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
