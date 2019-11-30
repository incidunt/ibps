<template>
  <div :style="{height:height+'px'}" class="position-content">
    <el-row>
      <el-col :span="24">
        <div class="ibps-tools-btn">
          <el-button type="primary" icon="ibps-icon-save" @click="saveData">保存</el-button>
          <el-button type="primary" icon="ibps-icon-clean" @click="clearData">清空</el-button>
        </div>
      </el-col>
      <el-col :span="24" class="detail">
        <attr-form
          v-if="forms && forms.length >0"
          ref="form"
          :data="formData"
          :forms="forms"
          :item-width="100+'%'"
          @input="handlerData"
        />
        <el-alert
          v-else
          title="无配置扩展属性"
          type="info"
          show-icon
          style="height:50px;"
        />
      </el-col>
    </el-row></div>
</template>
<script>
import { findByPartyTypeUserId4Edit } from '@/api/platform/org/attr'
import { validateInteger, validateFloat } from '@/utils/validate'
import { addAttr as save } from '@/api/platform/org/entity'
import ActionUtils from '@/utils/action'
import AttrForm from './attr-form'

export default {
  components: {
    AttrForm
  },
  props: {
    id: [String, Number],
    partyType: String,
    height: Number
  },
  data() {
    return {
      forms: [],
      formData: {}
    }
  },
  watch: {
    id: {
      handler() {
        if (this.$utils.isNotEmpty(this.id)) {
          // 初始化数据
          this.forms = []
          this.formData = {}
          this.getFormData()
        }
      },
      immediate: true
    }
  },
  methods: {
    clearData() {
      this.$refs.form.clearData()
      save({
        'attrValueVoList': [],
        'entityId': this.id
      }).then(response => {
        ActionUtils.saveSuccessMessage(response.message, r => {
          if (r) {
            this.$emit('callback', this)
          }
        })
      })
    },
    saveData() {
      const list = []
      const attrValidator = this.$refs['form'] ? this.$refs['form'].callback() : null
      if (!attrValidator) {
        this.$message.closeAll()
        this.$message({
          message: '请检查表单数据是否填写正确',
          type: 'warning'
        })
        return
      }
      for (const key in this.formData) {
        const value = this.formData[key] || ''
        if (Array.isArray(value)) {
          value.forEach(v => {
            list.push({
              attrId: key,
              value: v
            })
          })
        } else {
          list.push({
            attrId: key,
            value: value
          })
        }
      }
      if (this.$utils.isEmpty(list)) {
        this.$message.closeAll()
        this.$message({
          message: '属性值不能为空！',
          type: 'warning'
        })
        return
      }
      save({
        'attrValueVoList': list,
        'entityId': this.id
      }).then(response => {
        ActionUtils.saveSuccessMessage(response.message, r => {
          if (r) {
            this.$emit('callback', this)
          }
        })
      })
    },
    // 获取数据
    getFormData() {
      findByPartyTypeUserId4Edit({
        partyType: this.partyType,
        userId: this.id
      }).then(response => {
        const data = response.data
        const formData = {}
        this.forms = data.map(item => {
          formData[item.id] = this.getValue(item, item.values)
          var rules = []
          if (item.dataType === 'INT') {
            rules.push({ validator: validateInteger, trigger: 'blur' })
          }
          if (item.dataType === 'DOUBLE') {
            rules.push({ validator: validateFloat, trigger: 'blur' })
          }
          return {
            prop: item.id,
            label: item.name,
            fieldType: item.dataType,
            options: item.options,
            multiple: item.isMulti === 'Y',
            rules: rules
          }
        })
        this.formData = formData
      }).catch(() => {
      })
    },
    getValue({ isMulti }, values) {
      if (this.$utils.isEmpty(values)) return ''
      // if (dataType === 'STRING' || dataType === 'INT' ||
      //  dataType === 'DOUBLE' || dataType === 'BOOLEAN' ||
      //   dataType === 'OPTION' || dataType === 'DATE') {

      // }
      if (isMulti === 'Y') {
        var datas = []
        values.forEach(v => {
          datas.push(v.value)
        })
        return datas
      }
      return values[0].value || ''
    },
    handlerData(data) {
      this.formData = data
    }
  }
}
</script>
<style lang="scss" scoped>
  .ibps-tools-btn{
    padding:5px;
    margin-bottom: 5px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
  }
  .el-button+.el-button {
      margin-left: 5px;
  }
</style>
