<!--
******************
采用vue-signature v2.4.2 https://github.com/WangShayne/vue-signature
hugh zhuang 修改功能
1、加入监听事件  v-on="listeners
2、增加props 的format
 -->
<template>
  <div :style="style" @touchmove.prevent>
    <canvas
      :id="uid"
      :data-uid="uid"
      :disabled="disabled"
      class="canvas"
      v-on="listeners"
    />
  </div>
</template>

<script>
import SignaturePad from 'signature_pad'
export default {
  name: 'ibps-signature',
  props: {
    sigOption: {
      type: Object,
      default: () => {
        return {
          backgroundColor: 'rgb(255,255,255)',
          penColor: 'rgb(0, 0, 0)'
        }
      }
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: '100%'
    },
    clearOnResize: {
      type: Boolean,
      default: false
    },
    waterMark: {
      type: Object,
      default: () => {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    format: String,
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sig: () => {},
      canvas: null,
      option: {
        backgroundColor: 'rgb(255,255,255)',
        penColor: 'rgb(0, 0, 0)'
      },
      uid: ''
    }
  },
  computed: {
    style() {
      const style = {}
      const width = parseInt(this.width)
      const height = parseInt(this.height)
      Object.assign(style, {
        width: width <= 100 ? `${width}%` : `${width}px`,
        height: height <= 100 ? `${height}%` : `${height}px`
      })
      return style
    },
    listeners() {
      return {
        ...this.$listeners,
        touchend: this.onChange, // 触摸结束
        mouseup: this.onChange // 某个鼠标按键被松开
      }
    }
  },
  watch: {
    disabled(val) {
      this.handleDisabled()
    },
    value(val, oldVal) {
      if (val !== '') {
        this.fromDataURL(val)
      } else {
        this.clear()
      }
    }
  },
  created() {
    this.uid = 'canvas' + this._uid
    const sigOptions = Object.keys(this.sigOption)
    for (const item of sigOptions) {
      this.option[item] = this.sigOption[item]
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.draw()
    })
  },
  methods: {
    onChange() {
      if (this.disabled) { return }
      this.$emit('input', this.getData())
      this.$emit('change', this.getData())
    },
    getData() {
      return this.sig.toDataURL(this.format)
    },
    draw() {
      this.canvas = document.getElementById(this.uid)
      this.sig = new SignaturePad(this.canvas, this.option)
      this.handleDisabled()
      window.addEventListener('resize', () => { this.resizeCanvas() })
      this.resizeCanvas()
      this.fromDataURL(this.value)
    },
    resizeCanvas() {
      var url
      if (!this.isEmpty()) {
        url = this.save()
      }
      var ratio = Math.max(window.devicePixelRatio || 1, 1)
      this.canvas.width = this.canvas.offsetWidth * ratio
      this.canvas.height = this.canvas.offsetHeight * ratio
      this.canvas.getContext('2d').scale(ratio, ratio)
      this.clear()
      !this.clearOnResize && url !== undefined && this.fromDataURL(url)
      Object.keys(this.waterMark).length && this.addWaterMark(this.waterMark)
    },
    handleDisabled() {
      if (this.disabled) {
        this.sig.off()
      } else {
        this.sig.on()
      }
    },
    clear() {
      this.sig.clear()
    },
    save(format) {
      return format ? this.sig.toDataURL(format) : this.sig.toDataURL()
      // signaturePad.toDataURL(); // save image as PNG
      // signaturePad.toDataURL("image/jpeg"); // save image as JPEG
      // signaturePad.toDataURL("image/svg+xml"); // save image as SVG
    },
    fromDataURL(url) {
      this.sig.fromDataURL(url)
    },
    isEmpty() {
      return this.sig.isEmpty()
    },
    undo() {
      var data = this.sig.toData()
      if (data) {
        data.pop()
        this.sig.fromData(data)
      }
    },
    addWaterMark(data) {
      if (!(Object.prototype.toString.call(data) === '[object Object]')) {
        throw new Error('Expected Object, got ' + typeof data + '.')
      } else {
        var vCanvas = document.getElementById(this.uid)
        var textData = {
          text: data.text || '',
          x: data.x || 20,
          y: data.y || 20,
          sx: data.sx || 40,
          sy: data.sy || 40
        }

        var ctx = vCanvas.getContext('2d')
        ctx.font = data.font || '20px sans-serif'
        ctx.fillStyle = data.fillStyle || '#333'
        ctx.strokeStyle = data.strokeStyle || '#333'
        if (data.style === 'all') {
          ctx.fillText(textData.text, textData.x, textData.y)
          ctx.strokeText(textData.text, textData.sx, textData.sx)
        } else if (data.style === 'stroke') {
          ctx.strokeText(textData.text, textData.sx, textData.sx)
        } else {
          ctx.fillText(textData.text, textData.x, textData.y)
        }
        this.sig._isEmpty = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.canvas {
  width: 100%;
  height:97%;
}
</style>
