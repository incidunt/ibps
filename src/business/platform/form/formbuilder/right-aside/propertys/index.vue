<template>
  <div class="form-property">
    <el-form
      ref="formDef"
      :model="formDef"
      :rules="rules"
      size="mini"
      label-width="80px"
    >
      <div class="panel panel-default">
        <div class="panel-heading">表单属性</div>
        <div class="panel-body">
          <el-form-item label="表单标题" prop="name">
            <el-input
              v-model="formDef.name"
              v-pinyin="{vm:formDef}"
              placeholder="表单标题"
            />
          </el-form-item>
          <el-form-item label="表单key" prop="key">
            <el-input v-model="formDef.key" placeholder="表单key" />
          </el-form-item>
          <el-form-item label="表单分类">
            <ibps-type-select
              v-model="formDef.typeId"
              category-key="FORM_TYPE"
              clearable
            />
          </el-form-item>
          <el-form-item label="表单描述">
            <el-input
              v-model="formDef.desc"
              type="textarea"
              placeholder="表单描述"
            />
          </el-form-item>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">表单配置</div>
        <div class="panel-body">
          <el-form-item label="标签宽度">
            <el-row>
              <el-col :span="12">
                <el-input-number
                  v-model="formDef.attrs.labelWidth"
                  :min="formDef.attrs.labelWidthUnit==='px'?50:10"
                  :max="formDef.attrs.labelWidthUnit==='px'?500:100"
                  :step="1"
                  style="width: 100%;"
                />
              </el-col>
              <el-col :span="11">
                <el-select v-model="formDef.attrs.labelWidthUnit" style="width: 100%;" @change="changeLabelWidthUnit">
                  <el-option label="像素(px)" value="px" />
                  <el-option label="百分比(%)" value="%" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formDef.attrs.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="尺寸">
            <el-select v-model="formDef.attrs.size" style="width:100%;">
              <el-option label="默认" value="" />
              <el-option label="中" value="medium" />
              <el-option label="小" value="small" />
              <el-option label="迷你" value="mini" />
            </el-select>
          </el-form-item>
          <el-form-item label="验证图标">
            <el-switch v-model="formDef.attrs.statusIcon" />
          </el-form-item>
          <!-- <el-form-item label="字段描述">
            <el-radio-group v-model="formDef.attrs.descPosition">
              <el-radio-button label="lableIcon">在标签图标</el-radio-button>
              <el-radio-button label="inline">在一行</el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="文本字段间有冒号" label-width="125px">
            <el-switch v-model="formDef.attrs.colon" />
          </el-form-item>
          <el-form-item label="文本只读显示样式" label-width="125px">
            <el-select v-model="formDef.attrs.read_style" style="width:100%;">
              <el-option label="文本展示" value="text" />
              <el-option label="原样展示" value="original" />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <div class="panel panel-default">
        <div class="panel-heading">表单提交校验<help-tip prop="formVerify" /></div>
        <div class="panel-body">
          <el-table
            v-if="formVerifyList && formVerifyList.length >0"
            :data="formVerifyList"
            :show-header="false"
            size="small"
            style=" border: 1px solid #ebeef5;"
          >
            <el-table-column prop="show" />
            <el-table-column
              width="80"
            >
              <template slot-scope="{ $index}">
                <el-button type="text" icon="ibps-icon-remove" size="small" @click="removeFormVerify($index)" />
                <el-button type="text" icon="ibps-icon-edit" size="small" @click="editFormVerify($index)" />
              </template>
            </el-table-column>
          </el-table>
          <div style="padding-top: 5px;">
            <el-button style="width:100%;" type="primary" icon="ibps-icon-plus-square" @click="editFormVerify()">添加校验条件</el-button>
          </div>
        </div>
      </div>
      <!-- <div class="panel panel-default">
        <div class="panel-heading">表单规则<help-tip prop="formRule" /></div>
        <div class="panel-body">
          <el-button style="width:100%;" type="primary" @click="editFormRule()">设置表单规则</el-button>
        </div>
      </div> -->
      <div class="panel panel-default">
        <div class="panel-heading">表单脚本<help-tip prop="formScript" /></div>
        <div class="panel-body">
          <el-button style="width:100%;" type="primary" icon="ibps-icon-file-code-o" @click="editFormScript()">表单脚本</el-button>
        </div>
      </div>
      <!-- <div class="panel panel-default">
        <div class="panel-heading">提交设置<help-tip prop="formSubmit" /></div>
        <div class="panel-body">
          <el-form-item label="开启后端验证" label-width="125px">
            <el-switch v-model="formDef.attrs.validated" />
          </el-form-item>
          <el-form-item label="开启提交冲突提示" label-width="125px">
            <el-switch v-model="formDef.attrs.conflict" />
          </el-form-item>
        </div>
      </div> -->
      <div class="panel panel-default">
        <div class="panel-heading">其他设置</div>
        <div class="panel-body">
          <el-form-item label="隐藏表单标题" label-width="125px">
            <el-switch v-model="formDef.attrs.hide_name" />
          </el-form-item>
          <el-form-item v-if="!formDef.attrs.hide_name" label="隐藏表单描述" label-width="125px">
            <el-switch v-model="formDef.attrs.hide_desc" />
          </el-form-item>

        </div>
      </div>
    </el-form>

    <formula-edit
      :visible="formulaEditVisible"
      :title="'表单校验'"
      :bo-data="boData"
      :data="formVerify"
      verify
      @callback="handlerFormVerify"
      @close="visible => formulaEditVisible = visible"
    />

    <form-script
      :visible="formScriptVisible"
      :bo-data="boData"
      :data="formScript"
      @callback="handlerFormScript"
      @close="visible => formScriptVisible = visible"
    />
  </div>
