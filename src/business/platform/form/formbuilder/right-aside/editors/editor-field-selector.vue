<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item v-if="types.includes('selector_type')">
        <template slot="label">选择器类型</template>
        <el-select v-model="fieldOptions.selector_type" style="width:100%;" @change="changeSelectorType">
          <el-option
            v-for="option in selectorTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="types.includes('multiple')">
        <template slot="label">是否多选</template>
        <el-switch
          v-model="fieldOptions.multiple"
          @change="changeSelectorType"
        />
      </el-form-item>
      <el-form-item v-if="types.includes('store')">
        <template slot="label">存储格式</template>
        <el-select
          v-model="fieldOptions.store"
          style="width:100%;"
          @change="changeSelectorType"
        >
          <el-option
            v-for="store in selectorStoreOptions"
            :key="store.value"
            :value="store.value"
            :label="store.label"
          />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { selectorTypeOptions, selectorStoreOptions } from '@/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  props: {
    types: {
      type: String,
      default: 'selector_type,multiple,store'
    }
  },
  data() {
    return {
      selectorTypeOptions: selectorTypeOptions,
      selectorStoreOptions: selectorStoreOptions
    }
  },
  methods: {
    changeSelectorType() {
      if (this.fieldOptions.default_value_type === 'fixed') {
        this.fieldOptions.default_value = null
      }
    }
  }
}
</script>

