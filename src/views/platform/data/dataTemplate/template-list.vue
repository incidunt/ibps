<template>
  <data-template-render
    :data="dataTemplate"
  />
</template>
<script>
import { getBuildDataById } from '@/api/platform/data/dataTemplate'
import { getFormDataByFormKey } from '@/api/platform/form/formDef'

import DataTemplateRender from '@/business/platform/data/templaterender'
import { buildFelds } from '@/business/platform/data/templaterender/utils'

export default {
  components: {
    DataTemplateRender
  },
  data() {
    return {
      dataTemplate: {},
      dataTemplateId: ''
    }
  },
  watch: {
    '$route': {
      handler(val, oldVal) {
        if (val === oldVal) {
          return
        }
        this.$nextTick(() => {
          const defaultUrl = this.$route.meta.defaultUrl
          if (this.$utils.isNotEmpty(defaultUrl)) {
            // TODO: 判断地址对不对
            const url = defaultUrl.split('/')
            this.dataTemplateId = url[url.length - 1]
          } else {
            const params = this.$route.params
            this.dataTemplateId = params.id
          }
          if (this.$utils.isEmpty(this.dataTemplateId)) {
            this.$alert('参数错误，未获取模版ID')
            return
          }
          this.loadDataTemplate()
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadDataTemplate() {
      const loading = this.$loading({
        lock: false
      })
      this.dataTemplate = {}
      getBuildDataById({
        dataTemplateId: this.dataTemplateId,
        isFilterForm: false,
        isRightsFilter: true
      }).then(response => {
        // 从后台获取数据
        const data = this.$utils.parseData(response.data)
        if (data && data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
          getFormDataByFormKey({
            formKey: data.attrs.form_key
          }).then(response => {
            const formData = this.$utils.parseData(response.data)
            const datasets = buildFelds(formData.fields, data.datasets)
            data.datasets = datasets
            this.dataTemplate = data
            loading.close()
          }).catch(() => {
            loading.close()
          })
        } else {
          this.dataTemplate = data
          loading.close()
        }
      }).catch(() => {
        loading.close()
      })
    },
    buildFelds(fields, datasets) {
      const fieldMap = {}
      fields.forEach(field => {
        if (field.field_type === 'grid' || field.field_type === 'tabs') {
          field.field_options.columns.forEach(column => {
            column.fields.forEach(cfield => {
              fieldMap[cfield.field_name] = cfield
            })
          })
        } else {
          fieldMap[field.field_name] = field
        }
      })
      const rtn = []
      datasets.forEach(dataset => {
        const field = fieldMap[dataset.name]
        if (this.$utils.isNotEmpty(field)) {
          dataset.field_type = field.field_type
          dataset.field_options = field.field_options
        }
        rtn.push(dataset)
      })
      return rtn
    }
  }
}
</script>
<style lang="scss" >
  .data-template-renderer-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__headerbtn{
      z-index: 99999;
    }
  }
</style>

