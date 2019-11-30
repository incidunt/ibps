<template>
  <div class="rules-group-container">
    <div class="rules-group-header">
      <!--规则组条件-->
      <div class="btn-group group-conditions">
        <el-radio-group v-model="rulesData.condition" size="mini">
          <el-radio-button v-for="condition in conditions" :key="condition.value" :disabled="!hasMultipleRule" :label="condition.value">{{ condition.label }}</el-radio-button>
        </el-radio-group>
        <!--排序-->
        <div v-if="hasSort" class="drag-handle">
          <i class="el-icon-sort" />
        </div>
      </div>
      <!--规则操作-->
      <div class="btn-group pull-right group-actions">
        <el-button-group>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRule">{{ labels.addRulue }}</el-button>
          <el-button v-if="hasGroup" size="mini" type="success" icon="el-icon-circle-plus-outline" @click="addGroup">{{ labels.addGroup }}</el-button>
          <el-button v-if="depth > 1" size="mini" type="danger" icon="el-icon-close" @click="remove">{{ labels.removeGroup }}</el-button>
        </el-button-group>
      </div>
    </div>
    <!--规则-->
    <div class="rules-group-body">
      <div class="rules-list">
        <template v-for="(child, i) in rulesData[childrenKey]">
          <component
            :is="child && child.condition?'query-builder-group':'query-builder-rule'"
            :key="i"
            :rules.sync="child"
            :filters="filters"
            :index="i"
            :max-depth="maxDepth"
            :depth="depth + 1"
            :labels="labels"
            :conditions="conditions"
            :sort="sort"
            @errors="(data)=>{handleErrors(depth + 1,i,data)}"
            @child-deletion-requested="removeChild"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import QueryBuilderRule from './query-builder-rule.vue'

export default {
  name: 'query-builder-group',
  components: {
    QueryBuilderRule
  },
  props: {
    type: String,
    rules: Object,
    filters: Array,
    index: [String, Number],
    maxDepth: Number,
    depth: Number,
    labels: Object,
    conditions: Array,
    sort: Boolean,
    childrenKey: {// 儿子key
      type: String,
      default: 'rules'
    },
    conditionKey: {
      type: String,
      default: 'condition'
    }
  },
  data() {
    return {
      rulesData: this.rules,
      // 默认规则
      defaultRule: {},
      // 默认条件
      defaultCondition: '',
      errors: {}
    }
  },
  computed: {
    hasMultipleRule() {
      return this.rulesData[this.childrenKey] && this.rulesData[this.childrenKey].length > 1
    },
    hasGroup() {
      return !this.maxDepth || (this.maxDepth && this.depth < this.maxDepth)
    },
    hasSort() {
      return this.depth > 1 && this.sort
    }
  },
  watch: {
    rules(val) {
      this.rulesData = val
    },
    rulesData: {
      handler(val) {
        this.$emit('update:rules', val)
      },
      deep: true
    }
  },
  created() {
    this.defaultRule = JSON.parse(JSON.stringify({
      id: this.filters[0].id,
      field: this.filters[0].field,
      label: this.filters[0].label,
      type: this.filters[0].type || 'string',
      input: this.filters[0].input,
      operator: this.filters[0].operators[0],
      source: this.filters[0].sources[0],
      value: null
    }))
    this.defaultCondition = this.conditions[0].value
  },
  methods: {
    // 添加规则
    addRule() {
      this.rulesData[this.childrenKey].push(JSON.parse(JSON.stringify(this.defaultRule)))
    },
    // 添加组
    addGroup() {
      if (!this.hasGroup) { return }
      this.rulesData[this.childrenKey].push({
        [this.conditionKey]: this.defaultCondition,
        [this.childrenKey]: [JSON.parse(JSON.stringify(this.defaultRule))]
      })
    },
    // 删除当前组
    remove() {
      this.$emit('child-deletion-requested', this.index)
    },
    // 删除儿子
    removeChild(index) {
      // 如果只有一个时候
      if (this.rulesData[this.childrenKey].length === 1) {
        this.remove()
      } else {
        this.rulesData[this.childrenKey].splice(index, 1)
      }
    },
    handleErrors(depth, index, data) {
      const key = depth + '' + index
      if (this.$utils.isEmpty(data)) {
        delete this.errors[key]
      } else {
        this.errors[key] = data
      }

      this.$emit('errors', this.errors)
    }
  }
}
</script>
