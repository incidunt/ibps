<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="8vh"
    class="schemeDialog"
    width="70%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="方案名称:" prop="name">
            <el-input v-if="!readonly" v-model="form.name" />
            <span v-else>{{ form.name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="分类:" prop="typeId">
            <ibps-type
              v-model="form.typeId"
              :readonly="readonly"
              category-key="TEMPLATE_TYPE"
              class="type"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否生成子表:" label-width="120px" prop="genSub">
            <el-radio-group v-if="!readonly" v-model="form.genSub">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
            <el-tag v-else :type="form.genSub|optionsFilter(genSubOptions,'type')">{{ form.genSub|optionsFilter(genSubOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表配置:" prop="tableName">
            <el-select
              v-if="!readonly"
              v-model="form.tableName"
              :loading="dialogLoading"
              filterable
              style="width:100%"
              clearable
              @change="handleChange"
            >
              <el-option
                v-for="item in tableNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.tableName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单:" prop="formIdentity">
            <el-select
              v-if="!readonly"
              v-model="form.formIdentity"
              filterable
              style="width:100%"
            >
              <el-option
                v-for="item in formIdentityOptions"
                :key="item.id"
                :label="item.text"
                :value="item.id"
              />
            </el-select>
            <el-tag v-else>{{ form.formIdentity|optionsFilter(formIdentityOptions,'text','id') }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="生成类型:">
            <!-- dotype -->
            <el-checkbox-group v-if="!readonly" v-model="form.doType">
              <el-checkbox
                v-for="value in doTypeOptions "
                :key="value.key"
                :label="value.key"
              >{{ value.name }}</el-checkbox>
            </el-checkbox-group>
            <!-- template -->
            <el-checkbox-group v-if="!readonly" v-model="form.doType">
              <el-checkbox
                v-for="value in templateOptions "
                :key="value.key"
                :label="value.key"
              >{{ value.name }}</el-checkbox>
            </el-checkbox-group>
            <el-tag
              v-for="(item,i) in form.doType"
              v-else
              :key="i"
            >
              {{ item }}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统:">
            <el-input v-if="!readonly" v-model="form.sys" />
            <span v-else>{{ form.sys }}</span>
          </el-form-item>
        </el-col>
        <el-col v-show="false" :span="12">
          <el-form-item label="平台:">
            <el-input v-if="!readonly" v-model="form.platform" />
            <span v-else>{{ form.platform }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="模块:">
            <el-input v-if="!readonly" v-model="form.module" />
            <span v-else>{{ form.module }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否基础模块" label-width="120px">
            <span class="icon">
              <el-tooltip class="item" effect="light" placement="bottom">
                <div slot="content">
                  基础模块是指系统名与模块名一致，生成代码时不会连续使用相同包名；<br>
                  系统名org，模块名org，是否基础模块为'是'则生成包名为com.lc.ibps.org；<br>
                  是否基础模块为'否'则生成包名为com.lc.ibps.org.org；</div>
                <ibps-icon name="help" />
              </el-tooltip>:
            </span>
            <el-radio-group v-if="!readonly" v-model="form.isBase">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
            <el-tag v-else :type="form.isBase|optionsFilter(genSubOptions,'type')">{{ form.isBase|optionsFilter(genSubOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="代码作者:">
              <el-input v-if="!readonly" v-model="form.developer" disabled="disabled" />
              <span v-else>{{ form.developer }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者邮箱:">
              <el-input v-if="!readonly" v-model="form.email" />
              <span v-else>{{ form.email }}</span>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="包路径:">
            <el-input v-if="!readonly" v-model="form.packageUrl" disabled="disabled" />
            <span v-else>{{ form.packageUrl }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单url:">
            <el-input v-if="!readonly" v-model="form.menuUrl" disabled="disabled" />
            <span v-else>{{ form.menuUrl }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述:">
            <el-input v-if="!readonly" v-model="form.comment" type="textarea" />
            <span v-else>{{ form.comment }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <params ref="params" :readonly="readonly" />
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { save, get, saveGen, saveGenWorkspace, getFormList } from '@/api/platform/codegen/scheme'
import { doTypeListJson } from '@/api/platform/codegen/doType'
import { findByUserId } from '@/api/platform/codegen/variable'
import { getTableConfigList } from '@/api/platform/codegen/tableConfig'
import { downloadFile } from '@/business/platform/file/utils'
import { genSubOptions } from '../constants'
import ActionUtils from '@/utils/action'
import IbpsType from '@/business/platform/cat/type/select'
import Params from './params'

export default {
  components: {
    IbpsType,
    Params
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      loading: false,

      tableNameOptions: [],
      tableNameList: [],
      tableNameStates: [], // 数据储存
      formIdentityOptions: [],
      formIdentityList: [],
      formIdentityStates: [], // 数据储存

      genSubOptions: genSubOptions,
      doTypeOptions: [],
      templateOptions: [],
      defaultForm: {},
      form: {
        name: '',
        typeId: '',
        genSub: 'Y',
        tableName: '',
        formIdentity: '',
        doType: ['default'],
        sys: 'demo',
        platform: 'platform',
        module: 'codegen',
        isBase: 'N',
        developer: '',
        email: '',
        packageUrl: 'com.lc.ibps.demo',
        menuUrl: '/platform/v3/demo/codegen//list',
        comment: '',
        creator: this.$store.getters.userId
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        tableName: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'saveGen', icon: 'ibps-icon-download', label: '保存并下载', hidden: () => { return this.readonly } },
        // { key: 'saveGenWorkspace', icon: 'ibps-icon-free-code-camp', label: '保存并生成到工作目录', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    'form.tableName': {
      handler: function(val, oldVal) {
        const tmp = this.tableNameOptions.find(function(item) {
          if (val === item.value) {
            return item
          }
        }, val)
        if (!tmp) {
          return
        }
        this.changeMenuUrl(tmp.classVar, 5)
        this.changeMenuUrl(tmp.struType, 6)
      },
      deep: true
    },
    'form.sys': {
      handler: function(val, oldVal) {
        this.changePackageUrl(val)
        this.changeMenuUrl(val, 3)
      },
      deep: true
    },
    'form.module': {
      handler: function(val, oldVal) {
        this.changeMenuUrl(val, 4)
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
    this.tableNameFocus()
    this.doTypeListJson()
  },
  methods: {
    handleChange(data) {
      this.form.formIdentity = ''
      this.formIdentityFocus(data)
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave('save')
          break
        case 'saveGen':
          this.handleSave('saveGen')
          break
        case 'saveGenWorkspace':
          this.handleSave('saveGenWorkspace')
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    getFindByUserId() {
      findByUserId({
        userId: this.$store.getters.userId
      }).then(response => {
        const data = response.data
        this.form.sys = data.sys
        this.form.module = data.module
        this.form.developer = data.developer
        this.form.email = data.email
        this.form.packageUrl = data.packageUrl
        this.form.menuUrl = data.menuUrl + '/demo/list'
      })
    },
    tableNameFocus() {
      getTableConfigList().then(response => {
        const data = response.data
        this.tableNameOptions = data.map(item => {
          return {
            label: item.text,
            value: item.id,
            classVar: item.classVar,
            mode: item.mode,
            struType: item.struType,
            class: item.class
          }
        })
      })
    },
    doTypeListJson() {
      doTypeListJson().then(response => {
        let data = []
        const dotypeArr = []
        const templateArr = []
        data = response.data
        data.forEach(item => {
          if (item.subType === 'doType') {
            dotypeArr.push(item)
          } else if (item.subType === 'template') {
            templateArr.push(item)
          }
        })
        this.doTypeOptions = dotypeArr
        this.templateOptions = templateArr
      })
    },
    formIdentityFocus(tableName) {
      getFormList({
        formName: '',
        tableName: tableName || ''
      }).then(response => {
        this.formIdentityOptions = response.data
      })
    },
    // 保存数据
    handleSave(type) {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData(type)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData(type) {
      const data = JSON.parse(JSON.stringify(this.form))
      const doType = []
      data.doType.forEach(item => {
        if (item !== '') {
          doType.push(item)
        }
      })
      data.doType = doType.join(',')
      data.schemeParamPoList = this.$refs['params'].save()
      if (type === 'save') {
        save(data).then(response => {
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          console.info(err)
        })
      }
      if (type === 'saveGen') {
        saveGen(data).then(response => {
          if (!response) {
            return
          }
          downloadFile({
            fileName: response.data.fileName,
            id: response.data.attachmentId
          })
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          console.info(err)
        })
      }
      if (type === 'saveGenWorkspace') {
        saveGenWorkspace(data).then(response => {
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          console.info(err)
        })
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs['params'].clear()
      this.$refs[this.formName].resetFields()
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
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        this.getFindByUserId()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        const data = response.data
        this.formIdentityFocus(data.tableName)
        data.doType = data.doType.split(',')
        this.$refs['params'].callback(data.schemeParamPoList)
        this.form = data
        this.formValidate()
        setTimeout(() => {
          this.dialogLoading = false
        })
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    changePackageUrl(val, index = 3) {
      const value = this.form.packageUrl
      const vArr = value.split('.')
      vArr[index] = val
      this.form.packageUrl = vArr.join('.')
    },
    changeMenuUrl(val, part) {
      const value = this.form.menuUrl
      const vArr = value.split('/')
      vArr[part] = val
      this.form.menuUrl = vArr.join('/')
    }
  }
}
</script>
<style lang="scss">
.schemeDialog{
  .type{
    line-height: 27px;
  }
  .el-dialog__body{
    padding: 10px 20px;
    height: calc(80vh - 110px) !important
  }
  .icon{
    position: relative;
    left: -10px;
    .item{
    color: #409EFF;
    }
  }
  .el-checkbox,
  .el-checkbox+.el-checkbox
  {
    margin-left: 0;
    width: 10%;
  }
}
</style>
