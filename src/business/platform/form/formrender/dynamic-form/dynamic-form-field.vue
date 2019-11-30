<template>
  <div>
    <!-- 单行文本、 多行文本、数字-->
    <template v-if="fieldType==='text'||fieldType==='textarea' ||fieldType==='number'">
      <div v-if="readonlyText">
        {{ dataModel }}
      </div>
      <el-input
        v-else
        v-model="dataModel"
        :placeholder="placeholder"
        :type="fieldType"
        :name="field.name"
        :autosize="autosize"
        :rows="fieldOptions.rows||2"
        :readonly="readonly"
        clearable
        v-on="$listeners"
      />
    </template>
    <!-- 单项选择 -->
    <template v-else-if="fieldType==='radio'">
      <template v-if="readonlyText">
        <el-tag v-if="$utils.isNotEmpty(dataModel)">
          {{ dataModel|optionsFilter(dataOptions,'label','val') }}
        </el-tag>
      </template>
      <el-radio-group
        v-else
        v-model="dataModel"
        :readonly="readonly"
        v-on="$listeners"
      >
        <component
          :is="fieldOptions.button?'el-radio-button':'el-radio'"
          v-for="o in dataOptions"
          :key="o.val"
          :label="o.val"
          :border="fieldOptions.border"
          :style="{
            marginTop: '5px',
            display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
        >
          {{ o.label }}
        </component>
      </el-radio-group>
    </template>
    <!-- 多选项选择 -->
    <template v-else-if="fieldType==='checkbox'">
      <template v-if="readonlyText">
        <template v-if="checkboxGroupValue && checkboxGroupValue.length >0">
          <el-tag v-for="(v,i) in checkboxGroupValue" :key="i" class="ibps-mr-5">
            {{ v|optionsFilter(dataOptions,'label','val') }}
          </el-tag>
        </template>
      </template>
      <el-checkbox-group
        v-else
        v-model="checkboxGroupValue"
        v-on="$listeners"
      >
        <component
          :is="fieldOptions.button?'el-checkbox-button':'el-checkbox'"
          v-for="o in dataOptions"
          :key="o.val"
          :label="o.val"
          :border="fieldOptions.border"
          :style="{display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
        > {{ o.label }}
        </component>
      </el-checkbox-group>
    </template>

    <!-- 下拉框 -->
    <template v-else-if="fieldType==='select'">
      <template v-if="readonlyText">
        <el-tag v-if="$utils.isNotEmpty(dataModel)">
          {{ dataModel|optionsFilter(dataOptions,'label','val') }}
        </el-tag>
      </template>
      <el-select
        v-else
        v-model="dataModel"
        :placeholder="placeholder"
        :name="field.name"
        :style="{width:fieldOptions.width||' 100%'}"
        clearable
        v-on="$listeners"
      >
        <el-option
          v-for="o in dataOptions"
          :key="o.val"
          :label="o.label"
          :value="o.val"
        />
      </el-select>
    </template>
    <!-- 开关 -->
    <template v-else-if="fieldType==='switch'">
      <template v-if="readonlyText">
        <el-tag v-if="$utils.isNotEmpty(dataModel)">
          {{ dataModel|optionsFilter(dataOptions,'label','val') }}
        </el-tag>
      </template>
      <template v-else>
        <el-checkbox
          v-if="fieldOptions.appearance==='checkbox'"
          v-model="dataModel"
          v-on="$listeners"
        />
        <el-switch
          v-else
          v-model="dataModel"
          :width="fieldOptions.width"
          :active-value="fieldOptions.active_value"
          :inactive-value="fieldOptions.inactive_value"
          v-on="$listeners"
        />
      </template>
    </template>

    <!-- 滑块 -->
    <el-slider
      v-else-if="fieldType==='slider'"
      v-model="dataModel"
      :disabled="readonly"
    />
    <!-- 评分 -->
    <el-rate
      v-else-if="fieldType==='rate'"
      v-model="numberDataModel"
      :max="fieldOptions.max"
      :allow-half="fieldOptions.allow_half"
      :disabled="readonly"
    />

    <!-- 日期控件 -->
    <template v-else-if="fieldType==='datePicker'||fieldType==='currentTime'||fieldType==='currentDate'">
      <div v-if="readonlyText">
        {{ dataModel|dateFormat(datefmt,datefmt) }}
      </div>
      <template v-else>
        <el-date-picker
          v-if="dateType ==='date' || dateType =='datetime' "
          v-model="dataModel"
          :type="dateType"
          :value-format="datefmt"
          :format="datefmt"
          :placeholder="placeholder"
          :style="{width:fieldOptions.width||' 100%'}"
          :readonly="readonly"
          clearable
        />
        <el-time-picker
          v-else-if="dateType ==='time' "
          v-model="dataModel"
          :type="dateType"
          :value-format="datefmt"
          :format="datefmt"
          :placeholder="placeholder"
          :style="{width:fieldOptions.width||' 100%'}"
          :readonly="readonly"
          clearable
        />
        <!--TODO:自定义日期格式-->
      </template>
    </template>

    <!-- =======================增强字段==============================-->
    <!--富文本框-->
    <template v-else-if="fieldType==='editor'">
      <div
        v-if="readonlyText"
        v-html="dataModel"
      />
      <ibps-ueditor
        v-else
        v-model="dataModel"
        :placeholder="placeholder"
        :readonly="readonly"
        :config="ueditorConfig"
        destroy
      />
    </template>
    <!--数据字典-->
    <ibps-dictionary
      v-else-if="fieldType==='dictionary'"
      v-model="dataModel"
      :type-key="fieldOptions.dictionary"
      :multiple="fieldOptions.multiple"
      :select-mode="fieldOptions.select_mode"
      :display-mode="fieldOptions.display_mode"
      :separator="fieldOptions.split"
      :readonly="readonly"
      v-on="$listeners"
    />
    <!-- 自动编号-->
    <template v-else-if="fieldType==='autoNumber'">
      <ibps-auto-number
        v-model="dataModel"
        :alias="fieldOptions.identity"
        :init="fieldOptions.init==='true'||fieldOptions.init"
        :placeholder="placeholder"
        :readonly="readonly"
        :readonly-text="readonlyText"
      />
    </template>

    <!-- 上传附件-->
    <ibps-attachment
      v-else-if="fieldType==='attachment'"
      v-model="dataModel"
      :placeholder="fieldOptions.placeholder"
      :download="fieldOptions.download||true"
      :readonly="readonly"
      :limit="fileQuantity"
      :file-size="maxFileSize"
      :accept="accept"
      :file-ext="fileFormates"
      multiple
      v-on="$listeners"
    />
    <!-- 选择器-->
    <ibps-user-selector
      v-else-if="fieldType==='selector' || fieldType==='currentUser' || fieldType==='currentOrg' "
      v-model="dataModel"
      :placeholder="$utils.isNotEmpty(fieldOptions.placeholder)? fieldOptions.placeholder:'请选择'"
      :type="fieldOptions.selector_type"
      :multiple="fieldOptions.multiple"
      :store="fieldOptions.store||'id'"
      :disabled="readonly"
      :readonly-text="readonlyText?'text':null"
    />
    <!--自定义对话框-->
    <ibps-custom-dialog
      v-else-if="fieldType === 'customDialog'"
      v-model="dataModel"
      :template-key="fieldOptions.dialog"
      :dynamic-params="dynamicParams"
      :multiple="fieldOptions.multiple === 'Y'"
      :placeholder="fieldOptions.placeholder"
      :store="fieldOptions.store"
      :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
      :type="fieldOptions.dialog_type"
      :disabled="readonly"
      :readonly-text="readonlyText?'text':null"
      @change="changeData"
    />
    <!-- 关联数据-->
    <ibps-link-data
      v-else-if="fieldType==='linkdata'"
      v-model="dataModel"
      :template-key="fieldOptions.linkdata"
      :dynamic-params="dynamicParams"
      :placeholder="$utils.isNotEmpty(placeholder)? placeholder:'请选择'"
      :multiple="fieldOptions.multiple === 'Y'"
      :value-key="valueKey"
      :label-key="labelKey"
      :readonly="readonly"
      @change="changeData"
    />

    <!-- 地址-->
    <div
      v-else-if="fieldType==='address'"
    >
      <ibps-address
        v-model="addressValue"
        :size="fieldOptions.size"
        :top="fieldOptions.top || 'country'"
        :top-val="addressTopVal"
        :level="fieldOptions.level||'district'"
        :disabled="readonly"
        :readonly-text="readonlyText?'text':null"
        data-type="code"
      />
      <span v-if="readonlyText">
        {{ streetValue }}
      </span>
      <template v-else>
        <p />
        <el-input
          v-if="fieldOptions.is_street"
          v-model="streetValue"
          :disabled="readonly"
          placeholder="详细地址"
          type="textarea"
        />
      </template>
    </div>
    <!-- 签名-->
    <ibps-signature
      v-else-if="fieldType==='signature'"
      v-model="dataModel"
      :placeholder="placeholder"
      :height="fieldOptions.height"
      :disabled="readonly"
    />
    <!-- 图片-->
    <ibps-image
      v-else-if="fieldType==='image'"
      v-model="dataModel"
      :width="fieldOptions.width"
      :height="fieldOptions.height"
      :limit="fieldOptions.limit"
      :accept="fieldOptions.accept"
      :tip="fieldOptions.tip"
      :size="fieldOptions.size"
      :upload-type="fieldOptions.uploadType"
      :disabled="readonly"
    />
    <!-- 链接 -->
    <ibps-link
      v-else-if="fieldType === 'hyperlink'"
      :text="fieldOptions.text"
      :link="fieldOptions.link"
      :show-type="fieldOptions.showType"
      :text-type="fieldOptions.textType"
      :link-type="fieldOptions.linkType"
      :type="fieldOptions.type"
      :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
    />

    <!-- =======================其它字段==============================-->
    <!-- 文本-->
    <span v-else-if="fieldType==='label'">
      <template v-if="value">
        {{ value }}
      </template>
      <template v-else>
        {{ placeholder }}
      </template>
    </span>
  </div>

