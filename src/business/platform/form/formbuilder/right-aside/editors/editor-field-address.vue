<template>
  <div class="panel panel-default">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">最大区域<help-tip prop="addressTop" /></template>
        <el-select v-model="fieldOptions.top" style="width:100%;" @change="changeTop">
          <el-option
            v-for="item in areaOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="fieldOptions.top !== 'country'">
        <template slot="label">最大区域值<help-tip prop="addressTopval" /></template>
        <ibps-address
          v-model="fieldOptions.topval"
          :level="topvalLevel"
          data-type="code"
          @change="changeTopval"
        />
      </el-form-item>
      <el-form-item>
        <template slot="label">最小区域<help-tip prop="addressLevel" /></template>
        <el-select v-model="fieldOptions.level" style="width:100%;" @change="changeLevel">
          <el-option
            v-for="item in areaOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">默认值<help-tip prop="defaultValue" /></template>
        <template v-if="$utils.isNotEmpty(topval)">
          <ibps-address
            v-model="fieldOptions.default_value"
            :top-val="topval||'0'"
            :top="fieldOptions.top || 'country'"
            :level="fieldOptions.level||'district'"
            data-type="code"
            clearable
          />
        </template>
        <span v-else class="red">
          请先设置最大区域值
        </span>
      </el-form-item>
      <el-form-item>
        <template slot="label">是否显示详细地址</template>
        <el-checkbox v-model="fieldOptions.is_street" />
      </el-form-item>
      <el-form-item v-if="fieldOptions.is_street">
        <template slot="label">详细地址默认值</template>
        <el-input v-model="fieldOptions.street" :disabled="!fieldOptions.is_street" placeholder="详细地址默认值" type="textarea" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { areaOptions } from '@/business/platform/form/constants/fieldOptions'
import AddressUtil from '@/components/ibps-address/util'
import EditorMixin from '../mixins/editor'
import IbpsAddress from '@/components/ibps-address/cascader'

export default {
  components: {
    IbpsAddress
  },
  mixins: [EditorMixin],
  data() {
    return {
      areaOptions: areaOptions
    }
  },
  computed: {
    topvalLevel() {
      return AddressUtil.getPrevLevel(this.fieldOptions.top)
    },
    topval() {
      if (this.fieldOptions.top === 'country') {
        return '0'
      }
      if (this.fieldOptions.topval) {
        return this.fieldOptions.topval[this.fieldOptions.topval.length - 1]
      } else {
        return void 0
      }
    }
  },
  methods: {
    changeTop() {
      this.fieldOptions.topval = null
      this.fieldOptions.default_value = null
    },
    changeLevel() {
      this.fieldOptions.default_value = null
    },
    changeTopval() {
      this.fieldOptions.default_value = null
    }
  }
}
</script>

