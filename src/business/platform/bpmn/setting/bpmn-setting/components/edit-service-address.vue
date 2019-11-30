<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="edit-service-dialog"
      :width="'70%'"
      top="5vh"
      append-to-body
      @open="getFormData"
      @close="closeDialog"
    >
      <el-form :label-width="formLabelWidth" :model="form" :rules="rules">
        <el-form-item label="接口类型：">
          <el-select v-model="form.serviceType" placeholder="请选择接口类型">
            <el-option label="restful" value="restful" />
            <el-option label="webService" value="webservice" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务地址：" prop="url">
          <el-row>
            <el-col :span="12"> <el-input v-model="form.url" placeholder="请输入服务地址" /></el-col>
            <el-col :span="12">
              <el-button style="marginLeft:20px" icon="el-icon-plus" type="primary" @click="dialogService=true">选择</el-button>
              <el-button icon="el-icon-search" type="primary">解析</el-button>
              <el-button icon="el-icon-bell" type="primary">测试</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="请求方式：">
          <el-row type="flex" justify="space-between">
            <el-col :span="10">
              <el-select v-model="form.method" placeholder="请选择请求方式">
                <el-option label="POST" value="POST" />
                <el-option label="GET" value="GET" />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-tooltip class="item" effect="light" content="服务节点执行继续时是否继续执行流程！" placement="bottom">
                <span :style="{'textAlign':'center'}">
                  忽略异常:<i class="header-icon el-icon-info" /></span>
              </el-tooltip>
            </el-col>
            <el-col :span="9">
              <div class="">
                <el-select v-model="form.ignoreException" placeholder="请选择活动区域">
                  <el-option label="否" value="N" />
                  <el-option label="是" value="Y" />
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="8"><div class="in-var">
          <span :style="{'fontWeight':'bold'}">输入参数</span>
          <el-button icon="el-icon-plus" type="primary" @click="List.push('1')">添加</el-button>
          <el-button icon="el-icon-search" type="primary">重置</el-button>
        </div>
        </el-col>
      </el-row>
      <template v-for="(item,index) of List">
        <div :key="index" class="add-datas">
          <el-form :label-width="'100px'" :model="formList" :rules="rules">
            <el-row>
              <el-col :span="9" class="data-content">
                <el-row>
                  <div class="type">
                    <el-form-item label="数据类型：">
                      <el-select v-model="formList.dataType" placeholder="请选择活动区域">
                        <el-option label="字符串" value="string" />
                        <el-option label="整型" value="int" />
                        <el-option label="浮点型" value="double" />
                        <el-option label="布尔" value="boolean" />
                        <el-option label="日期时间" value="date" />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-row>
                <el-row>
                  <div class="type">
                    <el-form-item label="参数名：" prop="name">
                      <el-input v-model="formList.name" class="just-input" placeholder="请输入参数名"> />
                      </el-input>
                    </el-form-item>
                  </div>
                </el-row>
                <el-row>
                  <div class="type">
                    <el-form-item label="是否必填：">
                      <el-select v-model="formList.required" placeholder="请选择活动区域">
                        <el-option label="是" value="Y" />
                        <el-option label="否" value="N" />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-row>
              </el-col>
              <el-col :span="9" class="data-content">
                <el-row>
                  <div class="type">
                    <el-form-item label="参数类型：" prop="type">
                      <el-select v-model="formList.type" placeholder="请选择活动区域">
                        <el-option label="固定值" value="fixed" />
                        <el-option label="表单变量" value="var" />
                        <el-option label="Groovy脚本" value="script" />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-row>
                <el-row>
                  <div class="type">
                    <el-form-item label="值或表达式：" prop="value">
                      <el-input v-model="formList.value" class="just-input" placeholder="请输入参数值或表达式"> />
                      </el-input>
                    </el-form-item>
                  </div>
                </el-row>
                <el-row>
                  <div class="type">
                    <el-form-item label="测试值：" prop="testValue">
                      <el-input v-model="formList.testValue" class="just-input" placeholder="请输入参数测试值"> />
                      </el-input>
                    </el-form-item>
                  </div>
                </el-row>
              </el-col>
              <el-col :span="6">
                <div class="bottons">
                  <el-button icon="el-icon-refresh-left" type="success">还原</el-button>
                  <el-button icon="el-icon-delete" type="danger" @click="deleteRow(index)">删除</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <div class="service-content">
        <div class="servce-example">
          <el-row class="title">服务地址示例</el-row>
          <el-row class="content">
            <el-col :span="4" class="left">restful格式 </el-col>
            <el-col :span="20">IP：http://192.168.3.206:5100/ibps/oauth2/v3/user/login，域名：http://cloud.bpmhome.cn:15100/ibps/oauth2/v3/user/login</el-col>
          </el-row>
          <el-row class="content">
            <el-col :span="4" class="left">webService格式</el-col>
            <el-col :span="20">	http://ws.bpmhome.cn/bpmService/myTasks.asmx?WSDL</el-col>

          </el-row>
        </div>
        <div class="return-example">
          <el-row class="title">服务返回示例</el-row>
          <el-row class="content">
            <el-col :span="4" class="left">
              <el-tooltip class="item" effect="light" content="服务被调用后会将返回数据存入流程变量，可以通过节点后置事件自行处理后续操作！" placement="bottom">
                <span :style="{'textAlign':'center'}">
                  Json字符串:<i class="header-icon el-icon-info" /></span>
              </el-tooltip> </el-col>
            <el-col :span="20">
              <br>
              {<br>
              "cause": "string", // 异常原因<br>
              "data": {}, // 数据主体，Map形式（如：查询用户，则用Map格式返回用户数据）<br>
              "message": "string", // 成功提示<br>
              "request": "string", // 本次请求的地址<br>
              "state": 0, // 响应状态，200成功，其它都是失败<br>
              "variables": {} // 动态变量，Map形式（如：保存用户，则用Map格式返回用户ID或其他数据）<br>
              }
            </el-col>
          </el-row>
        </div>
      </div>
      <service-select
        :visible="dialogService"
        :multiple="false"
        @close="visible => dialogService = false"
      />
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="toolbars"
          @action-event="handleActionEvent"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ServiceSelect from './service-select/dialog'
