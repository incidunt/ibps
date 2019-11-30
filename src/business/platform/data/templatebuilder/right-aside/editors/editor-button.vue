<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="按钮名称">
      <el-input v-model="formData.label" placeholder="按钮名称" />
    </el-form-item>
    <el-form-item v-if="formData && formData.button_type === 'custom'" label="按钮编码">
      <el-input v-model="formData.code" placeholder="按钮编码" />
    </el-form-item>
    <el-form-item label="权限">
      <rights-selector v-model="formData.rights" />
    </el-form-item>
    <el-form-item v-if="type==='function'" label="按钮位置">
      <el-radio-group v-model="formData.position">
        <el-radio-button
          v-for="t in positionType"
          :key="t.value"
          :label="t.value"
        >{{ t.label }}</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="按钮颜色">
      <el-select v-model="formData.style" placeholder="按钮颜色">
        <el-option value="default" label="默认" />
        <el-option value="primary" label="主要" />
        <el-option value="success" label="成功" />
        <el-option value="info" label="信息" />
        <el-option value="warning" label="警告" />
        <el-option value="danger" label="危险" />
      </el-select>
    </el-form-item>
    <el-form-item label="按钮图标">
      <ibps-icon-select v-model="formData.icon" icon="el-icon-search" />
    </el-form-item>

    <el-form-item v-if="formData && formData.button_type === 'sefStartFlow'" label="绑定流程">
      <bpm-def-selector
        v-model="formData.deflow"
        value-key="defKey"
      />
    </el-form-item>

  </el-form>
</template>
<script>
import { hasPermission } from '@/business/platform/data/constants/buttons'
import bpmDefSelector from '@/business/platform/bpmn/definition/selector'
import RightsSelector from '@/business/platform/rights/config/selector'

export default {
  components: {
    RightsSelector,
    bpmDefSelector
  },
  props: {
    data: {
      type: Object
    },
    type: {
      type: String,
      default: 'function'
    }
  },
  data() {
    return {
      formName: 'form',
      formData: {
        style: 'primary'
      },
      rules: {
        label: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    positionType() {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })
      const type = this.formData.button_type || ''
      if (hasPermission(type, 'toolbar')) {
        positionType.push({
          value: 'toolbar',
          label: '仅顶部'
        })
      }

      if (hasPermission(type, 'manage')) {
        positionType.push({
          value: 'manage',
          label: '仅管理'
        })
      }
      if (hasPermission(type, 'search')) {
        positionType.push({
          value: 'search',
          label: '仅查询列'
        })
      }

      if (hasPermission(type, 'edit')) {
        positionType.push({
          value: 'edit',
          label: '仅编辑'
        })
      }

      return positionType
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.formData = val
        }
      },
      immediate: true
    }
  },
  methods: {
  // 获取表单数据
    getFormData(callback) {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          callback(this.formData)
        } else {
          callback()
        }
      })
    }
  }
}
</script>

