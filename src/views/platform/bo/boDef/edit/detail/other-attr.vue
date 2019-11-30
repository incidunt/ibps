<template>
  <el-form ref="form" label-width="130px">
    <el-form-item label="展示类型:" prop="struType">
      <el-select v-model="form.struType" :disabled="readonly" placeholder="请选择" style="width:100%;">
        <el-option
          v-for="item in struTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="form.struType==='tree'" label="树ID字段:" prop="idKey">
      <el-select v-model="form.idKey" :disabled="readonly" placeholder="请选择" style="width:100%;">
        <el-option
          v-for="item in fieldsOptions"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="form.struType==='tree'" label="树父ID字段:" prop="pIdKey">
      <el-select v-model="form.pIdKey" :disabled="readonly" placeholder="请选择" style="width:100%;">
        <el-option
          v-for="item in fieldsOptions"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="form.struType==='tree'" label="树展示字段:" prop="key">
      <el-select v-model="form.key" :disabled="readonly" placeholder="请选择" style="width:100%;">
        <el-option
          v-for="item in fieldsOptions"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { struTypeOptions } from '../../constants'
import { checkSameNode } from '@/views/platform/bo/boDef/utils'

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    options: Object,
    treeData: Array,
    review: Object,
    formData: Object
  },
  data() {
    return {
      struTypeOptions: struTypeOptions,
      isSame: false,
      form: {
        struType: 'list',
        idKey: 'id',
        pIdKey: 'id',
        key: 'id'
      },
      fieldsOptions: [],
      rules: {
        struType: [{ required: true, message: this.$t('validate.required') }],
        idKey: [{ required: true, message: this.$t('validate.required') }],
        pIdKey: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    reviewData() {
      return this.review
    }
  },
  watch: {
    form: {
      handler: function(val, oldVal) {
        this.checkNode(this.reviewData, this.treeData)
        this.$emit('change', val)
      },
      deep: true
    },
    options: {
      handler: function(val, oldVal) {
        this.form = val
      },
      immediate: true
    },
    formData: {
      handler: function(val, oldVal) {
        this.fieldsOptions = this.formData.attrs
      },
      deep: true
    },
    fieldsOptions: {
      handler: function(val, oldVal) {
        if (val === undefined) return
        const idIndex = val.findIndex(item => item.code === 'id')
        const idKeyIndex = val.findIndex(item => item.code === this.form.idKey)
        const pIdKeyIndex = val.findIndex(item => item.code === this.form.pIdKey)
        const keyIndex = val.findIndex(item => item.code === this.form.key)
        this.form.idKey = idKeyIndex > -1 ? val[idKeyIndex].code : idIndex > -1 ? val[idIndex].code : val[0].code
        this.form.pIdKey = pIdKeyIndex > -1 ? val[pIdKeyIndex].code : idIndex > -1 ? val[idIndex].code : val[0].code
        this.form.key = keyIndex > -1 ? val[keyIndex].code : idIndex > -1 ? val[idIndex].code : val[0].code
      },
      deep: true
    }
  },
  created() {
    this.form = this.options ? this.options : {}
    this.fieldsOptions = this.formData.attrs
  },
  methods: {
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs['form'].validate(() => {})
      })
    },
    struTypeChange(val) {
      this.fieldsOptions = val
    },
    checkNode(review, treeData) {
      this.isSame = checkSameNode(review, treeData)
      this.$emit('checkNode', this.isSame)
    }
  }
}
</script>

