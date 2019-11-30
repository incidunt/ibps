<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog"
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
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form}" />
        <span v-else>{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="业务主键:" prop="key">
        <el-input v-if="!readonly" v-model="form.key" :disabled="formId!==''" />
        <span v-else>{{ form.key }}</span>
      </el-form-item>
      <el-form-item label="实体表名:" prop="entityType">
        <el-input v-if="!readonly" v-model="form.entityType" />
        <span v-else>{{ form.entityType }}</span>
      </el-form-item>
      <el-form-item label="实体ID的KEY:" prop="entityIdKey">
        <el-input v-if="!readonly" v-model.number="form.entityIdKey" />
        <span v-else>{{ form.entityIdKey }}</span>
        <span v-if="!readonly">如果不填写，则默认<span style="color:red;">ID_</span>。</span>
      </el-form-item>
      <el-form-item label="拥有的权限:" prop="ownRights">
        <el-select
          v-if="!readonly"
          v-model="form.ownRights"
          placeholder="所有权限"
          multiple
          clearable
          style="width:100%;"
        >
          <el-option
            v-for="item in ownRightsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span v-else class="ibps-tag-list">
          <span v-if="form.ownRights.length >0">
            <el-tag
              v-for="(item,i) in form.ownRights"

              :key="i"
              :type="item|optionsFilter(ownRightsOptions,'type')"
            >
              {{ item|optionsFilter(ownRightsOptions,'label') }}
            </el-tag>
          </span>
          <span v-else><el-tag type="info"> 所有权限</el-tag></span>
        </span>

      </el-form-item>
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
import { save, get } from '@/api/platform/rights/config'
import { ownRightsOptions } from './constants'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      ownRightsOptions: ownRightsOptions,
      defaultForm: {},
      form: {
        name: '',
        key: '',
        entityType: '',
        entityIdKey: '',
        ownRights: []
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, validator: validateKey }],
        entityType: [{ required: true, message: this.$t('validate.required') }],
        entityIdKey: [{ validator: validateKey, trigger: 'blur' }]
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
      data.ownRights = this.form.ownRights.join(',')
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
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        rightsConfigId: this.formId
      }).then(response => {
        this.dialogLoading = false
        this.form = response.data
        this.form.ownRights = this.$utils.isNotEmpty(this.form.ownRights) ? this.form.ownRights.split(',') : []
        this.formValidate()
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
