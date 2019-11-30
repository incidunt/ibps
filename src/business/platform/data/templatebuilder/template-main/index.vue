<template>
  <div class="template-main">
    <el-header :height="'40px'" class="layout-header">
      <div class="layout-header-title">
        模版设计
      </div>
      <div class="layout-tools">
        <el-button type="info" size="mini" icon="el-icon-view" @click="previewTemplate()">预览</el-button>
        <el-button type="primary" size="mini" icon="ibps-icon-save" @click="saveTemplate()">保存</el-button>
        <el-button v-if="$utils.isNotEmpty(dataTemplate.id)" type="primary" size="mini" icon="ibps-icon-telegram" @click="addMenu()">添加为菜单</el-button>
        <!-- <el-button type="primary" size="mini" icon="ibps-icon-question-circle-o" @click.prevent.stop="guide()">介绍</el-button> -->
        <el-button size="mini" icon="ibps-icon-close" @click="closeDialog()">关闭</el-button>
      </div>
    </el-header>
    <!--标题-->
    <div :class="{selected:selected}" class="template-header">
      <div class="title">{{ dataTemplate.name||'未设置模版标题' }}</div>
    </div>
    <component
      :is="temlateType"
      v-if="template"
      :template="template"
    />
    <!--数据模版预览-动态参数-->
    <dynamic-params-preview
      :visible="dynamicParamsDialogVisible"
      :conditions="conditions"
      @close="visible => dynamicParamsDialogVisible = visible"
      @callback="handleDynamicParams"
    />
    <!--数据模版预览-->
    <data-template-render-preview
      :visible="templateRendererDialogVisible"
      :data="dataTemplate"
      :dynamic-params="dynamicParams"
      :label-key="labelKey"
      :multiple="multiple"
      :value="multiple?{}:[]"
      @close="visible => templateRendererDialogVisible = visible"
      @action-event="handleTemplaterenderActionEvent"
    />
    <!--数据模版预览数据-->
    <data-template-render-preview-data
      :visible="previewDialogVisible"
      :data="formData"
      @close="visible => previewDialogVisible = visible"
    />

    <!-- 添加菜单 -->
    <add-menu
      :edit-id="dataTemplate.id"
      :visible="addMenuDialogVisible"
      @close="visible => addMenuDialogVisible = visible"
    />
  </div>
</template>
<script>
import { getDynamicParamsConditions, buildLabelTitle } from '@/business/platform/data/templaterender/utils'
import DataTemlate from './templates'

import DynamicParamsPreview from '@/business/platform/data/templaterender/preview/dynamic-params'
import DataTemplateRenderPreview from '@/business/platform/data/templaterender/preview'
import DataTemplateRenderPreviewData from '@/business/platform/data/templaterender/preview/preview-data'

import AddMenu from '@/business/platform/auth/resources/add-menu'

export default {
  components: Object.assign({
    DynamicParamsPreview,
    DataTemplateRenderPreview,
    DataTemplateRenderPreviewData,
    AddMenu
  }, DataTemlate),
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      templateRendererDialogVisible: false,
      dynamicParamsDialogVisible: false,
      previewDialogVisible: false,
      addMenuDialogVisible: false,
      selected: false,
      formData: {},
      multiple: true,
      conditions: {},
      dynamicParams: {}
    }
  },
  computed: {
    dataTemplate() {
      return this.data ? this.data : {}
    },
    temlateType() {
      if (!this.dataTemplate) {
        return
      }
      let key = ''
      if (this.dataTemplate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemplate.showType === 'compose') {
          key = this.dataTemplate.composeType
        } else {
          key = this.dataTemplate.showType
        }
      }
      if (this.$utils.isEmpty(key)) { return }
      return 'ibps-data-template-fake-' + key
    },
    template() {
      if (!this.dataTemplate) {
        return
      }
      const templates = this.dataTemplate.templates || []
      if (this.dataTemplate.showType === 'compose') {
        return templates
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    },
    labelKey() {
      return buildLabelTitle(this.dataTemplate)
    }

  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
      },
      immediate: true
    }
  },
  methods: {

    closeDialog() {
      this.$emit('close')
    },
    saveTemplate() {
      this.$emit('save')
    },
    addMenu() {
      this.addMenuDialogVisible = true
    },
    previewTemplate() {
      // 判断是否有 动态参数
      const conditions = getDynamicParamsConditions(this.dataTemplate)

      if (this.dataTemplate.type === 'dialog') {
        const dialogs = this.dataTemplate.dialogs
        this.multiple = dialogs && dialogs.attrs ? dialogs.attrs.multi !== 'N' : true
      } else {
        this.multiple = true
      }
      if (this.$utils.isEmpty(conditions)) {
        this.templateRendererDialogVisible = true
      } else {
        this.conditions = conditions
        this.dynamicParamsDialogVisible = true
      }
    },

    handleDynamicParams(data) {
      this.dynamicParams = data
      this.templateRendererDialogVisible = true
    },
    handleTemplaterenderActionEvent(key, data) {
      switch (key) {
        case 'cancel':
          this.templateRendererDialogVisible = false
          break
        case 'clean':
          break
        default:
          this.formData = data
          this.previewDialogVisible = true
          break
      }
    }
  }
}
</script>

