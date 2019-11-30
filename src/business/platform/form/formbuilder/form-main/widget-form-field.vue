<template>
  <div>
    <!-- 单行文本-->
    <template v-if="field.field_type === 'text'">
      <el-input
        :value="defaultValue"
        :placeholder="fieldOptions.placeholder"
        :style="{width:fieldOptions.width||' 100%'}"
        disabled
      />
    </template>
    <!--多行文本-->
    <template v-else-if="field.field_type === 'textarea'">
      <el-input
        :value="defaultValue"
        type="textarea"
        :rows="fieldOptions.rows||5"
        :placeholder="fieldOptions.placeholder"
        :style="{width:fieldOptions.width||' 100%'}"
        disabled
      />
    </template>
    <!-- 数字 -->
    <template v-else-if="field.field_type === 'number'">
      <el-input
        :value="defaultValue"
        type="number"
        :controls-position="fieldOptions.controlsPosition"
        :placeholder="fieldOptions.placeholder"
        :style="{width:fieldOptions.width||' 100%'}"
        disabled
      />
    </template>
    <!-- 单选 -->
    <template v-else-if="field.field_type === 'radio'">
      <el-radio-group
        :value="defaultValue"
        disabled
      >
        <component
          :is="fieldOptions.button?'el-radio-button':'el-radio'"
          v-for="(o, i) in options"
          :key="o.val"
          :label="i"
          :border="fieldOptions.border"
          :style="{
            marginTop: '5px',
            display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
        >
          {{ o.label }}
        </component>
      </el-radio-group>
    </template>
    <!-- 多选 -->
    <template v-else-if="field.field_type === 'checkbox'">
      <el-checkbox-group
        :value="defaultValue"
        disabled
      >
        <component
          :is="fieldOptions.button?'el-checkbox-button':'el-checkbox'"
          v-for="(o,i) in options"
          :key="o.val"
          :label="i"
          :border="fieldOptions.border"
          disabled
          :style="{ display: fieldOptions.arrangement==='vertical' ? 'block' : null}"
        > {{ o.label }}
        </component>
      </el-checkbox-group>
    </template>
    <!-- 下拉 -->
    <template v-else-if="field.field_type === 'select'">
      <el-select
        :value="defaultValue"
        :multiple="fieldOptions.multiple"
        disabled
        :style="{width:fieldOptions.width||' 100%'}"
      >
        <el-option
          v-for="o in fieldOptions.options"
          :key="o.val"
          :label="o.label"
          :value="o.val"
          disabled
        />
      </el-select>
    </template>
    <!-- 日期控件 -->
    <el-date-picker
      v-else-if="field.field_type === 'datePicker'||field.field_type === 'currentTime'||field.field_type === 'currentDate'"
      :value="defaultValue"
      :type="fieldOptions.subtype||'date'"
      :value-format="fieldOptions.valueFormat"
      :format="fieldOptions.viewFormat||fieldOptions.valueFormat"
      :placeholder="fieldOptions.placeholder"
      disabled
      :style="{width:fieldOptions.width||' 100%'}"
    />
    <!-- 开关 -->
    <template v-else-if="field.field_type == 'switch'">
      <el-checkbox
        v-if="fieldOptions.appearance==='checkbox'"
        :value="defaultValue"
        disabled
      />
      <el-switch
        v-else
        :value="defaultValue"
        :width="fieldOptions.width"
        :active-value="fieldOptions.active_value"
        :inactive-value="fieldOptions.inactive_value"
        disabled
      />
    </template>

    <!-- 滑块 -->
    <template v-else-if="field.field_type === 'slider'">
      <el-slider
        :value="defaultValue"
        disabled
      />
    </template>
    <template v-else-if="field.field_type === 'rate'">
      <el-rate
        :value="defaultValue"
        :max="fieldOptions.max"
        :allow-half="fieldOptions.allow_half"
        disabled
      />
    </template>
    <!-- 隐藏域 -->
    <template v-else-if="field.field_type === 'hidden'">
      <el-input
        :value="defaultValue"
        disabled
      >
        <i slot="prefix" class="ibps-icon-eye-slash red" />
      </el-input>
    </template>
    <!-- =======================增强字段==============================-->
    <!--富文本框-->
    <template v-else-if="field.field_type === 'editor'">
      <ibps-ueditor
        :value="defaultValue"
        :config="ueditorConfig"
        destroy
        readonly
        disabled
        @click="()=>{$emit('click')}"
      />
    </template>
    <!--数据字典-->
    <ibps-dictionary
      v-else-if="fieldType==='dictionary'"
      :placeholder="fieldOptions.placeholder"
      :value="defaultValue"
      disabled
    />
    <!-- 自动编号-->
    <el-input
      v-else-if="fieldType==='autoNumber'"
      :value="defaultValue"
      :placeholder="fieldOptions.placeholder"
      prefix-icon="ibps-icon-list-ol"
      disabled
    />
    <!-- 上传附件-->
    <ibps-attachment
      v-else-if="fieldType==='attachment'"
      :value="defaultValue"
      :placeholder="fieldOptions.placeholder"
      disabled
    />
    <!-- 选择器-->
    <ibps-user-selector
      v-else-if="fieldType==='selector'"
      :value="defaultValue"
      :placeholder="$utils.isNotEmpty(fieldOptions.placeholder)? fieldOptions.placeholder:'请选择'"
      :readonly="true"
    />
    <!-- 自定义对话框-->
    <el-input
      v-else-if="fieldType==='customDialog'"
      :value="defaultValue"
      :placeholder="fieldOptions.placeholder"
      :prefix-icon="icon"
      type="text"
      disabled
    />
    <!-- 关联数据-->
    <el-select
      v-else-if="fieldType==='linkdata'"
      :value="defaultValue"
      style="width:100%;"
      disabled
    />
    <!-- 地址-->
    <div
      v-else-if="fieldType==='address'"
    >
      <ibps-address
        :value="defaultValue"
        :size="fieldOptions.size"
        :top-val="topVal||'0'"
        :top="fieldOptions.top || 'country'"
        :level="fieldOptions.level||'district'"
        data-type="code"
        disabled
      />
      <el-input
        v-if="fieldOptions.is_street"
        v-model="fieldOptions.stree"
        placeholder="详细地址"
        disabled
      />
    </div>
    <!-- 签名-->
    <div
      v-else-if="fieldType==='signature'"
      class="fr-signature-outer"
    >
      <div class="fr-signature-header">
        <div class="fr-signature-label">{{ fieldOptions.placeholder }}</div>
        <div class="fr-signature-toolbar">
          <a href="javascript:void(0);" data-toggle="signature-clear">清除</a>
        </div>
      </div>
      <div class="fr-signature-div" />
    </div>
    <!-- 图片控件 -->
    <ibps-image
      v-else-if="fieldType==='image'"
      :value="defaultValue"
      :width="fieldOptions.width"
      :height="fieldOptions.height"
      :limit="fieldOptions.limit"
      :accept="fieldOptions.accept"
      :tip="fieldOptions.tip"
      :size="fieldOptions.size"
      :upload-type="fieldOptions.uploadType"
    />
    <!-- =======================系统字段==============================-->
    <!-- 当前用户-->
    <ibps-user-selector
      v-else-if="fieldType==='currentUser'"
      :value="defaultValue"
      placeholder="自动获取当前用户"
      disabled
    />
    <!-- 当前组织-->
    <ibps-user-selector
      v-else-if="fieldType==='currentOrg'"
      :value="defaultValue"
      :placeholder="$utils.isNotEmpty(fieldOptions.placeholder)? fieldOptions.placeholder:'自动获取当前组织'"
      disabled
    />
    <!-- =======================流程字段==============================-->
    <!-- 流程图-->
    <img
      v-else-if="fieldType==='flow_diagram'"
      :src="flowDiagramImage"
    >
    <!-- 审批历史-->
    <img
      v-else-if="fieldType==='approval_history'"
      :src="approvalHistoryImage"
      style="width: 100%;"
    >
    <!-- 审批意见-->
    <approval-opinion
      v-else-if="fieldType==='approval_opinion'"
      :enable-common="fieldOptions.common_statment"
      disabled
    />
    <!-- =======================其它字段==============================-->
    <!-- 文本-->
    <span v-else-if="fieldType==='label'">
      {{ field.value|| '用于展示文本或者公式计算的值,且数据不会保存' }}
    </span>
    <!-- 链接-->
    <ibps-link
      v-else-if="fieldType==='hyperlink'"
      :text="fieldOptions.text"
      :link="fieldOptions.link"
      :show-type="fieldOptions.showType"
      :text-type="fieldOptions.textType"
      :link-type="fieldOptions.linkType"
      :type="fieldOptions.type"
      :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
    />

    <span v-else>未知控件类型</span>
    <div v-if="element && element.desc" class="ibps-help-block">
      {{ element.desc }}
    </div>
  </div>
