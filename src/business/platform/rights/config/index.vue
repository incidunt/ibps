<template>
  <el-dialog
    v-if="dialogVisible"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    append-to-body
    custom-class="rights-config-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div class="rights-config">
      <el-row class="rights-config-header">
        <el-col :span="6">权限分类</el-col>
        <el-col :span="12">授权给</el-col>
        <el-col :span="6" style="border-right:1px solid #dcdfe6;">操作</el-col>
      </el-row>
      <el-row
        v-for="rightsType in rightsTypeList"
        :key="rightsType.type"
        class="rightsType"
      >
        <template v-if="rightsType.type==='none'" />
        <el-col v-else-if="rightsType.type==='all'" :span="24" class="selectAll">
          <el-checkbox v-model="selectAll" @change="checkedAll">允许所有人访问</el-checkbox>
        </el-col>
        <table v-else class="customers">
          <tr>
            <td width="25%">{{ rightsType.label }}授权</td>
            <td class="tag-list" width="50%">
              <span v-if="$utils.isEmpty(rightsType.data)">&nbsp;</span>
              <el-tag
                v-for="(item,index) in rightsType.data"
                v-else
                :key="index"
              >{{ item.name }}
              </el-tag>
            </td>
            <td width="25%">
              <el-button
                v-if="!selectAll"
                type="primary"
                icon="ibps-icon-search-plus"
                @click="handleSelect(rightsType.type)"
              >选择</el-button>
              <el-button
                v-if="!selectAll"
                type="info"
                icon="ibps-icon-undo"
                @click="handleReset(rightsType.type)"
              >重置</el-button>
            </td>
          </tr>
        </table>
      </el-row>
    </div>
    <ibps-org-selector-dialog
      :visible="selectorVisible"
      :type="selectorType==='orgSub'?'org':selectorType"
      :value="selectorValue"
      multiple
      @close="visible=>selectorVisible=visible"
      @action-event="handleSelectorActionEvent"
    />

    <div slot="footer" class="el-dialog--center">
      <el-button v-if="isSave" type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      <el-button v-else type="primary" icon="ibps-icon-ok" @click="handleConfirm()">确定</el-button>
      <el-button icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { findRightsTypeByKey, findByTypeId, save } from '@/api/platform/rights/def'
import { ownRightsOptions } from './constants'
import ActionUtils from '@/utils/action'

