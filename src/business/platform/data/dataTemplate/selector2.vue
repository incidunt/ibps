<template>
  <el-select
    v-model="selectorValue"
    :remote-method="remoteMethod"
    :loading="loading"
    :loading-text="loadingText"
    :placeholder="placeholder"
    filterable
    remote
    reserve-keyword
    clearable
    style="width:100%;"
    @focus="onSelect"
    @clear="onClear"
  >
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.name"
      :value="item.key"
    />
  </el-select>
</template>
<script>
import { valueEquals } from 'element-ui/src/utils/util'
import { querySelectorData } from '@/api/platform/data/dataTemplate'
export default {
  props: {
    value: {
      type: String
    },
    type: {
      type: String,
      default: 'valueSource'
    },
    placeholder: String
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      init: false,
      loading: false,
      loadingText: '加载中',
      selectorValue: '',
      options: [],
      cacheData: {}
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.selectorValue = val
        if (!valueEquals(val, oldVal)) {
          // this.dispatch('ElFormItem', 'el.form.change', val)
          this.changeDataSource(val)
        }
      },
      immediate: true
    },
    selectorValue(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.remoteMethod()
  },
  methods: {
    remoteMethod(query) {
      this.loading = true
      this.loadingText = '加载中'
      querySelectorData({
        type: this.type,
        cascade: true,
        queryName: query || ''
      }).then(response => {
        this.options = response.data || []
        this.setCacheData(this.options)
        if (!this.init) {
          this.changeDataSource(this.selectorValue)
        }
        this.init = true
        if (this.$utils.isEmpty(this.options)) {
          this.loadingText = '暂无数据'
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    onSelect() {
      this.remoteMethod()
    },
    setCacheData(data) {
      if (this.$utils.isEmpty(data)) return
      data.forEach(v => {
        this.cacheData[v.key] = v
      })
    },
    changeDataSource(value) {
      const data = this.cacheData[value]
      this.$emit('change', data)
    },
    onClear() {
      this.$emit('input', '')
    }
  }
}
</script>

