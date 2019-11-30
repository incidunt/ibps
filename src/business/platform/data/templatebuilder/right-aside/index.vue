<template>
  <div :style="{ width:`${width}px`}">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :style="{ width:`${width}px`}" label="模版配置" class="template-config" name="template-config">
        <component
          :is="temlateType"
          v-if="dataTemplate"
          :template="template"
          @update="updateTemplate"
        />
      </el-tab-pane>
      <el-tab-pane v-if="isDialog" :style="{ width:`${width}px`}" label="对话框配置" class="dialog-config" name="dialog-config">
        <template-dialog
          :data="dialogs"
          @update="updateDialogs"
        />

      </el-tab-pane>
      <el-tab-pane :style="{ width:`${width}px`}" label="模版属性" class="template-property" name="template-property">
        <template-property
          ref="templateProperty"
          :data="dataTemplate"
          @update="updateData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import TemplateProperty from './propertys'
import TemplateDialog from './dialog'
import TemplateSetting from './settings'

export default {
  components: Object.assign(TemplateSetting, {
    TemplateProperty,
    TemplateDialog
  }),
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      width: 350,
      activeName: 'template-property',
      dataTemplate: {}
    }
  },
  computed: {
    temlateType() {
      if (!this.dataTemplate) {
        return
      }
      let key = ''
      if (this.dataTemplate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemplate.showType === 'compose') {
          key = 'compose'
        } else {
          key = this.dataTemplate.showType
        }
      }
      if (this.$utils.isEmpty(key)) {
        return
      }
      return 'ibps-template-setting-' + key
    },
    template() {
      const templates = this.dataTemplate.templates || []
      if (this.dataTemplate.showType === 'compose') {
        return templates
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    },
    dialogs() {
      return this.dataTemplate.dialogs || {}
    },
    isDialog() {
      return this.dataTemplate.type === 'dialog'
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.dataTemplate = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateData(data) {
      this.$emit('update', data)
    },
    updateTemplate(data) {
      const dataTemplate = JSON.parse(JSON.stringify(this.dataTemplate))
      if (this.dataTemplate.showType === 'compose') {
        dataTemplate.templates = data
      } else {
        dataTemplate.templates = [data]
      }

      this.$emit('update', dataTemplate)
    },
    updateDialogs(data) {
      const dataTemplate = JSON.parse(JSON.stringify(this.dataTemplate))
      dataTemplate.dialogs = data
      this.$emit('update', dataTemplate)
    },
    validate(callback) {
      this.$refs.templateProperty.validate(callback)
    }
  }
}
</script>

