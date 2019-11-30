<template>
  <el-form
    v-if="forms"
    ref="form"
    :model="params"
    :inline="inline"
    :label-width="labelWidth ? (labelWidth + 'px') : ''"
    class="ibps-crud-search-form"
    @keyup.enter.native.stop="handleEnter"
  >
    <template v-for="(item, index) in forms">
      <el-form-item
        v-if="item.fieldType !== 'hidden'"
        :key="index"
        :prop="item.modelValue"
        :label="item.label"
        :rules="item.rules || []"
        :label-width="item.labelWidth ? (item.labelWidth + 'px') : ''"
        class="search-form-item"
      >
        <!-- 文本框-->
        <el-input
          v-if="item.fieldType === 'input' ||item.fieldType === 'text'|| item.fieldType === undefined"
          v-model="params[item.modelValue]"
          :size="item.size ? item.size : size"
          :readonly="item.readonly"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          clearable
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 下拉框-->
        <el-select
          v-else-if="item.fieldType === 'select'"
          v-model="params[item.modelValue]"
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          clearable
          @keyup.enter.native.stop="handleEnter"
        >
          <el-option
            v-for="(option, optionIndex) in item.options"
            :key="optionIndex + '_local'"
            :value="(typeof option === 'object') ? option[item.valueKey || 'value'] : option"
            :label="(typeof option === 'object') ? option[item.labelKey || 'label'] : option"
          />
          <el-option
            v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]"
            :key="opIndex + '_remote'"
            :value="(typeof op === 'object') ? op[item.valueKey || 'value'] : op"
            :label="(typeof op === 'object') ? op[item.labelKey || 'label'] : op"
          />
        </el-select>
        <!-- 日期-->
        <el-date-picker
          v-else-if="item.fieldType === 'date'"
          v-model="params[item.modelValue]"
          :placeholder="item.placeholder"
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :editable="item.editable"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          :picker-options="item.pickerOptions || {}"
          :type="item.dateType||'date'"
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 日期范围-->
        <el-date-picker
          v-else-if="item.fieldType === 'daterange'"
          v-model="params[item.modelValue]"
          :size="item.size ? item.size : size"
          :disabled="item.disabled"
          :readonly="item.readonly"
          :editable="item.editable"
          :placeholder="item.placeholder"
          :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
          :picker-options="item.pickerOptions || {}"
          type="daterange"
          @change="date => changeDate(date, item.prop[0], item.prop[1])"
          @keyup.enter.native.stop="handleEnter"
        />
        <!-- 数据字典-->
        <ibps-dictionary
          v-else-if="item.fieldType === 'dictionary'"
          v-model="params[item.modelValue]"
          :type-key="item.field_options.dictionary"
          :multiple="false"
          :disabled="item.disabled"
          clearable
        />
        <ibps-user-selector
          v-else-if="item.fieldType === 'selector'"
          v-model="params[item.modelValue]"
          :type="item.selectorType||'user'"
          :placeholder="item.placeholder"
          :multiple="false"
          :store="'id'"
          :disabled="item.disabled"
        />
        <ibps-address
          v-else-if="item.fieldType === 'address'"
          v-model="params[item.modelValue]"
          :size="item.field_options.size"
          :top="item.field_options.top || 'country'"
          :top-val="topVal(item)"
          :level="item.field_options.level||'district'"
          data-type="code"
        />
      <!--TODO: 持续开发中-->
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import { formProps } from './props.js'
import request from '@/utils/request'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAddress from '@/components/ibps-address/cascader'
export default {
  components: {
    IbpsDictionary,
    IbpsUserSelector,
    IbpsAddress
  },
  props: formProps,
  data() {
    const { forms, fuzzy } = this.$props
    const datePrefix = 'daterange-prefix'
    const selectOptionPrefix = 'select-option-prefix'
    const dataObj = {
      selectOptions: {}
    }
    const params = {}
    const nameParams = {}
    const format = {}
    const fuzzyOps = {}

    forms.forEach((v, i) => {
      const propType = typeof v.prop
      if (propType === 'string') {
        v.modelValue = v.prop
        params[v.prop] = v.value || ''
        if (v.name) {
          nameParams[v.prop] = v.name
        }

        fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy
        if (v.format) {
          format[v.prop] = v.format
        }
      } else if (propType === 'object' && Object.prototype.toString.call(v.prop) === '[object Array]') {
        v.prop.forEach((vv, j) => {
          params[vv] = vv.value || ''
          if (v.name) {
            nameParams[vv] = v.name[j]
          }
          if (v.format) {
            format[vv] = v.format
          }
          fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy
        })
      }
      if (v.fieldType === 'daterange') {
        params[datePrefix + i] = ''
        v.modelValue = datePrefix + i
      } else if (v.fieldType === 'select' && (v.selectFetch || v.selectUrl)) {
        const dataKey = selectOptionPrefix + i
        dataObj.selectOptions[dataKey] = []
        if (!v.selectMethod) {
          v.selectMethod = 'get'
        }
        this.getRemoteData({
          fetch: v.selectFetch ? v.selectFetch : () => {
            const p = v.selectMethod.toLowerCase() === 'get'
              ? { params: v.selectParams } : v.selectParams
            return request({
              url: v.selectUrl,
              method: v.selectMethod,
              p
            })
          },
          dataKey,
          resultField: v.resultField || 'data',
          resultHandler: v.resultHandler
        })
      }
    })
    return {
      params,
      nameParams,
      datePrefix,
      selectOptionPrefix,
      ...dataObj,
      format,
      fuzzyOps
    }
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this
      if (itemWidth) {
        return `width: ${itemWidth}px;`
      }
      return ''
    }

  },
  methods: {
    /**
     * 处理回车
     */
    handleEnter() {
      this.$emit('search')
    },
    isArray(value) {
      return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]'
    },
    getParamFuzzy() {
      return this.fuzzyOps
    },
    /**
     * 获取参数
     */
    getSearcFormData() {
      const { params, nameParams, datePrefix, format } = this
      const formattedForm = {}
      Object.keys(params).forEach(v => {
        if (v && v.indexOf(datePrefix) === -1) {
          const val = format[v] ? format[v](params[v], v) : params[v]
          if (this.$utils.isNotEmpty(val) && !Array.isArray(val)) {
            let key = v
            if (nameParams[v]) {
              key = nameParams[v]
            }
            formattedForm[key] = val
          }
        }
      })
      return formattedForm
    },
    /**
     *重置表单
     */
    resetSearchForm() {
      this.$refs['form'].resetFields()
    },
    changeDate(date, startDate, endDate) {
      let dates
      if (date === null) {
        this.params[startDate] = ''
        this.params[endDate] = ''
        return
      }
      if (typeof date === 'string') {
        dates = date.split(' - ')
      } else if (date && date.hasOwnProperty('length')) {
        const firstDate = date[0]
        const secondDate = date[1]
        dates = [
          `${firstDate.getFullYear()}-${('0' + (firstDate.getMonth() + 1)).substr(-2)}-${('0' + firstDate.getDate()).substr(-2)}`,
          `${secondDate.getFullYear()}-${('0' + (secondDate.getMonth() + 1)).substr(-2)}-${('0' + secondDate.getDate()).substr(-2)}`
        ]
      }
      this.params[startDate] = dates[0]
      this.params[endDate] = dates[1]
    },
    /**
     * 获取的远程数据【下拉框】
     */
    getRemoteData({ fetch, dataKey, resultField, resultHandler }) {
      fetch().then(response => {
        let result = response
        if (typeof response === 'object' && !this.isArray(response)) {
          if (resultField.indexOf('.') !== -1) {
            resultField.split('.').forEach(vv => {
              result = result[vv]
            })
          } else {
            result = response[resultField]
          }
        }
        if (!result || !(result instanceof Array)) {
          throw new Error(`The result of key:${resultField} is not Array.`)// 接口返回的字段:${resultField} 不是一个数组
        }
        if (this.resultHandler) {
          this.selectOptions[dataKey] = result.map(this.resultHandler)
        } else {
          this.selectOptions[dataKey] = result
        }
      })
    },
    topVal(item) {
      const top = item.field_options.top
      const topval = item.field_options.topval
      if (this.$utils.isEmpty(topval)) {
        if (top === 'country') { return '0' }
        return '' // 异常配置
      }
      if (top === 'country') {
        return '0'
      } else if (top === 'province' || top === 'city' || top === 'district') {
        return topval[topval.length - 1]
      }
      return ''
    }
  }
}
</script>
