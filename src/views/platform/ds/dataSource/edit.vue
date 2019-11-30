<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="0"
    class="dialog"
    width="80%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="dataSourceForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="dataSource"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="dataSource.name" v-pinyin="{vm:dataSource,key:'alias'}" />
        <span v-else>{{ dataSource.name }}</span>
      </el-form-item>
      <el-form-item label="别名:" prop="alias">
        <el-input v-if="!readonly" v-model="dataSource.alias" />
        <span v-else>{{ dataSource.alias }}</span>
      </el-form-item>
      <el-form-item label="数据库类型:" prop="dbType">
        <el-select
          v-if="!readonly"
          v-model="dataSource.dbType"
          clearable
          placeholder="-请选择类型-"
          style="width:100%;"
          @change="dbTypeChange"
        >
          <el-option
            v-for="item in dbTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span v-else>{{ dataSource.dbType }}</span>
      </el-form-item>
      <el-form-item label="数据库驱动:" prop="driver">
        <el-input v-if="!readonly" v-model="dataSource.driver" />
        <span v-else>{{ dataSource.driver }}</span>
      </el-form-item>
      <el-form-item label="链接地址:" prop="driverUrl">
        <el-input v-if="!readonly" v-model="dataSource.driverUrl" />
        <span v-else>{{ dataSource.driverUrl }}</span>
      </el-form-item>
      <el-form-item label="用户名:" prop="user">
        <el-input v-if="!readonly" v-model="dataSource.user" />
        <span v-else>{{ dataSource.user }}</span>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-if="!readonly" v-model="dataSource.password" type="password" />
        <span v-else>{{ dataSource.password }}</span>
      </el-form-item>
      <el-form-item label="确认密码:" prop="confirmPwd">
        <el-input v-if="!readonly" v-model="dataSource.confirmPwd" type="password" />
        <span v-else>{{ dataSource.confirmPwd }}</span>
      </el-form-item>
      <el-form-item label="是否默认:" prop="isDefault">
        <el-input v-if="!readonly" v-model="dataSource.isDefault" readonly />
        <span v-else>{{ dataSource.isDefault }}</span>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select
          v-if="!readonly"
          v-model="dataSource.status"
          clearable
          placeholder="请选择"
          style="width:100%;"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span v-else>{{ dataSource.status }}</span>
      </el-form-item>
      <el-form-item label="说明:" prop="step">
        <el-input v-if="!readonly" v-model="dataSource.step" />
        <span v-else>{{ dataSource.step }}</span>
      </el-form-item>

      <el-form-item label="delegateProperties:" prop="delegateProperties">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.delegateProperties" />
        <span v-else>{{ dataSource.variableJson.delegateProperties }}</span>
        <div class="el-form-item__error">java.util.Properties</div>
      </el-form-item>
      <el-form-item label="jmx:" prop="jmx">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.jmx" />
        <span v-else>{{ dataSource.variableJson.jmx }}</span>
        <div class="el-form-item__error">boolean</div>
      </el-form-item>
      <el-form-item label="maximumActiveTime:" prop="maximumActiveTime">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.maximumActiveTime" />
        <span v-else>{{ dataSource.variableJson.maximumActiveTime }}</span>
        <div class="el-form-item__error">long</div>
      </el-form-item>
      <el-form-item label="maximumConnectionLifetime:" prop="maximumConnectionLifetime">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.maximumConnectionLifetime" />
        <span v-else>{{ dataSource.variableJson.maximumConnectionLifetime }}</span>
        <div class="el-form-item__error">long</div>
      </el-form-item>
      <el-form-item label="trace:" prop="trace">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.trace" />
        <span v-else>{{ dataSource.variableJson.trace }}</span>
        <div class="el-form-item__error">boolean</div>
      </el-form-item>
      <el-form-item label="fatalSqlExceptionsAsString:" prop="fatalSqlExceptionsAsString">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.fatalSqlExceptionsAsString" />
        <span v-else>{{ dataSource.variableJson.fatalSqlExceptionsAsString }}</span>
        <div class="el-form-item__error">java.lang.String</div>
      </el-form-item>
      <el-form-item label="logWriter:" prop="logWriter">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.logWriter" />
        <span v-else>{{ dataSource.variableJson.logWriter }}</span>
        <div class="el-form-item__error">java.io.PrintWriter</div>
      </el-form-item>
      <el-form-item label="testAfterUse:" prop="testAfterUse">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.testAfterUse" />
        <span v-else>{{ dataSource.variableJson.testAfterUse }}</span>
        <div class="el-form-item__error">boolean</div>
      </el-form-item>
      <el-form-item label="minimumConnectionCount:" prop="minimumConnectionCount">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.minimumConnectionCount" />
        <span v-else>{{ dataSource.variableJson.minimumConnectionCount }}</span>
        <div class="el-form-item__error">int</div>
      </el-form-item>
      <el-form-item label="simultaneousBuildThrottle:" prop="simultaneousBuildThrottle">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.simultaneousBuildThrottle" />
        <span v-else>{{ dataSource.variableJson.simultaneousBuildThrottle }}</span>
        <div class="el-form-item__error">int</div>
      </el-form-item>
      <el-form-item label="loginTimeout:" prop="loginTimeout">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.loginTimeout" />
        <span v-else>{{ dataSource.variableJson.loginTimeout }}</span>
        <div class="el-form-item__error">int</div>
      </el-form-item>
      <el-form-item label="prototypeCount:" prop="prototypeCount">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.prototypeCount" />
        <span v-else>{{ dataSource.variableJson.prototypeCount }}</span>
        <div class="el-form-item__error">int</div>
      </el-form-item>
      <el-form-item label="testBeforeUse:" prop="testBeforeUse">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.testBeforeUse" />
        <span v-else>{{ dataSource.variableJson.testBeforeUse }}</span>
        <div class="el-form-item__error">boolean</div>
      </el-form-item>
      <el-form-item label="houseKeepingTestSql:" prop="houseKeepingTestSql">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.houseKeepingTestSql" />
        <span v-else>{{ dataSource.variableJson.houseKeepingTestSql }}</span>
        <div class="el-form-item__error">java.lang.String</div>
      </el-form-item>
      <el-form-item label="maximumConnectionCount:" prop="maximumConnectionCount">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.maximumConnectionCount" />
        <span v-else>{{ dataSource.variableJson.maximumConnectionCount }}</span>
        <div class="el-form-item__error">int</div>
      </el-form-item>
      <el-form-item label="overloadWithoutRefusalLifetime:" prop="overloadWithoutRefusalLifetime">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.overloadWithoutRefusalLifetime" />
        <span v-else>{{ dataSource.variableJson.overloadWithoutRefusalLifetime }}</span>
        <div class="el-form-item__error">long</div>
      </el-form-item>
      <el-form-item label="statistics:" prop="statistics">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.statistics" />
        <span v-else>{{ dataSource.variableJson.statistics }}</span>
        <div class="el-form-item__error">java.lang.String</div>
      </el-form-item>
      <el-form-item label="statisticsLogLevel:" prop="statisticsLogLevel">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.statisticsLogLevel" />
        <span v-else>{{ dataSource.variableJson.statisticsLogLevel }}</span>
        <div class="el-form-item__error">java.lang.String</div>
      </el-form-item>
      <el-form-item label="fatalSqlExceptionWrapperClass:" prop="fatalSqlExceptionWrapperClass">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.fatalSqlExceptionWrapperClass" />
        <span v-else>{{ dataSource.variableJson.fatalSqlExceptionWrapperClass }}</span>
        <div class="el-form-item__error">java.lang.String</div>
      </el-form-item>
      <el-form-item label="recentlyStartedThreshold:" prop="recentlyStartedThreshold">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.recentlyStartedThreshold" />
        <span v-else>{{ dataSource.variableJson.recentlyStartedThreshold }}</span>
        <div class="el-form-item__error">long</div>
      </el-form-item>
      <el-form-item label="verbose:" prop="verbose">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.verbose" />
        <span v-else>{{ dataSource.variableJson.verbose }}</span>
        <div class="el-form-item__error">boolean</div>
      </el-form-item>
      <el-form-item label="houseKeepingSleepTime:" prop="houseKeepingSleepTime">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.houseKeepingSleepTime" />
        <span v-else>{{ dataSource.variableJson.houseKeepingSleepTime }}</span>
        <div class="el-form-item__error">long</div>
      </el-form-item>
      <el-form-item label="jmxAgentId:" prop="jmxAgentId">
        <el-input v-if="!readonly" v-model="dataSource.variableJson.jmxAgentId" />
        <span v-else>{{ dataSource.variableJson.jmxAgentId }}</span>
        <div class="el-form-item__error">java.lang.String</div>
      </el-form-item>

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
import { save, test } from '@/api/platform/system/identity'
import { get } from '@/api/platform/ds/dataSource'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'
import { dbTypeOptions, statusOptions } from './constants'

