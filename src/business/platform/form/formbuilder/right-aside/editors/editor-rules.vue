<template>
  <div class="panel panel-default rules-panel">
    <div class="panel-heading">校验规则</div>
    <div class="panel-body">
      <div class="el-form-item ibps-mb-5">
        <!-- // - 必填 -->
        <div v-if="types.includes('required')" class="el-form-item__content">
          <el-checkbox v-model="fieldOptions.required">必填</el-checkbox><help-tip prop="required" />
        </div>
        <!-- // - 数字类型 -->
        <template v-if="types.includes('number')">
          <div class="el-form-item__content">
            <el-checkbox v-model="fieldOptions.integer">只能输入整数</el-checkbox><help-tip prop="integer" />
          </div>
          <div class="el-form-item__content">
            <el-checkbox v-model="fieldOptions.is_decimal" :disabled="fieldOptions.integer">不超过&nbsp;&nbsp;<help-tip prop="decimal" />
              <el-input-number v-model="fieldOptions.decimal" :disabled="fieldOptions.integer||!fieldOptions.is_decimal" controls-position="right" size="mini" />
              位</el-checkbox>
          </div>
        </template>
        <!-- //- 字符串长度 -->
        <div v-if="types.includes('length')" class="el-form-item__content">
          <div>
            <el-checkbox v-model="fieldOptions.is_min_length">最少填</el-checkbox><help-tip prop="minLength" />
            <el-input-number v-model="fieldOptions.min_length" :disabled="!fieldOptions.is_min_length" controls-position="right" size="mini" />
            个字符
          </div>
          <div>
            <el-checkbox v-model="fieldOptions.is_max_length">最多填</el-checkbox><help-tip prop="maxLength" />
            <el-input-number v-model="fieldOptions.max_length" :disabled="!fieldOptions.is_max_length" controls-position="right" size="mini" />
            个字符
          </div>
        </div>
        <!-- //- 最大最小值-->
        <div v-if="types.includes('minMax')" class="el-form-item__content">
          <div>
            <el-checkbox v-model="fieldOptions.is_min">最小值</el-checkbox><help-tip prop="min" />
            <el-input-number v-model="fieldOptions.min" :min="1" :disabled="!fieldOptions.is_min" controls-position="right" size="mini" />
          </div>
          <div>
            <el-checkbox v-model="fieldOptions.is_max">最大值</el-checkbox><help-tip prop="max" />
            <el-input-number v-model="fieldOptions.max" :min="1" :disabled="!fieldOptions.is_max" controls-position="right" size="mini" />
          </div>
        </div>
        <!-- //- 最大最小项-->
        <div v-if="types.includes('item')" class="el-form-item__content">
          <div>
            <el-checkbox v-model="fieldOptions.is_min_mum" @change="changeCheckbox('min_mum')">最少选择</el-checkbox><help-tip prop="minItem" />
            <el-input-number v-model="fieldOptions.min_mum" :disabled="!fieldOptions.is_min_mum" controls-position="right" size="mini" />
            项
          </div>
          <div>
            <el-checkbox v-model="fieldOptions.is_max_mum" @change="changeCheckbox('max_mum')">最多选择</el-checkbox><help-tip prop="maxItem" />
            <el-input-number v-model="fieldOptions.max_mum" :disabled="!fieldOptions.is_max_mum" controls-position="right" size="mini" />
            项
          </div>
        </div>
        <!-- //- 起始日期-->
        <div v-if="types.includes('date')" class="el-form-item__content">
          <div>
            <el-checkbox v-model="fieldOptions.is_start_date">起始日期</el-checkbox><help-tip prop="startDate" />
            <el-select v-model="fieldOptions.start_date_type" :disabled="!fieldOptions.is_start_date" :size="'mini'" style="width:100px;height: 28px;">
              <el-option
                v-for="dateType in dateTypes"
                :key="dateType.value"
                :value="dateType.value"
                :label="dateType.label"
              />
            </el-select>
            <el-input v-if="fieldOptions.start_date_type==='specific'" v-model="fieldOptions.start_date" :disabled="!fieldOptions.is_start_date" size="mini" style="width:100px;" />
            <el-input-number v-else v-model="fieldOptions.start_date" :min="1" :disabled="!fieldOptions.is_start_date" controls-position="right" size="mini" style="width:100px;" />

          </div>
          <div>
            <el-checkbox v-model="fieldOptions.is_end_date">结束日期</el-checkbox><help-tip prop="endDate" />
            <el-select v-model="fieldOptions.end_date_type" :size="'mini'" :disabled="!fieldOptions.is_end_date" style="width:100px;height: 28px;">
              <el-option
                v-for="dateType in dateTypes"
                :key="dateType.value"
                :value="dateType.value"
                :label="dateType.label"
              />
            </el-select>
            <el-input v-if="fieldOptions.end_date_type==='specific'" v-model="fieldOptions.end_date" :disabled="!fieldOptions.is_end_date" size="mini" style="width:100px;" />
            <el-input-number v-else v-model="fieldOptions.end_date" :min="1" :disabled="!fieldOptions.is_end_date" controls-position="right" size="mini" style="width:100px;" />

          </div>
        </div>

        <!-- //- 正则表达式 -->
        <div v-if="types.includes('dataFormat')" class="el-form-item__content">
          数据格式<help-tip prop="dataFormat" />
          <el-select v-model="fieldOptions.data_format" placeholder="请选择" size="mini" clearable>
            <el-option v-for="o in dataFormatOptions" :key="o.value" :value="o.value" :label="o.label" />
          </el-select>
          <div v-if="fieldOptions.data_format ==='custom'">
            <el-input v-model="fieldOptions.data_format_value" placeholder="正则表达式" type="textarea" rows="1" />
            <el-input v-model="fieldOptions.data_format_msg" placeholder="提示信息" type="textarea" rows="1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dataFormatOptions, dateTypes } from '@/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'
/**
 * 校验规则
 */
// TODO: 未做的功能
// 1、正则表达式 message编辑，添加正则flag，允许添加多条regexp
export default {
  mixins: [EditorMixin],
  props: {
    // 规则类型 可选值[required、length、dataFormat]
    types: {
      type: String,
      default: 'required'
    }
  },
  data() {
    return {
      dataFormatOptions: dataFormatOptions,
      dateTypes: dateTypes
    }
  },
  methods: {
    changeCheckbox(key) {
      this.fieldItem.field_options[key] = null
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-checkbox{
     margin-right: 10px;
  }
</style>

