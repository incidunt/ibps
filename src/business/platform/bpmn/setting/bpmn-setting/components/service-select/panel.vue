<template>
  <ibps-layout ref="layout" class="service-select-panel">
    <div slot="west" :style="{width:width+'px'}">
      <div ref="searchForm" class="ibps-tree-search-form">
        <!-- 重置 -->
      </div>
      <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
        <ibps-toolbar
          :actions="toolbars"
          type="icon"
          @action-event="handleTreeAction"
        />
      </div>
      <div :style="{ height:(tableHeight-100)+'px'}">
        <el-scrollbar
          ref="elTree"
          v-loading="loadingTree"
          style="height: 100%;"
          wrap-class="ibps-tree-wrapper"
        >
          <el-tree
            :show-checkbox="multiple"
            :data="treeData"
            :expand-on-click-node="false"
            :props="{ children: 'children', label: 'name'}"
            node-key="id"
            pid-key="parentId"
            default-expand-all
            highlight-current
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <el-radio v-model="radio" :label="data[pkKey]" :disabled="data.disabled" @change="changeRadio(data)">{{ node.label }}</el-radio>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <div class="con-right">
      <el-form :label-width="'100px'" :model="formList" :rules="rules">
        <el-row>
          <el-col :span="12" class="data-content">
            <div class="type">
              <el-form-item label="名称：">
                <el-input v-model="formList.name" class="just-input" placeholder="请输入参数名"> />
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" class="data-content">
            <div class="type">
              <el-form-item label="标识：" prop="key">
                <el-input v-model="formList.key" class="just-input" placeholder="请输入参数名"> />
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <div class="type">
            <el-form-item label="服务地址：" prop="address">
              <el-input v-model="formList.address" class="just-input" placeholder="请输入参数名"> />
              </el-input>
            </el-form-item>
          </div>
        </el-row>
        <el-row>
          <el-col :span="12" class="data-content">
            <div class="type">
              <el-form-item label="是否目录：">
                <el-select v-model="formList.isDir" placeholder="请选择活动区域">
                  <el-option label="是" value="Y" />
                  <el-option label="否" value="N" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" class="data-content">
            <div class="type">
              <el-form-item label="忽略异常：">
                <el-select v-model="formList.ignoreException" placeholder="请选择活动区域">
                  <el-option label="是" value="Y" />
                  <el-option label="否" value="N" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="data-content">
            <div class="type">
              <el-form-item label="请求方式：">
                <el-select v-model="formList.method" placeholder="请选择活动区域">
                  <el-option label="POST" value="POST" />
                  <el-option label="GET" value="GET" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" class="data-content">
            <div class="type">
              <el-form-item label="接口类型">
                <el-select v-model="formList.serviceType" placeholder="请选择活动区域">
                  <el-option label="restful" value="restful" />
                  <el-option label="webService" value="webService" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <div class="type">
            <el-form-item label="描述：">
              <el-input v-model="formList.desc" type="textarea" />
            </el-form-item>
          </div>
        </el-row>
        <el-row>
          <div class="type">
            <el-form-item label="返回值格式：">
              <el-input v-model="formList.resultModel" type="textarea" />
            </el-form-item>
          </div>
        </el-row>
      </el-form>
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
    </div>
  </ibps-layout>
</template>
<script>
import { findTreeData as getOrgTreeData } from '@/api/platform/org/org'
import TreeUtils from '@/utils/tree'
export default {
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      radio: '',
      formList: {
        name: '',
        key: '',
        address: '',
        isDir: 'N',
        ignoreException: 'N',
        method: 'POST',
        serviceType: '',
        desc: '',
        resultModel: ''
      },
      rules: {
        url: [{ required: true, message: this.$t('validate.required') }, { trigger: 'blur' }],
        name: [{ required: true, message: this.$t('validate.required') }, { trigger: 'blur' }],
        value: [{ required: true, message: this.$t('validate.required') }, { trigger: 'blur' }],
        testValue: [{ required: true, message: this.$t('validate.required') }, { trigger: 'blur' }]
      },
      expandAll: false,
      width: 200,
      editId: '',
      title: '更多查询条件',
      partyTypeOptions: '',
      partyType: 'org',
      inclueChild: true,

      // 树配置
      loadingTree: false,
      treeData: [],
      toolbars: [{
        key: 'refresh'
      }, {
        key: 'expand'
      }, {
        key: 'compress'
      }],
      // 列表配置
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      pagination: {},
      sorts: {},
      moreSearchParams: {},
      selectOrg: {
        orgsid: []
      }

    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h)
    }
  },
  watch: {
  },
  created() {
    this.loadOrgTreeData()
    this.loadListData()
  },
  methods: {
    // ==========================左侧的====================================
    // 加载机构树
    loadOrgTreeData() {
      getOrgTreeData().then(response => {
        this.loadingTree = false
        const data = response.data
        this.treeData = TreeUtils.transformToArrayFormat(data)
      }).catch(() => {
        this.loadingTree = false
      })
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar' && command === 'refresh') {
        this.loadOrgTreeData()
      }
      if (command === 'expand') {
        this.expandAll = true
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        console.log('收缩啊')

        this.expandCompressTree(false)
      }
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    // 点击节点
    changeRadio(data) {
      if (data.id === 0 || data.id === '0') return
      this.radio = data[this.pkKey]
      this.$emit('selected', data)
      this.loadListData()
    },
    // ========================右侧======================================

    /**
     * 加载数据
     */
    loadListData() {

    }
  }
}
</script>
<style lang="scss" scoped>
$border-color: #e5e6e7;
.service-select-panel{
    height: 100% !important;

}
.ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 30px;
    padding: 5px;
  }
  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
  }
  .con-right{
    padding:0 10px;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    .service-content{
        .left{
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
      height: 180px;
          .left{
      line-height: 180px;
      }
      .el-col{
        height: 100%;
        border-bottom:1px solid #DCDFE6;
      }
    }
  }
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree > .el-tree-node {
      display: inline-block;
    }
  }
</style>