export default {
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
      formName: 'dataSourceForm',
      formLabelWidth: '220px',
      dialogVisible: this.visible,
      dbTypeOptions: dbTypeOptions,
      statusOptions: statusOptions,
      dialogLoading: false,
      defaultForm: {},
      dataSource: {
        name: '',
        alias: '',
        oldAlias: '',
        dbType: '',
        driver: '',
        driverUrl: '',
        user: '',
        password: '',
        confirmPwd: '',
        status: 'disable',
        comment: '',
        variableJson: {
          delegateProperties: '',
          jmx: 'true',
          maximumActiveTime: '30',
          maximumConnectionLifetime: '10',
          trace: '',
          fatalSqlExceptionsAsString: '',
          logWriter: '',
          testAfterUse: '',
          minimumConnectionCount: '',
          simultaneousBuildThrottle: '',
          loginTimeout: '',
          prototypeCount: '',
          testBeforeUse: '',
          houseKeepingTestSql: '',
          maximumConnectionCount: '',
          overloadWithoutRefusalLifetime: '',
          statistics: '',
          statisticsLogLevel: '',
          fatalSqlExceptionWrapperClass: '',
          recentlyStartedThreshold: '',
          verbose: '',
          houseKeepingSleepTime: '',
          jmxAgentId: ''
        },
        paramJson: {}
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        alias: [
          { required: true, validator: validateKey },
          { type: 'string', min: 1, max: 60, message: '长度不超过60位', trigger: 'blur' }
        ],
        driver: [{ required: true, message: this.$t('validate.required') }],
        driverUrl: [{ required: true, message: this.$t('validate.required') }]
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
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.dataSource))
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
    // 保存数据
    handleSave(preview = false) {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (preview) {
            this.handlePreview()
          } else {
            this.saveData()
          }
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      save(this.dataSource).then(response => {
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
    },
    handlePreview() {
      test(this.dataSource).then(response => {
        const data = response.data
        this.$alert(data, '预览流水号', {
          dangerouslyUseHTMLString: true
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    dbTypeChange(data) {
      const index = this.dbTypeOptions.findIndex(i => i.value === data)
      this.dataSource.driver = this.dbTypeOptions[index].driver
      this.dataSource.driverUrl = this.dbTypeOptions[index].driverUrl
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
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
        this.dataSource = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.dataSource = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
