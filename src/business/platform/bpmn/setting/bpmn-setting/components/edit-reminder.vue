<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="edit-reminder-dialog"
    top="5vh"
    width="80%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :rules="rules"
      :element-loading-text="$t('common.loading')"
      :model="form"
      label-width="120px"
      @click.native.stop="closeVarTree"
    >
      <el-tabs v-model="activeIndex" type="card">
        <!-- 到期条件设置 -->
        <el-tab-pane label="到期条件设置" name="1">
          <div>
            <el-row>
              <el-col :span="11">
                <el-form-item label="名称:" prop="name">
                  <el-input v-model="form.name" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="当前节点:" prop="nodeId">
                  <el-input v-model="form.nodeId" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="相对节点:" prop="relNodeId">
                  <el-select v-model="form.relNodeId" placeholder="请选择">
                    <template v-for="item in nodeList">
                      <el-option
                        v-if="item.value !== curNode.id"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="相对处理事件:" prop="relNodeEvent">
                  <el-select v-model="form.relNodeEvent" placeholder="请选择">
                    <el-option
                      v-for="item in relNodeEventOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-col :span="11">
              <el-form-item label="相对时间类型:" prop="relTimeType">
                <el-select v-model="form.relTimeType" placeholder="请选择">
                  <el-option
                    v-for="item in relTimeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="相对到期时间:" prop="dueTime">
                <el-col :span="8">
                  <el-input v-model="dueTimeDays"><template slot="append">天</template></el-input>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="dueTimeHours" placeholder="请选择">
                    <el-option
                      v-for="item in hoursOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="dueTimeMunites" placeholder="请选择">
                    <el-option
                      v-for="item in minutesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="条件表达式:" prop="cronExpression">
                <el-button type="primary" size="small" @click.native="handleCommonScript">常用脚本</el-button>
                <el-button type="primary" size="small" @click.native="handleConditionScript">条件脚本</el-button>
                <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="(data)=> handleFormVar('cronExpression',data)" />
                <codemirror v-model="form.cronExpression" :options="cmOption" />
                <span>(条件表达要求是返回boolean值的脚本，返回true，表示满足条件；返回false，表示条件不满足。如果表达式为空，将返回true)</span>
              </el-form-item>
            </el-col>
          </div>

        </el-tab-pane>
        <!-- 到期动作设置 -->
        <el-tab-pane label="到期动作设置" name="2">
          <div>
            <el-col :span="11">
              <el-form-item label="执行动作:" prop="dueAction">
                <el-select v-model="form.dueAction" placeholder="请选择">
                  <el-option
                    v-for="item in actionsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item v-if="form.dueAction === 'call-method'" label="执行脚本:" prop="callScript">
                <el-button type="primary" size="small" @click.native="handleCommonScript">常用脚本</el-button>
                <el-button type="primary" size="small" @click.native="handleConditionScript">条件脚本</el-button>
                <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="(data)=> handleFormVar('callScript',data)" />

                <codemirror v-model="form.callScript" :options="cmOption" />
              </el-form-item>
            </el-col>
          </div>
        </el-tab-pane>
        <!-- 发送催办消息设置 -->
        <el-tab-pane label="发送催办消息设置" name="3">
          <div>
            <el-col :span="11">
              <el-form-item label="发送催办信息:" prop="needSendMsg">
                <el-checkbox v-model="form.needSendMsg">发送</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item v-if="form.needSendMsg" label="开始发送时间:" prop="startTime">
                <el-col :span="8">
                  <el-input v-model="startTimeDays"><template slot="append">天</template></el-input>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="startTimeHours" placeholder="请选择">
                    <el-option
                      v-for="item in hoursOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="startTimeMunites" placeholder="请选择">
                    <el-option
                      v-for="item in minutesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item v-if="form.needSendMsg" label="发送的间隔:" prop="interval">
                <el-col :span="8">
                  <el-input v-model="intervalDays"><template slot="append">天</template></el-input>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="intervalHours" placeholder="请选择">
                    <el-option
                      v-for="item in hoursOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="intervalMunites" placeholder="请选择">
                    <el-option
                      v-for="item in minutesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item v-if="form.needSendMsg" label="发送信息次数:" prop="sendTimes">
                <el-select v-model="form.sendTimes" placeholder="请选择">
                  <el-option
                    v-for="item in timesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </div>
        </el-tab-pane>
        <!-- 消息内容 -->
        <el-tab-pane label="消息内容" name="4">
          <el-col :span="22">
            <el-form-item label="发送类型:" prop="msgTypeHtml">
              <ibps-checkbox
                v-model="form.msgTypeHtml"
                :options="messageTypes"
                value-key="type"
                label-key="title"
              />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="富文本内容:" prop="html">
              <ibps-ueditor v-model="form.html" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="普通文本内容:" prop="plainText">
              <el-input v-model="form.plainText" type="textarea" rows="3" />
              <span>提示：可以用{title}来代表任务名称、用{time}来代表收到任务的时间。</span>
            </el-form-item>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <common-script
      multiple
      :visible="commonScriptVisible"
      style="width:'100%'"
      class="form-content"
      @close="visible => commonScriptVisible = visible"
    />
    <condition-script-select
      :visible="conditionScriptVisible"
      style="width:'100%'"
      class="form-content"
      @close="visible => conditionScriptVisible = visible"
    />
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import ActionUtils from '@/utils/action'
import IbpsUeditor from '@/components/ibps-ueditor'
import { getFormVars } from '../utils'
import BpmnFormVar from './form-var'
import commonScript from './form-script/common-script/dialog'
import conditionScriptSelect from './form-script/condition-script'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'
export default {
  components: {
    IbpsUeditor,
    BpmnFormVar,
    codemirror,
    commonScript,
    conditionScriptSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    data: Object,
    curNode: Object
  },
  data() {
    const validateMsgTypeHtml = (rule, value, callback) => {
      if (value === '') {
        if (this.form.html === '' && !this.form.plainText) {
          callback()
        } else {
          callback(new Error('请勾选发送类型'))
        }
      } else {
        callback()
      }
    }
    return {
      varTree: false,
      activeIndex: '1',
      formName: 'form',
      dialogVisible: this.visible,
      commonScriptVisible: false,
      conditionScriptVisible: false,
      dialogLoading: false,
      defaultForm: {},
      dueTimeDays: '',
      dueTimeMunites: 0,
      dueTimeHours: 0,
      startTimeDays: '',
      startTimeMunites: 0,
      startTimeHours: 0,
      intervalDays: '',
      intervalMunites: 1,
      intervalHours: 0,
      cmOption: {
        lineNumbers: true,
        autoCloseTags: true,
        line: true,
        mode: 'text/html',
        theme: 'eclipse'
      },
      form: {
        nodeId: '',
        name: '',
        relNodeId: '',
        relNodeEvent: 'create',
        relTimeType: 'caltime',
        cronExpression: '',
        dueTime: '',
        dueAction: 'no-action',
        startTime: '',
        interval: '',
        sendTimes: '',
        msgTypeHtml: '', // 发送类型
        html: '',
        plainText: '',
        needSendMsg: false
      },
      relTimeTypeOptions: [{
        value: 'caltime',
        label: '日历日'
      }, {
        value: 'worktime',
        label: '工作日'
      }],
      relNodeEventOptions: [{
        value: 'create',
        label: '创建'
      }, {
        value: 'complete',
        label: '完成'
      }],
      actionsOptions: [{
        value: 'no-action',
        label: '无动作'
      }, {
        value: 'auto-next',
        label: '执行同意操作'
      }, {
        value: 'end-process',
        label: '结束该流程'
      }, {
        value: 'call-method',
        label: '调用指定方法'
      }],
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        msgTypeHtml: [{ validator: validateMsgTypeHtml, trigger: 'blur' }]
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    ...mapState({
      messageTypes: state => state.ibps.bpmn.messageTypes,
      nodeList: state => state.ibps.bpmn.userNodeList,
      boDefData: state => state.ibps.bpmn.boDefData,
      variables: state => state.ibps.bpmn.variables
    }),
    formVars() {
      return getFormVars(this.boDefData, this.variables, this.nodeId)
    },
    hoursOptions() {
      let list = Array.from({ length: 24 }, (v, k) => k)
      list = list.map(i => {
        return {
          value: i,
          label: i + '小时'
        }
      })
      return list
    },
    minutesOptions() {
      let list = [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
      list = list.map(i => {
        return {
          value: i,
          label: i + '分钟'
        }
      })
      return list
    },
    timesOptions() {
      let list = Array.from({ length: 11 }, (v, k) => k)
      list = list.map(i => {
        return {
          value: i,
          label: i
        }
      })
      return list
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
    closeVarTree() {
      this.varTree = false
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
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
    handleSave() {
      this.form.dueTime = (this.dueTimeDays * 24 * 60) + (this.dueTimeHours * 60) + this.dueTimeMunites
      this.form.startTime = (this.startTimeDays * 24 * 60) + (this.startTimeHours * 60) + this.startTimeMunites
      this.form.interval = (this.intervalDays * 24 * 60) + (this.intervalHours * 60) + this.intervalMunites

      if (!this.form.needSendMsg) {
        this.form.sendTimes = '0'
        this.form.startTime = '0'
        this.form.interval = '0'
      }
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (this.$utils.isEmpty(this.id)) {
            this.$emit('callback', this.form)
          } else {
            this.$emit('callback', this.form)
          }
          this.closeDialog()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    getFormData() {
      this.activeIndex = '1'
      this.form = JSON.parse(JSON.stringify(this.data))
      this.formValidate()
    },
    timeStamp(StatusMinute) {
      const day = parseInt(StatusMinute / 60 / 24)
      const hour = parseInt(StatusMinute / 60 % 24)
      const min = parseInt(StatusMinute % 60)
      return {
        day, hour, min
      }
    },
    handleFormVar(key, node) {
      let data = ''
      if (node.attrType === 'field') {
        if (node.type === 'string') {
          data = node.tableName + '.getString("' + node.key + '")'
        } else if (node.type === 'number') {
          data = node.tableName + '.getInt("' + node.key + '")'
        } else if (node.type === 'date') {
          data = node.tableName + '.getDate("' + node.key + '")'
        } else {
          data = node.tableName + '.get("' + node.key + '")'
        }
      } else if (node.attrType === 'var') {
        data = node.key
      } else if (node.attrType === 'bpmConstants') {
        data = node.key
      } else {
        return
      }
      // TODO： 插入
      this.form[key] = (this.form[key] || '') + data
    },
    handleCommonScript() {
      this.commonScriptVisible = true
    },
    handleConditionScript() {
      this.conditionScriptVisible = true
    }
  }

}
</script>
<style lang='scss' >
.edit-reminder-dialog{
  // .el-dialog{
  //   width:80%
  // }
  .CodeMirror{
    border: 1px solid #ddd;
  }
  .el-dialog__header{
    height: 30px;
    line-height: 30px;
    padding: 10px;
  }
  .el-dialog__body{
    padding: 10px !important;
    height: 450px;
    // max-height: 480px;
    overflow-y: auto;
  }
  .el-button.el-button--primary.el-button--small{
    margin-bottom: 2px;
  }
  .el-select {
    display: block;
    position: relative;
  }
}
</style>