</template>
<script>
import { getByKey, queryDataTable } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import FormOptions from '@/business/platform/form/constants/formOptions'
import { fileTypes as FILE_TYPES, accept as ACCEPT } from '@/business/platform/form/constants/fileTypes'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsAutoNumber from '@/business/platform/system/identity/auto-number'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAddressCascader from '@/components/ibps-address/cascader'
import IbpsSignature from './components/signature'
import IbpsImage from '@/components/ibps-image'
import IbpsLink from '@/components/ibps-link'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import FormUtils from '@/business/platform/form/utils/formUtil'

export default {
  components: {
    'ibps-ueditor': IbpsUeditor,
    'ibps-dictionary': IbpsDictionary,
    'ibps-auto-number': IbpsAutoNumber,
    'ibps-attachment': IbpsAttachment,
    'ibps-user-selector': IbpsUserSelector,
    'ibps-address': IbpsAddressCascader,
    'ibps-signature': IbpsSignature,
    'ibps-image': IbpsImage,
    'ibps-link': IbpsLink,
    'ibps-custom-dialog': IbpsCustomDialog,
    'ibps-link-data': IbpsLinkData
  },
  props: {
    value: {
      type: [String, Number, Date, Object, Array]
    },
    models: [Object, Array], // 所有字段数据
    field: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    readonlyStyle: {
      type: String,
      default: 'text'
    },
    params: {
      type: Object
    }
  },
  data() {
    return {
      ajaxOptions: [],
      dataModel: this.value
    }
  },
  computed: {
    fieldType() {
      return this.field.field_type
    },
    fieldOptions() {
      return this.field.field_options || {}
    },
    checkboxGroupValue: {
      get() {
        if (Array.isArray(this.dataModel)) {
          return this.dataModel
        }
        return this.dataModel ? this.dataModel.split(',') : []
      },
      set(value) {
        this.dataModel = value.join(',')
      }
    },
    numberDataModel: {
      get() {
        if (this.$utils.isEmpty(this.dataModel)) { return 0 }
        return Number(this.dataModel)
      },
      set(value) {
        this.dataModel = value
      }
    },

    addressTopVal() {
      return FormUtils.getAddressTopVal(this.fieldOptions)
    },
    // 地址值
    addressValue: {
      get() {
        return FormUtils.getAddressControlValue(this.dataModel, this.fieldOptions)
      },
      set(value) {
        this.dataModel = FormUtils.getAddressValue(value, this.dataModel, this.fieldOptions)
      }
    },
    streetValue: {
      get() {
        if (this.$utils.isEmpty(this.dataModel)) {
          return ''
        }
        const data = JSON.parse(this.dataModel)
        return data['street'] || ''
      },
      set(val) {
        let data = {}
        if (this.$utils.isNotEmpty(this.dataModel)) {
          data = JSON.parse(this.dataModel)
        }
        data['street'] = val
        this.dataModel = JSON.stringify(data)
      }
    },
    readonlyText() {
      if (!this.readonly) return false
      if (this.readonlyStyle === 'text') {
        return true
      } else {
        return false
      }
    },
    // 自适应内容高度
    autosize() {
      let autosize = this.fieldOptions.autosize
      if (this.fieldOptions.autosize && (this.fieldOptions.min_rows || this.fieldOptions.max_rows)) {
        const row = {}
        row.minRows = this.fieldOptions.min_rows ? this.fieldOptions.min_rows : null
        row.minRows = this.fieldOptions.max_rows ? this.fieldOptions.max_rows : null
        autosize = row
      }
      return autosize
    },
    // 日期格式
    datefmt() {
      if (this.fieldType === 'currentDate') {
        return FormOptions.t.DATE_FORMATS['date']
      } else if (this.fieldType === 'currentTime') {
        return FormOptions.t.DATE_FORMATS['datetime']
      } else {
        if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
          return FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        }
        return this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
      }
    },
    // 日期类型
    dateType() {
      // year/month/date/week/ datetime/datetimerange/daterange
      if (this.fieldType === 'currentDate') {
        return 'date'
      } else if (this.fieldType === 'currentTime') {
        return 'datetime'
      } else {
        if (this.fieldOptions['datefmt_type'] === 'date') {
          return 'date'
        } else if (this.fieldOptions['datefmt_type'] === 'datetime') {
          return 'datetime'
        } else if (this.fieldOptions['datefmt_type'] === 'time') {
          return 'time'
        } else if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
          // TODO: 根据自定义日期格式的配置
          return 'datetime'
        } else {
          return 'datetime'
        }
      }
    },
    /**
     * 单选、多选、下拉等选项
     */
    dataOptions() {
      return this.field.field_options['options'] || this.ajaxOptions
    },
    /**
     *  占位符
     */
    placeholder() {
      return !this.$attrs.readonly ? this.fieldOptions['placeholder'] : ''
    },
    /**
     * 下拉占位符
     */
    selectPlaceholder() {
      return !this.$attrs.readonly ? (this.fieldOptions['include_blank_value'] || this.fieldOptions['placeholder']) : ''
    },
    /**
     * 编辑器按钮
     */
    ueditorConfig() {
      const config = {
        initialContent: this.placeholder,
        toolbars: []
      }

      const toolbars = this.fieldOptions.toolbars
      if (toolbars && toolbars.length > 0) {
        config.toolbars.push(toolbars)
      }
      return config
    },
    /**
     * 最大文件上传
     */
    maxFileSize() {
      return this.$utils.isNotEmpty(this.fieldOptions.max_file_size) ? this.fieldOptions.max_file_size * 1024 * 1024 : null
    },
    /**
     * 最大文件个数
     */
    fileQuantity() {
      if (this.$utils.isNotEmpty(this.fieldOptions.max_file_quantity) && (this.fieldOptions.max_file_quantity !== '-1' || this.fieldOptions.max_file_quantity !== -1)) {
        return parseInt(this.fieldOptions.max_file_quantity, 10)
      } else {
        return null
      }
    },
    accept() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) { return '*' }
      return ACCEPT[mediaType] || '*'
    },
    fileFormates() {
      const mediaType = this.fieldOptions.media_type
      if (this.$utils.isEmpty(mediaType)) { return [] }
      const x = FILE_TYPES[mediaType]
      if ((x)) {
        return x.map((v) => {
          return '.' + v
        })
      } else {
        return (this.fieldOptions.media || '').split(',')
      }
    },
    bindId() {
      const bindId = this.fieldOptions['bind_id']
      if (this.$utils.isEmpty(bindId)) { return '' }
      return this.models[bindId] || ''
    },
    /**
     * 是否多选
     */
    multiple() {
      return !this.$utils.toBoolean(this.fieldOptions['is_single'])
    },
    // 高
    height() {
      return this.fieldOptions.height ? parseInt(this.fieldOptions.height, 10) : null
    },
    // 其他选项值
    otherOptionValue: {
      get() {
        const otherId = this.fieldOptions['option_other_id']
        if (this.$utils.isEmpty(otherId)) return
        return this.models[otherId] || ''
      },
      set(value) {
        const otherId = this.fieldOptions['option_other_id']
        if (this.$utils.isEmpty(otherId)) return
        this.$emit('change-data', otherId, value)
      }
    },
    valueKey() {
      return this.fieldOptions['link_config'] ? this.fieldOptions['link_config'].id : ''
    },
    labelKey() {
      return this.fieldOptions['link_config'] ? this.fieldOptions['link_config'].text : ''
    },
    dynamicParams() {
      const conditions = this.fieldOptions['link_condition'] ? this.fieldOptions['link_condition'] : []
      if (this.$utils.isEmpty(conditions)) { return {} }
      const dynamicParams = {}
      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i]
        let val = condition.value
        if (condition.mode === 'bind') { // 绑定表单
          val = this.models[condition.value]
        }
        dynamicParams[condition.fieldName] = val || ''
      }
      return dynamicParams
    }
  },
  watch: {
    value: {
      handler(val) {
        this.dataModel = val
      },
      deep: true
    },
    dataModel: {
      handler(val) {
        this.$emit('update:value', val)
      },
      deep: true
    }
  },
  created() {
    if ((this.fieldType === 'radio' || this.fieldType === 'checkbox' || this.fieldType === 'select') &&
      this.fieldOptions['datasource'] === 'valuesource') {
      this.field.field_options['options'] = null
      getByKey({
        dataTemplateKey: this.fieldOptions['value_source']
      }).then(response => {
        const dataTemplate = this.$utils.parseData(response.data)
        const template = dataTemplate.templates[0]
        queryDataTable(this.getValuesourceParams(template, dataTemplate)).then(resp => {
          const data = resp.data
          const dataResult = data.dataResult || []
          const options = dataResult.map(item => {
            return {
              val: item[this.valueKey ],
              label: item[this.labelKey]
            }
          })
          this.ajaxOptions = options
        })
      }).catch(() => {
      })
    }
  },
  methods: {
    getValuesourceParams(template, dataTemplate) {
      const formParams = {}
      const responseData = JSON.parse(JSON.stringify(template))
      responseData.datasetKey = dataTemplate.datasetKey
      responseData.unique = this.valueKey
      responseData['key'] = this.fieldOptions['value_source']
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = ''
      return ActionUtils.formatParams(formParams)
    },
    /**
     * 改变数据
     */
    changeData(value, data) {
      this.$emit('change', value, data)
      this.handleLinkageData(value, data)
      this.handleLinkageAttr(value, data)
    },
    /**
     * 联动数据
     */
    handleLinkageData(value, data) {
      const linkLinkage = this.fieldOptions['link_linkage']
      if (this.$utils.isEmpty(linkLinkage)) { return }
      for (let i = 0; i < linkLinkage.length; i++) {
        const item = linkLinkage[i]
        const fieldName = item.field
        if (this.models.hasOwnProperty(fieldName)) {
          this.$emit('change-data', fieldName, data[item.name] || '')
        }
      }
    },
    /**
     *  联动属性
     */
    handleLinkageAttr(value, data) {
      const linkAttr = this.fieldOptions['link_attr']
      if (this.$utils.isEmpty(linkAttr)) { return }
      for (let i = 0; i < linkAttr.length; i++) {
        const item = linkAttr[i]
        const fieldName = item.field
        if (this.models.hasOwnProperty(fieldName)) {
          this.$emit('change-data', fieldName, data[item.name] || '')
        }
      }
    },
    selectorBindCallback(value) {
      const bindId = this.fieldOptions['bind_id']
      if (this.$utils.isEmpty(bindId)) {
        this.$message.error('[' + this.label + ']字段未绑Id')
        return
      }
      this.$emit('change-data', bindId, value || '')
    }
  }
}
</script>

