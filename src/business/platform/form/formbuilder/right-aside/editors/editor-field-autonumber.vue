<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">流水号</template>
        <ibps-identity-selector v-model="fieldOptions.identity" value-key="alias" />
      </el-form-item>
      <el-form-item label-width="150px">
        <template slot="label">
          <el-tooltip content="初始化是否生成编号">
            <div class="ibps-ellipsis">初始化是否生成编号</div>
          </el-tooltip>
        </template>
        <el-switch v-model="fieldOptions.init" @change="changeInit" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import IbpsIdentitySelector from '@/business/platform/system/identity/selector'
import EditorMixin from '../mixins/editor'

export default {
  components: {
    IbpsIdentitySelector
  },
  mixins: [EditorMixin],
  methods: {
    changeInit(val) {
      if (val) {
        this.fieldItem.field_options.placeholder = ''
      } else {
        this.fieldItem.field_options.placeholder = '表单提交后展示'
      }
    }
  }
}
</script>

