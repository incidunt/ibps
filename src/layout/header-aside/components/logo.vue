<template>
  <div>
    <!--  svg 方式 -->
    <div v-if="system.logoType ==='svg'" class="logo-group-icon">
      <ibps-icon-svg :size="logoSize" :name="system.logo||'logo'" :title="system.name" />
      <div v-if="!asideCollapse" class="logo-title ibps-ellipsis" style="width:140px;">>{{ system.name }}</div>
      <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
    </div>
    <!--  icon 方式  -->
    <div v-else class="logo-group-icon">
      <ibps-icon :name="system.logo||'logo'" :size="logoSize" :title="system.name" />
      <div v-if="!asideCollapse" class="logo-title ibps-ellipsis" style="width:140px;">{{ system.name }}</div>
      <i v-if="subsystemList && subsystemList.length >1 " class="el-icon-arrow-down el-icon--right" />
    </div>
    <!-- 图片方式
           <img v-if="asideCollapse" :src="logoIconOnly">
          <img v-else :src="logoIconAll"> -->
  </div>
</template>
<script>
export default {
  props: {
    system: Object,
    asideCollapse: Boolean,
    subsystemList: Array
  },
  computed: {
    logoSize() {
      return this.asideCollapse ? 32 : 26
    }
  }
}
</script>

