<template>
  <ibps-container type="full" class="page">
    <div style="padding: 10px;">
      <el-card body-style="padding:0;" style="width: 300px;">
        <div slot="header" class="clearfix">
          <span>选项</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <ibps-list-group>
          <ibps-list title="Only show titles" />
          <ibps-list title="Display label content" label="label content" />
          <ibps-list title="Display right content" extra="details" />
          <ibps-list title="Link" extra="details" to="/components/button" />
          <ibps-list title="Open link in new window" to="/components/button" target="_blank" />
          <ibps-list title="Disabled" disabled />
          <ibps-list title="Selected" selected />
          <ibps-list title="With Badge" to="/components/badge">
            <el-badge slot="extra" :value="10" />
          </ibps-list>
          <ibps-list title="With Switch">
            <el-switch slot="extra" v-model="switchValue" />
          </ibps-list>
          <ibps-list title="Avatar">
            <el-avatar slot="icon" icon="ibps-icon-users" shape="square" size="small" style="background-color: #87d068" />
          </ibps-list>
        </ibps-list-group>
      </el-card>
    </div>
  </ibps-container>
</template>

<script>

export default {
  data() {
    return {
      switchValue: ''
    }
  }
}
</script>

