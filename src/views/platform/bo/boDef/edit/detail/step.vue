<template>
  <div>
    <el-steps
      :active="stepActive"
      align-center
      finish-status="success"
    >
      <el-step title="选择BO类型" @click.native="handleStep(1)" />
      <el-step title="选择现有BO" @click.native="handleStep(2)" />
      <el-step title="选择离线表" @click.native="handleStep(3)" />
    </el-steps>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <!--步骤①-->
      <div v-show="stepActive===1" class="boType">
        <el-form-item label="BO类型：" prop="boType">
          <el-radio-group v-model="form.boType">
            <el-radio label="new">新建</el-radio>
            <el-radio :disabled="showBo" label="boDef">现有BO</el-radio>
            <el-radio label="external">离线表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="步骤说明：">
          <div class="step-desc">
            <ul>
              <li> 1、新建：</li>
              <li>
                <ul>
                  <li> 1.1 跳转编辑页面；</li>
                </ul>
              </li>
              <li>2、现有BO：</li>
              <li>
                <ul>
                  <li>2.1、选择现有BO；</li>
                  <li>2.2、跳转到编辑页面；</li>
                </ul>
              </li>

              <li>离线表</li>
              <li>
                <ul>
                  <li>3.1、有对应BO:</li>
                  <li>
                    <ul>
                      <li>3.1.1、选择现有BO；</li>
                      <li>3.1.2、跳转到编辑页面</li>
                    </ul>
                  </li>
                </ul>
                <ul>
                  <li>3.2、无对应BO：</li>
                  <li>
                    <ul>
                      <li>3.2.1、选择现有BO；</li>
                      <li>3.2.2、选择离线表；</li>
                      <li>3.2.3、跳转到编辑页面；</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-form-item>
      </div>
      <!--步骤②-->

      <div v-show="stepActive===2" class="external-hint">
        <el-form-item label="BO定义:" prop="boCode">
          <div v-if="tip==='tip'">
            <label>离线表创建的BO不能直接添加为主对象，如需修改请直接通过编辑功能修改！</label>
          </div>
          <div v-else>
            <bo-def-selector v-model="form.boCode" title="业务对像选择器" :height="height" :bo="isBo" @input="bodefInput" />
          </div>
        </el-form-item>
      </div>

      <!--步骤③-->
      <div v-show="stepActive===3" class="external">
        <el-form-item label="离线表：" prop="external">
          <bo-def-selector
            v-model="form.external"
            title="离线表选择器"
            store="json"
            :bo="isBo"
            :height="height"
            @change="externalInput"
            @callback="data => dsAliasOptions = data"
          />
        </el-form-item>
      </div>
    </el-form>
    <div style="padding-left: 20px;">
      <div class="formFooter">
        <el-button :disabled="stepActive === 1" icon="el-icon-arrow-left" type="primary" style="margin-top: 12px;" @click="prev">上一步</el-button>
        <el-button v-if="stepActive !== 3" autofocus type="primary" style="margin-top: 12px;" @click="next">下一步<i class="el-icon-arrow-right el-icon--right" /></el-button>
        <el-button v-else autofocus type="primary" style="margin-top: 12px;" @click="complete">完成<i class="el-icon-arrow-right el-icon--right" /></el-button>
      </div>
    </div>
  </div>
</template>
<script>
// import { getJson } from '@/api/platform/bo/boDef'
import BoDefSelector from '@/business/platform/bo/def/selector'
import ActionUtils from '@/utils/action'
export default {
  components: {
    BoDefSelector
  },
  props: {
    action: String
  },
  data() {
    return {
      stepActive: 1,
      searchFormCreator: '',
      tip: '',
      paramArr: [],
      isBo: true,
      formLabelWidth: '120px',
      form: {
        boType: 'new',
        boCode: '',
        external: ''
      },
      height: '',
      rules: {},
      dsAliasOptions: []
    }
  },
  computed: {
    showBo() {
      return this.action !== 'addSub'
    }
  },
  created() {
    this.height = JSON.stringify(document.body.offsetHeight - 350) + 'px'
  },
  methods: {
    // 上一步
    prev() {
      this.stepActive--
      if (this.form.boType === 'boDef') {
        console.log(this.stepActive)
      }
      if (this.form.boType === 'external') {
        console.log(this.stepActive)
      }
    },
    next() {
      const boType = this.form.boType
      if (boType === 'new') {
        this.rules = {}
        this.$emit('step-action', boType)
        return
      } else if (boType === 'boDef') { // 现选BO
        this.isBo = true
        if (this.stepActive === 1) {
          this.stepActive++
          this.tip = ''
          this.rules = {
            boCode: [{ required: true, message: this.$t('validate.required') }]
          }
        } else {
          // 表验证
          if (this.$utils.isEmpty(this.form.boCode)) {
            ActionUtils.saveErrorMessage()
          } else {
            this.$emit('step-action', boType, this.form.boCode)
          }
        }
      } else if (boType === 'external') { // 离线表
        this.isBo = false
        if (this.stepActive === 1) {
          if (this.$utils.isEmpty(this.form.external)) {
            this.rules = { external: [{ required: true, message: this.$t('validate.required') }] }
            this.rules.boCode = [{ required: false, message: this.$t('validate.required') }]
          }
          this.tip = 'tip'
          this.$emit('step-action', boType)
        }
        this.stepActive++
      }
    },
    bodefInput(value) {
      if (this.$utils.isEmpty(value)) {
        this.rules = { boCode: [{ required: true, message: this.$t('validate.required') }] }
      } else {
        this.rules = { boCode: [{ required: false, message: this.$t('validate.required') }] }
      }
      this.form.boCode = value
    },
    complete() {
      if (this.$utils.isEmpty(this.form.external)) {
        ActionUtils.saveErrorMessage()
      } else {
        this.$emit('complete', this.form.external)
      }
    },
    externalInput(value) {
      if (this.$utils.isEmpty(value)) {
        this.rules = { external: [{ required: true, message: this.$t('validate.required') }] }
      } else {
        this.rules = { external: [{ required: false, message: this.$t('validate.required') }] }
      }
      const arr = []
      let pk
      let fk
      value.columnList.forEach(item => {
        if (item.isPk && item.isPk === 'Y') {
          pk = item.name
        }
        if (item.isFk && item.isFk === 'Y') {
          fk = item.name
        }
      })
      const obj = {
        tableDesc: value.comment,
        tableName: value.name,
        aliasName: value.name,
        dsName: this.dsAliasOptions.label,
        dsAlias: this.dsAliasOptions.value,
        pk: pk,
        fk: fk
      }
      obj.attrs = value.columnList.map(item => {
        return {
          code: item.name,
          alias: item.name,
          name: item.comment,
          dataType: item.columnType,
          attrLength: item.intLen > 0 ? item.intLen : item.charLen,
          precision: item.decimalLen
        }
      })
      arr.push(obj)
      this.form.external = JSON.stringify(arr)
    },
    resetFields() {
      this.stepActive = 1
      this.$refs['form'].resetFields()
    },
    handleStep(step) {
      if (this.stepActive <= step) { return }
      this.stepActive = step
    }
  }
}
</script>
<style lang="scss" >
.bo-content-detail{
  .step-desc{
    ul{
        line-height: 20px;
        li{
          line-height: 25px;
        }
    }
  }
  .external,
  .external-hint,
  .boType{
    padding-top:15px;
  }
  .external{
    .ibps-selector .selector-list{
      line-height: 28px;
      min-height: 0;
      max-height: 30px;
    }
  }
  .formFooter{
     text-align: center;
   }
}
</style>

