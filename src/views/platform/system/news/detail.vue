<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="65%"
    top="5vh"
    class="newDialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div>
      <p class="title">
        <span ref="title">
          {{ form.publicItem|optionsFilter(publicItemOptions,'label') }}
        </span>：<label>{{ form.title }}</label>
      </p>
      <p>发布人：{{ form.userName }}  &nbsp;&nbsp;作者：{{ form.author }}</p>
      <p>有效时间：{{ form.publicDate }} 至 {{ form.loseDate }}</p>
      <p>是否公共：{{ form.isPublic|optionsFilter(isPublicOptions,'label') }} &nbsp;&nbsp; 发布状态：{{ form.status|optionsFilter(typeOptions,'label') }}</p>
      <p>查看范围组织：{{ form.depName }} &nbsp;&nbsp; 关键字：<label style="color:red">{{ form.key }}</label></p>
      <img :src="image" class="avatar">
      <p>附件：</p>
      <ibps-attachment-selector
        ref="fileAttach"
        :value="form.fileAttach"
        readonly
        allow-download
        :download="readonly"
        style="margin:5px;"
        @callback="data => formId = data.id"
      />
      <ibps-ueditor v-model="form.content" :readonly="true" />
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import { get } from '@/api/platform/system/news'
import { typeOptions, publicItemOptions, isPublicOptions } from './constants'
import { getFile } from '@/utils/avatar'
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
    title: String
  },
  data() {
    return {
      formName: 'form',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogFormVisible: false, // 弹窗
      typeOptions: typeOptions,
      publicItemOptions: publicItemOptions,
      isPublicOptions: isPublicOptions,
      form: {},
      toolbars: [
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
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    titleStyle(color) {
      this.$refs.title.style.color = color
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        newsId: this.formId
      }).then(response => {
        this.form = response.data
        if (response.data.publicItem === 'important') {
          this.titleStyle('red')
        } else {
          this.titleStyle('black')
        }
        console.log(this.form)
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.newDialog{
  .title{
    font-size: 18px;
    margin: 0;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-dialog__body{
    height:  calc(80vh - 110px) !important;
  }
  #edui1_iframeholder{
    height:380px !important;
  }
}
</style>