</template>
<script>
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import FormulaEdit from '../components/formula-edit'
import FormScript from '../components/form-script'

/**
 * 表单属性
 */
export default {
  name: 'form-property',
  components: {
    IbpsTypeSelect,
    FormulaEdit,
    FormScript
  },
  props: {
    data: {
      type: Object
    },
    boData: {
      type: Array
    }
  },
  data() {
    return {
      formulaEditVisible: false,
      index: -1,
      formVerify: '',
      formScriptVisible: false,
      formDef: {
        name: '',
        key: '',
        typeId: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    formVerifyList() {
      return this.formDef.attrs.verifys || []
    },
    formScript() {
      return this.formDef.attrs.script || ''
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.formDef = this.data
      },
      immediate: true,
      deep: true
    },
    formDef: {
      handler: function(val, oldVal) {
        this.$emit('update', val)
      },
      deep: true
    }
  },
  methods: {
    changeLabelWidthUnit(value) {
      this.formDef.attrs.labelWidth = value === 'px' ? 100 : 20
    },
    // 添加、编辑
    editFormVerify(index = -1) {
      this.index = index
      this.formulaEditVisible = true
      this.formVerify = this.formVerifyList[index]
    },
    // 删除表单校验条件
    removeFormVerify(index) {
      this.formDef.attrs.verifys.splice(index, 1)
    },
    handlerFormVerify(data) {
      if (this.index > -1) {
        this.formDef.attrs.verifys.splice(this.index, 1, data)
      } else {
        this.formDef.attrs.verifys.push(data)
      }
    },
    /**
     * 表单规则
     */
    editFormRule() {

    },
    /**
     * 表单脚本
     */
    editFormScript() {
      this.formScriptVisible = true
    },
    handlerFormScript(value) {
      this.formDef.attrs.script = value
    },

    handleInput(key, val) {
      this.formDef[key] = val
      this.$emit('update', JSON.parse(JSON.stringify(this.formDef)))
    }
  }
}
</script>

