<template>
  <div class="formbuilder-container">
    <ibps-layout ref="layout">
      <div slot="west">
        <left-aside
          :bo-data="boData"
        />
      </div>
      <div class="form-main">
        <el-header :height="'40px'" class="layout-header form-actions">
          <div class="layout-header-title">
            表单设计
          </div>
          <div class="layout-tools ">
            <el-button type="primary" size="mini" icon="ibps-icon-save" @click="handleSaveForm()">保存表单</el-button>
            <el-button type="info" size="mini" icon="el-icon-view" @click="handlePreviewForm()">预览</el-button>
            <!-- <el-button type="primary" size="mini" icon="ibps-icon-question-circle-o" @click.prevent.stop="guide()">介绍</el-button> -->
            <el-button size="mini" icon="ibps-icon-close" @click="closeDialog()">关闭</el-button>
          </div>
        </el-header>
        <widget-form
          ref="widgetForm"
          :data="widgetForm"
          :select.sync="widgetFormSelect"
        />

      </div>
      <div slot="east">
        <right-aside
          :data="widgetForm"
          :select.sync="widgetFormSelect"
          :aside-active-name="asideActiveName"
          :bo-data="boData"
          @active-name="name=> asideActiveName = name"
          @update-form-def="updateFormDef"
        />
      </div>
    </ibps-layout>

    <formrender-preview
      :visible="formrenderDialogVisible"
      :data="widgetFormData"
      @close="visible => formrenderDialogVisible = visible"
    />
  </div>
</template>
<script>
import { save } from '@/api/platform/form/formDef'
import ActionUtils from '@/utils/action'
// import { testKey } from '@/utils/validate'
import FormOptions from '@/business/platform/form/constants/formOptions'
import FieldTypes from '@/business/platform/form/constants/fieldTypes'

import LeftAside from './left-aside'
import RightAside from './right-aside'
import WidgetForm from './form-main/widget-form'
import FormrenderPreview from '@/business/platform/form/formrender/preview/index.vue'

