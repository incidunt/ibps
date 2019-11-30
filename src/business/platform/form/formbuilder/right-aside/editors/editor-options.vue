<template>
  <div class="panel panel-default">
    <div class="panel-heading">选项配置</div>
    <div class="panel-body">
      <el-radio-group v-model="fieldOptions.datasource" size="mini" style="margin-bottom:10px;">
        <el-radio-button
          v-for="item in datasourceOptions"
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-radio-button>
      </el-radio-group>
      <help-tip prop="datasource" />
      <!---=================自定义=============---->
      <div v-if="datasource === 'custom' || !datasource ">
        <vue-draggable
          v-model="itemOptions"
          v-bind="draggableOptions"
          class="list-group"
          @start="isDragging = true"
          @end="()=>{isDragging= false}"
        >
          <div v-for="(opt,i) in itemOptions" :key="opt.val+i" class="list-group-item">
            <div class="actions-left">
              <el-tooltip content="设为默认值">
                <el-checkbox v-if="fieldType==='checkbox'" v-model="opt.checked" />
                <el-radio v-else v-model="defaultValue" :label="i" @click.native.prevent="handleDefaultValue(i)">&nbsp;</el-radio>
              </el-tooltip>
              <el-input v-model="opt.val" size="mini" placeholder="选项值" />
              <el-input v-model="opt.label" size="mini" placeholder="选项标签" />
            </div>
            <el-button-group class="actions">
              <el-button size="small" type="text" title="新增" icon="ibps-icon-add" @click="addOption(i)" />
              <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeOption(i)" />
              <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
            </el-button-group>
          </div>
        </vue-draggable>
        <div class="more-actions">
          <div class="el-button el-button--text" @click="addOption">添加选项 </div>
          <!-- <el-divider direction="vertical" />
          <div class="el-button el-button--text" @click="optionTemplate">选项模版 </div> -->
          <el-divider direction="vertical" />
          <div class="el-button el-button--text" @click="editOption">编辑选项 </div>
        </div>

        <option-template
          :visible="optionTemplateVisible"
          :title="title"
          :options="choices"
          :is-template="isTemplate"
          @close="visible => optionTemplateVisible = visible"
          @callback="handleOptions"
        />
      </div>
      <!---=================值来源=============---->
      <div v-else-if="datasource === 'valuesource'">
        <el-form-item>
          <template slot="label">值来源<help-tip prop="valueSource" /></template>
          <ibps-data-template-selector2
            v-model="fieldOptions.value_source"
            placeholder="请选择值来源"
            style="width:100%;"
            @change="(data)=>{changeDataSource(data,'value_source')}"
          />
        </el-form-item>
        <el-form-item>
          <div slot="label">关联配置<help-tip prop="linkConfig" /></div>
          <div class="el-form-item__content">
            <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateConfig('value_source')">设置关联配置</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="$utils.isNotEmpty(dynamicConditions)">
          <div slot="label">动态参数<help-tip prop="linkConfig" /></div>
          <div class="el-form-item__content">
            <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateCondition('value_source')">设置动态参数</el-button>
          </div>
        </el-form-item>
        <template v-if="fieldType !== 'checkbox' && $utils.isNotEmpty(resultColumns)">
          <el-form-item>
            <div slot="label">联动数据<help-tip prop="linkConfig" /></div>
            <div class="el-form-item__content">
              <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateLinkData('value_source')">设置联动数据</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div slot="label">关联属性<help-tip prop="linkConfig" /></div>
            <div class="el-form-item__content">
              <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateLinkAttr('value_source')">设置关联属性</el-button>
            </div>
          </el-form-item>
        </template>
      </div>
    </div>

    <!--数据模版-参数配置-->
    <data-template-config
      :visible="dataTemplateConfigVisible"
      :columns="resultColumns"
      :data="fieldItem.field_options.link_config"
      @callback="setDataTemplateConfig"
      @close="visible => dataTemplateConfigVisible = visible"
    />

    <!--数据模版-动态参数配置-->
    <data-template-condition
      :visible="dataTemplateConditionVisible"
      :conditions="dynamicConditions"
      :data="fieldItem.field_options.link_condition"
      :fields="formFields"
      @callback="setDataTemplateCondition"
      @close="visible => dataTemplateConditionVisible = visible"
    />

    <!--数据模版-联动数据配置-->
    <data-template-linkdata
      :visible="dataTemplateLinkDataVisible"
      :columns="resultColumns"
      :data="fieldItem.field_options.link_linkage"
      :fields="formFields"
      @callback="setDataTemplateLinkData"
      @close="visible => dataTemplateLinkDataVisible = visible"
    />
    <!--数据模版-联动属性配置-->
    <data-template-linkdata
      :visible="dataTemplateLinkAttrVisible"
      :columns="resultColumns"
      :data="fieldItem.field_options.link_attr"
      :fields="formLabelFields"
      @callback="setDataTemplateLinkAttr"
      @close="visible => dataTemplateLinkAttrVisible = visible"
    />
  </div>
