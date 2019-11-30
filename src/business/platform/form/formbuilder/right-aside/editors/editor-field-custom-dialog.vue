<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">对话框类型</template>
        <el-select v-model="fieldOptions.dialog_type" style="width:100%;">
          <el-option value="dialog" label="自定义对话框" />
          <el-option value="url" label="URL对话框" />
        </el-select>
      </el-form-item>
      <template v-if="fieldOptions.dialog_type==='dialog'">
        <el-form-item>
          <template slot="label">自定义对话框</template>
          <ibps-data-template-selector2
            v-model="fieldOptions.dialog"
            type="dialog"
            placeholder="请选择自定义对话框"
            @change="(data)=>{changeDataSource(data)}"
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

        <div v-if="$utils.isNotEmpty(dynamicConditions)" class="el-form-item el-form-item--mini">
          <div class="el-form-item__label">设置动态参数</div>
          <div class="el-form-item__content">
            <el-button style="width:220px;" type="primary" plain size="mini" @click="settingDataTemplateCondition('dialog')">设置动态参数</el-button>
          </div>
        </div>

        <div v-if="fieldOptions.multiple === 'N' && $utils.isNotEmpty(resultColumns)" class="el-form-item el-form-item--mini">
          <div class="el-form-item__label">设置联动数据</div>
          <div class="el-form-item__content">
            <el-button style="width:220px;" type="primary" plain size="mini" @click="settingDataTemplateLinkData('dialog')">设置联动数据</el-button>
          </div>
        </div>
      </template>
      <template v-else-if="fieldOptions.dialog_type==='url'">
        <el-form-item>
          <template slot="label">URL设置</template>
          <el-button style="width:100%;" type="primary" @click="settingURLDialog">设置</el-button>
        </el-form-item>
        <el-form-item>
          <template slot="label">是否多选</template>
          <el-switch
            v-model="fieldOptions.multiple"
            active-value="Y"
            inactive-value="N"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <template slot="label">图标</template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item>
        <template slot="label">存储格式</template>
        <el-select v-model="fieldOptions.store" style="width:100%;">
          <el-option
            v-for="item in dialogStoreOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </div>

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
  </div>
</template>
<script>
import { dialogStoreOptions } from '@/business/platform/form/constants/fieldOptions'

import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import EditorMixin from '../mixins/editor'
import DataTemplateMixin from '../mixins/data-template'
import DataTemplateCondition from '../components/data-template-condition'
import DataTemplateLinkdata from '../components/data-template-linkdata'

export default {
  components: {
    DataTemplateCondition,
    DataTemplateLinkdata,
    IbpsDataTemplateSelector2
  },
  mixins: [EditorMixin, DataTemplateMixin],
  data() {
    return {
      dialogStoreOptions: dialogStoreOptions
    }
  },
  computed: {
    hasLinkCondition() {
      return this.$utils.isNotEmpty(this.fieldItem.field_options.link_condition)
    },
    hasLinkLinkage() {
      return this.$utils.isNotEmpty(this.fieldItem.field_options.link_linkage)
    }
  },
  methods: {
    settingURLDialog() {

    }
  }
}
</script>