import { validateKey } from '@/utils/validate'
export default {
  components: {
    ServiceSelect
  },
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      List: [],
      rules: {
        url: [{ required: true, message: this.$t('validate.required') }, { validator: validateKey, trigger: 'blur' }],
        name: [{ required: true, message: this.$t('validate.required') }, { trigger: 'blur' }],
        value: [{ required: true, message: this.$t('validate.required') }, { trigger: 'blur' }],
        testValue: [{ required: true, message: this.$t('validate.required') }, { trigger: 'blur' }]
      },
      dialogService: false,
      formLabelWidth: '100px',
      dialogVisible: this.visible,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      form: {
        serviceType: 'restful',
        url: '',
        method: 'POST'

      },
      formList: {
        ignoreException: 'N',
        dataType: 'string',
        name: '',
        required: 'N',
        type: 'fixed',
        value: '',
        testValue: ''
      }
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
        case 'confirm':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    /** 删除 */
    deleteRow(index) {
      this.List.splice(index, 1)
    },
    // 提交保存数据
    saveData() {
      this.$emit('callback', this)
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
.edit-service-dialog{
  .in-var{
    margin-bottom: 20px;
  }
  .el-select{
    width: 100%;
  }
  .el-icon-info{
    color: #dd5a43 !important;
  }
  .el-dialog__body{
    height: 70vh;
  }
  .add-datas{
    margin-bottom: 20px;
          .bottons{
           display: flex;
          justify-content: center;
          margin-top: 60px;
         }
        .el-row{
           border: 1px solid #DCDFE6;
           min-height: 50px;
           line-height: 50px;
       .el-col{
         box-sizing: border-box;
       }
       .data-content{
         .el-row{
           border-left:none;
           border-top: none;
           &:last-child{
             border-bottom:none;
           }
         }

         .type{
           display: flex;
           justify-content: space-around;
           line-height: 50px;
           height: 50px;
           .el-select{
            width: 100%;
           }
           .el-form-item__label{
             width: 35%!important;
           }
           .el-form-item{
               display: flex;
           justify-content: space-around;
           align-items: center;
           margin-bottom: 0;
           line-height: 50px;
           .el-form-item__content{
             margin-left:0!important;
           }
           }
           .just-input{
             width: 100%;
           }
         }
       }
    }
  }
  .service-content{
        .left{
      // line-height: 100px;
      text-align: center;
      }
    background-color: #F0F8FF;
        .el-row{
      border: 1px solid #DCDFE6;
      border-bottom:none;
       min-height: 36px;
       .el-col{
         border-right:1px solid #DCDFE6;
         padding-left:20px;
         box-sizing: border-box;
         &:last-child{
           border-right:none;
         }
       }
    }
    .title{
      text-align: center;
      line-height:36px;
      font-weight: bold;
    }
  }

  .servce-example{
    .content{
      height: 50px;
      line-height: 50px;
    }
  }
   .return-example{
    .content{
      height: 150px;
          .left{
      line-height: 150px;
      }
      .el-col{
        height: 100%;
        border-bottom:1px solid #DCDFE6;
      }
    }
  }
.el-dialog__header{
  height: 30px;
  line-height: 30px;
  padding: 10px;
}
.el-dialog__body{
  padding: 10px 30px!important;
}
.el-dialog__footer{
  border: none
}
}
</style>
