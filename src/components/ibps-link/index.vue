<template>
  <el-link
    v-if="showType === 'link'"
    :underline="underline"
    :icon="icon"
    :disabled="disabled"
    :type="type"
    @click.native="click"
  >{{ text }}</el-link>
  <el-button
    v-else-if="showType === 'button'"
    :icon="icon"
    :disabled="disabled"
    :type="type"
    @click.native="click"
  >{{ text }}</el-button>
</template>

<script>
import { getScriptValue } from '@/api/platform/form/common.js'
export default {
  name: 'ibps-hyperlink',
  props: {
    showType: { // 是按钮还是文本
      type: String,
      default: 'link',
      validator: function(value) {
        return ['link', 'button'].indexOf(value) !== 1
      }
    },
    text: {
      type: String
    },
    linkType: { // 打开链接的类型
      type: String,
      default: 'fixed',
      validator: function(value) { // fixed 固定值; dynamic groovy脚本; javascript js 脚本
        return ['fixed', 'dynamic', 'javascript'].indexOf(value) !== -1
      }
    },
    link: {
      type: String
    },
    type: {
      type: String,
      default: 'default'
    },
    underline: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // href: {
    //   type: String
    // },
    icon: {
      type: String
    },
    isNewTab: { // 新开窗口还是弹框显示
      type: Boolean,
      default: true
    },
    beforeClick: { // 方法参数（ linkData, text, cb） cb 是回调函数
      type: Function
    },
    afterClick: {
      type: Function
    }
  },
  data() {
    return {
      linkData: ''
    }
  },
  computed: {
  },
  watch: {
    link: {
      handler: function(val) {
        this.setVal(val, 'link')
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    /**
     * val 属性的值
     * prop [link]
     */
    setVal(val, prop) {
      // console.log('setVal')
      if (this[prop + 'Type'] === 'fixed') {
        this[prop + 'Data'] = val
      } else if (this[prop + 'Type'] === 'dynamic') {
        this.runGroovy(val, prop)
      } else if (this[prop + 'Type'] === 'javascript') {
        this.runScript(val, prop)
      }
    },
    runScript(val, prop) {
      let value = ''
      try {
        value = new Function(val + ';')()
      } catch (e) {
        value = ''
      }
      this[prop + 'Data'] = value
    },
    runGroovy(val, prop) {
      if (this.$utils.isNotEmpty(val)) {
        getScriptValue(val).then(res => {
          this[prop + 'Data'] = res.content
        })
      }
    },
    cb() {
      if (this.isNewTab) {
        this.$open(this.linkData)
      } else {
        this.$emit('open-dialog', this.text, this.linkData)
      }
      this.afterClick && this.afterClick()
    },
    click() {
      if (this.beforeClick) {
        this.beforeClick(this.text, this.linkData, this.cb)
      } else {
        this.cb()
      }
    }
  }
}
</script>
