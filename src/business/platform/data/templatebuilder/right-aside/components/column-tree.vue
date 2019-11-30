<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span>{{ title }}</span>
    </div>
    <div class="panel-body">
      <el-form label-width="120px" size="mini">
        <el-form-item label="显示名称">
          <el-input placeholder="显示名称" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    }
  }
}
</script>
