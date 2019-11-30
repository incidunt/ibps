<template>
  <el-form
    ref="form"
    :model="formData"
    :inline="inline"
    :label-width="labelWidth ? (labelWidth + 'px') : ''"
    @keyup.enter.native="handleEnter"
  >
    <el-form-item
      v-for="(form, index) in forms"
      :key="index"
      :prop="form.prop"
      :label="form.label"
      :rules="form.rules || []"
      :label-width="form.labelWidth ? (form.labelWidth + 'px') : ''"
      class="attr-form"
    >
      <!-- 文本框-->
      <el-input
        v-if="form.fieldType === 'STRING' || form.fieldType === 'INT' || form.fieldType === 'DOUBLE' || form.fieldType === undefined"
        v-model="formData[form.modelValue]"
        :size="form.size ? form.size : size"
        :readonly="form.readonly"
        :disabled="disabled"
        :placeholder="form.placeholder"
        :clearable="form.clearable||true"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
      />
      <el-switch
        v-else-if="form.fieldType === 'BOOLEAN'"
        v-model="formData[form.modelValue]"
        :size="form.size ? form.size : size"
        :disabled="disabled"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        active-value="Y"
        inactive-value="N"
      />
      <!--选项 option-->
      <el-select
        v-else-if="form.fieldType === 'OPTION'"
        v-model="formData[form.modelValue]"
        :size="form.size ? form.size : size"
        :disabled="disabled"
        :placeholder="form.placeholder"
        :clearable="form.clearable||true"
        :multiple="form.multiple||false"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex"
          :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
          :label="(typeof option === 'object') ? option[form.labelKey || 'groupName'] : option"
        />
      </el-select>
      <!-- 日期-->
      <el-date-picker
        v-else-if="form.fieldType === 'DATE'"
        v-model="formData[form.modelValue]"
        :placeholder="form.placeholder"
        :size="form.size ? form.size : size"
        :disabled="disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :clearable="form.clearable||true"
        :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
        :picker-options="form.pickerOptions || {}"
        :value-format="form.valueFormat||'yyyy-MM-dd'"
        type="date"
      />
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    // 尺寸
    size: {
      type: String
    },
    // 是否在一行
    inline: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: Number,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    },
    itemWidth: [Number, String],
    forms: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const { forms, fuzzy } = this.$props
    const formData = {}
    const format = {}
    const fuzzyOps = {}
    const defaultFormData = {}

    forms.forEach((v, i) => {
      const propType = typeof v.prop

      if (propType === 'string') {
        v.modelValue = v.prop
        formData[v.prop] = this.data[v.prop] || (v.fieldType === 'OPTION' && v.multiple ? [] : null)
        fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy
        if (v.format) {
          format[v.prop] = v.format
        }
        defaultFormData[v.prop] = (v.fieldType === 'OPTION' && v.multiple ? [] : null)
      } else if (propType === 'object' && Object.prototype.toString.call(v.prop) === '[object Array]') {
        v.prop.forEach(vv => {
          formData[vv] = this.data[vv.prop] || (v.fieldType === 'OPTION' && v.multiple ? [] : null)
          defaultFormData[vv] = (v.fieldType === 'OPTION' && v.multiple ? [] : null)
          fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy
          if (v.format) {
            format[vv] = v.format
          }
        })
      }
    })
    return {
      formData,
      defaultFormData
    }
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this
      if (typeof itemWidth === 'number') {
        return `width: ${itemWidth}px;`
      } else if (typeof itemWidth === 'string') {
        return `width: ${itemWidth};`
      }
      return ''
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.formData = this.data
          this.formValidate()
        }
      },
      deep: true
    },
    formData: {
      handler: function(val, oldVal) {
        this.$emit('input', this.formData)
        this.callback()
      },
      deep: true
    }
  },
  methods: {
    callback() {
      let attrValidator = true
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          attrValidator = false
        }
      })
      return attrValidator
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs['form'].validate(() => {})
      })
    },
    clearData() {
      this.formData = JSON.parse(JSON.stringify(this.defaultFormData))
    }
  }
}
</script>
