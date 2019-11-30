<template>
  <div>
    <el-dialog
      title="条件脚本选择框"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="condition-script"
      width="80%"
      append-to-body
      @open="getFormData"
      @close="closeDialog"
    >
      <div class="condition-content">
        <el-input v-model="input2" disabled placeholder="请选择条件脚本">
          <el-button slot="append" type="primary" @click="conditionScript=true">条件脚本</el-button>
        </el-input>
        <div class="form-content">
          <el-row class="head">
            <el-col :span="6">参数名称</el-col>
            <el-col :span="6">参数类型</el-col>
            <el-col :span="6">参数说明</el-col>
            <el-col :span="6">参数值</el-col>
          </el-row>
        </div>
      </div>
      <div class="condition-bottom">
        <el-row>
          <el-col :span="3">
            <div class="return-value">
              返回值:
            </div>
          </el-col>
          <el-col :span="8">
            <el-input v-model="node" disabled placeholder="请选择节点" />
          </el-col>
        </el-row>

      </div>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="toolbars"
          @action-event="handleActionEvent"
        />
      </div>
    </el-dialog>
    <condition-script
      :visible="conditionScript"
      :style="{width:'100%'}"
      class="form-content"
      @close="visible => conditionScript = visible"
    />
  </div>
</template>

<script>
import ActionUtils from '@/utils/action'
import conditionScript from '../../components/form-script/condition-script/dialog'
export default {
  components: {
    conditionScript
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Object
  },
  data() {
    return {
      node: '',
      input2: '',
      conditionScript: false, // 条件脚本
      dialogVisible: this.visible,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {

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

  },
  methods: {
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
      this.$emit('callback', this.form)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 获取表单数据
     */
    getFormData() {

    }
  }

}
</script>
<style lang='scss' >
.condition-script{
  .condition-content{
    .form-content{
      margin-top: 10px;
      .head{
        height: 40px;
        line-height: 40px;
        .el-col{
        text-align: center;
        }
      }
    }
    .el-button{
          color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    }
  }
      .condition-bottom{
        .el-col{
          height: 30px;
            .return-value{
           text-align: center;
           width: 100%;
           line-height: 30px;

         }
        }

    }
}
</style>
