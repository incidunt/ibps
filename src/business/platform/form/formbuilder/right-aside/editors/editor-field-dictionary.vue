<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item required>
        <template slot="label">数据字典</template>
        <ibps-type-select
          v-model="fieldOptions.dictionary"
          category-key="DIC_TYPE"
          node-key="typeKey"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">是否多选<help-tip prop="multiple" /></template>
        <el-switch
          v-model="fieldOptions.multiple"
          @change="changeMultiple"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">默认值<help-tip prop="defaultValue" /></template>
        <ibps-dictionary
          v-model="fieldOptions.default_value"
          :type-key="fieldOptions.dictionary"
          :multiple="fieldOptions.multiple"
          :empty-text="'请先绑定的数据字典'"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">选值模式<help-tip prop="selectMode" /></template>
        <el-select v-model="fieldOptions.select_mode" style="width:100%;">
          <el-option value="leaf" label="叶节点" />
          <el-option value="any" label="任意节点" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">显示模式<help-tip prop="displayMode" /></template>
        <el-select v-model="fieldOptions.display_mode" style="width:100%;">
          <el-option value="name" label="节点名称" />
          <el-option value="path" label="完整路径" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="fieldOptions.display_mode==='path'">
        <template slot="label">分割符<help-tip prop="split" /></template>
        <el-input v-model="fieldOptions.split" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import EditorMixin from '../mixins/editor'

export default {
  components: {
    IbpsTypeSelect,
    IbpsDictionary
  },
  mixins: [EditorMixin],
  methods: {
    changeMultiple(val) {
      this.fieldOptions.default_value = ''
    }
  }
}
</script>

