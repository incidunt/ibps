<template>
  <div :style="{ width:`${width}px`}">
    <el-tabs v-model="activeName" type="border-card" class="formbuilder-tab-container" @tab-click="clickTab">
      <el-tab-pane :style="{ width:`${width}px`}" label="字段配置" class="field-config" name="field-config">
        <template v-if="hasField">
          <component
            :is="fieldType"
            :field-item="curField"
            :bo-data="boData"
            :fields="formFields"
            size="mini"
            label-position="right"
            label-width="90px"
            @update="updateField"
            @select="updateSelectField"
          />
        </template>
        <p v-else class="empty-field" data-content="请选择或拖入控件" />
      </el-tab-pane>
      <el-tab-pane :style="{ width:`${width}px`}" label="表单属性" class="form-property" name="form-property">
        <form-property
          :data="data"
          :bo-data="boData"
          @update="updateFormDef"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue'
import _camelCase from 'lodash.camelcase'
import _upperFirst from 'lodash.upperfirst'
import _kebabCase from 'lodash.kebabcase'

import FieldTypes from './field-types'
import FormProperty from './propertys'

Vue.component('HelpTip', () => import('./components/help-tip.vue'))

export default {
  name: 'right-aside',
  components: Object.assign(FieldTypes, {
    FormProperty
  }),
  props: {
    data: Object,
    select: Object,
    asideActiveName: String,
    boData: {
      type: Array
    }
  },
  data() {
    return {
      width: 350,
      curField: null,
      activeName: 'form-property'
    }
  },
  computed: {
    fieldType() {
      const name = _kebabCase(this.curField.field_type)
      return `ibps-field-${name}`
    },
    hasField() {
      if (!this.curField) {
        return false
      }
      const componentName = _upperFirst(_camelCase(this.fieldType))
      return !!this.$options.components[componentName]
    },
    formFields() {
      return this.data.fields || []
    }
  },
  watch: {
    select(val) {
      this.curField = val
    },
    asideActiveName: {
      handler: function(val, oldVal) {
        this.activeName = this.asideActiveName
      },
      immediate: true
    },
    activeName(val, oldVal) {
      this.$emit('active-name', val)
    }
  },
  methods: {
    clickTab(tab) {
      if (tab.name === 'field-config') {
        if (!this.hasField && this.data.fields && this.data.fields.length > 0) {
          this.updateSelectField(this.data.fields[0])
        }
      }
    },
    updateFormDef(data) {
      this.$emit('update-form-def', data)
    },
    updateField(field) {
      this.updateSelectField(field)
    },
    updateSelectField(field) {
      this.$emit('update:select', field)
    }
  }

}
</script>
<style scoped>
  .empty-field {
      position: relative;
      opacity: 0.5;
      box-shadow: none;
      height: 100%;
    }

  .empty-field:after {
    content: attr(data-content);
    position: absolute;
    text-align: center;
    top: 40%;
    left: 0;
    width: 100%;
    font-size: 18px;
  }
</style>

