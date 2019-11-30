<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="15vh"
    class="dataset-dialog"
    width="70%"
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
    >
      <el-row>
        <el-col :span="span">
          <el-form-item label="名称:" prop="name">
            <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form}" />
            <span v-else>{{ form.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="数据集key:" prop="key">
            <el-input v-if="!readonly" v-model="form.key" :disabled="disabled" />
            <span v-else>{{ form.key }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="!readonly" :span="span">
          <el-form-item key="typeId" label="分类:" prop="typeId">
            <ibps-type
              v-model="form.typeId"
              :readonly="readonly"
              category-key="DATASET_TYPE"
              class="type"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="外部数据:" prop="external">
            <el-switch
              v-if="!readonly"
              v-model="form.external"
              :active-value="'Y'"
              :inactive-value="'N'"
              active-text="是"
              inactive-text="否"
            />
            <el-tag v-else :type="form.external|optionsFilter(externalOptions,'type')">
              {{ form.external|optionsFilter(externalOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col> -->
        <el-col v-if="form.external==='Y'" :span="12" style="height:50px;">
          <el-form-item label="数据源:" prop="dsAlias">
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
            <el-tag v-else :type="form.dsAlias|optionsFilter(externalOptions,'type')">
              {{ form.dsAlias|optionsFilter(externalOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="类型:" prop="type">
            <el-row>
              <el-col :span="5">
                <el-select
                  v-if="!readonly"
                  v-model="form.type"
                  placeholder="请选择"
                  style="width:100%;"
                  @change="loadDataTableOrView"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tag v-else :type="form.type|optionsFilter(typeOptions,'type')">{{ form.type|optionsFilter(typeOptions,'label') }}</el-tag>
              </el-col>
              <el-col :span="19">
                <el-form-item v-if="!readonly" prop="from" class="from">
                  <el-select v-model="form.from" filterable placeholder="请选择或者搜索关键字后选择" style="width:100%">
                    <el-option
                      v-for="item in fromOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <template v-if="readonly">
          <el-col :span="span">
            <el-form-item key="from" label="来源:">
              <span>{{ form.from }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="isTree" label="是否树型:">
              <span>{{ form.isTree|optionsFilter(externalOptions,'label') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="createBy" label="创建人:">
              <!-- <span>{{ form.createBy }}</span> -->
              <ibps-employee-selector
                :value="form.createBy"
                :disabled="true"
                class="dataset-readonly-selector"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="createTime" label="创建时间:">
              <span>{{ form.createTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="updateBy" label="更新人:">
              <!-- <span>{{ form.updateBy }}</span> -->
              <ibps-employee-selector
                :value="form.updateBy"
                :disabled="true"
                class="dataset-readonly-selector"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="updateTime" label="更新时间:">
              <span>{{ form.updateTime }}</span>
            </el-form-item>
          </el-col>
        </template>
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
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import { save, get, getTableOrViewList } from '@/api/platform/data/dataset'
import { typeOptions, externalOptions, dsAliasOptions } from './constants'
import { validateKey } from '@/utils/validate'

import IbpsType from '@/business/platform/cat/type/select'
import ActionUtils from '@/utils/action'

export default {
  components: {
    IbpsType,
    IbpsEmployeeSelector
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
    typeId: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      span: 24,
      dialogVisible: this.visible,
      dialogLoading: false,
      dsAlias: false,
      disabled: false,
      typeOptions: typeOptions,
      externalOptions: externalOptions,
      dsAliasOptions: dsAliasOptions,
      fromOptions: [],
      defaultForm: {},
      form: {
        key: '',
        name: '',
        typeId: '',
        external: 'N',
        type: 'table',
        isTree: 'N',
        from: '',
        dsAlias: 'dataSource_default'
      },
      rules: {
        key: [{ required: true, validator: validateKey }],
        name: [{ required: true, message: this.$t('validate.required') }],
        from: [{ required: true, message: this.$t('validate.required') }],
        external: [{ required: true, message: this.$t('validate.required') }],
        type: [{ required: true, message: this.$t('validate.required') }]
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
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
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
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          } else {
            this.formValidate()
            this.loadDataTableOrView('table')
          }
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
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
    // 子集Key数据获取
    loadDataTableOrView(type = 'table') {
      this.form.from = ''
      this.fromOptions = []
      getTableOrViewList({
        from: '',
        external: this.form.external,
        dsAlias: this.form.dsAlias || 'dataSource_default',
        type: type
      }).then(response => {
        const data = response.data
        this.fromOptions = data.map(item => {
          return {
            value: item.id,
            label: item.text + '【' + item.comment + '】'
          }
        })
      }).catch(() => {})
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.disabled = false
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.form.typeId = this.typeId
        this.span = 24
        this.loadDataTableOrView()
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        datasetId: this.formId
      }).then(response => {
        this.span = 24
        if (this.readonly) {
          this.span = 12
          this.dsAlias = false
        }
        this.loadDataTableOrView(response.data.type)
        this.disabled = true
        this.form = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.dataset-dialog{
  .el-tree-select{
    line-height: 28px;
  }
  .dataset-readonly-selector{
    .is-disabled{
      input{
        display:none;
      }
    }
  }
}
</style>