import IbpsOrgSelectorDialog from '@/business/platform/org/selector/dialog'
export default {
  components: {
    IbpsOrgSelectorDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: { // 标题
      type: String,
      default: '权限配置'
    },
    rightsKey: {
      type: String,
      required: false
    },

    rightsTypes: {// 权限类型
      type: Array,
      default: () => {
        return Object.keys(ownRightsOptions)
      }
    },
    isSave: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number]
    },
    data: {// 权限数据
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      selectorVisible: false,
      selectAll: false,
      rightsTypeList: [],
      selectorType: '',
      selectorValue: ''
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.rightsTypeList = []
        this.selectAll = false
        if (this.visible) {
          this.getFormData()
        }
      },
      immediate: true
    }
  },
  methods: {
    getFormData() {
      this.getRightsTypes()
    },
    getRightsTypes() {
      if (this.$utils.isEmpty(this.rightsKey)) {
        this.convertRightsTypeList(this.rightsTypes, this.convertDataMap(this.data))
        return
      }
      findRightsTypeByKey({
        entityType: this.rightsKey
      }).then(response => {
        const list = response.data
        if (this.$utils.isEmpty(list)) {
          return
        }
        const rightsTypeList = []
        list.forEach(item => {
          rightsTypeList.push(item.key)
        })
        if (this.$utils.isNotEmpty(this.id)) {
          this.loadRightsDefData(rightsTypeList, this.id)
        } else {
          this.convertRightsTypeList(rightsTypeList, this.convertDataMap(this.data))
        }
      })
    },
    /**
     * 从后台加载权限数据
     */
    loadRightsDefData(list, id) {
      findByTypeId({
        entityType: this.rightsKey,
        entityId: id
      }).then(response => {
        const rightsDefList = response.data
        let dataMap = {}
        if (this.$utils.isNotEmpty(rightsDefList)) {
          dataMap = this.convertDataMap(this.$utils.parseData(rightsDefList))
        }
        this.convertRightsTypeList(list, dataMap)
      })
    },
    convertDataMap(data) {
      const dataMap = {}
      if (this.$utils.isEmpty(data)) return {}
      data.forEach(def => {
        const type = def.type
        if (type === 'all') {
          this.selectAll = true
          return false
        } else if (type === 'none') {
          this.selectAll = false
          return false
        } else {
          const ids = def.rightsId.split(',')
          const names = def.rightsName.split(',')
          const data = []
          ids.forEach((id, i) => {
            if (this.$utils.isNotEmpty(id)) {
              data.push({
                id: id,
                name: names[i]
              })
            }
          })
          dataMap[type] = data
        }
      })
      return dataMap
    },
    convertRightsTypeList(list, dataMap = {}) {
      this.rightsTypeList = list.map((d) => {
        const rights = ownRightsOptions[d]
        if (rights) {
          rights.data = dataMap[rights.type] || []
          return rights
        }
      })
    },
    /**
     * 选择所有
     */
    checkedAll(data) {
      if (data) {
        this.rightsTypeList = this.rightsTypeList.map(rights => {
          rights.data = []
          return rights
        })
      }
    },
    handleSelect(type) {
      this.selectorType = type
      this.selectorValue = []
      this.selectorVisible = true
    },
    handleReset(type) {
      this.rightsTypeList = this.rightsTypeList.map(rights => {
        if (rights.type === type) {
          rights.data = []
        }
        return rights
      })
      this.selectorType = ''
    },
    handleSelectorActionEvent(key, data) {
      switch (key) {
        case 'confirm':
          this.handleSelectorConfirm(data)
          break
        default:
          break
      }
    },
    handleSelectorConfirm(data) {
      this.selectorVisible = false
      const d = data.map((d) => {
        return {
          id: d.id,
          name: d.name
        }
      })
      const list = []
      this.rightsTypeList.forEach(rights => {
        if (rights.type === this.selectorType) {
          rights.data = d
        }
        list.push(rights)
      })
      this.rightsTypeList = list
      this.selectorType = ''
    },
    getRights() {
      if (this.selectAll) {
        return [{
          type: 'all',
          rightsId: '',
          rightsName: ''
        }]
      }
      const rights = []
      this.rightsTypeList.forEach(r => {
        if (r.type === 'all') return true
        if (r.type === 'none') return true
        const ids = r.data.map((d) => d.id)
        const names = r.data.map((d) => d.name)
        if (this.$utils.isNotEmpty(ids)) {
          rights.push({
            type: r.type,
            rightsId: ids.join(','),
            rightsName: names.join(',')
          })
        }
      })
      return rights
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleConfirm() {
      const rights = this.getRights()
      this.$emit('callback', rights)
      this.closeDialog()
    },
    handleSave() {
      save({
        entityType: this.rightsKey,
        entityId: this.id,
        rights: JSON.stringify(this.getRights())
      }).then(response => {
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.rights-config-dialog {
  .el-dialog__body{
    height:  calc(80vh - 110px) !important;
    padding: 0 0 20px 0;
    .rights-config{
      .rights-config-header{
        .el-col{
          border: 1px solid #dcdfe6{
            top: 0px;
            right: 0px;
          }
          padding:10px;
          background-color: #f5f5f6;
        }
      }
      .rightsType{
        margin-top: -1px;
        .customers{
          width:100%;
          border-collapse:collapse;
        }
        .customers td, .customers th
        {
          height: 32px;
          font-size:1em;
          border:1px solid #dcdfe6;
          padding:3px 7px 2px 7px;
        }
      }
    }
    .selectAll{
      padding: 7px 10px;
      background-color: #f5f5f6;
    }
  }
}
</style>

<style lang="scss" scoped>
 .tag-list .el-tag+.el-tag{
    margin-left: 5px;
    margin-top: 5px;
  }
</style>