</template>

<script>
import VueDraggable from 'vuedraggable'
import OptionTemplate from '../components/option-template'
import EditorMixin from '../mixins/editor'
import DataTemplateMixin from '../mixins/data-template'

import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import DataTemplateConfig from '../components/data-template-config'
import DataTemplateCondition from '../components/data-template-condition'
import DataTemplateLinkdata from '../components/data-template-linkdata'

export default {
  components: {
    VueDraggable,
    OptionTemplate,
    IbpsDataTemplateSelector2,
    DataTemplateConfig,
    DataTemplateCondition,
    DataTemplateLinkdata
  },
  mixins: [EditorMixin, DataTemplateMixin],
  data() {
    return {
      title: '选项模版',
      choices: [],
      isTemplate: false,
      optionTemplateVisible: false,
      isDragging: false,
      datasourceOptions: [{
        value: 'custom',
        label: '静态数据'
      }, {
        value: 'valuesource',
        label: '值来源'
      }
      //  {
      //   key: 'dictionary',
      //   value: '数据字典'
      // }
      ],
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      },
      loading: false,
      dataSourceOptions: []
    }
  },
  computed: {
    itemOptions: {
      get() {
        return this.fieldOptions.options || []
      },
      set(val) {
        this.fieldOptions.options = val
      }
    },
    datasource() {
      return this.fieldOptions.datasource || 'custom'
    },
    defaultValue: {
      get() {
        const defaultOption = this.fieldOptions.options.findIndex((option) => option.checked === true)
        return defaultOption !== -1 ? defaultOption : void 0
      },
      set(value) {
        this.fieldOptions.options.forEach((option, i) => {
          option.checked = i === value
        })
        this.handleOptions(JSON.parse(JSON.stringify(this.fieldOptions.options)))
      }
    }
  },
  methods: {
    addOption(i = -1, type) {
      var newOption = {
        val: '',
        label: '选项',
        disabled: false
      }
      if (i > -1) {
        this.itemOptions.splice(i + 1, 0, newOption)
      } else {
        this.itemOptions.push(newOption)
      }
    },
    removeOption(i) {
      this.itemOptions.splice(i, 1)
    },
    editOption() {
      this.title = '编辑选项'
      this.choices = JSON.parse(JSON.stringify(this.itemOptions))
      this.isTemplate = false
      this.optionTemplateVisible = true
    },
    optionTemplate(i) {
      this.title = '选项模版'
      this.choices = []
      this.isTemplate = true
      this.optionTemplateVisible = true
    },
    handleOptions(data) {
      this.itemOptions = data
    },
    handleDefaultValue(value) {
      const defaultOption = this.itemOptions.findIndex((option) => option.checked === true)
      this.defaultValue = defaultOption !== value ? value : void 0
    }
  }
}
</script>
<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin-bottom: -1px;
    .actions-left{
      height: 24px;
      line-height: 24px;
        .el-input {
        display: inline-block;
        width: 35%;
        vertical-align: middle;
      }
      .el-checkbox,.el-radio{
          margin-right: 10px;
      }
      .el-radio{
        margin-right: -5px;
      }
    }

    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: right;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }

</style>
