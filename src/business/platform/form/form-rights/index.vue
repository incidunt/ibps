<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    width="90%"
    top="3vh"
    class="rigths-dialog"
    append-to-body
    @open="getFormData"
    @close="closeDialog"
  >
    <div v-loading="dialogLoading" :element-loading-text="$t('common.loading')">
      <table width="100%" class="table">
        <colgroup>
          <col style="width:25%;">
          <col style="width:25%;">
          <col style="width:25%;">
          <col style="width:25%;">
        </colgroup>
        <thead>
          <tr class="table-header">
            <th>字段</th>
            <th>只读权限</th>
            <th>编辑权限</th>
            <th>必填权限</th>
          </tr>
          <tr class="table-buttons">
            <td v-for="(type,i) in rigthsTypes" :key="i" align="center">
              <el-button
                v-for="(item,l) in type.fields"
                :key="l"
                :type="item.type"
                size="mini"
                @click="buttonActions(item.group,rigthsTypes,i,l,item.key)"
              >{{ item.label }}</el-button>
            </td>
          </tr>
        </thead>
      </table>
    </div>
    <div style="max-height:608px;overflow-y: auto;">
      <table width="100%" class="table">
        <colgroup>
          <col style="width:25%;">
          <col style="width:25%;">
          <col style="width:25%;">
          <col style="width:25%;">
        </colgroup>
        <tbody v-for="(table,i) in rightsFormData" :key="i" class="table-body" :class="'isMain-'+table.isMain">
          <!-- 为主表时 -->
          <tr v-if="table.isMain==='Y'">
            <td colspan="4" class="main-head">
              <span class="title">{{ table.label }}</span>
            </td>
          </tr>
          <!-- 为子表时 -->
          <template v-if="table.isMain==='N'">
            <!-- 子表权限 -->
            <tr class="sublist-head">
              <td>&nbsp;&nbsp;
                <el-tag class="tag">{{ 'table'|optionsFilter(controlTypes,'label') }}</el-tag>
                <span class="title">{{ table.label }}</span>
              </td>
              <td
                v-for="type in rightsList"
                :key="type"
                class="tr-list-td"
              >
                <div v-if="table[type]" class="settings">
                  <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit',type,table,table.name)" />
                  <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset',type,table,table.name)" />
                </div>
                <rights-label
                  :value="table[type]"
                  :name="table.name"
                  :type-key="type"
                  :item="table"
                  @remove="handleRemove"
                />
              </td>
            </tr>
            <!-- 子表按钮 -->
            <tr class="sublist-body">
              <td colspan="4">
                <table>
                  <thead>
                    <tr>
                      <th>按钮权限</th>
                      <th>显示权限</th>
                    </tr>
                  </thead>
                  <tbody v-if="table.buttons&&table.buttons.length>0">
                    <tr v-for="(button,j) in table.buttons" :key="j">
                      <td>
                        <el-tag class="tag">{{ button.type|optionsFilter(subButtonTypeOptions,'label') }}</el-tag>
                        {{ button.label }}
                      </td>
                      <td>
                        <div v-if="button['show']" class="settings">
                          <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit','read',button,table.name)" />
                          <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset','read',button,table.name)" />
                        </div>
                        <rights-label :value="button.show" :name="table.name" :item="button" @remove="handleRemove" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
          <!-- 权限列表 -->
          <tr v-for="(field,l) in table.fields" :key="l" class="tr-list">
            <td>
              <el-tag>{{ field.field_type|optionsFilter(controlTypes,'label') }}</el-tag>
              {{ field.label }}
            </td>
            <td v-for="type in getRightsList(field)" :key="type" class="tr-list-td">
              <div v-if="field[type]" class="settings">
                <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit',type,field,table.name)" />
                <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset',type,field,table.name)" />
              </div>
              <rights-label
                :value="field[type]"
                :name="table.name"
                :type-key="type"
                :item="field"
                @remove="handleRemove"
              />
            </td>
          </tr>
        </tbody>
        <!-- 审批意见 -->
        <tfoot v-if="opinion && opinion.length >0" class="table-tfoot">
          <tr>
            <td colspan="4">
              <h4 class="title">流程意见</h4>
            </td>
          </tr>
          <tr v-for="(field,n) in opinion" :key="n" class="tr-list">
            <td>{{ field.label }}</td>
            <td v-for="type in getRightsList(field)" :key="type" class="tr-list-td">
              <div v-if="field[type]" class="settings">
                <el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="handleSettings('edit',type,field,'opinion')" />
                <el-button title="重置" type="danger" icon="ibps-icon-undo" circle @click="handleSettings('reset',type,field,'opinion')" />
              </div>
              <rights-label :value="field[type]" :type-key="type" name="opinion" :item="field" @remove="handleRemove" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
    <rights-config
      :visible="dialogRightsVisible"
      :data="rightsTypeList"
      title="表单授权"
      @callback="handleRightsConfirm"
      @close="visible => dialogRightsVisible = visible"
    />
  </el-dialog>
