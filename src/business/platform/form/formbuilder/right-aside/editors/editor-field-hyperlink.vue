<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span v-text="'链接设置'" />
    </div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">文本<help-tip prop="hyperlinkText" /></template>
        <el-select v-model="fieldOptions.textType" style="width:100%;" @change="changeTextValueType">
          <el-option v-for="item in textValueOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="fieldOptions.textType === 'fixed'" style="padding-top: 5px;">
          <el-input v-model="fieldOptions.text" clearable />
        </div>
        <div v-else style="padding-top: 5px;">
          <el-button type="primary" plain style="width:100%;" @click="handleTextValue">{{ fieldOptions.textType | optionsFilter(textValueOptions) }}</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <template slot="label">显示类型</template>
        <el-select v-model="fieldOptions.showType" style="width:100%;">
          <el-option v-for="item in showTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">显示样式</template>
        <el-select v-model="fieldOptions.type" style="width:100%;">
          <el-option value="default" label="默认" />
          <el-option value="primary" label="主要" />
          <el-option value="success" label="成功" />
          <el-option value="info" label="信息" />
          <el-option value="warning" label="警告" />
          <el-option value="danger" label="危险" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">图标</template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item>
        <template slot="label">事件脚本类型<help-tip prop="hyperlinkScriptType" /></template>
        <el-select v-model="fieldOptions.linkType" style="width:100%;" @change="changeLinkValueType">
          <el-option v-for="item in defauleValueOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="fieldOptions.linkType === 'fixed'" style="padding-top: 5px;">
          <el-input v-model="fieldOptions.link" type="textarea" autosize clearable />
        </div>
        <div v-else style="padding-top: 5px;">
          <el-button type="primary" plain style="width:100%;" @click="handleDefaultValue">{{ fieldOptions.linkType | optionsFilter(defauleValueTypeOptions) }}</el-button>
        </div>
      </el-form-item>

    </div>
    <formula-edit
      :visible="formulaEditVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="dialogData"
      @callback="setDefaultValue"
      @close="visible => formulaEditVisible = visible"
    />

    <dynamic-script
      key="1"
      :visible="dynamicScriptVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="dialogData"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptVisible = visible"
    />
    <dynamic-script
      key="2"
      :visible="dynamicScriptTextVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="dialogData"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptTextVisible = visible"
    />
    <javascript-script
      key="11"
      :visible="javascriptScriptTextVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="dialogData"
      @callback="setDefaultTextValue"
      @close="visible => javascriptScriptTextVisible = visible"
    />
    <javascript-script
      key="22"
      :visible="javascriptScriptVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="dialogData"
      @callback="setDefaultValue"
      @close="visible => javascriptScriptVisible = visible"
    />
    <linkage-data
      :visible="linkageDataVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="dialogData"
      @callback="setDefaultValue"
      @close="visible => linkageDataVisible = visible"
    />
  </div>
</template>
<script>
import FIELD_TYPES from '@/business/platform/form/constants/fieldTypes'
import { defauleValueTypeOptions } from '@/business/platform/form/constants/fieldOptions'
import FormulaEdit from '../components/formula-edit'
import DynamicScript from '../components/dynamic-script'
import JavascriptScript from '../components/javascript-script'
import LinkageData from '../components/linkage-data'
import EditorMixin from '../mixins/editor'

export default {
  components: {
    FormulaEdit,
    DynamicScript,
    LinkageData,
    JavascriptScript
  },
  mixins: [EditorMixin],
  props: {
    boData: {
      type: Array
    },
    defaultValueTypes: {// 默认值类型
      type: String,
      default: 'fixed,dynamic,javascript'
    },
    linkValueTypes: {
      type: String,
      default: 'fixed,javascript'
    }
  },
  data() {
    return {
      defauleValueTypeOptions: defauleValueTypeOptions,
      showTypeOptions: [{
        value: 'link',
        label: '链接'
      }, {
        value: 'button',
        label: '按钮'
      }],
      formulaEditVisible: false,
      dynamicScriptVisible: false,
      dynamicScriptTextVisible: false,
      linkageDataVisible: false,
      isLinkButtonClick: false,
      javascriptScriptVisible: false,
      javascriptScriptTextVisible: false
    }
  },
  computed: {
    defauleValueOptions() {
      const options = []
      defauleValueTypeOptions.forEach((type) => {
        if (this.defaultValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    textValueOptions() {
      const options = []
      defauleValueTypeOptions.forEach((type) => {
        if (this.linkValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    dialogData() {
      const val = this.isLinkButtonClick ? this.fieldItem.field_options.link : this.fieldItem.field_options.text_javascript
      console.log(val, 'dialogData')
      return val
    }
  },
  watch: {
    // fieldItem: {
    //   handler: function(val) {
    //     console.log(val)
    //   },
    //   immediate: true
    // }
  },
  methods: {
    getLabel() {
      return FIELD_TYPES[this.fieldItem.field_type]['label'] || '字段属性'
    },
    /**
     * 设置默认值
     */
    setDefaultValue(data) {
      const key = this.isLinkButtonClick ? 'link' : 'text'
      this.fieldItem.field_options[key] = data
    },
    setDefaultTextValue(data) {
      let value = ''
      try {
        value = new Function(data + ';')()
      } catch (e) {
        value = ''
      }
      this.fieldItem.field_options.text = value
      this.fieldItem.field_options.text_javascript = data
    },
    /**
     * 改变默认值
     */
    changeLinkValueType(type) {
      this.fieldOptions.linkType = type
      if (this.fieldOptions.link) { this.fieldOptions.link = null }
    },
    changeTextValueType(type) {
      this.fieldOptions.textType = type
      if (this.fieldOptions.text) { this.fieldOptions.text = null }
    },
    handleDefaultValue() {
      this.isLinkButtonClick = true
      switch (this.fieldOptions.linkType) {
        case 'fixed':// 固定值
          this.fixedVisible = true
          break
        case 'dynamic': // 动态脚本
          this.dynamicScriptVisible = true
          break
        case 'javascript': // javascript脚本
          this.javascriptScriptVisible = true
          break
        case 'linkage': // 联动数据
          this.linkageDataVisible = true
          break
        case 'formula': // 公式编辑
          this.formulaEditVisible = true
          break
        default:
          break
      }
    },
    handleTextValue() {
      this.isLinkButtonClick = false
      switch (this.fieldOptions.textType) {
        case 'fixed':// 固定值
          this.fixedVisible = true
          break
        case 'dynamic': // 动态脚本
          this.dynamicScriptTextVisible = true
          break
        case 'javascript': // javascript脚本
          this.javascriptScriptTextVisible = true
          break
        case 'linkage': // 联动数据
          this.linkageDataVisible = true
          break
        case 'formula': // 公式编辑
          this.formulaEditVisible = true
          break
        default:
          break
      }
    }
  }
}
</script>
