<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{key:'refresh'},{key:'fullscreen'},{key:'collapse'}]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}" class="text item">
      <v-chart :options="data" :style="{height:getHeight(),width:'100%'}" autoresize />
    </div>
  </el-card>
</template>