</template>
<script>
import { getPermission, saveFlowPermission, resetFlowPermission } from '@/api/platform/form/formRights'
import {
  buttonsTypes,
  groupFieldss,
  subButtonTypeOptions,
  tableFieldTypes,
  ownRightsOptions
} from './constants'

import ActionUtils from '@/utils/action'
import RightsConfig from '@/business/platform/rights/config'
import RightsLabel from '@/business/platform/rights/config/label'

export default {
  components: {
    RightsConfig,
    RightsLabel
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    formKey: String,
    flowKey: String,
    nodeId: String,
    parentFlowKey: String,
    isInst: Boolean,
    rightsType: {// 权限类型
      type: String,
      default: 'form'
    },
    isSave: {// 是否保存
      type: Boolean,
      default: false
    },
    permission: Object // 权限数据
  },
  data() {
    return {
      rigthsTypes: [],
      subButtonTypeOptions: subButtonTypeOptions,
      controlTypes: tableFieldTypes,
      dialogVisible: this.visible,
      dialogRightsVisible: false,
      dialogLoading: false,
      default: [],
      rightsFormData: [],

      rightsFields: '',
      rightsList: ['read', 'edit', 'required'],
      buttonKey: ['hide', 'read', 'edit', 'required'],
      opinion: [],
      formParams: {},
      rightsTypeList: []
    }
  },
  computed: {
    toolbars() {
      let toolbars = []
      if (this.isSave) {
        toolbars = [
          { key: 'save' },
          { key: 'undo', icon: 'ibps-icon-undo', type: 'success', label: '重置' },
          { key: 'cancel' }
        ]
      } else {
        toolbars = [
          { key: 'confirm' },
          { key: 'undo', icon: 'ibps-icon-undo', type: 'success', label: '重置' },
          { key: 'cancel' }
        ]
      }
      return toolbars
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
    this.initFieldTypes()
    this.default = JSON.parse(JSON.stringify(this.rigthsTypes))
  },
  methods: {
    getRightsList(item) {
      const arr = []
      for (var i in item) {
        if (Object.prototype.toString.call(item[i]) === '[object Array]') {
          arr.push(i)
        }
      }
      return arr
    },
    handleSettings(key, rigths, targetItem, boName) {
      this.formParams = { rigths, targetItem, boName }
      this.rightsFields = ''
      this.rightsTypeList = []
      const ownRights = []
      for (var i in ownRightsOptions) {
        const field = ownRightsOptions[i].type
        ownRights.push({ type: field })
      }
      if (key === 'edit') {
        let targetArr = []
        if (targetItem.show && targetItem.show.length > 0) {
          targetArr = targetItem.show
        } else {
          targetArr = targetItem[rigths]
        }
        ownRights.forEach(l => {
          targetArr.forEach(n => {
            if (l.type === n.type) {
              this.rightsTypeList.push(n)
            }
          })
        })
        this.dialogRightsVisible = true
      } else if (key === 'reset') {
        let data
        if (rigths === 'read' || rigths === 'edit') {
          data = [this.rootDatas('all')]
        } else if (rigths === 'required') {
          data = [this.rootDatas('none')]
        }
        this.handleRightsConfirm(data)
      }
    },
    // 编辑
    handleRightsConfirm(data) {
      if (this.$utils.isEmpty(data)) return
      const rightsFormData = this.rightsFormData
      const opinion = this.opinion || []
      const formParams = this.formParams || {}
      rightsFormData.forEach((v, i) => {
        this.rightsList.forEach(item => {
          if (this.rightsFields === item) {
            v.fields.forEach(m => {
              if (m[item] !== undefined) {
                m[item] = data
              } else if (m['show'] !== undefined && item === 'read') {
                m['show'] = data
              }
            })
            opinion.forEach(o => {
              o[item] = data
            })
            if (v.isMain === 'N') {
              v[item] = data
              if (item === 'read') {
                v.buttons.forEach(a => {
                  a.show = data
                })
              }
            }
          } else if (formParams.rigths === item) {
            if (v.name === formParams.boName) {
              v.fields.forEach(n => {
                if (n.name === formParams.targetItem.name) {
                  n[formParams.rigths] = data
                }
              })
              if (v.isMain === 'N') {
                if (formParams.rigths === 'read') {
                  if (formParams.targetItem.show && formParams.targetItem.show.length > 0) {
                    v.buttons.forEach(m => {
                      if (m.type === formParams.targetItem.type) {
                        m.show = data
                      }
                    })
                  } else if (formParams.targetItem.buttons) {
                    v[formParams.rigths] = data
                  }
                }
              }
            }
          } else if (formParams.boName === 'opinion') {
            opinion.forEach(o => {
              if (o.name === formParams.targetItem.name) {
                o[formParams.rigths] = data
              }
            })
          }
        })
      })
    },

    initFieldTypes() {
      let groupFields = {}
      for (const key in buttonsTypes) {
        // 对字段进行分组处理
        const field = buttonsTypes[key]
        var groupKey
        for (var i = 0; i < field.group.length; i++) {
          groupKey = field.group[i]
          if (!groupFields[groupKey]) {
            groupFields[groupKey] = []
          }
          groupFields[groupKey].push(field)
        }
      }
      const group = JSON.parse(JSON.stringify(groupFields))
      for (const key in groupFields) {
        for (let a = 0; a < groupFields[key].length; a++) {
          group[key][a].group = key
          const requiredIndex = group['fields'].findIndex(
            i => i.key === 'required'
          )
          const editIndex = group['fields'].findIndex(i => i.key === 'edit')
          if (requiredIndex < editIndex) {
            const temp = group['fields'][requiredIndex]
            group['fields'][requiredIndex] = group['fields'][editIndex]
            group['fields'][editIndex] = temp
          }
        }
      }
      groupFields = JSON.parse(JSON.stringify(group))
      // 合并分组
      for (const key in groupFieldss) {
        const groupField = groupFieldss[key]
        if (!groupField) {
          continue
        }
        groupField['fields'] = groupFields[key] || []
        if (groupField['fields'] && groupField['fields'].length > 0) {
          this.rigthsTypes.push(groupField)
        }
      }
    },
    buttonActions(value, data, listIndex, buttonIndex, key) {
      this.handleButtonType(value, data, listIndex, buttonIndex)
      this.globalControl(value, data, key)
    },
    // 字段按钮全局权限控制
    globalControl(value, data, key) {
      const type = []
      let rigths = []
      let parameters
      for (var i in buttonsTypes) {
        type.push(i)
      }
      for (let a = 0; a < data.length; a++) {
        if (value === data[a].key) {
          for (let b = 0; b < data[a].fields.length; b++) {
            type.forEach(item => {
              if (key === item) {
                if (key === 'hide' || key === 'none') {
                  rigths = ['none', 'none', 'none']
                }
                if (key === 'read') {
                  rigths = ['all', 'none', 'none']
                }
                if (key === 'edit') {
                  rigths = ['all', 'all', 'none']
                }
                if (key === 'all' || key === 'required') {
                  rigths = ['all', 'all', 'all']
                }
                if (key === 'all' || key === 'none') {
                  parameters = value
                }
              }
            })
            if (value !== 'fields' && key === 'edit') {
              this.dialogRightsVisible = true
              this.rightsFields = value
              this.rightsTypeList = []
              this.formParams = {}
            } else {
              this.changerightsFields(rigths, key, parameters)
            }
          }
        }
      }
    },
    rootDatas(type, rightsId = '', rightsName = '') {
      return {
        type: type,
        rightsId: '',
        rightsName: ''
      }
    },
    changerightsFields(typeArr, key, handFields) {
      const rightsFormData = this.rightsFormData
      for (let i = 0; i < rightsFormData.length; i++) {
        for (let l = 0; l < rightsFormData[i].fields.length; l++) {
          if (this.buttonKey.includes(key)) {
            if (rightsFormData[i].fields[l]['read'] !== undefined) {
              rightsFormData[i].fields[l].read = [this.rootDatas(typeArr[0])]
            }
            if (rightsFormData[i].fields[l]['edit'] !== undefined) {
              rightsFormData[i].fields[l].edit = [this.rootDatas(typeArr[1])]
            }
            if (rightsFormData[i].fields[l]['required'] !== undefined) {
              rightsFormData[i].fields[l].required = [this.rootDatas(typeArr[2])]
            }
            if (rightsFormData[i].fields[l]['show'] !== undefined) {
              rightsFormData[i].fields[l].show = [this.rootDatas(typeArr[0])]
            }
            this.opinionRights(typeArr, key)
            this.sublistRights(rightsFormData[i], typeArr)
          } else {
            this.rightsList.forEach((item, n) => {
              if (item === handFields) {
                if (rightsFormData[i].fields[l][item] !== undefined) {
                  rightsFormData[i].fields[l][item] = [this.rootDatas(typeArr[n])]
                } else if (rightsFormData[i].fields[l]['show'] !== undefined && handFields === 'read') {
                  rightsFormData[i].fields[l].show = [this.rootDatas(typeArr[0])]
                }
                if (item === 'read') {
                  this.sublistRights(rightsFormData[i], typeArr, handFields)
                }
                if (rightsFormData[i].isMain === 'N' && (item === 'edit' || item === 'required')) {
                  rightsFormData[i][item] = [this.rootDatas(typeArr[n])]
                }
              }
            })
            this.opinionRights(typeArr, key, handFields)
          }
        }
      }
    },
    // 子表权限
    sublistRights(obj, array, handFields) {
      if (obj.isMain === 'N') {
        obj.read = [this.rootDatas(array[0])]
        if (handFields !== 'read') {
          obj.edit = [this.rootDatas(array[1])]
          obj.required = [this.rootDatas(array[2])]
        }
        for (var p = 0; p < obj.buttons.length; p++) {
          obj.buttons[p].show = [this.rootDatas(array[0])]
        }
      }
    },
    // 流程意见
    opinionRights(arr, key, handFields) {
      const opinion = this.opinion || []
      opinion.forEach(item => {
        if (this.buttonKey.includes(key)) {
          item.read = [this.rootDatas(arr[0])]
          item.edit = [this.rootDatas(arr[1])]
          item.required = [this.rootDatas(arr[2])]
        } else {
          this.rightsList.forEach((v, i) => {
            if (v === handFields) {
              item[v] = [this.rootDatas(arr[i])]
            }
          })
        }
      })
    },
    // 按钮样式控制
    handleButtonType(handleField, data, pi, i) {
      let v = 0
      const buttonType = 'success'
      let type = ''
      for (; v < data.length; v++) {
        if (pi !== undefined && i !== undefined) {
          for (let a = 0; a < data[pi].fields.length; a++) {
            data[pi].fields[a].type = ''
          }
          if (handleField === 'fields') {
            for (let a = 0; a < data[v].fields.length; a++) {
              if (data[v].key !== 'fields') {
                this.buttonKey.forEach(m => {
                  if ((data[v].key === 'read' && m === 'read') || ((data[v].key === 'read' || data[v].key === 'edit') && m === 'edit') || ((data[v].key === 'read' || data[v].key === 'edit' || data[v].key === 'required') && m === 'required')) {
                    type = 'all'
                  } else {
                    type = 'none'
                  }
                  if (data[pi].fields[i].key === m) {
                    this.getTarget(data[v], type, a, 'fields')
                  }
                })
              }
            }
          }
          data[pi].fields[i].type = buttonType
        } else {
          for (let a = 0; a < data[v].fields.length; a++) {
            data[v].fields[a].type = ''
          }
        }
      }
    },
    getTarget(value, key, i, childrenKey) {
      value.fields[i].type = ''
      const index = value[childrenKey].findIndex(i => i.key === key)
      value.fields[index].type = 'success'
    },
    // 权限逐个删除[数据格式转换]
    handleRemove(index, item, items, lists, typeKeys, boName) {
      // console.log('当前单元格数据删除某字段权限的索引位置', index)
      // console.log('当前删除前单元格数据里的某字段权限的数据-obj', item)
      // console.log('当前删除后单元格数据里的某字段权限的数据集-arr', items)
      // console.log('当前表格行的数据', lists)
      // console.log('当前操作的权限列字段', typeKeys)
      // console.log('表名', boName)
      // console.log('当前表单权限表单数据', this.rightsFormData)
      let idArr = []
      let nameArr = []
      let targetObj = {}
      const targetItems = [...items]
      items.forEach(i => {
        if (i.type === item.type) {
          if (!item.rightsId || !item.rightsName) {
            item = this.rootDatas(item.type)
          }
          idArr = item.rightsId.split(',') || []
          nameArr = item.rightsName.split(',') || []
          idArr.splice(index, 1)
          nameArr.splice(index, 1)
          targetObj = {
            rightsId: idArr.join(','),
            rightsName: nameArr.join(','),
            type: item.type
          }
        }
      })
      // 上部分是处理当前行删除操作的数据处理过程，得到items。
      const site = items.findIndex(l => l.type === targetObj.type)
      if (targetObj.rightsId === '' && targetObj.rightsName === '') {
        if (items.length === 1) {
          const none = {
            rightsId: '',
            rightsName: '',
            type: 'none'
          }
          targetItems.splice(site, 1, none)
        } else {
          targetItems.splice(site, 1)
        }
      } else {
        targetItems.splice(site, 1, targetObj)
      }
      this.changeRightsFormData(targetItems, lists, typeKeys, boName)
    },
    changeRightsFormData(items, lists, typeKeys, boName) {
      const rightsFormData = this.rightsFormData
      const opinion = this.opinion || []
      rightsFormData.forEach(i => {
        if (i.name === boName) {
          if (i.isMain === 'Y') {
            i.fields.forEach(l => {
              if (l.name === lists.name) {
                l[typeKeys] = items
              }
            })
          } else if (i.isMain === 'N') {
            if (i.name === lists.name) {
              i[typeKeys] = items
            } else {
              if (lists.show === undefined) {
                i.fields.forEach(l => {
                  if (l.name === lists.name) {
                    l[typeKeys] = items
                  }
                })
              } else {
                i.buttons.forEach(p => {
                  if (p.name === lists.name) {
                    p.show = items
                  }
                })
              }
            }
          }
        }
      })
      opinion.forEach(a => {
        if (a.name === lists.name) {
          a[typeKeys] = items
        }
      })
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'confirm':
          this.handleConfirm()
          break
        case 'undo':
          this.handleUndo()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    /**
     * 获取提交
     */
    getSaveData() {
      const permission = {
        field: [],
        subfield: [],
        table: [],
        button: [],
        opinion: []
      }
      const rightsFormData = this.rightsFormData
      const opinion = this.opinion || []
      rightsFormData.forEach(item => {
        permission['field'] = permission['field'].concat(item.fields)
        if (item.isMain === 'N') {
          const subTable = { code: '', name: '', read: {}, edit: {}, required: {}}
          permission['subfield'] = permission['subfield'].concat(item.fields)
          for (const i in item) {
            for (const l in subTable) {
              if (i === l) {
                subTable[l] = item[i]
                subTable['code'] = subTable['name']
              }
            }
          }
          permission['table'].push(subTable)
          const button = item.buttons.map((button) => {
            button['code'] = subTable['code']
            return button
          })
          permission['button'] = permission['button'].concat(button)
        }
      })
      const rootType = ['all', 'none']
      opinion.forEach(item => {
        this.rightsList.forEach(i => {
          item[i].forEach((v, l) => {
            if (rootType.includes(v.type)) {
              item[i][l] = this.rootDatas(item[i][l].type)
            }
          })
        })
      })
      permission.opinion = opinion
      const formParams = this.getRightsParams()
      formParams.permission = permission
      return formParams
    },
    handleConfirm() {
      this.$emit('callback', this.getSaveData())
    },
    handleSave() {
      saveFlowPermission({
        permission: JSON.stringify(this.getSaveData())
      }).then(response => {
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          }
        })
      })
    },
    getRightsParams() {
      return {
        formKey: this.formKey ? this.formKey : null,
        flowKey: this.flowKey ? this.flowKey : null,
        nodeId: this.nodeId ? this.nodeId : null,
        parentflowKey:	this.parentflowKey ? this.parentflowKey : null,
        isInst: this.isInst ? this.isInst : false,
        rightsScope: this.rightsType ? this.rightsType : 'form'
      }
    },
    handleUndo() {
      this.$confirm('确认重置表单权限吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogLoading = true
        if (this.isSave) {
          resetFlowPermission({
            permission: JSON.stringify(this.getRightsParams())
          }).then(response => {
            this.$message.closeAll()
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.dialogLoading = false
            this.getFormData()
          })
        } else {
          this.globalControl('fields', this.rigthsTypes, 'edit')
          this.handleButtonType('fields', this.rigthsTypes)
          setTimeout(() => {
            this.$emit('callback', null)
            this.$message.closeAll()
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.dialogLoading = false
          }, 100)
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      this.rigthsTypes = JSON.parse(JSON.stringify(this.default))
      if (!this.isSave && this.$utils.isNotEmpty(this.permission)) {
        this.handlePermissionData(this.permission)
      } else {
        this.loadPermission()
      }
    },
    loadPermission() {
      const formParams = this.getRightsParams()
      formParams.rightsType = this.rightsType || 'form'
      this.dialogLoading = true
      getPermission(formParams)
        .then(response => {
          this.dialogLoading = false
          this.handlePermissionData(response.data)
        }).catch(() => {
          this.dialogLoading = false
        })
    },
    handlePermissionData(data) {
      this.rightsFormData = data.table
      this.opinion = data.opinion
    }
  }
}
</script>
<style lang="scss">
@import "./rights.scss";
</style>
