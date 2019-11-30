<template>
  <div class="ibps-signature-outer">
    <div v-if="!disabled" class="ibps-signature-header">
      <div v-if="placeholder" class="ibps-signature-label">{{ placeholder }}</div>
      <div v-if="!disabled" class="ibps-signature-toolbar">
        <a href="javascript:void(0);" data-toggle="signature-clear" @click="onClear">清除</a>
      </div>
    </div>
    <div style="width:100%;height:100%;">
      <signature
        ref="signature"
        v-model="data"
        :sig-option="sigOption"
        :width="width"
        :height="height"
        :disabled="disabled"
        @input="onInput"
        @change="onChange"
      />
    </div>
  </div>
</template>
<script>
import Signature from '@/components/ibps-signature/index'
export default {
  components: {
    Signature
  },
  props: {
    value: {
      type: String
    },
    sigOption: {
      type: Object,
      default: () => {
        return {
          backgroundColor: 'rgb(255,255,255)',
          penColor: 'rgb(0, 0, 0)'
        }
      }
    },
    placeholder: {
      type: String,
      default: '在这里输入您的签名'
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: '100%'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: this.value
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.data = val
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.onInput(val)
      },
      deep: true
    }
  },
  methods: {
    onInput(data) {
      this.$emit('input', data)
    },
    onChange(data) {
      this.$emit('change', data)
    },
    onClear() {
      this.$refs.signature.clear()
      this.$nextTick(() => {
        this.onInput('')
        this.onChange('')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
 .ibps-signature-outer {
    border: 1px solid #bbb;
    .ibps-signature-header {
      font-size: 12px;
      cursor: pointer;
      border-bottom: 1px dotted #ccc;
      height: 32px;
      background-color: #f6f6f6;
      .ibps-signature-label {
        float: left;
        padding: 0 7px 5px 7px;
      }
      .ibps-signature-toolbar {
        text-align: right;
        float: right;
        padding: 0 7px 5px 7px;
        a{
          text-decoration: none;
          cursor: pointer;
          color: #409eff;
        }
      }
    }
  }
</style>

