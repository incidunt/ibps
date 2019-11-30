<template>
  <div>
    <div class="panel panel-default template-compose-container">
      <div class="panel-heading">组合-列表</div>
      <div class="panel-body">
        <el-form :model="attrs" label-position="top">
          <el-form-item label="列表数据模板">
            <selector
              v-model="attrs.bind_template_key"
              :bo-code="boCode"
              :toolbar="formToolbar"
            />
          </el-form-item>
          <el-form-item label="关联字段：">
            <el-autocomplete
              v-model="attrs.ref_field"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Selector from '@/business/platform/form/form-def/selector'
export default {
  components: {
    Selector
  },
  props: {
    attrs: {
      type: Object,
      default: () => {
        return {
          bind_template_key: '',
          ref_field: ''
        }
      }
    },
    boCode: {
      type: String,
      default: 'bocode'
    }
  },
  date() {
    return {
      refFieldOptions: []
    }
  },
  computed: {
    // 工具栏
    formToolbar() {
      const toolbar = [{
        key: 'rechoose',
        type: 'primary',
        label: '重选'
      }, {
        key: 'remove',
        type: 'danger',
        label: '删除'
      }]
      return toolbar
    }
  },
  mounted() {
    this.refFieldOptions = this.loadAll()
  },
  methods: {
    querySearch(queryString, cb) {
      var refFieldOptions = this.refFieldOptions
      var results = queryString ? refFieldOptions.filter(this.createFilter(queryString)) : refFieldOptions
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (reffield) => {
        return (reffield.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': '一需动态获取' },
        { 'value': '二需动态获取' },
        { 'value': '三需动态获取' }
      ]
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style lang="scss">
.template-compose-container {
  .el-form-item__label {
    padding-bottom:0;
  }
  .el-autocomplete {
    width:100%;
  }
}
</style>

