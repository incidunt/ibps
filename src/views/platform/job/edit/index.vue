<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    top="5vh"
    class="dialog job-edit-dialog"
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form
      ref="schedulerForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="scheduler"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="任务名:" prop="jobName">
        <el-input v-if="!readonly" v-model="scheduler.jobName" :disabled="params.jobName!==undefined" />
        <span v-else>{{ scheduler.jobName }}</span>
      </el-form-item>
      <el-form-item label="分组:">
        <el-select v-if="!readonly" v-model="scheduler.group" :disabled="params.group!==undefined" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in groups"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
        <span v-else>{{ scheduler.group }}</span>
      </el-form-item>
      <el-form-item prop="jobClass">
        <template slot="label">任务类:
          <el-popover
            v-if="!readonly"
            :width="200"
            trigger="hover"
          >
            <i slot="reference" class="ibps-icon-help" style="color: red;font-size: 13px;" />
            参考测试类：com.lc.ibps.cloud.timer.job.PrintJob
          </el-popover>
        </template>
        <el-input v-if="!readonly" v-model="scheduler.jobClass" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" type="primary" icon="ibps-icon-check" style="background:#409eff;color:white;" @click="verify">验证</el-button>
        </el-input>
        <span v-else>{{ scheduler.jobClass }}</span>
      </el-form-item>
      <el-form-item label="任务描述:" prop="description">
        <el-input v-if="!readonly" v-model="scheduler.description" type="textarea" />
        <span v-else>{{ scheduler.description }}</span>
      </el-form-item>
    </el-form>
    <el-row>
      <!--参数-->
      <params ref="addParams" :readonly="readonly" :job-data-map="jobDataMap" />
    </el-row>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getGroups, validClass, create, update, get } from '@/api/platform/job/job'
import { validateKey } from '@/utils/validate'
import ActionUtils from '@/utils/action'
import params from './params'

export default {
  components: {
    params
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
    title: String,
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formName: 'schedulerForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      groups: [],
      jobDataMap: [],
      defaultForm: {},
      jobClass: false,
      scheduler: {
        jobName: '',
        group: '',
        jobClass: '',
        description: '',
        jobDataMap: {}
      },
      rules: {
        jobName: [{ required: true, validator: validateKey }],
        group: [{ required: true, message: this.$t('validate.required') }],
        jobClass: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
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
    this.loadGroups()
    this.defaultForm = JSON.parse(JSON.stringify(this.scheduler))
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
    loadGroups() {
      getGroups().then(response => {
        this.groups = response.data
        if (this.$utils.isNotEmpty(this.groups)) {
          this.defaultForm.group = this.groups[0]
          this.scheduler.group = this.groups[0]
        }
      })
    },
    verify() {
      if (this.$utils.isNotEmpty(this.scheduler.jobClass)) {
        validClass({
          jobClass: this.scheduler.jobClass
        }).then(response => {
          this.jobClass = true
          this.$message.closeAll()
          this.$message.success('验证成功！')
        })
      } else {
        this.jobClass = false
        this.$message.closeAll()
        this.$message.warning('请填写验证类！')
      }
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
      const jobDataMap = this.$refs.addParams.getData()
      const jobDataMapObj = {}
      const obj = {}
      jobDataMap.forEach(i => {
        obj[i.paramsName] = i.paramValue
        Object.assign(jobDataMapObj, obj)
      })
      this.scheduler.jobDataMap = jobDataMapObj
      if (this.params.group === undefined && this.params.jobName === undefined) {
        create(this.scheduler).then(response => {
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            } else {
              this.$refs['addParams'].initData()
            }
          })
        }).catch((err) => {
          console.info(err)
        })
      } else {
        update(this.scheduler).then(response => {
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            } else {
              this.$refs['addParams'].initData()
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
      this.$refs[this.formName].resetFields()
      this.$refs['addParams'].initData()
    },
    getFormData() {
      // 加载组
      this.loadGroups()
      if (this.params.jobName === undefined) {
        // 重置表单
        this.scheduler = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        group: this.params.group,
        jobName: this.params.jobName
      }).then(response => {
        this.scheduler = response.data
        this.tableDataDispose(this.scheduler.jobDataMap)
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    tableDataDispose(jobDataMap) {
      if (jobDataMap === {}) return
      const arr = []
      const targetArr = []
      for (var i in jobDataMap) {
        arr.push(i)
      }
      arr.forEach(l => {
        for (var i in jobDataMap) {
          if (l === i) {
            const obj = {
              paramsName: '',
              paramValue: ''
            }
            obj.paramsName = i
            obj.paramValue = jobDataMap[i]
            l = obj
            targetArr.push(l)
          }
        }
      })
      this.jobDataMap = targetArr
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    }
  }

}
</script>
<style lang="scss">
.job-edit-dialog{
  .el-dialog__body{
    height:  calc(60vh - 120px) !important;
  }
}
</style>
