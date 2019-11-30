<template>
  <el-form
    ref="form"
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    :label-width="formLabelWidth"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="主题:">
          <span>{{ form.subject }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间:">
          <span>{{ form.createTime }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发送人:">
          <span>{{ form.ownerName }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="消息类型:">
          <el-tag :type="form.messageType|optionsFilter(typeOptions,'type')">{{ form.messageType|optionsFilter(typeOptions,'label') }}</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否公告:">
          <el-tag :type="form.isPublic|optionsFilter(publicOrCanreplyOptions,'type')">{{ form.isPublic|optionsFilter(publicOrCanreplyOptions,'label') }}</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否可回复:">
          <el-tag :type="form.canreply|optionsFilter(publicOrCanreplyOptions,'type')">{{ form.canreply|optionsFilter(publicOrCanreplyOptions,'label') }}</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="消息内容:">
          <span v-html="form.content" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件:">
          <ibps-attachment-selector
            v-model="form.fileMsg"
            :download="readonly"
            :readonly="readonly"
            multiple
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item class="list">
          <el-tabs v-model="activeName" class="detail" @tab-click="handleClick">
            <el-tab-pane label="已回复信息列表" name="replied" style="height:300px;">
              <reply-list :id="formId" ref="replyList" />
            </el-tab-pane>
            <el-tab-pane label="已读取人员列表" name="readed" style="height:300px;">
              <readed-list :id="formId" ref="readedList" />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { get } from '@/api/platform/message/innerMessage'
import { typeOptions, publicOrCanreplyOptions } from '../constants'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import ReadedList from './readed-list'
import ReplyList from './reply-list'
import fecha from '@/utils/fecha'
export default {
  components: {
    ReadedList,
    IbpsAttachmentSelector,
    ReplyList
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
    title: String
  },
  data() {
    return {
      activeName: 'replied',
      formLabelWidth: '120px',
      typeOptions: typeOptions,
      publicOrCanreplyOptions: publicOrCanreplyOptions,
      loading: false,
      form: {},
      fileSrc: '',
      fileTitle: ''
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  methods: {
    handleClick(tab, event) {
      this.$refs['readedList'].loadData()
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.activeName = 'replied'
      this.form = ''
      this.loading = true
      get({
        innerMessageId: this.formId
      }).then(response => {
        this.form = response.data
        this.form.createTime = fecha.format(response.data.createTime, 'yyyy-MM-dd HH:mm:ss')
        this.$refs['replyList'].loadData()
        this.$refs['readedList'].loadData()
        this.fileSrc = this.form.fileMsg.src
        this.fileTitle = this.form.fileMsg.title
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }

}
</script>
<style lang="scss">
.inner-dialog{
  .el-dialog__body{
    padding: 20px 20px;
    height:  calc(80vh - 110px) !important;
  }
  .list{
  .el-form-item__content{
    margin-left: 0px!important;
      .el-table--border{
        height: 300px !important;
      }
    }
  }
  .ibps-container-crud__header{
    display: none;
  }
}

</style>
