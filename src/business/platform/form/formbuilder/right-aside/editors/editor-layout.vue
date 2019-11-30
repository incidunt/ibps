<template>
  <div class="panel panel-default toolbars-panel">
    <div class="panel-heading">布局设置</div>
    <div class="panel-body">
      <el-form-item v-if="types.includes('width')">
        <template slot="label">控件宽度</template>
        <el-input-number v-model="fieldOptions.width" />
      </el-form-item>

      <el-form-item v-if="types.includes('labelWidth')" label="标签宽度">
        <el-row>
          <el-col :span="2">
            <el-checkbox v-model="fieldOptions.is_label_width" @change="changeIsLabelWidth" />
          </el-col>
          <el-col :span="12">
            <el-input-number
              v-model="fieldOptions.label_width"
              :disabled="!fieldOptions.is_label_width"
              style="width: 100%;"
              :min="fieldOptions.label_width_unit==='px'?50:10"
              :max="fieldOptions.label_width_unit==='px'?500:100"
              :step="1"
            />
          </el-col>
          <el-col :span="10">
            <el-select
              v-model="fieldOptions.label_width_unit"
              :disabled="!fieldOptions.is_label_width"
              style="width: 100%;"
              @change="changeLabelWidthUnit"
            >
              <el-option label="像素(px)" value="px" />
              <el-option label="百分比(%)" value="%" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="types.includes('rows')">
        <template slot="label">行数<help-tip prop="rows" /></template>
        <el-input v-model="fieldOptions.rows" />
      </el-form-item>
      <el-form-item v-if="types.includes('autosize')" label-width="120px">
        <template slot="label">自适应高度<help-tip prop="autosize" /></template>
        <el-switch v-model="fieldOptions.autosize" />
        <div v-if="fieldOptions.autosize">
          <el-input-number
            v-model="fieldOptions.min_rows"
            :min="1"
            placeholder="最小行数"
            controls-position="right"
            style="width:90px;"
          />
          -
          <el-input-number
            v-model="fieldOptions.max_rows"
            :min="fieldOptions.min_rows||1"
            placeholder="最大行数"
            controls-position="right"
            style="width:90px;"
          />
        </div>
      </el-form-item>
      <el-form-item v-if="types.includes('mode')">
        <template slot="label">编辑模式<help-tip prop="tableMode" /></template>
        <el-select v-model="fieldOptions.mode">
          <el-option
            v-for="(mode,index) in tabeModeOptions"
            :key="index"
            :value="mode.value"
            :label="mode.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="types.includes('index')">
        <template slot="label">显示序号<help-tip prop="index" /></template>
        <el-switch v-model="fieldOptions.index" />
      </el-form-item>
      <el-form-item v-if="types.includes('summary')">
        <template slot="label">表尾合计行<help-tip prop="summary" /></template>
        <el-switch v-model="fieldOptions.summary" />
        <el-input v-model="fieldOptions.sum_text" placeholder="合计描述" />
      </el-form-item>
      <el-form-item v-if="types.includes('height')">
        <template slot="label">高度<help-tip prop="height" /></template>
        <el-input v-model="fieldOptions.height">
          <template slot="append">像素(px)</template>
        </el-input>
      </el-form-item>

      <el-form-item v-if="types.includes('arrangement')">
        <template slot="label">排序方式<help-tip prop="arrangement" /></template>
        <el-radio-group v-model="fieldOptions.arrangement">
          <el-radio-button label="horizontal">横向</el-radio-button>
          <el-radio-button label="vertical">纵向</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="types.includes('gridsToOccupy')" label-width="120px">
        <template slot="label">字段占比%<help-tip prop="gridsToOccupy" /></template>
        <el-radio-group v-model="fieldOptions.grids_to_occupy">
          <el-radio-button label="1">25</el-radio-button>
          <el-radio-button label="2">50</el-radio-button>
          <el-radio-button label="3">75</el-radio-button>
          <el-radio-button label="4">100</el-radio-button>
        </el-radio-group>
      </el-form-item>

    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
      tabeModeOptions: [{
        value: 'inner',
        label: '表内编辑模式'
      }, {
        value: 'block',
        label: '块模式'
      }, {
        value: 'dialog',
        label: '弹窗模式'
      }]
    }
  },
  methods: {
    changeIsLabelWidth() {
      this.fieldOptions.label_width_unit = 'px'
    },
    changeLabelWidthUnit(value) {
      this.fieldOptions.label_width = value === 'px' ? 100 : 20
    }
  }
}
</script>

