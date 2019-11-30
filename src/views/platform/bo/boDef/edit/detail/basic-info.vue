<template>
  <el-form ref="form" class="basic-info-form" :model="form" :rules="rules" label-width="140px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" v-pinyin="{vm:form,key:'code'}" :disabled="readonly" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="编码：" prop="code">
          <el-input
            v-model="form.code"
            :disabled=" readonly||(form.state==='exist'&&form.boType==='object')||form.boType==='out'"
            @change="checkNode"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="数据格式：" prop="dataFormat">
          <el-select v-model="form.dataFormat" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in dataFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="form.dsName" :span="24">
        <el-form-item v-if="form.boType==='out'" label="数据源：" prop="dsName">
          <el-input v-model="form.dsName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="当前对象主键：" prop="pk">
          <el-select v-model="form.pk" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in changeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isMaster" :span="12">
        <el-form-item label="当前对象外键" class="forms" prop="fk">
          <span class="forms-span">
            <el-tooltip
              class="item"
              effect="light"
              placement="bottom"
            >
              <div slot="content">设置外键为当前主键时，则表示关系类<br>型为一对一 </div>
              <ibps-icon name="exclamation-circle" class="forms-icon" />
            </el-tooltip>：
          </span>
          <el-select v-model="form.fk" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in changeOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isMaster" :span="12">
        <el-form-item label="来自主对象属性：" prop="fromAttr">
          <el-select v-model="form.fromAttr" :disabled="readonly" style="width:100%;">
            <el-option
              v-for="item in pkOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isMaster" :span="24">
        <el-form-item label="关系类型：" prop="relation">
          <el-select v-model="form.relation" :disabled="readonly||(!form.edit&&pass)" style="width:100%;">
            <el-option
              v-for="item in relationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述：" prop="desc">
          <el-input v-model="form.desc" :autosize="{ minRows: 5, maxRows: 10}" :disabled="readonly" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { dataFormatOptions, relationOptions } from '../../constants'
import { checkCode } from '@/api/platform/bo/boDef'

export default {
  props: {
    isMaster: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    formData: Object,
    parentData: Object,
    treeData: Array,
    id: String,
    code: String,
    action: String,
    boType: String
  },
  data() {
    const validateLength = (rule, value, callback) => {
      if (value.length > 63) {
        callback(new Error('整数位长度不能超过64'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]{0,17}$/
      if (!reg.test(value)) {
        callback(new Error('首字符为字母，其他只能为字母，数字或者下划线，并且字符不能超过18字符'))
      } else {
        if (value.length > 17) {
          callback(new Error('首字符为字母，其他只能为字母，数字或者下划线，并且字符不能超过18字符'))
        } else {
          callback()
        }
      }
    }
    return {
      formName: 'form',
      dataFormatOptions: dataFormatOptions,
      relationOptions: relationOptions,
      validateCode: validateCode,
      form: this.formData,
      changeOptions: [],
      treeDatas: [],
      pass: false,
      rules: {
        name: [{ required: true, message: this.$t('validate.required') },
          { validator: validateLength, trigger: 'blur' }],
        code: [{ required: true, message: this.$t('validate.required') }],
        dataFormat: [{ required: true, message: this.$t('validate.required') }],
        pk: [{ required: true, message: this.$t('validate.required') }],
        fk: [{ required: true, message: this.$t('validate.required') }],
        fromAttr: [{ required: true, message: this.$t('validate.required') }],
        relation: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    pkOptions() {
      return this.parentData.attrs
    }
  },
  watch: {
    form: { // 返回数据给父组件
      handler: function(val, oldVal) {
        const range = /^[0-9]*$/
        const pass = range.test(val.id)
        this.pass = pass
        this.$emit('change', val)
      },
      deep: true
    },
    'form.code': {
      handler: function(val, oldVal) {
        const reg = /^[a-zA-Z][a-zA-Z0-9_]{1,17}$/
        const params = {}
        params.boCode = val
        params.boDefId = this.form.id
        params.isMain = 'Y'
        if (val === '') return
        if (this.form.edit) {
          // 校验[后端]
          if (this.form.status === '') {
            if (reg.test(val) && val.length < 17) {
              this.checkCode(params, this.form)
            }
          }
        }
      },
      immediate: true
    },
    formData: {
      handler: function(val) {
        const rule1 = [{ required: true, message: this.$t('validate.required') }]
        const rule2 = [{ required: true, message: this.$t('validate.required') }, { validator: this.validateCode, trigger: 'blur' }]
        this.rules.code = val.status !== '' ? rule1 : rule2
        this.form = val
      },
      deep: true
    },
    treeData: {
      handler: function(val, oldVal) {
        this.treeDatas = oldVal
      },
      deep: true
    },
    changeOptions: { // 初始化下拉数据
      handler: function(val, oldVal) {
        if (val === undefined) return
        this.form.pk = this.form.pk === null || this.form.pk === '' ? val[0].code : this.form.pk
        if (this.parentData.attrs && this.parentData.attrs !== []) {
          this.form.fromAttr = this.form.fromAttr === null || this.form.fromAttr === '' ? this.parentData.attrs[0].code : this.form.fromAttr
        }
        const fkIndex = val.findIndex(item => item.code === 'parentId')
        this.form.fk = this.form.fk === null || this.form.fk === '' ? fkIndex > -1 ? val[fkIndex].code : val[0].code : this.form.fk
      },
      deep: true
    }
  },
  mounted() {
    this.formValidate()
  },
  created() {
    this.changeOptions = this.formData.attrs
  },
  methods: {
    // 检测树是否存在重复节点。
    checkNode(value) {
      let isSame = false
      const childrenKey = 'subBoDefs'
      const sanmeNode = (data) => {
        data.find(item => {
          if (item.code === value) {
            isSame = true
          } else {
            if (item[childrenKey] && item[childrenKey] !== []) {
              sanmeNode(item[childrenKey])
            }
          }
        })
      }
      sanmeNode(this.treeDatas)
      if (!isSame) {
        this.$emit('change', this.form)
      } else {
        this.$message({
          message: '业务对象的标识[' + this.form.code + ']已存在了,请重新填写！',
          type: 'warning'
        })
        this.$emit('change', false, this.form)
      }
    },
    checkCode(params, val) {
      checkCode(params).then(response => {
        if (response.data === true) {
          this.$emit('change', val)
        } else {
          this.$message({
            message: '业务对象的标识[' + val.code + ']已存在了,请重新填写！',
            type: 'warning'
          })
          this.$emit('change', false, val)
        }
      })
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    pkChange(value) {
      this.changeOptions = value
    },
    // 提交数据
    validate() {
      let validate = true
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          validate = true
        } else {
          validate = false
        }
      })
      return validate
    }
  }
}
</script>
<style lang="scss">
.basic-info-form{
    .forms{
      position: relative;
      label{
        width: 110px!important;
      }
      .forms-span{
        position:absolute;
        left: -41px;
        top: 0;
        .forms-icon{
          color: #337ab7;
        }
      }
    }
}
</style>
