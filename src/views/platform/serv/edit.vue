<template>
  <div v-if="dialogVisible" class="main-container">
    <ibps-container type="full" class="page">
      <template slot="header">
        <el-button type="primary" :disabled="readonly" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      </template>
      <el-form
        ref="serviceForm"
        :model="service"
        :rules="rules"
        :label-width="formLabelWidth"
      >

        <!-- 服务主体部分 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称:" prop="name">
              <el-input v-if="!readonly" v-model="service.name" v-pinyin="{vm:service,key:'key'}" />
              <span v-else>{{ service.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标识:" prop="key">
              <el-input v-if="!readonly" v-model="service.key" />
              <span v-else>{{ service.key }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="service.isDir!=='Y'">
          <el-col :span="19">
            <el-form-item label="服务地址:" prop="address">
              <el-input v-if="!readonly" v-model="service.address" />
              <span v-else>{{ service.address }}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="!readonly" :span="4" :offset="1">
            <el-button type="primary" size="mini" @click="handleParse()">解析</el-button>
            <el-button type="primary" size="mini" @click="handleTest()">测试</el-button>
          </el-col>
        </el-row>
        <el-row v-if="service.isDir!=='Y' && (service.serviceType==='webservice' || serviceTypeLocal === 'local')">
          <el-col :span="24">
            <el-form-item label="命名空间:" prop="namespace">
              <el-input v-if="!readonly" v-model="service.namespace" />
              <span v-else>{{ service.namespace }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="service.isDir!=='Y' && (service.serviceType==='webservice' || serviceTypeLocal === 'local')">
          <el-col :span="12">
            <el-form-item label="是否设置消息头:" prop="soapAction">
              <el-select v-if="!readonly" v-model="service.soapAction" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="option in defaultOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <span v-else>{{ service.soapAction|optionsFilter(defaultOptions,'label') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作方法:" prop="operation">
              <el-input v-if="!readonly" v-model="service.operation" />
              <span v-else>{{ service.operation }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="service.isDir!=='Y' && (service.serviceType==='webservice' || serviceTypeLocal === 'local')">
          <el-col :span="12">
            <el-form-item label="用户名:" prop="username">
              <el-input v-if="!readonly" v-model="service.username" />
              <span v-else>{{ service.username }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码:" prop="password">
              <el-input v-if="!readonly" v-model="service.password" />
              <span v-else>{{ service.password }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否目录:" prop="isDir">
              <el-select v-if="!readonly" v-model="service.isDir" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="option in defaultOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <span v-else>{{ service.isDir|optionsFilter(defaultOptions,'label') }}</span>
            </el-form-item>
          </el-col>
          <el-col v-if="service.isDir!=='Y'" :span="12">
            <el-form-item label="忽略异常:" prop="ignoreException">
              <el-select v-if="!readonly" v-model="service.ignoreException" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="option in defaultOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <span v-else>{{ service.ignoreException|optionsFilter(defaultOptions,'label') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="service.isDir!=='Y'">
          <el-col :span="12">
            <el-form-item label="请求方式:" prop="method">
              <el-select v-if="!readonly" v-model="service.method" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="option in methodOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <span v-else>{{ service.method|optionsFilter(methodOptions,'label') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接口类型:" prop="serviceType">
              <el-select v-if="!readonly" v-model="service.serviceType" placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="option in serviceTypeOptions"
                  v-show="option.type === serviceTypeLocal"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <span v-else>{{ service.serviceType|optionsFilter(serviceTypeOptions,'label') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述:" prop="desc">
              <el-input v-if="!readonly" v-model="service.desc" type="textarea" />
              <span v-else>{{ service.desc }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="service.isDir!=='Y'">
          <el-col :span="24">
            <el-form-item label="返回值格式:" prop="resultModel">
              <el-input v-if="!readonly" v-model="service.resultModel" type="textarea" />
              <span v-else>{{ service.resultModel }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 服务参数部分 -->
        <el-row v-if="service.isDir!=='Y'" class="lc-row-buttom-setting">
          <el-col :span="14" :offset="10">
            <span>输入参数：</span>
            <el-tooltip class="item" effect="dark" content="第三方接口token目前只支持以参数的形式传入；大文本类型有且只有一个，对应request的body" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
            <el-button v-if="!readonly" type="primary" size="mini" @click="addParam()">添加</el-button>
            <el-button v-if="!readonly" type="primary" size="mini" @click="delParams()">重置</el-button>
          </el-col>
        </el-row>
        <div v-if="service.isDir!=='Y'">
          <el-row v-for="(item, index) in service.serviceParams" :key="index">
            <el-col :span="4">
              <el-row v-if="!readonly" class="lc-row-buttom-setting">
                <el-button type="primary" size="mini" @click="resetParam(item, index)">还原</el-button>
                <el-button type="primary" size="mini" @click="delParam(item, index)">删除</el-button>
              </el-row>
              <el-row v-if="!readonly" class="lc-row-buttom-setting">
                <el-button type="primary" size="mini" @click="moveUp(item, index)">上移</el-button>
                <el-button type="primary" size="mini" @click="moveDown(item, index)">下移</el-button>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="数据类型:">
                    <el-select v-if="!readonly" v-model="item.dataType" placeholder="请选择" style="width:100%;" @change="()=>item.testValue=''">
                      <el-option
                        v-for="option in dataTypeOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                    <span v-else>{{ item.dataType|optionsFilter(dataTypeOptions,'label') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="参数类型:">
                    <el-select v-if="!readonly" v-model="item.type" placeholder="请选择" style="width:100%;">
                      <el-option
                        v-for="option in typeOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                    <span v-else>{{ item.type|optionsFilter(typeOptions,'label') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="参数名:" :prop="'serviceParams.' + index + '.name'" :rules="{required: true, message: '参数名不能为空', trigger: 'blur'}">
                    <el-input v-if="!readonly" v-model="item.name" />
                    <span v-else>{{ item.name }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="item.type==='dynamic'||item.type==='fixed'" :span="12">
                  <el-form-item label="值或表达式:">
                    <el-input v-if="!readonly" v-model="item.defaultValue" :disabled="item.type==='dynamic'" />
                    <span v-else>{{ item.defaultValue }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-if="item.type==='script'" :span="12">
                  <el-form-item label="值或表达式:">
                    <!-- <el-button @click="handleSelectScript('', index)">常用脚本</el-button>
                    <el-button @click="handleSelectScript('', index)">条件脚本</el-button> -->
                    <el-input v-if="!readonly" v-model="item.defaultValue" type="textarea" size="medium" :disabled="item.type==='dynamic'" />
                    <span v-else>{{ item.defaultValue }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否必填:">
                    <el-select v-if="!readonly" v-model="item.isRequire" placeholder="请选择" style="width:100%;">
                      <el-option
                        v-for="option in defaultOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                    <span v-else>{{ item.isRequire|optionsFilter(defaultOptions,'label') }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="测试值:" :prop="'serviceParams.' + index + '.testValue'" :rules="{required: item.isRequire === 'Y'?true:false, message: '测试值不能为空', trigger: 'blur'}">
                    <div v-if="!readonly">
                      <el-input v-if="item.dataType === 'string'" v-model="item.testValue" />
                      <el-input v-if="item.dataType === 'int'" v-model="item.testValue" type="number" />
                      <el-input-number v-if="item.dataType === 'double'" v-model="item.testValue" :precision="4" />
                      <el-date-picker v-if="item.dataType === 'date'" v-model="item.testValue" type="datetime" placeholder="选择日期时间" />
                      <el-select v-if="item.dataType === 'boolean'" v-model="item.testValue" placeholder="请选择" style="width:100%;">
                        <el-option label="true" value="true" />
                        <el-option label="false" value="false" />
                      </el-select>
                      <el-input v-if="item.dataType === 'text'" v-model="item.testValue" type="textarea" />
                    </div>
                    <span v-else>{{ item.testValue }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>

        <!-- 服务地址示例 -->
        <el-row v-if="service.isDir!=='Y'">
          <el-col :span="13" :offset="11">服务地址示例</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="restful格式:">
              <span>IP：http://192.168.3.220:5100/ibps/oauth2/v3/user/login，域名：http://cloud.bpmhome.cn:15100/ibps/oauth2/v3/user/login</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="webService格式:">
              <span>http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?wsdl</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="request格式:">
              <span>/login.htm</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13" :offset="11">服务返回示例</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Json字符串:">
              <span>
                {<br>
                &nbsp;&nbsp;"cause": "string", // 异常原因<br>
                &nbsp;&nbsp;"data": {}, // 数据主体，Map形式（如：查询用户，则用Map格式返回用户数据）<br>
                &nbsp;&nbsp;"message": "string", // 成功提示<br>
                &nbsp;&nbsp;"request": "string", // 本次请求的地址<br>
                &nbsp;&nbsp;"state": 0, // 响应状态，200成功，其它都是失败<br>
                &nbsp;&nbsp;"variables": {} // 动态变量，Map形式（如：保存用户，则用Map格式返回用户ID或其他数据）<br>
                }
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <!--
        -->
      </el-form>
      <!-- 常用脚本对话框 -->
      <!-- <common-script
        :visible="commonScriptVisible"
        :value="commonScriptValue"
        :type="commonType"
        @close="visible => commonScriptVisible = visible"
        @action-event="handleCommonSelectorActionEvent"
      /> -->
    </ibps-container>
  </div>
</template>
<script>
import { save, get, testService, parseService } from '@/api/platform/serv/service'
import ActionUtils from '@/utils/action'
import { defaultOptions, methodOptions, serviceTypeOptions, dataTypeOptions, typeOptions } from './constants'
import { validateKey } from '@/utils/validate'
// import { CommonScript } from '@/business/platform/bpmn/setting/bpmn-setting/components/form-script/common-script/dialog'
export default {
  // components: {
  //   CommonScript
  // },
  props: {
    id: {
      type: String
    },
    serviceType: {
      type: String,
      default: 'remote'
    },
    parentData: Object, // 父类数据
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formName: 'serviceForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      // 常用脚本对话框参数
      commonScriptVisible: false,
      commonScriptValue: '',
      commonType: 'default',
      // 条件脚本对话框参数
      conditionScriptVisible: false,
      conditionScriptValue: '',

      defaultOptions: defaultOptions,
      methodOptions: methodOptions,
      dataTypeOptions: dataTypeOptions,
      typeOptions: typeOptions,

      serviceTypeLocal: '', // 服务类型，local/remote
      defaultForm: {
        name: '',
        key: '',
        address: '',
        namespace: '',
        soapAction: 'N',
        operation: '',
        username: '',
        password: '',
        isDir: 'N',
        ignoreException: 'N',
        method: 'POST',
        serviceType: '',
        type: '',
        resultModel: '',
        desc: '',
        serviceParams: []
      },
      service: {},
      defaultParam: {
        name: '',
        dataType: 'string',
        type: 'dynamic',
        isRequire: 'Y',
        defaultValue: '',
        testValue: '',
        desc: '',
        sn: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, validator: validateKey }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    serviceTypeOptions() {
      const _this = this
      return serviceTypeOptions.filter(function(currentValue, index, arr) {
        return currentValue.type === _this.serviceTypeLocal
      })
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.getFormData()
      },
      immediate: true
    },
    formId() {
      this.getFormData()
    },
    serviceType: {
      handler: function(val, oldVal) {
        this.serviceTypeLocal = this.serviceType
        this.getFormData()
      },
      immediate: true
    },
    'service.isDir': {
      handler: function(val, oldVal) {
        if (this.service.isDir === 'N') {
          this.rules.address = [{ required: true, message: this.$t('validate.required') }]
        } else {
          this.rules.address = [{ required: false }]
        }
      },
      immediate: true
    }
  },
  created() {
    this.service = JSON.parse(JSON.stringify(this.defaultForm))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      if (this.$utils.isEmpty(this.formId)) {
        this.service.parentId = this.parentData.id
      }
      this.service.type = this.serviceTypeLocal
      save(JSON.stringify(this.service)).then(response => {
        ActionUtils.removeSuccessMessage('保存成功')
        this.$emit('callback', true)
      }).catch((err) => {
        console.info(err)
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
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.service = JSON.parse(JSON.stringify(this.defaultForm))
        this.serviceTypeLocal = this.serviceType
        if (this.serviceTypeLocal === 'local') {
          this.service.serviceType = 'request'
        } else if (this.serviceTypeLocal === 'remote') {
          this.service.serviceType = 'restful'
        }
        this.formValidate()
        return
      }
      get({
        serviceId: this.formId
      }).then(response => {
        this.$refs[this.formName].clearValidate()
        this.service = response.data
        this.serviceTypeLocal = this.service.type
      }).catch(() => { })
    },
    /**
     * 添加服务参数
     */
    addParam() {
      this.service.serviceParams.push(this.$utils.newData(this.defaultParam))
    },
    /**
     * 清空所有参数
     */
    delParams() {
      this.service.serviceParams = []
    },
    /**
     * 重置当前参数
     */
    resetParam(data, index) {
      this.service.serviceParams.splice(index, 1, this.$utils.newData(this.defaultParam))
    },
    /**
     * 删除当前参数
     */
    delParam(data, index) {
      this.service.serviceParams.splice(index, 1)
    },
    /**
     * 上移
     */
    moveUp(data, index) {
      if (index !== 0) {
        this.swapArray(this.service.serviceParams, index, index - 1)
      } else {
        alert('已经处于置顶，无法上移')
      }
    },
    /**
     * 下移
     */
    moveDown(data, index) {
      if (index + 1 !== length) {
        this.swapArray(this.service.serviceParams, index, index + 1)
      } else {
        alert('已经处于置底，无法下移')
      }
    },
    /**
     * 交换数组方法
     */
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    /**
     * 解析服务
     */
    handleParse() {
      const params = {
        url: this.service.address,
        method: this.service.method,
        type: this.service.type,
        parentId: this.parentData.id
      }
      parseService(params).then(response => {
        ActionUtils.success(response.message)
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 测试服务
     */
    handleTest() {
      this.service.type = this.serviceTypeLocal
      testService(JSON.stringify(this.service)).then(response => {
        if (response.state === '200' || response.state === 200) {
          ActionUtils.success(response.message)
          this.service.resultModel = response.data
        } else {
          ActionUtils.error(response.cause)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectScript(data, index) {
      this.commonScriptVisible = true
    },
    handleCommonSelectorActionEvent(data) {
      console.log('handleCommonSelectorActionEvent--->', data)
    }
  }
}
</script>

<style scoped>
.lc-row-buttom-setting{
  margin-bottom: 10px;
}
/* .el-row {
    margin-bottom: 10px;
  } */
</style>
