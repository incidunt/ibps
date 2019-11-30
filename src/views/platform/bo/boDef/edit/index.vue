<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="bo-def-dialog"
    append-to-body
    fullscreen
    top="0"
    @open="getFormData"
    @close="closeDialog"
  >
    <div slot="title" style="padding-left: 20px;" class="el-dialog--left">
      <span v-if="shade" class="shade" />
      <el-button icon="el-icon-circle-close" @click="closeDialog()">关闭</el-button>
      <el-button v-if="!readonly" type="primary" icon="ibps-icon-save" @click="handleSave('save')">保存</el-button>
      <el-button v-if="formId&&!readonly" icon="ibps-icon-release" type="primary" @click="handleSave('deploy')">发布新版本</el-button>
    </div>
    <ibps-layout ref="layout">
      <div slot="west">
        <ibps-tree
          ref="tree"
          v-loading="treeLoading"
          :element-loading-text="$t('common.loading')"
          :width="width"
          :height="height"
          :data="treeData"
          :options="treeOptions"
          :show-icon="true"
          :contextmenus="treeContextmenus"
          title="业务对象管理"
          @action-event="handleTreeAction"
          @node-click="handleNodeClick"
          @expand-collapse="handleExpandCollapse"
        />
      </div>
      <ibps-container style="margin-left: 10px;" class="page">
        <div
          v-if="show==='step'"
          class="bo-content-detail"
        >
          <step
            ref="step"
            :action="action"
            @step-action="handleStepAction"
            @complete="complete"
          />
        </div>
        <div
          v-else-if="show==='detail'"
        >
          <detail
            :id="formId"
            ref="detail"
            :form-data="curData"
            :parent-data="parentData"
            :action="action"
            :bo-type="state"
            :code="getcode"
            :readonly="readonly"
            :is-master="isMaster"
            :toolbars="toolbars"
            :height="height"
            :tree-data="treeData"
            @change="changeData"
            @check="checkCode"
          />
        </div>
        <div
          v-else
        >
          <el-alert
            :closable="false"
            title="请选择左边树进行左键或右键操作！"
            type="warning"
            show-icon
            style="height:50px;"
          />
        </div>
      </ibps-container>
    </ibps-layout>
  </el-dialog>
</template>

<script>
import { manage, save, getJson, getJsonByTbl, checkCode } from '@/api/platform/bo/boDef'
import _cloneDeep from 'lodash.clonedeep'
import { rootData, defaultAttrs, subBoDefsAttrs, masterAttrs } from '../constants'
import ActionUtils from '@/utils/action'
import detail from './detail/index'
import step from './detail/step'

const uuid = require('uuid')

