<template>
  <ibps-container
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    class="page"
  >
    <template slot="header">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
    </template>
    <el-form ref="resourcesForm" :model="resources" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="资源名称:" prop="name">
        <el-input v-model="resources.name" v-pinyin="{vm:resources,key:'alias'}" autocomplete="off" />
      </el-form-item>
      <el-form-item label="资源别名:" prop="alias">
        <el-input v-model="resources.alias" autocomplete="off" />
      </el-form-item>
      <el-form-item label="图标:" prop="icon">
        <ibps-icon-select v-model="resources.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item label="菜单资源:" prop="resourceType">
        <el-select v-model="resources.resourceType" placeholder="请选择">
          <el-option
            v-for="item in resourceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="默认URL:" prop="defaultUrl">
        <el-input v-model="resources.defaultUrl" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否目录:" prop="isFolder">
        <el-switch
          v-model="resources.isFolder"
          active-value="Y"
          inactive-value="N"
        />
      </el-form-item>
      <el-form-item label="显示到菜单:" prop="displayInMenu">
        <el-switch
          v-model="resources.displayInMenu"
          active-value="Y"
          inactive-value="N"
        />
      </el-form-item>
      <el-form-item label="是否展开:" prop="isOpen">
        <el-switch
          v-model="resources.isOpen"
          active-value="Y"
          inactive-value="N"
        />
      </el-form-item>
      <el-form-item label="同层顺序:" prop="sn">
        <el-input v-model="resources.sn" type="number" />
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input v-model="resources.des" type="textarea" row="4" />
      </el-form-item>
    </el-form>
  </ibps-container>
</template>
<script>
import { save } from '@/api/platform/auth/resources'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'
import { resourceTypeOptions } from '../constants'

export default {
  props: {
    url: [String, Number],
    parentId: [String, Number],
    systemId: [String, Number],
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formName: 'resourcesForm',
      formLabelWidth: '120px',
      clientHeight: '',
      defaultForm: {},
      resourceTypeOptions: resourceTypeOptions,
      resources: {
        id: '',
        parentId: this.parentId,
        name: '',
        alias: '',
        icon: 'cog',
        resourceType: 'menu',
        defaultUrl: this.url,
        isFolder: 'Y',
        displayInMenu: 'Y',
        isOpen: 'N',
        sn: 1,
        desc: '',
        systemId: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        alias: [{ required: true, validator: validateKey }],
        icon: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  watch: {
    resources: {
      handler: function(val, oldVal) {
        console.log(val)
      },
      deep: true
    },
    parentId: {
      handler: function(val, oldVal) {
        this.resources.parentId = val
      },
      immediate: true
    },
    systemId: {
      handler: function(val, oldVal) {
        this.resources.systemId = val
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.resources))
  },
  methods: {
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (this.$utils.isEmpty(this.parentId)) {
            this.$message.error('请在左树，选择一个父节点!')
            return
          }
          this.saveData()
          this.$emit('close')
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      this.resources.systemId = this.systemId
      console.log(this.resources)
      save(this.resources).then(response => {
        this.$emit('callback', this)
        if (this.$utils.isEmpty(this.parentId)) {
          this.$refs[this.formName].resetFields()
        }
        this.$message({
          message: '保存菜单成功',
          type: 'success'
        })
      }).catch((err) => {
        console.info(err)
      })
    },
    // 表单验证
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    resetFields() {
      this.$refs[this.formName].resetFields()
    }
  }
}
</script>
