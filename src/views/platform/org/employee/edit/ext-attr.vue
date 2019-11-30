<template>
  <div>
    <el-row>
      <el-col v-if="!readonly" :span="24">
        <div class="ibps-tools-btn">
          <el-button type="primary" icon="ibps-icon-trash-o" @click="handlerData([])">清空</el-button>
        </div>
      </el-col>
      <attr-form
        v-if="forms && forms.length >0"
        ref="attrForm"
        :disabled="readonly"
        :data="formData"
        :forms="forms"
        :item-width="100+'%'"
        @input="handlerData"
      />
      <el-alert
        v-else
        title="无配置扩展属性"
        type="info"
        show-icon
      />
    </el-row>
  </div>
</template>
<script>
import { findByTypeAndPartyType } from '@/api/platform/org/attr'
import { validateFloat, validateInteger } from '@/utils/validate'
import AttrForm from '../../components/attr/attr-form'

export default {
  components: {
    AttrForm
  },
  props: {
    data: {
      type: Array,
      default: () => { return [] }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      forms: [],
      formData: {}
    }
  },
  created() {
    this.loadAttr()
  },
  methods: {
    callback() {
      const attrValidator = this.$refs['attrForm'] ? this.$refs['attrForm'].callback() : true
      return attrValidator
    },
    loadAttr() {
      // 从后台加载值
      findByTypeAndPartyType({
        partyType: 'employee'
      }).then(response => {
        const data = response.data
        this.forms = data.map(item => {
          var rules = []
          if (item.dataType === 'INT') {
            rules.push({ validator: validateInteger, trigger: 'blur' })
          }
          if (item.dataType === 'DOUBLE') {
            rules.push({ validator: validateFloat, trigger: 'blur' })
          }
          return {
            id: item.id,
            prop: item.key,
            label: item.name,
            fieldType: item.dataType,
            options: item.options,
            multiple: item.isMulti === 'Y',
            rules: rules
          }
        })
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    loadAttrData() {
      const data = this.data
      if (data !== [] && this.readonly) {
        console.log(data)
      }
      const formData = {}
      data.map(item => {
        // 数据回显设置
        const values = item.values
        if (this.$utils.isNotEmpty(values)) {
          let result = ''
          if (item.isMulti === 'Y') {
            result = []
            for (let i = 0; i < values.length; i++) {
              result.push(values[i].value)
            }
          } else {
            result = values[0].value
          }
          formData[item.key] = result
        } else {
          if (item.isMulti === 'Y') {
            formData[item.key] = []
          } else {
            formData[item.key] = ''
          }
        }
      })

      this.formData = formData
    },
    clearData() {
      const formData = {}
      this.forms.map(item => {
        if (item.multiple) formData[item.prop] = []
        else formData[item.prop] = ''
      })
      this.formData = formData
    },
    handlerData(data) {
      if (data instanceof Array) {
        this.$refs['attrForm'] ? this.$refs['attrForm'].clearData() : null
      }
      const d = this.$utils.newData(this.formData)
      const form = Object.assign(d, data)
      this.$emit('input', this.formatData(form))
    },
    // 格式化数据返回用于保存
    formatData(form) {
      const result = []
      const formData = form
      const forms = this.forms
      for (var i = 0; i < forms.length; i++) {
        for (var data in formData) {
          if (this.$utils.isNotEmpty(formData[data]) && data === forms[i].prop) {
            if (forms[i].multiple) {
              if (Array.isArray(formData[data])) {
                for (const item of formData[data]) {
                  const tmp = {}
                  tmp['attrId'] = forms[i].id
                  tmp['value'] = item
                  result.push(tmp)
                }
              } else if (typeof formData[data] === 'string') {
                const arr = formData[data].split(',')
                for (const item of arr) {
                  const tmp = {}
                  tmp['attrId'] = forms[i].id
                  tmp['value'] = item
                  result.push(tmp)
                }
              }
            } else {
              const tmp = {}
              tmp['attrId'] = forms[i].id
              tmp['value'] = formData[data]
              result.push(tmp)
            }
          }
        }
      }
      return result
    }

  }
}
</script>
<style lang="scss" scoped>
  .ibps-tools-btn{
    padding:5px;
    margin-bottom: 5px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
  }
</style>
