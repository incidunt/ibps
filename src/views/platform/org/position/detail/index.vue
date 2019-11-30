<template>
  <div class="main-container">
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="岗位明细" name="detail">
        <detail :id="id" :readonly="readonly" />
      </el-tab-pane>
      <el-tab-pane label="归属组织" name="positionOrg">
        <position-org :id="id" :height="height" :visible="activeName==='positionOrg'" />
      </el-tab-pane>
      <el-tab-pane label="岗位人员" name="positionEmployee">
        <position-employee :id="id" module-type="position" :height="height" :visible="activeName==='positionEmployee'" />
      </el-tab-pane>
      <el-tab-pane label="扩展属性" name="extraAttr">
        <ext-attr :id="id" ref="attrForm" :height="height" :visible="activeName==='extraAttr'" party-type="position" />
      </el-tab-pane>
      <el-tab-pane label="已分配角色" name="positionRole">
        <position-role :id="id" :height="height" :visible="activeName==='positionRole'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// 组件
import detail from '../edit'
import positionOrg from './position-org'
import positionEmployee from './position-employee'
import positionRole from './position-role'
import extAttr from '../../components/attr/ext-attr'
export default {
  components: {
    'detail': detail,
    'position-org': positionOrg,
    'position-employee': positionEmployee,
    'position-role': positionRole,
    'ext-attr': extAttr
  },
  props: {
    id: {
      type: [String, Number]
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'detail',
      height: 500
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
    }
  }
}
</script>