</template>
<script>
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAddress from '@/components/ibps-address/cascader'
import IbpsLink from '@/components/ibps-link'
import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
import FlowDiagramImage from '@/assets/images/form/flow_diagram.png'
import ApprovalHistoryImage from '@/assets/images/form/approval_history.png'

export default {
  components: {
    IbpsUeditor,
    IbpsDictionary,
    IbpsAttachment,
    IbpsUserSelector,
    IbpsAddress,
    IbpsLink,
    ApprovalOpinion
  },
  props: {
    element: Object
  },
  data() {
    return {
      field: this.element,
      flowDiagramImage: FlowDiagramImage,
      approvalHistoryImage: ApprovalHistoryImage,
      ajaxOptions: [{
        value: '0',
        label: '动态获取'
      }]
    }
  },
  computed: {
    fieldType() {
      return this.field.field_type
    },
    fieldOptions() {
      return this.field.field_options || {}
    },
    options() {
      if (this.field.field_options.datasource === 'valuesource') {
        return this.ajaxOptions
      } else {
        return this.field.field_options.options
      }
    },
    defaultValue() {
      if (this.field.field_options.default_value_type === 'fixed') {
        if (this.fieldType === 'radio' || this.fieldType === 'checkbox' || this.fieldType === 'select') {
          const defaultValue = []
          this.options.forEach((option, i) => {
            if (option.checked === true) {
              defaultValue.push(this.fieldType !== 'select' ? i : option.label)
            }
          })
          if (this.fieldType !== 'checkbox') {
            return defaultValue.length > 0 ? defaultValue[0] : void 0
          }
          return defaultValue
        } else if (this.fieldType === 'selector') {
          return void 0
        } else {
          return this.field.field_options.default_value
        }
      } else {
        return void 0
      }
    },
    autosize() {
      let autosize = this.field.field_options.autosize
      if (this.field.field_options.autosize && (this.field.field_options.min_rows || this.field.field_options.max_rows)) {
        const row = {}
        row.minRows = this.field.field_options.min_rows ? this.field.field_options.min_rows : null
        row.maxRows = this.field.field_options.max_rows ? this.field.field_options.max_rows : null
        autosize = row
      }
      return autosize
    },
    ueditorConfig() {
      const config = {
        initialContent: this.field.field_options.placeholder,
        toolbars: []
      }

      const toolbars = this.field.field_options.toolbars
      if (toolbars && toolbars.length > 0) {
        config.toolbars.push(toolbars)
      }
      return config
    },
    icon() {
      return 'ibps-icon-' + (this.field.field_options.icon || 'search')
    },
    topVal() {
      if (this.field.field_options.top === 'country') {
        return '0'
      }
      if (this.field.field_options.topval) {
        return this.field.field_options.topval[this.field.field_options.topval.length - 1]
      } else {
        return void 0
      }
    }
  },
  watch: {
    element: {
      handler(val) {
        this.field = val
      },
      deep: true
    }
  }
}
</script>

