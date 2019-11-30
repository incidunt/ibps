<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{key:'refresh'},{key:'fullscreen'},{key:'collapse'}]" @action-event="handleActionEvent" />
    </div>
    <transition name="draw" mode="in-out" appear>
      <div ref="body" :style="{height:showHeight,width:'100%'}" class="text item">
        <v-full-calendar :events="getFullCalendarEvents(data)" :config="getFullCalendarConfig()" :style="{height:getHeight(),width:'100%'}" />
      </div>
    </transition>
  </el-card>
</template>