export default {
  name: 'formbuilder',
  components: {
    LeftAside,
    RightAside,
    WidgetForm,
    FormrenderPreview
  },
  props: {
    data: {
      type: Object
    },
    bo: {
      type: Array
    }
  },
  data() {
    return {
      widgetForm: {},
      boData: [],
      asideActiveName: 'form-property',
      widgetFormSelect: null,
      formrenderDialogVisible: false,
      widgetFormData: {},
      bindField: {},
      bindFlowField: {}
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        // console.log(this.$refs.widgetForm)
      }
    },
    widgetFormSelect: {
      deep: true,
      handler: function(val) {
        this.selectField(val)
      }
    },
    data: {
      handler: function(val, oldVal) {
        this.widgetForm = JSON.parse(JSON.stringify(val))
      },
      immediate: true,
      deep: true
    },
    bo: {
      handler: function(val, oldVal) {
        this.boData = val
      },
      deep: true
    }
  },
  methods: {
    // 选择字段
    selectField(field) {
      if (field) {
        this.asideActiveName = 'field-config'
        this.widgetFormSelect = field
      } else {
        this.asideActiveName = 'form-property'
      }
    },
    /**
     * 更新当前表单定义
     */
    updateFormDef(data) {
      this.widgetForm = data
    },
    /**
     * 关闭窗口
     */
    closeDialog() {
      this.$emit('close', false)
    },
    validateForm(callback, checkAll = true) {
      if (checkAll) {
        if (this.$utils.isEmpty(this.widgetForm.name)) {
          this.asideActiveName = 'form-property'
          callback(false, '请设置表单标题')
          return
        }

        if (this.$utils.isEmpty(this.widgetForm.key)) {
          this.asideActiveName = 'form-property'
          callback(false, '请设置表单Key')
          return
        }
        if (this.widgetForm.mode === 'bo' &&
            this.$utils.isEmpty(this.widgetForm.code)) {
          callback(false, '未绑定业务对象，请检查数据是否正确')
          return
        }
      }

      if (this.widgetForm.fields.length <= 0) {
        callback(false, '请从左侧拖拽字段')
        return
      }

      this.checkFields(callback)
    },
    checkFields(callback) {
      const fields = this.widgetForm.fields
      this.bindField = {}
      this.bindFlowField = {}
      const code = this.widgetForm.code
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        // 判断是否是字段
        if (field.field_type === 'grid' || field.field_type === 'tabs') { // 栅格布局
          const columns = field.field_options.columns
          for (let j = 0; j < columns.length; j++) {
            const column = columns[j]
            for (let k = 0; k < column.fields.length; k++) {
              const item = column.fields[k]
              const msg = this.checkField(item)
              if (msg) {
                this.selectField(item, code)
                callback(false, msg)
                return
              }
            }
          }
        } else if (field.field_type === 'table') { // 子表单
          const msg = this.checkField(field)
          if (msg) {
            this.selectField(field, code)
            callback(false, msg)
            return
          }
          const columns = field.field_options.columns
          if (this.$utils.isNotEmpty(columns)) {
            for (let j = 0; j < columns.length; j++) {
              const column = columns[j]
              const msg = this.checkField(column, field.name)
              if (msg) {
                this.selectField(column, field.name)
                callback(false, msg)
                return
              }
            }
          }
        } else {
          const msg = this.checkField(field, code)
          if (msg) {
            this.selectField(field)
            callback(false, msg)
            return
          }
        }
      }
      callback(true)
    },
    /**
     * 检查字段
     */
    checkField(field, code) {
      // 只读字段不需要绑定
      const name = field.name
      const fieldType = field.field_type
      if (fieldType === 'flow_diagram' || fieldType === 'approval_history') {
        if (this.$utils.isNotEmpty(this.bindFlowField[fieldType])) {
          const label = FieldTypes[fieldType].label
          return `一个表单只能存在一个${label},请删除一个`
        }
        this.bindFlowField[fieldType] = field
      }
      if (FormOptions.t.NON_INPUT_FIELD_TYPES.includes(fieldType)) {
        return
      }

      if (this.$utils.isEmpty(name)) {
        return '请绑定字段'
      }
      // 检查是否重复绑定
      const key = code + '.' + name
      if (this.$utils.isNotEmpty(this.bindField[key])) {
        const label = this.bindField[key].label
        return `重复绑定字段，请检查[${label}]和[${field.label}]`
      }
      this.bindField[key] = field

      // 不能为空的判断，选项重复
      if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        if (field.field_options.datasource === 'custom') {
          const options = field.field_options.options
          if (options.length === 0) {
            return `请至少添加一个选项`
          }
          // 重复选项
          const optionKey = {}
          for (let i = 0; i < options.length; i++) {
            const option = options[i]
            const optionVal = option.val
            if (this.$utils.isEmpty(optionVal)) {
              return `有选项值为空`
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(optionVal)) {
              return '选项Key含有非法字符'
            }

            if (optionKey[optionVal]) {
              return `重复的选项值`
            }
            optionKey[optionVal] = true
          }
        }
      }

      // 必填参数
      if (fieldType === 'dictionary') {
        if (this.$utils.isEmpty(field.field_options.dictionary)) {
          return '请绑定数据字典'
        }
      }
      if (fieldType === 'autoNumber') {
        if (this.$utils.isEmpty(field.field_options.identity)) {
          return '请绑定流水号'
        }
      }

      if (fieldType === 'customDialog') {
        if (this.$utils.isEmpty(field.field_options.dialog)) {
          return '请选择自定义对话框'
        }
      }
      if (fieldType === 'linkdata') {
        if (this.$utils.isEmpty(field.field_options.linkdata)) {
          return '请绑定关联数据'
        }
      }

      // bindFlowField

      return
    },
    /**
     * 保存表单
     */
    handleSaveForm() {
      this.validateForm((valid, errorMsg) => {
        if (!valid) {
          if (errorMsg) {
            ActionUtils.warning(errorMsg)
          }
          return
        }
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        save({
          data: JSON.stringify(this.widgetForm)
        }).then(response => {
          loading.close()
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (rtn) {
              this.closeDialog()
            } else {
              if (this.$utils.isEmpty(this.widgetForm.id)) {
                this.widgetForm.id = response.variables.id
              }
            }
          })
        }).catch((err) => {
          loading.close()
          console.info(err)
        })
      })
    },
    /**
     * 预览表单
     */
    handlePreviewForm() {
      this.validateForm((valid, errorMsg) => {
        if (!valid) {
          if (errorMsg) {
            ActionUtils.warning(errorMsg)
          }
          return
        }
        this.previewForm()
      }, false)
    },
    previewForm() {
      this.widgetFormData = JSON.parse(JSON.stringify(this.widgetForm))
      console.log('FormData', this.widgetFormData)
      this.formrenderDialogVisible = true
    },
    /**
     * 预览表单回调事件
     */
    handlePreviewActionEvent(command, { formData }) {
      switch (command) {
        case 'close':
          this.formrenderDialogVisible = false
          break
        case 'preview':
          this.formPreviewDialogVisible = true
          this.formData = formData
          break
      }
    }
  }
}
</script>
<style lang="scss">
.formbuilder-container {
  overflow: hidden;
  height: 100%;
  .el-aside{
    overflow: hidden;
  }
  .formbuilder-tab-container{
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content,
    .el-tabs--border-card > .el-tabs__content{
      position: absolute;
      padding: 0;
      height: calc(100% - 45px);
    }
    .el-tab-pane {
      overflow:auto;
      height: 100%;
      width: 100%;
      border-left: 1px solid #E4E7ED;
      border-right: 1px solid #E4E7ED;
    }
  }

  .panel-heading {
    padding: 10px 10px 10px;
    font-weight: bold;
  }

  $primary-color: #409EFF;
  $primary-background-color: #ecf5ff;
  //==============字段列表============
  .field-type-container{
    width: 100%;
    height: 100%;
    .panel-body{
      padding: 10px 0 0 0;
    }
    ul{
      position: relative;
      overflow: hidden;
      padding: 0 5px 10px;
      margin: 0;
    }

    .form-edit-widget-label{
      font-size: 12px;
      display: block;
      width: 45%;
      line-height: 26px;
      position: relative;
      float: left;
      left: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 1%;
      color: #333;
      border: 1px solid #F4F6FC;

      &:hover{
        color: $primary-color;
        border: 1px dashed $primary-color;
      }

      &>a{
        display: block;
        cursor: move;
        background: #F4F6FC;
        border: 1px solid #F4F6FC;

        .ibps-icon{
          margin-right: 6px;
          margin-left: 8px;
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
        }

        span{
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  .fr-signature-outer {
      border: 1px solid #bbb;
      .fr-signature-header {
        font-size: 12px;
        cursor: pointer;
        border-bottom: 1px dotted #ccc;
        height: 32px;
        background-color: #f6f6f6;
        .fr-signature-label {
          float: left;
          padding: 0 7px 5px 7px;
        }
        .fr-signature-toolbar {
          text-align: right;
          float: right;
          padding: 0 7px 5px 7px;
          a{
            text-decoration: none;
            cursor: pointer;
            color: #409eff;
          }
        }

      }
      .fr-signature-div{
        height: 100px;
      }
    }

.form-main {
  padding: 0;

  //==============顶部布局按钮============
  .layout-header {
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-weight: bold;
    text-align: center;
    padding: 6px;
    position: relative;
    overflow: hidden;
    .layout-header-title {
      font-size: 14px;
      margin: 5px;
      padding: 0;
      text-overflow: ellipsis;
      float: left;
      color: #676a6c;
    }
    .layout-tools {
      float: right;
      margin-top: 0;
      position: relative;
      padding: 0 10px;
      .el-button + .el-button {
        margin-left: 0;
      }
    }
  }

  //==============表单============
  .widget-form-container{
        height: calc(100% - 44px);
      width: calc(100% - 570px);
      position: absolute;
      overflow: auto;
    //==============表头============
      .form-header {
        cursor: pointer;
        border-bottom: 1px solid  #ddd;
        margin-bottom: 5px;
        .title {
          font-size: 16px;
          font-weight: bold;
          color: #222;
          text-align: left;
          padding: 8px 10px 10px;
          margin: 0;
        }
        .desc {
          word-wrap: break-word;
          word-break: normal;
          text-indent: 0;
          line-height: 1.6;
          margin: 0 0 11px;
          padding: 3px 30px 8px;
        }
      }
    //==============字段列表============
    .widget-form-list{
      background: #fff;
      min-height: 500px;

      .widget-col-list{
        min-height: 50px;
        border: 1px dashed #ccc;
        background: #fff;
      }

      .widget-view{
        padding-bottom: 18px;
        position: relative;
        border: 1px dashed rgba(170,170,170,0.7);
        background-color: rgba(236, 245, 255, .3);
        margin: 2px;

        .el-form-item__content{
          position: unset;
        }
        //必填
        &.is_req{
          .el-form-item__label::before{
            content: '*';
            color: #f56c6c;
            margin-right: 4px;
          }
        }

        .widget-view-description{
          height: 15px;
          line-height: 15px;
          font-size:13px;
          margin-top: 6px;
          color:#909399;
        }

        .widget-view-action{
          position: absolute;
          right: 0;
          bottom: 0;
          height: 28px;
          line-height: 28px;
          background: $primary-color;
          z-index: 9999;

          i{
            font-size: 14px;
            color: #fff;
            margin: 0 5px;
            cursor: pointer;

          }
        }

        .widget-view-drag{
          position: absolute;
          left: -2px;
          top: -2px;
          bottom: -18px;
          height: 28px;
          line-height: 28px;
          background: $primary-color;
          z-index: 1000;
          // display: none;

          i{
            font-size: 14px;
            color: #fff;
            margin: 0 5px;
            cursor: move;
          }
        }

        &:after{
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: block;
        }

        &:hover{
          background: $primary-background-color;
          outline: 1px solid $primary-color;
          outline-offset: 0px;

          &.active{
            outline: 2px solid $primary-color;
            border: 1px solid $primary-color;
            outline-offset: 0;
          }

          .widget-view-drag{
            display: block;
          }
        }

        &.active{
          outline: 2px solid $primary-color;
          border: 1px solid $primary-color;
        }

        &.ghost{
          background: #F56C6C;
          border: 2px solid #F56C6C;
          outline-width: 0;
          height: 3px;
          box-sizing: border-box;
          font-size: 0;
          content: '';
          overflow: hidden;
          padding: 0;
        }
      }

      /**子表单**/
      .widget-table{
        padding-bottom: 0;
        padding: 5px;
        background-color: rgba(253,246,236, .3);

        .widget-table-wrapper{
          min-height: 50px;
          background: #fff;
          display: flex;
          justify-content: flex-start;

          .widget-table-row{
            td{
              border-bottom: 0;
            }
          }

          .widget-table-view{
            border: 1px solid #EBEEF5;
            width: 200px;
            float: left;
            height: 98%;
            position: relative;
            display: block;

            .el-table{
              height: 100%;
            }

            &.is_req{
              .el-form-item__label::before{
                content: '*';
                color: #f56c6c;
                margin-right: 4px;
              }
            }

            .widget-view-description{
              height: 15px;
              line-height: 15px;
              font-size:13px;
              margin-top: 6px;
              color:#909399;
            }

            .widget-view-action{
              position: absolute;
              right: 0;
              bottom: 0;
              height: 28px;
              line-height: 28px;
              background: $primary-color;
              z-index: 1000;

              i{
                font-size: 14px;
                color: #fff;
                margin: 0 5px;
                cursor: pointer;

              }
            }

            .widget-view-drag{
              position: absolute;
              left: -2px;
              top: -2px;
              bottom: -18px;
              height: 28px;
              line-height: 28px;
              background: $primary-color;
              z-index: 1000;
              // display: none;

              i{
                font-size: 14px;
                color: #fff;
                margin: 0 5px;
                cursor: move;
              }
            }

            &::after{
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              display: block;
              content: '';
            }

            &::before{
              display: none;
            }

            &:hover{
              background: $primary-background-color;
              outline: 1px solid $primary-color;
              outline-offset: -1px;

              &.active{
                // outline: 1px solid $primary-color;
                border: 1px solid $primary-color;
                outline: 1px solid $primary-color;
                outline-offset: -1px;
              }

              .widget-view-drag{
                display: block;
              }
            }

            &.active{
              outline: 1px solid $primary-color;
              border: 1px solid $primary-color;
              outline-offset: -1px;
            }

            &.ghost{
              background: #F56C6C;
              outline-width: 0;
              width: 5px !important;
              box-sizing: border-box;
              font-size: 0;
              content: '';
              overflow: hidden;
              padding: 0;
              position: relative;
              outline: none !important;
              border: 0 !important;

              &::after{
                background: #F56C6C;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                z-index: 1000;
                content: '';
                outline: none;
              }
            }
          }

          .widget-table-content{
            width:100%;
            // border: 1px dashed #ccc;
            outline: 1px dashed #ccc;
            background: #fff;
            flex:1;
            margin: 0 1px;
            overflow-y: hidden;
            overflow-x: auto;
            &>div{
              height: 100%;
            }

            .widget-table-col{
              height: 100%;

              .ghost{
                background: #F56C6C;
                // border: 2px solid #F56C6C;
                position: relative;
                content: '';
                float: left;
                height: 100%;
                width: 5px !important;
                list-style: none;
                font-size: 0;
                overflow: hidden;
                outline: none;

                &::after{
                  background: #F56C6C;
                  position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  z-index: 1000;
                  content: '';
                  outline: none;
                }
              }
            }
          }
        }

        &.active{
          outline: 2px solid #e6a23c;
          border: 1px solid #e6a23c;
        }

        &:hover{
          background: #fdf6ec;
          outline: 1px solid #e6a23c;
          outline-offset: 0px;

          &.active{
            outline: 2px solid #e6a23c;
            border: 1px solid #e6a23c;
            outline-offset: 0;
          }
        }

        .widget-view-action.widget-table-action{
          background: #e6a23c;
        }

        .widget-view-drag.widget-table-drag{
          background: #e6a23c;
        }

        &::after{
          display: none;
        }

        &.ghost{
          background: #F56C6C;
          outline-width: 0;
          height: 5px;
          box-sizing: border-box;
          font-size: 0;
          content: '';
          overflow: hidden;
          padding: 0;
          position: relative;
          outline: none;
          border: 0;

          &::after{
            background: #F56C6C;
            position: absolute;
            top:0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            display: block;
            z-index: 1000;
          }
        }
      }

      .widget-col{
        padding-bottom: 0;
        padding: 5px;
        // margin-left: 2px !important;
        // margin-right: 2px !important;
        background-color: rgba(253,246,236, .3);

        &.active{
          outline: 2px solid #e6a23c;
          border: 1px solid #e6a23c;
        }

        &:hover{
          background: #fdf6ec;
          outline: 1px solid #e6a23c;
          outline-offset: 0px;

          &.active{
            outline: 2px solid #e6a23c;
            border: 1px solid #e6a23c;
            outline-offset: 0;
          }
        }

        .el-col{
          min-height: 50px;
        }

        &.ghost{
          background: #F56C6C;
          border: 2px solid #F56C6C;
          outline-width: 0;
          height: 3px;
          box-sizing: border-box;
          font-size: 0;
          content: '';
          overflow: hidden;
          padding: 0;
        }

        .widget-view-action.widget-col-action{
          background: #e6a23c;
        }

        .widget-view-drag.widget-col-drag{
          background: #e6a23c;
        }

        &::after{
          display: none;
        }
      }
      //TABS(标签页)
      .widget-tabs{
        padding-bottom: 0;
        padding: 5px;
        // margin-left: 2px !important;
        // margin-right: 2px !important;
        background-color: rgba(253,246,236, .3);

        &.active{
          outline: 2px solid #e6a23c;
          border: 1px solid #e6a23c;
        }

        &:hover{
          background: #fdf6ec;
          outline: 1px solid #e6a23c;
          outline-offset: 0px;

          &.active{
            outline: 2px solid #e6a23c;
            border: 1px solid #e6a23c;
            outline-offset: 0;
          }
        }

        // .el-tabs__content{
        //   min-height: 50px;
        // }

        &.ghost{
          background: #F56C6C;
          border: 2px solid #F56C6C;
          outline-width: 0;
          height: 3px;
          box-sizing: border-box;
          font-size: 0;
          content: '';
          overflow: hidden;
          padding: 0;
        }

        .widget-view-action.widget-tabs-action{
          background: #e6a23c;
        }

        .widget-view-drag.widget-tabs-drag{
          background: #e6a23c;
        }

        &::after{
          display: none;
        }
      }

      .ghost{
        background: #F56C6C;
        border: 2px solid #F56C6C;
        outline-width: 0;
        height: 3px;
        box-sizing: border-box;
        font-size: 0;
        content: '';
        overflow: hidden;
        padding: 0;
      }
    }

    .ghost{
      background: #F56C6C;
      border: 2px solid #F56C6C;
      position: relative;

      &::after{
        background: #F56C6C;
      }
    }

    li.ghost{
      height: 5px;
      list-style: none;
      font-size: 0;
      overflow: hidden;
    }

    .widget-grid{
      background: #F4F6FC;
      position: relative;
      border-left: 5px solid transparent;
      padding: 5px;
      margin: 0 !important;

      &.active{
        border-left: 5px solid $primary-color;
        background: #b3d8ff;
      }
    }

    .widget-grid-container{
      &.ghost{
        background: #F56C6C;
        border: 2px solid #F56C6C;
        outline-width: 0;
        height: 3px;
        box-sizing: border-box;
        font-size: 0;
        content: '';
        overflow: hidden;
        padding: 0;
      }
    }

    .ghost{
      background: #F56C6C;
      border: 2px solid #F56C6C;
      position: relative;

      &::after{
        background: #F56C6C;
      }
    }

    li.ghost{
      height: 5px;
      list-style: none;
      font-size: 0;
      overflow: hidden;
    }
  }

  .ghost{
    background: #fff;
    border: 1px dashed $primary-color;

    &::after{
      background: #fff;
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  ul{
    margin: 0;
    padding: 0;
  }

  li.ghost{
    list-style: none;
    font-size: 0;
    display: block;
    position: relative;
  }
}

.viewer-container{
  z-index: 99999 !important;
}

.form-empty{
  position: absolute;
  text-align: center;
  font-size: 20px;
  top: 200px;
  left: 50%;
  margin-left: -150px;
  color: #ccc;
}

}
</style>

