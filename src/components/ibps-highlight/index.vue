<script>
// https://highlightjs.org/usage/
// http://highlightjs.readthedocs.io/en/latest/api.html#configure-options
import './highlight-styles/github-gist.css'
import detectIndent from 'detect-indent'
import redent from 'redent'
import htmlFormat from './libs/htmlFormat'
import highlight from 'highlight.js'
export default {
  name: 'ibps-highlight',
  props: {
    code: { // 代码
      type: String,
      default: ''
    },
    formatHtml: {// 格式html
      type: Boolean,
      default: false
    },
    lang: { // 语言
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inlineStyles: {
        'display': `inline !important`,
        'vertical-align': `middle`
      }
    }
  },
  methods: {
    hasCode() {
      return (typeof this.code === 'string') && (this.code.length > 0)
    },
    getSlotText(slot) {
      if (Array.isArray(slot)) {
        return slot.map(node => { // node is VNode
          if (Array.isArray(node.children) && (node.children.length > 0)) {
            return this.getSlotText(node.children)
          } else {
            return node.text
          }
        }).join('')
      } else {
        return ''
      }
    },
    indentCode(code) {
      if (typeof code === 'string') {
        const indent = detectIndent(code).indent || '\t'
        code = redent(code, 0, indent)
        return code.trim()
      } else {
        return code
      }
    }
  },
  render(createElement) {
    const lang = this.lang
    const inline = this.inline
    let code = this.hasCode() ? this.code : this.getSlotText(this.$slots.default) // If no `code`, get text from default slot.
    code = !inline ? this.indentCode(code) : code // Don't indent code if in inline mode.
    code = this.formatHtml ? htmlFormat(code) : code
    const highlightedCode = lang ? highlight.highlight(lang, code).value
      : highlight.highlightAuto(code, [
        'html',
        'javascript',
        'json',
        'css',
        'scss',
        'less'
      ]).value
    return createElement(
      !inline ? 'pre' : 'span',
      {
        'class': [
          'ibps-highlight',
          'hljs',
          ...(lang ? [lang] : [])
        ],
        style: inline ? this.inlineStyles : {},
        domProps: {
          innerHTML: highlightedCode
        }
      }
    )
  }

}
</script>

<style lang="scss" scoped>
.ibps-highlight {
  margin: 5px;
  border-radius: 4px;
}
</style>
