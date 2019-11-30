<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <ibps-icon name="commenting" />
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-scrollbar
        style="height: 100%;width:100%;"
      >
        <ibps-list-group v-if="data&&data.length >0">
          <ibps-list v-for="(d,i) in data" :key="i" @click.native="handleApprove(d.id)">
            <div slot="icon"><ibps-icon name="bolt" style="color:#5cb85c;margin: 5px 0 0 5px;" /></div>
            <el-link type="primary" :underline="false">{{ d.title }}</el-link>
            <div slot="extra">
              <ibps-icon name="dot-circle-o" style="color:#36c6d3" />{{ d.userName }}
            </div>
          </ibps-list>
        </ibps-list-group>
        <el-alert
          v-else
          :closable="false"
          title="当前没有记录。"
          type="warning"
        />
      </el-scrollbar>
    </div>
  </el-card>
</template>
