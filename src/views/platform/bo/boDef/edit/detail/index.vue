<template>
  <el-tabs v-model="activeTabName" @tab-click="handerTabClick">
    <el-tab-pane label="基本信息" name="basic-info">
      <basic-info
        :id="id"
        ref="basic"
        :bo-type="boType"
        :form-data="saveData"
        :tree-data="treeData"
        :parent-data="parentData"
        :readonly="readonly"
        :is-master="isMaster"
        :code="code"
        @change="handleBoDef"
      />
    </el-tab-pane>
    <el-tab-pane label="对象属性" name="bo-attr">
      <object-attr
        ref="attr"
        :readonly="readonly"
        :form-data="saveData"
        :tree-data="treeData"
        :review="reviewData"
        :attrs="saveData.attrs"
        :action="action"
        :toolbars="isToolbars"
        :height="height"
        @change="handleAttrs"
        @checkNode="checkNode"
      />
    </el-tab-pane>
    <el-tab-pane label="其他属性" name="other-attr">
      <other-attr
        :id="id"
        ref="other"
        :options="saveData.options"
        :form-data="saveData"
        :tree-data="treeData"
        :review="reviewData"
        :parent-data="parentData"
        :readonly="readonly"
        @change="handleOtherAttr"
        @checkNode="checkNode"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import BasicInfo from './basic-info'
import ObjectAttr from './object-attr'
import OtherAttr from './other-attr'

export default {
  components: {
    BasicInfo,
    ObjectAttr,
    OtherAttr
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    },
    id: String,
    code: String,
    boType: String,
    action: String,
    parentData: Object,
    toolbars: Boolean,
    treeData: Array,
    isMaster: {
      type: Boolean,
      default: true
    },
    height: [String, Number]
  },
  data() {
    return {
      activeTabName: 'basic-info',
      boDef: this.formData,
      saveData: this.formData,
      checkCode: false,
      review: {}
    }
  },
  computed: {
    isToolbars() {
      return this.toolbars
    },
    saveDatas() {
      return this.formData
    },
    reviewData() {
      return this.review
    }
  },
  watch: {
    saveDatas: {
      handler: function(val, oldVal) {
        this.saveData = val
      },
      deep: true
    },
    boDef: {
      handler: function(val, oldVal) {
        this.$emit('change', val, this.activeTabName)
      },
      deep: true
    }
  },
  methods: {
    initActive(value) {
      this.activeTabName = value
    },
    handleBoDef(data, sameNode) {
      if (typeof data === 'object') {
        this.checkCode = false
        this.boDef = data
        this.review = data
      } else {
        this.checkCode = !data
        this.review = {}
      }
      this.$emit('check', this.checkCode, sameNode)
    },
    handleAttrs(attrs) {
      this.boDef.attrs = attrs
      this.$refs['other'].struTypeChange(attrs)
      this.$refs['basic'].pkChange(attrs)
    },
    handleOtherAttr(options) {
      this.boDef.options = options
    },
    checkNode(isSame) {
      this.$emit('check', isSame, this.reviewData)
    },
    validate() {
      const validate = this.$refs['basic'].validate()
      return validate
    },
    handerTabClick(e) {
      this.activeTabName = e.name
    }
  }
}
</script>
