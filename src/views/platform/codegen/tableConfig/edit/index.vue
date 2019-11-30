<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="tableConfigDialog"
    fullscreen
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
      class="tableConfigForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="表来源:" prop="tableSource" label-width="120px">
            <ibps-dictionary
              v-model="form.tableSource"
              :readonly="readonly"
              type-key="tableSource"
              @input="tableSourceValue"
              @callback="data => tableSourceArr = data"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="show" :span="12">
          <el-form-item label="数据源:" prop="dsAlias" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.dsAlias"
              clearable
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in dsAliasOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.dsAlias|optionsFilter(dsAliasOptions,'label') }}</span>
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item label="业务对象:" prop="boName" label-width="120px">
            <ibps-BoDef-selector
              v-model="form.boId"
              :readonly="readonly"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表名:" prop="tableName" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.tableName"
              :loading="loading"
              filterable
              clearable
              placeholder="请选择"
              style="width:100%;"
              @focus="getTableNameData(form.tableSource,form.boId)"
              @change="tableNameChange"
            >
              <el-option
                v-for="item in tableNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.tableName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注释:" prop="tableComment" label-width="120px">
            <el-input v-if="!readonly" v-model="form.tableComment" clearable />
            <span v-else>{{ form.tableComment }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类名:" prop="className" label-width="120px">
            <el-input v-if="!readonly" v-model="form.className" />
            <span v-else>{{ form.className }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="布局模板:" prop="layerTemplate" label-width="120px">
            <ibps-dictionary
              v-model="form.layerTemplate"
              :readonly="readonly"
              type-key="layerTemplate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主表表名:" prop="parentTableName" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.parentTableName"
              :loading="loading"
              placeholder="请选择"
              filterable
              clearable
              style="width:100%;"
              @focus="parentTableNameFocus(form.tableSource,form.boId)"
              @change="parentTableNameChange"
            >
              <el-option
                v-for="item in parentTableNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.parentTableName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类:" prop="typeId" label-width="120px">
            <ibps-type
              v-model="form.typeId"
              :readonly="readonly"
              category-key="TEMPLATE_TYPE"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isParentTab" :span="8">
          <el-form-item label="外键:" prop="foreignKey" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.foreignKey"
              :loading="loading"
              filterable
              placeholder="请选择"
              style="width:100%;"
              @focus="foreignKeyFocus(form.tableName,form.boId)"
            >
              <el-option
                v-for="item in foreignKeyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.foreignKey }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="isParentTab" :span="8">
          <el-form-item label="来自属性:" prop="fromKey" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.fromKey"
              :loading="loading"
              filterable
              placeholder="请选择"
              style="width:100%;"
              @focus="fromKeyFocus(form.parentTableName,form.boId)"
            >
              <el-option
                v-for="item in fromKeyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.fromKey }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="isParentTab" :span="8">
          <el-form-item label="关系类型:" prop="relation" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.relation"
              :loading="loading"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in relationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.relation }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="展现形式:" prop="struType" label-width="120px">
            <el-radio-group v-if="!readonly" v-model="form.struType" @change="struTypeChange">
              <el-radio label="list">列表</el-radio>
              <el-radio label="tree">树形</el-radio>
            </el-radio-group>
            <el-tag v-else>{{ form.struType|optionsFilter(struTypeOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>

        <el-col v-if="form.struType==='tree'&&form.tableName!==''" :span="12">
          <el-form-item label="节点ID字段:" prop="idKey" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.idKey"
              :loading="loading"
              filterable
              placeholder="请选择"
              style="width:100%;"
              @focus="foreignKeyFocus(form.tableName,form.boId)"
            >
              <el-option
                v-for="item in foreignKeyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.foreignKey }}</span>
          </el-form-item>
        </el-col>

        <el-col v-if="form.struType==='tree'&&form.tableName!==''" :span="12">
          <el-form-item label="父节点ID字段:" prop="pidKey" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.pidKey"
              :loading="loading"
              filterable
              placeholder="请选择"
              style="width:100%;"
              @focus="foreignKeyFocus(form.tableName,form.boId)"
            >
              <el-option
                v-for="item in foreignKeyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.foreignKey }}</span>
          </el-form-item>
        </el-col>

        <el-col v-if="form.struType==='tree'&&form.tableName!==''" :span="12">
          <el-form-item label="节点名称:" prop="key" label-width="120px">
            <el-select
              v-if="!readonly"
              v-model="form.key"
              :loading="loading"
              filterable
              placeholder="请选择"
              style="width:100%;"
              @focus="foreignKeyFocus(form.tableName,form.boId)"
            >
              <el-option
                v-for="item in foreignKeyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>{{ form.foreignKey }}</span>
          </el-form-item>
        </el-col>

        <el-col v-if="readonly" :span="12">
          <el-form-item label="创建人:" label-width="120px">
            <el-input v-if="!readonly" v-model="form.creator" />
            <el-tag v-else>{{ form.creator|optionsFilter(creatorOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col v-if="readonly" :span="12">
          <el-form-item label="创建时间:" label-width="120px">
            <el-input v-if="!readonly" v-model="form.createTime" />
            <span v-else>{{ form.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="fields-table">
          <fields-list
            ref="fieldsList"
            :is-fields="isFields"
            :readonly="readonly"
            @change="fieldsFormData"
          />
        </el-col>
      </el-row>
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
import { save, get, getTableList, getPtableList, getColumnList, getPcolumnList } from '@/api/platform/codegen/tableConfig'
import { queryPageList } from '@/api/platform/org/employee'
import { queryDataSource } from '@/api/platform/data/dataset'
import { relationOptions, struTypeOptions } from '../constants'
import { validateUpperCaseKey } from '@/utils/validate'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'
import IbpsBoDefSelector from '@/business/platform/bo/def/selector'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsType from '@/business/platform/cat/type/select'
import FieldsList from './fields-list'

export default {
  components: {
    IbpsDictionary,
    IbpsType,
    IbpsBoDefSelector,
    FieldsList
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
    id: String,
    title: String,
    datas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: true,
      loading: false,

      tableNameOptions: [],
      parentTableNameOptions: [],
      foreignKeyOptions: [],
      fromKeyOptions: [],
      relationOptions: relationOptions,
      struTypeOptions: struTypeOptions,

      formName: 'form',
      top: '0',
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      isParentTab: false,
      isFields: false,
      dsAliasOptions: [],
      defaultForm: {},
      creatorOptions: [],
      form: {
        tableSource: 'table',
        dsAlias: 'dataSource_default',
        boName: '',
        tableName: '',
        tableComment: '',
        className: '',
        layerTemplate: '',
        parentTableName: '',
        typeId: '',
        foreignKey: '',
        fromKey: '',
        relation: '',
        struType: 'list',
        idKey: '',
        pidKey: '',
        key: '',
        creator: this.$store.getters.userId
      },
      rules: {
        tableSource: [{ required: true, message: this.$t('validate.required') }],
        tableName: [{ required: true, message: this.$t('validate.required') }],
        tableComment: [{ required: true, message: this.$t('validate.required') }],
        className: [{ required: true, message: this.$t('validate.required') }, { validator: validateUpperCaseKey, trigger: 'blur' }],
        layerTemplate: [{ required: true, message: this.$t('validate.required') }],
        relation: [{ required: true, message: this.$t('validate.required') }],
        foreignKey: [{ required: true, message: this.$t('validate.required') }],
        fromKey: [{ required: true, message: this.$t('validate.required') }],
        idKey: [{ required: true, message: this.$t('validate.required') }],
        pidKey: [{ required: true, message: this.$t('validate.required') }],
        struType: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    form: {
      handler: function(val, oldVal) {
        if (val.tableName !== '') {
          this.formValidate()
        }
        this.show = val.tableSource === 'table'
        this.defaultForm = JSON.parse(JSON.stringify(val))
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
    this.getCreator()
    this.dataSource()
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
    initProp(target) {
      this.form.tableName = ''
      this.form.parentTableName = ''
      this.isParentTab = false
      this.$refs['fieldsList'].clear()
      target = ''
    },
    tableSourceValue(value) {
      this.show = value === 'table'
      const params = value === 'table' ? this.form.boId : this.form.dsAlias
      if (this.defaultForm.tableSource !== value) {
        this.initProp(params)
      }
      this.form.tableSource = value
    },
    getCreator() {
      queryPageList({ requestPage: { limit: 0, pageNo: 0 }, sorts: [] }).then(response => {
        const data = response.data['dataResult']
        this.creatorOptions = data.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      })
    },
    struTypeChange(value) {
      if (value === 'tree') {
        this.formValidate()
      }
    },
    // 数据源
    dataSource() {
      queryDataSource().then(response => {
        const data = response.data['dataResult']
        this.dsAliasOptions = data.map(item => {
          return {
            label: item.name,
            value: item.alias
          }
        })
      })
    },
    getTableNameData(tableSource, boId) {
      getTableList({
        boId: boId || '',
        dsAlias: this.form.dsAlias || '',
        tableSource: tableSource || 'table'
      }).then(response => {
        const data = response.data
        if (this.$utils.isNotEmpty(data)) {
          this.tableNameOptions = data.map(item => {
            return {
              label: item.text,
              value: item.id
            }
          })
        }
      })
    },
    tableNameChange(value) {
      this.form.tableComment = value
      this.form.parentTableName = ''
      this.isParentTab = false
      this.form.className = ''
      if (value === '') {
        this.$refs['fieldsList'].clear()
        return
      }
      this.$refs['fieldsList'].init(value)
    },
    parentTableNameFocus(tableSource, boId) {
      getPtableList({
        tableSource: tableSource || '',
        boId: boId || '',
        dsAlias: 'dataSource_default'
      }).then(response => {
        const data = response.data
        this.parentTableNameOptions = data.map(item => {
          return {
            label: item.text,
            value: item.id
          }
        })
      })
    },
    parentTableNameChange(value) {
      this.form.relation = ''
      this.form.foreignKey = ''
      this.form.fromKey = ''
      if (value !== '') {
        this.isParentTab = true
        return
      }
      this.isParentTab = false
    },
    // 外键
    foreignKeyFocus(tableName, boId) {
      getColumnList({
        tableName: tableName,
        boId: boId,
        dsAlias: 'dataSource_default'
      }).then(response => {
        const data = response.data
        this.foreignKeyOptions = data.map(item => {
          return {
            label: item.text,
            value: item.id
          }
        })
      })
    },
    // 来自属性
    fromKeyFocus(tableName, boId) {
      getPcolumnList({
        tableName: tableName,
        boId: boId,
        dsAlias: 'dataSource_default'
      }).then(response => {
        const data = response.data
        this.fromKeyOptions = data.map(item => {
          return {
            label: item.text,
            value: item.id
          }
        })
      })
    },
    fieldsFormData(data) {
      this.form.fieldConfigPoList = data
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
      const data = JSON.parse(JSON.stringify(this.form))
      const tableName = this.datas.findIndex(item => item.tableName === data.tableName)
      if (tableName > -1 && this.formId === '') {
        this.$message.closeAll()
        this.$message({
          message: '表配置【' + data.tableName + '】已存在',
          type: 'warning'
        })
        return
      }
      data.createTime = Date.parse(data.createTime)
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.isFields = false
      this.show = true
      this.$emit('close', false)
      this.$refs['fieldsList'].clear()
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.top = '0'
        this.form.createTime = ''
        this.show = true
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        if (this.readonly) {
          this.top = '15vh'
        } else {
          this.top = '0'
        }
        const data = response.data
        this.form = data
        this.form.createTime = fecha.format(response.data.createTime, 'yyyy-MM-dd HH:mm:ss')
        this.show = this.form.tableSource !== 'bo'
        this.formValidate()
        this.$refs['fieldsList'].rootData(this.form.fieldConfigPoList)
        this.$nextTick(() => {
          this.dialogLoading = false
        })
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.tableConfigDialog{
  .tableConfigForm{
    .el-tree-select{
      line-height: 32px;
    }
    .el-form-item{
      max-height: 29px;
    }
    .ibps-selector .selector-list{
      min-height: 24px;
    }
  }
  .el-dialog__body{
    padding: 40px 20px;
    height:80%;
  }
  .el-dialog__footer{
    padding:10px 20px 10px;
  }
}
</style>
