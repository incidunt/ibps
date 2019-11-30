<template>
  <div class="main-container">
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="组织明细" name="detail">
        <detail :id="id" readonly />
      </el-tab-pane>
      <el-tab-pane label="组织负责人" name="orgCharge">
        <org-charge :id="id" :rights-arr="rightsArr" :height="height" :visible="activeName==='orgCharge'" />
      </el-tab-pane>
      <el-tab-pane label="行政岗位" name="position">
        <org-position :id="id" :rights-arr="rightsArr" :height="height" :visible="activeName==='position'" />
      </el-tab-pane>
      <el-tab-pane label="组织人员" name="employee">
        <org-employee :id="groundId" :rights-arr="rightsArr" :is-tree-all="isTreeAll" :height="height" :visible="activeName==='employee'" />
      </el-tab-pane>
      <el-tab-pane label="扩展属性" name="extAttr">
        <ext-attr :id="id" ref="attrForm" :height="height" :visible="activeName==='extAttr'" party-type="org" />
      </el-tab-pane>
      <el-tab-pane label="已分配角色" name="role">
        <org-role :id="id" :is-auth="isAuth" :rights-arr="rightsArr" :height="height" :visible="activeName==='role'" />
      </el-tab-pane>
      <el-tab-pane label="组织分级管理" name="orgAuth">
        <org-auth :org-id="id" :org-name="orgName" :is-edit="isEdit" :rights-arr="rightsArr" :height="height" :visible="activeName==='orgAuth'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 组件
import Detail from '../edit'
import OrgCharge from './org-charge'
import OrgPosition from './org-position/index'
import OrgEmployee from './org-employee'
import OrgRole from './org-role'
import OrgAuth from '../../auth/list'
import ExtAttr from '../../components/attr/ext-attr'
export default {
  components: {
    Detail,
    OrgCharge,
    OrgPosition,
    OrgEmployee,
    OrgRole,
    OrgAuth,
    ExtAttr
  },
  props: {
    id: {
      type: [String, Number]
    },
    orgName: String,
    isAuth: {
      type: Boolean,
      default: false
    },
    rightsArr: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isTreeAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: 'detail',
      height: 500,
      groundId: ''
    }
  },
  watch: {
    id() {
      this.activeName = 'detail'
    }
  },
  mounted() {
    this.height = this.$parent.$el.offsetHeight - 75
  },
  methods: {
    handleTabClick(tab) {
      this.groundId = this.id
    }
  }
}
</script>
