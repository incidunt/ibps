<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">关联数据</template>
        <ibps-data-template-selector2
          v-model="fieldOptions.linkdata"
          placeholder="请选择关联数据"
          type="valueSource"
          @change="(data)=>{changeDataSource(data,'linkdata')}"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">是否多选</template>
        <el-switch
          v-model="fieldOptions.multiple"
          active-value="Y"
          inactive-value="N"
        />
      </el-form-item>

      <el-form-item>
        <div slot="label">关联配置<help-tip prop="linkConfig" /></div>
        <div class="el-form-item__content">
          <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateConfig('linkdata')">设置关联配置</el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="$utils.isNotEmpty(dynamicConditions)">
        <div slot="label">动态参数<help-tip prop="linkConfig" /></div>
        <div class="el-form-item__content">
          <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateCondition('linkdata')">设置动态参数</el-button>
        </div>
      </el-form-item>
      <template v-if="fieldOptions.multiple === 'N' && $utils.isNotEmpty(resultColumns)">
        <el-form-item>
          <div slot="label">联动数据<help-tip prop="linkConfig" /></div>
          <div class="el-form-item__content">
            <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateLinkData('linkdata')">设置联动数据</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <div slot="label">关联属性<help-tip prop="linkConfig" /></div>
          <div class="el-form-item__content">
            <el-button style="width:100%;" type="primary" size="mini" plain @click="settingDataTemplateLinkAttr('linkdata')">设置关联属性</el-button>
          </div>
        </el-form-item>
      </template>

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
  </div>
</template>
<script>
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import EditorMixin from '../mixins/editor'
import DataTemplateMixin from '../mixins/data-template'
import DataTemplateConfig from '../components/data-template-config'
import DataTemplateCondition from '../components/data-template-condition'
import DataTemplateLinkdata from '../components/data-template-linkdata'

export default {
  components: {
    IbpsDataTemplateSelector2,
    DataTemplateConfig,
    DataTemplateCondition,
    DataTemplateLinkdata
  },
  mixins: [EditorMixin, DataTemplateMixin]
}
</script>

