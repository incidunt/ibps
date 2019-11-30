<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="20vh"
    class="trigger-edit-dialog"
    @close="closeDialog"
    @open="formValidate()"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="计划名称:" prop="trigName">
        <el-input v-model="formData.trigName " />
      </el-form-item>
      <el-form-item label="执行计划的方式:" prop="type">
        <el-select v-model="formData.type" placeholder="请选择" style="width:100%;" @change="change">
          <el-option
            v-for="option in planTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行规则:">
        <!-- 一次 -->
        <el-form-item v-if="show==='once'" label="执行时间:" prop="timeInterval">
          <div>
            <el-date-picker
              v-model="formData.timeInterval "
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
            />
          </div>
        </el-form-item>
        <!--每天每隔-->
        <el-form-item v-if="show==='minute'" prop="timeInterval">
          <div>
            <el-select v-model="formData.timeInterval " placeholder="请选择" style="width:100%;">
              <el-option
                v-for="option in timeOption"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <!--每天-->
        <el-form-item v-if="show==='day'" prop="timeInterval">
          <div>
            <el-time-picker
              v-model="formData.timeInterval"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              value-format="HH:mm:ss"
            />
          </div>
        </el-form-item>
        <!--每周-->
        <el-form-item v-if="show==='week'">
          <el-form-item prop="timeInterval">
            <el-checkbox-group v-model="formData.timeInterval">
              <el-checkbox-group
                v-model="formData.timeInterval"
              >
                <el-checkbox v-for="week in weekOptions" :key="week.value" :label="week.value">{{ week.label }}</el-checkbox>
              </el-checkbox-group>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="selectTime">
            <el-time-select
              v-model="formData.selectTime"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:59'
              }"
              value-format="HH:mm"
              arrow-control
              is-range
              placeholder="选择时间"
            />
          </el-form-item>
        </el-form-item>
        <!--每月-->
        <el-form-item v-if="show==='month'">
          <el-form-item prop="timeInterval">
            <el-checkbox-group
              v-model="formData.timeInterval"
            >
              <el-checkbox v-for="day in 31" :key="day" :label="day">{{ day }}</el-checkbox>
              <el-checkbox label="L">最后一天</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="selectTime">
            <el-time-select
              v-model="formData.selectTime"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:59'
              }"
              value-format="HH:mm"
              arrow-control
              is-range
              placeholder="选择时间"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="show==='cron'">
          <el-input v-model="formData.timeInterval" />
        </el-form-item>
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
import { save } from '@/api/platform/job/trigger'
import { planTypeOptions, timeOption, weekOptions } from './../constants'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'
import { setTimeout } from 'timers'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jobName: {
      type: String
    },
    group: {
      type: String
    }
  },
  data() {
    return {
      title: '添加计划',
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      planTypeOptions: planTypeOptions,
      timeOption: timeOption,
      weekOptions: weekOptions,
      formData: {
        trigName: '',
        type: 'once',
        timeInterval: '',
        selectTime: ''
      },
      rules: {
        trigName: [{ required: true, validator: validateKey }],
        timeInterval: [{ required: true, message: this.$t('validate.required') }],
        selectTime: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    show() {
      return this.formData.type
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
    change(data) {
      this.$refs[this.formName].clearValidate()
      if (data === 'week' || data === 'month') {
        this.formData.timeInterval = []
      } else {
        this.formData.timeInterval = ''
      }
      this.formData.selectTime = ''
      setTimeout(() => {
        this.formValidate()
      })
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
      const dataMap = {}
      const type = this.formData.type
      const timeInterval = this.formData.timeInterval
      switch (type) {
        case 'once':
          dataMap.type = 1
          dataMap.timeInterval = timeInterval
          break
        case 'minute':
          dataMap.type = 2
          dataMap.timeInterval = timeInterval
          break
        case 'day':
          dataMap.type = 3
          dataMap.timeInterval = timeInterval
          break
        case 'week':
          dataMap.type = 4
          dataMap.timeInterval = timeInterval.join(',') + '|' + this.formData.selectTime
          break
        case 'month':
          dataMap.type = 5
          dataMap.timeInterval = timeInterval.join(',') + '|' + this.formData.selectTime
          break
        case 'cron':
          dataMap.type = 6
          dataMap.timeInterval = timeInterval
          break
        default:
          break
      }

      save({
        jobName: this.jobName,
        group: this.group,
        triggerName: this.formData.trigName
      },
      dataMap).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          } else {
            this.$refs[this.formName].resetFields()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.formData = {
        trigName: '',
        type: 'once',
        timeInterval: '',
        selectTime: ''
      }
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
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
.trigger-edit-dialog{
  .el-dialog__body{
    height:  calc(30vh - 120px) !important;
  }
}
</style>
