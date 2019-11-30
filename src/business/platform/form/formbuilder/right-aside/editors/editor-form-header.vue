<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span v-text="getLabel()" />
    </div>
    <div class="panel-body">
      <el-form-item label="字段名">
        <el-input v-model="fieldItem.label" />
      </el-form-item>
      <el-form-item label="描述文字">
        <el-input v-model="fieldOptions.placeholder" type="textarea" />
      </el-form-item>
      <el-form-item label="对齐">
        <el-radio-group v-model="fieldOptions.align ">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="center">居中对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </div>
  </div>

</template>
<script>
import FIELD_TYPES from '../../../constants/fieldTypes'
// import { getDefaultAttributes } from '../../utils/util'
/**
 *  字段基本属性
 */
export default {
  props: {
    fieldItem: {
      type: Object,
      required: true
    }
  },
  computed: {
    fieldTypes() {
      const fieldTypes = []
      for (const type in FIELD_TYPES) {
        const fieldType = FIELD_TYPES[type]
        if (type === 'table') { continue }
        if (this.$utils.isEmpty(fieldType.is_input) || fieldType.is_input === true) {
          fieldTypes.push(fieldType)
        }
      }
      return fieldTypes
    },
    fieldOptions() {
      if (!this.fieldItem.field_options) {
        return {
          default_value_type: 'fixed'
        }
      } else {
        return this.fieldItem.field_options
      }
    }
  },
  methods: {
    getLabel() {
      return FIELD_TYPES[this.fieldItem.type]['label'] || '字段属性'
    },
    /**
     * 改变默认值
     */
    changeDefaultValueType(type) {
      this.fieldOptions.default_value_type = type
      if (this.fieldOptions.value) { this.fieldOptions.value = null }
    }
  }
}
</script>
<style scoped>
.field-type-dropdown.el-dropdown-menu {
  padding: 0;
}
</style>

