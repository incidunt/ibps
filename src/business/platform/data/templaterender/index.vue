<template>
  <component
    :is="temlateType"
    v-if="template"
    ref="dataTemlate"
    :template="template"
    :data-template="dataTemlate"
    :dynamic-params="dynamicParams"
    :multiple="multiple"
    :height="height"
    :fields="fields"
    v-on="$listeners"
  />
</template>
<script>
import DataTemlate from './templates'

import Vue from 'vue'
Vue.component('ibps-data-template-formrender', () => import('@/business/platform/form/formrender/index.vue'))

export default {
  components: DataTemlate,
  props: {
    data: {
      type: Object
    },
    dynamicParams: {
      type: Object
    },
    multiple: {
      type: Boolean,
      default: true
    },
    height: {
      type: [String, Number]
    }
  },
  data() {
    return {
      selected: false,
      dataTemlate: {}
    }
  },
  computed: {
    temlateType() {
      if (!this.dataTemlate) {
        return
      }
      let key = ''
      if (this.dataTemlate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemlate.showType === 'compose') {
          key = this.dataTemlate.composeType
        } else {
          key = this.dataTemlate.showType
        }
      }
      if (this.$utils.isEmpty(key)) { return }
      return 'ibps-data-template-' + key
    },
    template() {
      const templates = this.dataTemlate.templates || []
      if (this.dataTemlate.showType === 'compose') {
        return templates
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    },
    fields() {
      const fields = {}
      if (this.dataTemlate.datasets && this.dataTemlate.datasets.length > 0) {
        this.dataTemlate.datasets.forEach(dataset => {
          if (dataset.parentId !== '0') {
            fields[dataset.name] = dataset
          }
        })
      }
      return fields
    }

  },
  watch: {
    data: {
      handler(val) {
        this.dataTemlate = val
      },
      immediate: true
    }
  },
  methods: {
    // 清空选择
    clearSelection() {
      this.$refs['dataTemlate'].clearSelection()
    }
  }
}
</script>

