<template>
  <!--自定义对话框-->
  <ibps-selector-dialog
    :visible="dialogVisible"
    :value="selectedValue"
    :title="title"
    :width="width"
    :height="height"
    :margin-top="marginTop"
    :multiple="multiple"
    :label-key="labelKey"
    :default-button="false"
    :buttons="toolbars"
    @input="handleSelectChange"
    @close="closeDialog"
  >
    <template v-slot="scope">
      <ibps-data-template-render
        v-if="dialogVisible"
        ref="dataTemplate"
        :data="dataTemplate"
        :dynamic-params="dynamicParams"
        :multiple="multiple"
        :height="dialogHeight"
        @close="closeDialog"
        @selected="handleSelectChange"
      />
    </template>
  </ibps-selector-dialog>
</template>
<script>
import TypeMixin from '../mixins/types'
// import ActionUtils from '@/utils/action'

import IbpsSelectorDialog from '@/components/ibps-selector/dialog'
import Vue from 'vue'
Vue.component('ibps-data-template-render', () => import('@/business/platform/data/templaterender/index.vue'))

export default {
  components: {
    IbpsSelectorDialog
  },
  mixins: [TypeMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    dynamicParams: {
      type: Object
    },
    value: {
      type: [Object, Array]
    },
    title: String,
    width: {
      type: [String, Number],
      default: '80%'
    },
    height: {
      type: [String, Number],
      default: '80%'
    },
    dialogHeight: {
      type: [String, Number],
      default: 400
    },
    multiple: {
      type: Boolean,
      default: false
    },
    toolbars: {
      type: Array
    },
    labelKey: {
      type: [String, Function]
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      selectedValue: this.multiple ? [] : {},
      dataTemplate: {}
    }
  },
  computed: {
    marginTop() {
      if (this.height === '100%' || this.height === 100) {
        return '0'
      } else {
        return '5vh'
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = val
        if (val) {
          this.getFormData()
        }
      },
      immediate: true
    },
    value(val) {
      this.selectedValue = val
    },
    selectedValue: {
      handler(val) {
        this.$emit('update:value', val)
      },
      deep: true
    }
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.initData(JSON.parse(JSON.stringify(this.data)))
    },
    handleSelectChange(val) {
      // if (typeof this.labelKey === 'function') {
      // if (this.$utils.isNotEmpty(val)) {
      //   ActionUtils.warning('配置错误，请设置一个返回字段')
      //   this.clearSelection()
      //   return
      // }
      // } else if (typeof this.labelKey === 'string') {
      //   return data[config]
      // } else if (typeof this.labelKey === 'undefined') {

      // }
      this.selectedValue = val
    },
    clearSelection() {
      this.$refs['dataTemplate'].clearSelection()
    }

  }
}
</script>
