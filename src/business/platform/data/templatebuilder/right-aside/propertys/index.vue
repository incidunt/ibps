<template>
  <div class="template-property">
    <el-form
      ref="dataTemplate"
      :model="dataTemplate"
      :rules="rules"
      size="mini"
      label-width="80px"
    >
      <div class="panel panel-default">
        <div class="panel-heading">模版属性</div>
        <div class="panel-body">
          <el-form-item label="模版标题" prop="name">
            <el-input
              v-model="dataTemplate.name"
              v-pinyin="{vm:dataTemplate}"
              placeholder="模版标题"
              @input="(val)=>handleInput('name',val)"
            />
          </el-form-item>
          <el-form-item label="模版key" prop="key">
            <el-input
              v-model="dataTemplate.key"
              placeholder="模版key"
              @input="(val)=>handleInput('key',val)"
            />
          </el-form-item>
          <el-form-item label="模版分类" prop="typeId">
            <ibps-type-select
              v-model="dataTemplate.typeId"
              category-key="DATA_TEMPLATE_TYPE"
              clearable
              @input="(val)=>handleInput('typeId',val)"
            />
          </el-form-item>
          <el-form-item label="模版类型" prop="type">
            <el-select
              v-model="dataTemplate.type"
              style="width:100%;"
              @change="(val)=>handleInput('type',val)"
            >
              <el-option
                v-for="option in templateTypeOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dataTemplate.type !== 'valueSource'" label="展示形式" prop="showType">
            <el-select
              v-model="dataTemplate.showType"
              style="width:100%;"
              @change="(val)=>handleInput('showType',val)"
            >
              <el-option
                v-for="option in showTypeOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="dataTemplate.type !== 'valueSource' && dataTemplate.showType === 'compose'" label="组合形式:" prop="composeType">
            <el-select
              v-model="dataTemplate.composeType"
              style="width:100%;"
              @change="(val)=>handleInput('composeType',val)"
            >
              <el-option
                v-for="option in composeTypeOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="数据集" prop="datasetKey">
            <dataset-selector
              v-model="dataTemplate.datasetKey"
              value-key="key"
              @change="changeDataset"
            />
          </el-form-item>
          <el-form-item label="唯一字段" prop="unique">
            <el-select
              v-model="dataTemplate.unique"
              style="width:100%;"
              @change="(val)=>handleInput('unique',val)"
            >
              <el-option
                v-for="field in fields"
                :key="field.name"
                :value="field.name"
                :label="field.label"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">扩展属性</div>
        <div class="panel-body">
          <el-form-item label="绑定表单" prop="form">
            <form-def-selector
              v-model="dataTemplate.attrs.form_key"
              :value-key="'key'"
              :toolbar="formToolbar"
              @input="(val)=>handleAttrs('form_key',val)"
            />
          </el-form-item>
          <!-- <el-form-item label="打印模版" prop="formPrint">
            <form-print-selector v-model="dataTemplate.attrs.print_id" @input="(val)=>handleAttrs('print_id',val)" />
          </el-form-item> -->
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">模版脚本</div>
        <div class="panel-body">
          <el-button style="width:100%;" type="primary" icon="ibps-icon-file-code-o" @click="editTemplateScript('pc')">模版脚本</el-button>
          <!-- <el-button style="width:100%;margin:16px 0 0 0;" type="primary" icon="ibps-icon-file-code-o" @click="editTemplateScript('mobile')">移动端模版脚本</el-button> -->
          <template-script
            :visible="dialogScriptVisible"
            :title="title"
            @callback="handleDialogScript"
            @close="visible => dialogScriptVisible = visible"
          />
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { templateTypeOptions, showTypeOptions, composeTypeOptions } from '@/business/platform/data/constants'

import IbpsTypeSelect from '@/business/platform/cat/type/select'
import DatasetSelector from '@/business/platform/data/dataset/selector'
import FormDefSelector from '@/business/platform/form/form-def/selector'
// import FormPrintSelector from '@/business/platform/form/form-print/selector'
import TemplateScript from '../editors/template-script'
/**
 * 表单属性
 */
export default {
  components: {
    IbpsTypeSelect,
    DatasetSelector,
    FormDefSelector,
    // FormPrintSelector,
    TemplateScript
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogScriptVisible: false,
      title: '模板脚本设置',
      templateTypeOptions: templateTypeOptions,
      showTypeOptions: showTypeOptions,
      composeTypeOptions: composeTypeOptions,
      formToolbar: [{
        key: 'rechoose',
        type: 'primary',
        label: '重选'
      }, {
        key: 'remove',
        type: 'danger',
        label: '删除'
      }, {
        key: 'rights',
        type: 'success',
        label: '权限'
      }],
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    }),
    fields() {
      const fields = JSON.parse(JSON.stringify(this.datasets))
      return fields.filter((d) => {
        return d.parentId !== '0'
      })
    },
    dataTemplate: {
      get() {
        return this.data || {}
      },
      set(val) {
        this.$emit('update', val)
      }
    }
  },
  methods: {
    changeDataset(data) {
      this.dataTemplate.datasetType = data.type
    },
    handleInput(key, val) {
      this.dataTemplate[key] = val
      this.$emit('update', JSON.parse(JSON.stringify(this.dataTemplate)))
    },
    handleAttrs(key, val) {
      if (this.$utils.isEmpty(this.dataTemplate.attrs)) {
        this.dataTemplate.attrs = {}
      }
      this.dataTemplate.attrs[key] = val
      this.$emit('update', JSON.parse(JSON.stringify(this.dataTemplate)))
    },
    editTemplateScript(type) {
      if (type === 'pc') {
        this.title = '模板脚本设置'
      } else if (type === 'mobile') {
        this.title = '移动端模板脚本设置'
      }
      this.dialogScriptVisible = true
    },
    handleDialogScript(script) {
      // script 为codemirror中填入的脚本值
      console.log(script)
    },
    validate(callback) {
      this.$refs.dataTemplate.validate(callback)
    }
  }
}
</script>

