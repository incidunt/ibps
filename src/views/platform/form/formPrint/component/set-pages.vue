<template>
  <div class="menu-tools-set-pages">
    <div class="title">纸张设置</div>
    <el-form ref="form" class="items" :model="form" :rules="rules" label-position="top" size="mini">
      <el-form-item label="纸张大小" prop="size">
        <el-select v-model="form.size" placeholder="请选择" size="mini" class="form-item-select" @change="handleChange">
          <el-option
            v-for="item in sizes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <div v-if="form.size === 'auto'" class="inline-form">
        <el-form-item label-width="0" class="inline-form-item" prop="width">
          <div class="inline-form-item-content">
            <div class="inline-form-label">宽: </div>
            <el-input v-model="form.width" class="inline-form-input" @change="handleChange" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
        <el-form-item label-width="0" class="inline-form-item" prop="height">
          <div class="inline-form-item-content">
            <div class="inline-form-label">高: </div>
            <el-input v-model="form.height" class="inline-form-input" @change="handleChange" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="纸张方向" prop="orientation">
        <el-select v-model="form.orientation" placeholder="请选择" size="mini" class="form-item-select" @change="handleChange">
          <el-option
            v-for="item in orientations"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="页边距" style="margin-bottom:0;" />
      <div class="inline-form">
        <el-form-item label-width="0" class="inline-form-item" prop="top">
          <div class="inline-form-item-content">
            <div class="inline-form-label">上: </div>
            <el-input v-model="form.top" class="inline-form-input" @change="handleChange" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
        <el-form-item label-width="0" class="inline-form-item" prop="bottom">
          <div class="inline-form-item-content">
            <div class="inline-form-label">下: </div>
            <el-input v-model="form.bottom" class="inline-form-input" @change="handleChange" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
      </div>
      <div class="inline-form">
        <el-form-item label-width="0" class="inline-form-item" prop="left">
          <div class="inline-form-item-content">
            <div class="inline-form-label">左: </div>
            <el-input v-model="form.left" class="inline-form-input" @change="handleChange" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
        <el-form-item label-width="0" class="inline-form-item" prop="right">
          <div class="inline-form-item-content">
            <div class="inline-form-label">右: </div>
            <el-input v-model="form.right" class="inline-form-input" @change="handleChange" />
            <div class="inline-form-unit">mm</div>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    design: {
      type: Number,
      default: 96
    }
  },
  data() {
    const reg = /^\d+(\.\d+)?$/
    const isNumber = (rule, value, callback) => {
      if (!reg.test(value)) {
        return callback(new Error())
      }
      return callback()
    }
    return {
      sizes: [{ value: 'A4', label: 'A4' }, { value: 'A3', label: 'A3' }, { value: 'A5', label: 'A5' }, { value: 'B5', label: 'B5' }, { value: 'auto', label: '自定义' }],
      orientations: [{ value: 'portrait', label: '纵向' }, { value: 'landscape', label: '横向' }],
      rules: {
        width: [
          { required: true, message: '请输入宽度', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        height: [
          { required: true, message: '请输入宽度', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        top: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        bottom: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],

        left: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ],
        right: [
          { required: true, message: '请输入数字', trigger: 'change' },
          { validator: isNumber, message: '请输入数字', trigger: 'change' }
        ]
      },
      form: {
        size: 'A4',
        orientation: 'portrait',
        width: '210',
        height: '297',
        top: '19.1',
        bottom: '19.1',
        left: '17.8',
        right: '17.8'
      },
      PAGE_SIZE: {
        A4: {
          width: 210,
          height: 297
        },
        A3: {
          width: 297,
          height: 420
        },
        A5: {
          width: 148,
          height: 210
        },
        B5: {
          width: 176,
          height: 250
        }
      }
    }
  },
  computed: {
    pageSize() {
      const size = this.PAGE_SIZE[this.form.size]
      let width = 0
      let height = 0
      if (size) {
        width = Math.ceil(size.width / 25.4 * this.design)
        height = Math.ceil(size.height / 25.4 * this.design)
      } else {
        width = Math.ceil((this.form.width ? this.form.width : 0) / 25.4 * this.design)
        height = Math.ceil((this.form.height ? this.form.height : 0) / 25.4 * this.design)
      }

      const pageSize = {
        width: this.form.orientation === 'portrait' ? width : height,
        height: this.form.orientation === 'portrait' ? height : width
      }
      const form = {
        top: this.form.top,
        right: this.form.right,
        left: this.form.left,
        bottom: this.form.bottom
      }
      const formatPageValue = this._formatPageValue(form)
      console.log(formatPageValue)

      pageSize.width = Math.ceil(pageSize.width - formatPageValue.right - formatPageValue.left)
      pageSize.height = Math.ceil(pageSize.height - formatPageValue.top - formatPageValue.bottom)

      return pageSize
    }
  },
  mounted() {
    setTimeout(() => {
      this.$emit('submit', this.form, this.pageSize)
    }, 1000)
  },
  methods: {
    _formatPageValue: function(a) {
      return {
        top: this._mm2PT(a.top, 6),
        right: this._mm2PT(a.right, 6),
        bottom: this._mm2PT(a.bottom, 6),
        left: this._mm2PT(a.left, 6)
      }
    },
    _mm2PT: function(mm, num) {
      const _mm = +mm
      return parseFloat((_mm / 25.4 * this.design).toFixed(num))
    },
    checkForm() {
      return this.$refs.form.validate()
    },
    async handleChange() {
      await this.checkForm()
      this.$emit('submit', this.form, this.pageSize)
    }
  }
}
</script>
<style  lang="scss">
.menu-tools-set-pages{
  .title{
    color: #7C7C7C;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .form-item-select{
    width: 100%;
  }
  .items{
    font-size: 12px;
    .item{
      &:not(:last-of-type){
        margin-bottom: 8px;
      }
    }
    .label{
      margin-bottom: 6px;
    }
  }
  .inline-form{
    display: flex;
    align-items: center;
    .inline-form-item{
      flex: 1;
      &:nth-of-type(2){
        margin-left: 30px;
      }
    }
    .inline-form-item-content{
      display: flex;
      align-items: center;
      .inline-form-input{
        margin: 0 8px;
      }
      .inline-form-unit{
        min-width: 30px;
      }
    }
  }
}
</style>