export default {
  components: {
    step,
    detail
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
    typeId: String,
    id: String,
    code: String,
    title: String
  },
  data() {
    return {
      dialogVisible: false,
      isMaster: true,
      isAdd: false,
      sameCode: false,
      treeLoading: false,
      shade: false, // 阻止双击
      isSame: {
        boolean: false,
        code: ''
      },
      toolbars: '',
      tabName: '',
      getcode: '',
      height: 540,
      width: 250,
      treeData: [],
      childrenKey: 'subBoDefs',
      treeOptions: { 'rootPId': '0', showIcon: true, props: { children: 'subBoDefs', label: 'name' }},
      treeContextmenus: [
        {
          icon: 'add', label: '增加主业务对象', value: 'add', rights: function(menu, data, isRoot) {
            if (data.subBoDefs && data.subBoDefs.length > 0) return false
            if (data.id === '0') return true
            return false
          }
        },
        { icon: 'add', label: '添加下级业务对象', value: 'addSub', rights: (menu, data, isRoot) => {
          if (this.nodeStatus(data, 'rights')) return true
          if (isRoot) true
          if (data.id === '0') return false
          if (data.level) return false
          return false
        } },
        { icon: 'edit', label: '编辑当前业务对象', value: 'edit', rights: function(menu, data, isRoot) {
          if (isRoot) true
          if (data.id === '0') return false
          return true
        } },
        { icon: 'remove', label: '删除当前业务对象', value: 'remove', rights: function(menu, data, isRoot) {
          if (isRoot) true
          if (data.id === '0') return false
          return true
        } }
      ],
      show: 'step', // 控制按钮
      boType: '',
      state: '',
      tempTreeData: [],
      action: 'add',
      parentData: {},
      curId: uuid(),
      curData: {},

      level: 0,
      rootIndex: '',
      defaultBoDef: {
        name: '',
        code: '',
        boType: 'object',
        dsName: '',
        dsAlias: '',
        tblName: '',
        state: 'new',
        status: '',
        dataFormat: 'json',
        pk: 'id',
        id: uuid(),
        fk: null,
        fromAttr: null,
        relation: 'one2many',
        desc: '',
        options: {
          struType: 'list',
          idKey: 'id',
          pIdKey: 'id',
          key: 'id'
        },
        isMain: 'Y',
        isMaster: 'Y',
        attrs: defaultAttrs,
        edit: true
      }
    }
  },
  computed: {
    formId() {
      return this.id
    },
    sameCodes() {
      return this.sameCode
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    typeId: {
      handler: function(val) {
        this.defaultBoDef.typeId = val
      },
      immediate: true
    }
  },
  created() {
    this.treeData = JSON.parse(JSON.stringify(rootData))
    this.tempTreeData = JSON.parse(JSON.stringify(this.treeData))
    this.contextmenus = this.treeContextmenus
    this.height = document.body.offsetHeight - 55
  },
  methods: {
    // 树右键
    handleTreeAction(command, position, selection, data) {
      // if (this.sameCodes) {
      //   this.$message({
      //     message: '存在已有的业务对象标识,请重新填写！',
      //     type: 'warning'
      //   })
      //   return
      // }
      // const validate = this.$refs['detail'] ? this.$refs['detail'].validate() : true
      // if (!validate) {
      //   ActionUtils.saveErrorMessage()
      //   return
      // }
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.treeData = this.tempTreeData
        }
      } else {
        this.isAdd = false
        if (command === 'add') { // 增加主业务对象
          this.show = 'step'
          this.action = command
          this.$refs['step'] ? this.$refs['step'].resetFields() : null
        } else if (command === 'addSub') { // 添加下级业务对象
          this.sameCode = false
          this.isAdd = true
          this.show = 'step'
          this.action = command
          this.parentData = data // 父节点数据
          this.$refs['step'] ? this.$refs['step'].resetFields() : null
        } else if (command === 'edit') { // 编辑当前业务对象
          this.show = 'detail'
          this.action = command

          this.getCurData(data.id)
        } else if (command === 'remove') { // 删除当前业务对象
          this.action = 'remove'
          this.sameCode = false
          this.$confirm('确定是否删除该业务对象？', '信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.remove(data.id)
            this.removeNode(data)
          }).catch(() => {})
        }
      }
    },

    // 节点状态
    nodeStatus(value, use) {
      const arr = []
      let show = true
      let isMaster = false
      const childrenKey = this.childrenKey
      if (value.id === '0') return
      var filter = function(data) {
        data.find(item => {
          if (item[childrenKey] && item[childrenKey] !== []) {
            if (item.code === undefined) {
              item.code = '业务对象管理'
            }
            arr.push(item[childrenKey])
            filter(item[childrenKey])
          } else {
            return
          }
        })
      }
      filter(this.treeData)
      let target = ''
      if (this.$utils.isNotEmpty(value)) {
        arr.forEach((p, i) => {
          p.forEach((v, l) => {
            if (v.id === value.id) {
              target = i
            }
          })
        })
        show = target <= 1
        if (target === 0 || target === -1) {
          isMaster = true
        }
      }
      if (use === 'rights') {
        return show
      } else {
        return isMaster
      }
    },
    // 检测树是否存在重复节点。
    checkSameNode(value, params) {
      let isSame = false
      this.isSame = {
        boolean: false,
        code: value.code
      }
      const childrenKey = this.childrenKey
      const sanmeNode = (data, param) => {
        data.find(item => {
          if (param === 'boDef') {
            if (item.id === value) {
              isSame = true
            } else {
              if (item[childrenKey] && item[childrenKey] !== []) {
                sanmeNode(item[childrenKey], 'boDef')
              }
            }
          } else if (param === 'external') {
            if (item.code === value[0].tableName) {
              isSame = true
            } else {
              if (item[childrenKey] && item[childrenKey] !== []) {
                sanmeNode(item[childrenKey], 'external')
              }
            }
          } else {
            if ((item.code === value.code && item.id !== value.id) && (value.edit && value.status === '')) {
              isSame = true
              this.isSame.boolean = true
            } else {
              if (item[childrenKey] && item[childrenKey] !== []) {
                sanmeNode(item[childrenKey], 'new')
              }
            }
          }
        })
      }
      sanmeNode(this.treeData, params)
      return isSame
    },
    // Bo类型事件
    handleStepAction(boType, value) {
      this.boType = boType
      this.toolbars = false
      if (boType === 'external') {
        this.toolbars = true
      }
      let level = 1
      if (this.parentData && this.parentData.isMain === 'Y') {
        level = 2
      } else if (this.parentData && this.parentData.isMain === 'N') {
        level = 3
      }

      this.getCurData(null, level)
      if (boType === 'new') {
        this.show = 'detail'
      } else {
        if (boType === 'boDef') {
          if (this.checkSameNode(value, 'boDef')) {
            this.$message.closeAll()
            this.$message({
              message: 'BO定义存在循环引用或层次混乱！',
              type: 'warning'
            })
            return
          }
          this.getBindForm(value)
          this.show = 'detail'
        } else {
          this.show = 'step'
        }
      }
    },
    // 现有BO
    getBindForm(id) {
      getJson({ boDefId: id }).then(response => {
        const data = response.data
        data.options = JSON.parse(response.data.options)
        const getJson = JSON.parse(JSON.stringify(this.defaultBoDef))
        for (var i in getJson) {
          getJson[i] = data[i]
        }
        getJson.attrs = data.attrList
        getJson.relation = response.data.relation === null ? 'one2many' : response.data.relation
        getJson.isMain = 'N'
        getJson.isMaster = 'N'
        getJson.edit = true
        this.getcode = getJson.code
        this.parentData[this.childrenKey] = getJson
        this.changeData(getJson)

        this.getCurData(getJson.id)
      })
    },
    // 外部数据完成按钮
    complete(paramArr) {
      const arr = JSON.parse(paramArr)
      const outCode = {}
      outCode.boCode = arr[0].tableName
      outCode.boDefId = uuid()
      outCode.isMain = 'Y'
      checkCode(outCode).then(response => {
        if (response.data === true) {
          if (this.checkSameNode(JSON.parse(paramArr), 'external')) {
            const arr = JSON.parse(paramArr)
            this.$message.closeAll()
            this.$message({
              message: '业务对象的标识[' + arr[0].tableName + ']已存在了,请重新填写！',
              type: 'warning'
            })
            return
          }
          this.show = 'detail'
          getJsonByTbl({
            boDefs: paramArr
          }).then(response => {
            const data = response.data
            this.getcode = data.code
            const temp = {
              name: data.name,
              tblName: arr[0].tableName,
              code: data.code,
              boType: 'out',
              dataFormat: data.dataFormat,
              dsName: data.dsName,
              state: data.state,
              status: data.status,
              pk: data.pk,
              fk: data.fk,
              fromAttr: null,
              desc: data.desc,
              attrs: data.attrList,
              options: {
                struType: 'list',
                idKey: 'id',
                pIdKey: 'id',
                key: 'id'
              },
              isMain: data.isMain ? data.isMain : this.treeData[0].subBoDefs.length === 0 ? 'Y' : 'N',
              isMaster: data.isMaster ? data.isMaster : 'Y',
              relation: data.relation ? data.relation : 'one2many',
              id: uuid(),
              edit: true
            }
            this.changeData(temp)
            this.getCurData(temp.id)
          })
        } else {
          this.$message({
            message: '业务对象的标识[' + arr[0].tableName + ']已存在了,请使用现有BO的方式添加！',
            type: 'warning'
          })
        }
      })
    },
    // 递归函数
    getCurNode(id, level = -1) {
      let curData = {}
      let curId = id
      const childrenKey = this.childrenKey
      const findData = function(treeData) {
        level++
        treeData.find(data => {
          if (data.id === id) {
            curData = _cloneDeep(data)
          } else {
            const children = data[childrenKey]
            if (children && children.length > 0) {
              findData(children)
            }
          }
        })
      }
      if (this.$utils.isNotEmpty(id)) {
        findData(this.treeData)
        curId = id
      } else {
        curId = uuid()
        const data = _cloneDeep(this.defaultBoDef)
        if (level === 1) {
          data.isMain = 'Y'
        } else {
          data.isMain = 'N'
          data.attrs.splice(1, 0, subBoDefsAttrs)
        }
        data.id = curId
        curData = data
      }
      return {
        curData: curData,
        curId: curId,
        level: level
      }
    },
    getCurData(id, level = -1) {
      const obj = this.getCurNode(id, level)
      this.isMaster = obj.level === 1 ? true : this.nodeStatus(obj.curData)
      this.curData = obj.curData
      this.curId = obj.curId
      this.level = obj.level
    },
    remove(id) {
      this.getCurData(id) // 删除属性的方法
      this.handleNodeClick({ id: '0' }) // 回归提示状态
    },
    // 添加、编辑
    handleNodeData(nodes, id, value) {
      const curIndex = nodes.findIndex(i => i.id === id)
      if (this.$utils.isEmpty(value)) {
        nodes.splice(curIndex, 1)
      } else {
        if (curIndex > -1) {
          nodes.splice(curIndex, 1, value)
        } else {
          if (value.name !== '') {
            nodes.push(value)
          }
        }
      }
      return nodes
    },
    // 节点删除
    removeNode(value) {
      const childrenKey = this.childrenKey
      var arr = function(data) {
        data.find(item => {
          if (item[childrenKey] && item[childrenKey] !== []) {
            item[childrenKey].forEach((v, i) => {
              if (v.id !== value.id) {
                arr(item[childrenKey])
              } else {
                if (item[childrenKey].length === 1) {
                  delete item[childrenKey]
                } else {
                  item[childrenKey].splice(i, 1)
                }
              }
            })
          }
        })
        return data
      }
      // arr(this.treeData)
      this.tempTreeData = arr(this.treeData)
      this.treeData = JSON.parse(JSON.stringify(this.tempTreeData))
    },
    // 添加数据
    changeData(value, tabName) {
      this.tabName = tabName
      if (value.code === '' && value) {
        return
      } else if (this.checkSameNode(value, 'new') && this.tabName === 'basic-info') {
        this.$message({
          message: '业务对象的标识[' + value.code + ']已存在了,请重新填写！',
          type: 'warning'
        })
        return
      }
      const tempTreeData = JSON.parse(JSON.stringify(this.treeData))
      const first = 0
      let second = ''
      // 第一级
      if (this.level === 1) {
        const childrens = tempTreeData[0][this.childrenKey] || []
        tempTreeData[0][this.childrenKey] = this.handleNodeData(childrens, this.curId, value)
      } else if (this.level === 2) {
      // 第二级

        const childrens = tempTreeData[0][this.childrenKey][first][this.childrenKey] || []
        tempTreeData[0][this.childrenKey][first][this.childrenKey] = this.handleNodeData(childrens, this.curId, value)
      } else if (this.level === 3) {
      // 第三级
        if (value !== undefined) {
          second = tempTreeData[0][this.childrenKey][first][this.childrenKey].findIndex(i => i.id === this.parentData.id)
          const index = tempTreeData[0][this.childrenKey][first][this.childrenKey].findIndex(i => i.id === value.id)
          if (index > -1) {
            const rootData = tempTreeData[0][this.childrenKey][first][this.childrenKey]
            tempTreeData[0][this.childrenKey][first][this.childrenKey] = this.handleNodeData(rootData, this.curId, value)
          } else {
            const childrens = tempTreeData[0][this.childrenKey][first][this.childrenKey][second][this.childrenKey] || []
            tempTreeData[0][this.childrenKey][first][this.childrenKey][second][this.childrenKey] = this.handleNodeData(childrens, this.curId, value)
          }
        }
      } else if (this.level >= 4) {
      // 第 N 级
        if (value !== undefined) {
          const arr = tempTreeData[0][this.childrenKey][first][this.childrenKey]
          let index
          arr.forEach((v, i) => {
            if (v[this.childrenKey] && v[this.childrenKey].length > 0) {
              v[this.childrenKey].forEach(l => {
                if (l.id === value.id) {
                  index = i
                }
              })
            }
          })
          if (index > -1) {
            const childrens = tempTreeData[0][this.childrenKey][first][this.childrenKey][index][this.childrenKey] || []
            tempTreeData[0][this.childrenKey][first][this.childrenKey][index][this.childrenKey] = this.handleNodeData(childrens, this.curId, value)
          } else {
            const rootData = tempTreeData[0][this.childrenKey][first][this.childrenKey]
            tempTreeData[0][this.childrenKey][first][this.childrenKey] = this.handleNodeData(rootData, this.curId, value)
          }
        }
      }
      this.treeData = JSON.parse(JSON.stringify(tempTreeData))
      this.tempTreeData = JSON.parse(JSON.stringify(tempTreeData))
    },
    // 点击节点
    handleNodeClick(data) {
      // if ((this.sameCodes || this.isSame.boolean) && this.tabName === 'basic-info') {
      //   this.$message({
      //     message: '业务对象的标识[' + this.isSame.code + ']已存在了,请重新填写！',
      //     type: 'warning'
      //   })
      //   return
      // }
      // const validate = this.$refs['detail'] ? this.$refs['detail'].validate() : true
      // if (!validate) {
      //   ActionUtils.saveErrorMessage()
      //   return
      // }
      this.state = data.state
      this.getParentObjAttr(data)
      this.isMaster = this.nodeStatus(data)
      if (data.id === '0') {
        this.show = 'none'
        this.curId = ''
        this.curData = {}
        this.level = -1
      } else {
        this.show = 'none'
        if (this.$utils.isEmpty(data.dsName)) {
          this.toolbars = false
        } else {
          this.toolbars = true
        }
        setTimeout(() => {
          this.show = 'detail'
          this.action = 'edit'

          this.getCurData(data.id)
          if (data.isMain === undefined) {
            this.toolbars = true
          } else {
            this.toolbars = this.readonly
          }
        }, 0)
      }
    },
    // 获取父节点对象属性
    getParentObjAttr(value) {
      const arr = []
      const childrenKey = this.childrenKey
      var filter = function(data) {
        data.find(item => {
          if (item[childrenKey] && item[childrenKey] !== []) {
            arr.push(item)
            filter(item[childrenKey])
          } else {
            return
          }
        })
      }
      filter(this.treeData)
      arr.forEach((v, i) => {
        v.subBoDefs.forEach((p, l) => {
          if (p.id === value.id) {
            this.parentData = arr[i]
          }
        })
      })
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 250 : 30
    },
    // 保存数据
    handleSave(saveType) {
      this.saveData(saveType)
    },
    checkCode(boolean, sameNode) {
      this.sameCode = boolean
      if (this.sameCode) {
        this.removeNode(sameNode)
      }
    },
    // 提交保存数据
    saveData(saveType) {
      this.shade = true
      if (this.treeData[0].subBoDefs === undefined || this.treeData[0].subBoDefs.length === 0) {
        this.$message({
          message: '请设置主对象',
          type: 'warning'
        })
        this.shade = false
        return
      }
      if (this.treeData[0].subBoDefs !== undefined || this.treeData[0].subBoDefs.length === 1) {
        this.sameCode = false
      }
      if (this.sameCodes) {
        this.$message({
          message: ' 业务对象标识已存在',
          type: 'warning'
        })
        this.shade = false
        return
      }
      const validate = this.$refs['detail'] ? this.$refs['detail'].validate() : true
      if (!validate) {
        ActionUtils.saveErrorMessage()
        this.shade = false
        return
      }
      this.isAddSub = false
      const index = this.treeData[0].subBoDefs.findIndex(i => i.isMain === 'Y')
      const obj = this.treeData[0].subBoDefs[index]
      if (saveType === 'deploy') {
        obj.attrs.forEach(v => {
          masterAttrs.desc = v.name
          Object.assign(v, masterAttrs)
        })
      }
      const data = JSON.stringify(this.treeData[0].subBoDefs)
      save({
        boDefs: data,
        saveType: saveType
      }).then(response => {
        this.$emit('callback', this)
        this.closeDialog()
        this.shade = false
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.showBo = false
      this.tip = 'tip'
      this.action = 'add'
      this.tabName = ''
      this.treeContextmenus = this.contextmenus
      this.tempTreeData = JSON.parse(JSON.stringify(rootData))
      this.$emit('close', false)
      this.$refs['step'] ? this.$refs['step'].resetFields() : null
      this.$refs['detail'] ? this.$refs['detail'].initActive('basic-info') : null
    },
    getFormData() {
      this.$nextTick(() => {
        this.$refs['tree'] ? this.$refs['tree'].fixZIndex() : null
      })
      if (this.$utils.isEmpty(this.formId)) {
        this.show = 'step'
        this.parentData = {}
        this.treeData = JSON.parse(JSON.stringify(rootData))
      } else {
        this.show = 'detail'
        manage({
          boDefId: this.id
        }).then(response => {
          this.toolbars = false
          if (this.readonly) {
            this.toolbars = true
            this.treeContextmenus = []
          }
          const data = response.data
          this.treeData[0][this.childrenKey] = [JSON.parse(data)]

          this.getCurData(this.id)
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    }
  }
}
</script>
<style lang="scss">
$rootBorder:1px solid #ebeef5;
.bo-def-dialog{
  .el-dialog__header{
    padding: 5px;
    background-color: #f5f5f7;
  }
  .el-dialog--left{
      position: relative;
    .shade{
      position: absolute;
      display:inline-block;
      width:265px;
      height:35px;
    }
  }
  .ibps-tree-main{
    border:1px solid #e0e3e9;
  }
  .el-scrollbar{
    border-bottom: $rootBorder;
  }
  .el-dialog__body{
    padding:9px 20px !important;
    height: 94%;
    .ibps-layout{
      height: 100%;
      .ibps-layout_west{
        div{
          .ibps-tree{
            height: 100%;
            .ibps-tree-main{
              height:calc(100vh - 140px) !important;;
            }
          }
        }
      }
    }
  }
  .el-steps--horizontal{
    border-bottom: $rootBorder;
  }
  .bo-content-detail-form{
     margin-top: 15px;
    .el-form-item{
      margin-bottom: 0;
    }
    .formFooter{
      width: 185px;
      margin: 0 auto;
      .rightBottom{
        margin-left: 5px;
      }
    }
  }
}
</style>
