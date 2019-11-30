<template>
  <span>
    <template v-if="disabled & readonlyText=='text'">
      {{ selectValue }}
    </template>
    <template v-else>
      <el-cascader
        v-model="select"
        :options="options"
        :filterable="filterable"
        :disabled="disabled"
        :size="size"
        :placeholder="placeholder"
        :separator="separator"
        :clearable="clearable"
        style="width: 100%;"
        @change="handleChange"
      />
    </template>
  </span>
</template>

<script>
import { getAreaData } from './util/areaData'
import util from './util'
const dataTypeArr = util.dataTypeArr
let IBPS_AREA_DATA = window.IBPS_AREA_DATA = null
const ROOT_VALUE = '0'

export default {
  name: 'ibps-address-cascader',
  props: {
    value: [Array, String],
    top: { // country、province、city、district、street
      type: String,
      default: 'country',
      validator: val => {
        return util.checkLevel(val)
      }
    },
    topVal: {
      type: String,
      default: ROOT_VALUE
    },
    level: {// country、province、city、district、street
      type: String,
      default: 'district',
      validator: val => {
        return util.checkLevel(val)
      }
    },
    data: {
      type: Object
    },
    dataType: {
      type: String,
      default: 'all',
      validator: val => {
        return util.oneOf(val, dataTypeArr)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    size: String,
    placeholder: String,
    separator: {
      type: String,
      default: '/'
    },
    clearable: Boolean,
    /**
     * 只读样式 【text original】
     */
    readonlyText: {
      type: String,
      default: 'original'
    }
  },
  data() {
    return {
      options: [],
      select: [],
      isInit: true,
      oldData: []
    }
  },
  computed: {
    showLevel() {
      return util.getLevelIndex(this.level) - util.getLevelIndex(this.top)
    },
    selectValue() {
      const res = []
      if (this.select && this.select.length > 0) {
        let i = 0
        while (this.select[i]) {
          res.push(this.getName(i, this.select))
          i++
        }
      }
      return res.join(this.separator)
    }
  },
  watch: {
    value(val) {
      this.initDefaultValue()
    },
    level(val, oldVal) {
      if (val !== oldVal) {
        this.init()
      }
    },
    top(val, oldVal) {
      if (val !== oldVal) {
        this.init()
      }
    },
    topVal(val, oldVal) {
      if (val !== oldVal) {
        this.init()
      }
    }

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.$utils.isNotEmpty(this.data)) {
        this.areaData = this.data
        this.initData()
        this.initDefaultValue()
        return
      }
      if (this.$utils.isEmpty(IBPS_AREA_DATA)) { // 从服务器加载地址数据
        getAreaData().then((data) => {
          this.areaData = IBPS_AREA_DATA = window.IBPS_AREA_DATA = data
          this.initData()
          this.initDefaultValue()
        })
      } else {
        this.areaData = IBPS_AREA_DATA
        this.initData()
        this.initDefaultValue()
      }
    },
    /**
     *  初始化options数据
     */
    initData() {
      const topData = []
      for (const t in this.areaData[this.topVal]) {
        const topItem = {
          value: t,
          label: this.areaData[this.topVal][t]
        }
        if (this.showLevel > 0 && this.areaData[t]) {
          topItem.loading = false
          topItem.children = this.loadChildData(t)
        } else {
          topItem.children = null
        }
        topData.push(topItem)
      }
      this.options = topData
    },
    /**
     * 初始化默认值
     */
    initDefaultValue() {
      if (this.canEmit(this.value)) {
        this.setDefaultValue()
      } else {
        this.setDefaultSelect()
      }
    },
    // 加载儿子节点
    loadChildData(value) {
      const childData = []
      const childs = this.areaData[value]
      for (const c in childs) {
        const childitem = {
          value: c,
          label: this.areaData[value][c]
        }
        if (this.areaData[childitem.value] && this.levelShow(this.showLevel, value)) {
          childitem.loading = false
          childitem.children = this.loadChildData(c)
        }
        childData.push(childitem)
      }
      return childData
    },
    levelShow(level, code) {
      if (level === 2) {
        return Object.keys(this.areaData[this.topVal]).indexOf(code) > -1
      } else if (level === 3) {
        return true
      }
    },
    setDefaultValue() {
      if (this.value && this.value[0]) {
        this.setDefaultSelect()
        const res = this.procesValue(this.select, this.dataType)
        this.oldData = res
        this.$emit('input', res)
        this.$emit('change', res)
      }
    },
    // 设置默认选择
    setDefaultSelect() {
      this.select = []
      if (this.value && this.value[0]) {
        let select = []
        if (this.dataType === 'all') { // all
          select = this.value.map((v) => {
            return v.code
          })
        } else if (this.dataType === 'code') { // code
          select = this.value
        } else if (this.dataType === 'name') { // name
          let i = 0
          let index = ''
          while (this.value[i] && i <= this.showLevel) {
            if (i === 0) {
              index = util.getIndex(this.areaData[this.topVal], this.value[0])
            } else {
              index = util.getIndex(this.areaData[index], this.value[i])
            }
            select.push(index)
            i++
          }
        }
        this.select = select
      }
    },
    canEmit(res) {
      let ifEmit = false
      if (this.value && this.value.length !== 0) {
        if (typeof res[0] === 'string') {
          if (this.value[this.value.length - 1] !== this.oldData[this.oldData.length - 1]) {
            ifEmit = true
          }
        } else {
          if (this.oldData && this.oldData.length !== 0 && this.value[this.value.length - 1].code !== this.oldData[this.oldData.length - 1].code) {
            ifEmit = true
          }
        }
      } else {
        ifEmit = true
      }
      return ifEmit
    },
    handleChange(resArr) {
      const res = this.procesValue(this.select, this.dataType)
      this.oldData = res
      this.$emit('input', res)
      this.$emit('change', res)
    },
    procesValue(arr, dataType) {
      let i = 0
      const res = []
      while (arr[i]) {
        let item
        if (dataType === 'all') {
          item = {
            code: arr[i],
            name: this.getName(i, arr)
          }
        } else if (dataType === 'name') {
          item = this.getName(i, arr)
        } else {
          item = arr[i]
        }
        res.push(item)
        i++
      }
      return res
    },
    getName(level, values) {
      if (this.$utils.isEmpty(this.areaData)) {
        return ''
      }
      if (level === 0) {
        return this.areaData[this.topVal] ? this.areaData[this.topVal][values[level]] : ''
      } else {
        return this.areaData[values[level - 1]] ? this.areaData[values[level - 1]][values[level]] : ''
      }
    }
  }
}
</script>
