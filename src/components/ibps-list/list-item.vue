<template>
  <div class="ibps-list-item">
    <!-- <div class="ibps-list-icon">
      <slot name="icon" />
    </div>
    <div class="ibps-list-main">
      <div class="ibps-list-title"><slot>{{ title }}</slot></div>
      <div class="ibps-list-label"><slot name="label">{{ label }}</slot></div>
    </div>
    <div class="ibps-list-footer">
      <span class="ibps-list-extra"><slot name="extra">{{ extra }}</slot></span>
    </div>
  </div> -->
    <el-row>
      <div class="ibps-list-col-icon"><slot name="icon" /></div>
      <el-col :span="15" class="ibps-list-col-main">
        <div>
          <slot><p>{{ title }}</p></slot>
          <slot name="label"><p>{{ label }}</p></slot>
        </div>
      </el-col>
      <div>
        <div class="ibps-list-col-footer">
          <p>
            <slot name="extra">{{ extra }}</slot>
          </p>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    extra: {
      type: String,
      default: ''
    }
  }
}
</script>
