<template>
  <div class="panel-default tree-display-column">
    <!-- 业务数据模板的树形显示字段 -->
    <div class="panel-heading">显示字段</div>
    <el-form :model="formData" label-position="top">
      <el-form-item label="ID字段：">
        <el-select v-model="formData.id_key">
          <el-option
            v-for="item in fields"
            :key="item.name"
            :value="item.name"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="父ID字段：">
        <el-select v-model="formData.pid_key">
          <el-option
            v-for="item in fields"
            :key="item.name"
            :value="item.name"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="显示字段：">
        <el-select v-model="formData.name_key">
          <el-option
            v-for="item in fields"
            :key="item.name"
            :value="item.name"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="根节点的父ID值">
        <el-input
          v-model="formData.root_pid"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="虚拟根节点显示值">
        <el-input
          v-model="formData.root_label"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="formData.is_script">父类值来源是否groovy脚本</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return { }
      }
    },
    fields: {// 字段
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  watch: {
    watch: {
      data: {
        handler(val) {
          this.formData = val
        },
        immediate: true
      },
      formData: {
        handler(val) {
          this.$emit('update:data', val)
        },
        deep: true
      }
    }
  }
}
</script>

<style lang="scss">
.tree-display-column {
  .el-form {
    margin:10px 0 0 20px;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item__label {
    line-height: 12px;
  }
}
</style>

