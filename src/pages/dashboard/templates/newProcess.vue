<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}">
      <el-scrollbar
        style="height: 100%;width:100%;"
      >
        <ibps-list-group v-if="data && data.length >0">
          <ibps-list
            v-for="(d,i) in data"
            :key="i"
            :extra="`版本：${d.version}`"
            :label="d.creator"
            @click.native="handleFlowClick({defId:d.id})"
          >
            <el-link type="primary" :underline="false">{{ d.name }}</el-link>
          </ibps-list>
        </ibps-list-group>
        <ibps-empty
          v-else
        />
      </el-scrollbar>
    </div>
  </el-card>

</template>
