<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div>
      <div class="tabs-title">
        <ibps-icon name="commenting" />
        <span>{{ title }}</span>
      </div>
      <div class="tabs-toolbar">
        <ibps-desktop-toolbar ref="toolbar" :actions="[{ key: 'refresh' }, { key: 'more' }, { key: 'fullscreen' }, { key: 'collapse' }]" @action-event="handleActionEvent" />
      </div>
      <div ref="body">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="内部" name="innerMessage">
            <div ref="tabsContent" :style="{height:showHeight,width:'100%'}" class="tabs-content">
              <el-scrollbar
                style="height: 100%;width:100%;"
              >
                <ibps-list-group v-if="data && data.normal && data.normal.length >0">
                  <ibps-list v-for="(d,i) in data.normal" :key="i" :label="`${d.createTime}`">
                    <div slot="icon"><ibps-icon name="bolt" style="color:#5cb85c;margin:5px 0 0 5px;" /></div>
                    <el-link type="primary" :underline="false" @click="handleUnreadMessage(d.id)">{{ d.subject }}</el-link>
                    <div slot="extra">
                      <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
                      {{ d.messageType | filterStatus('unreadMessage') }}
                    </div>
                  </ibps-list>
                </ibps-list-group>
                <el-alert
                  v-else
                  :closable="false"
                  title="当前没有记录。"
                  type="warning"
                />
              </el-scrollbar></div>
          </el-tab-pane>
          <el-tab-pane label="外部" name="system">
            <div ref="tabsContent" :style="{height:showHeight,width:'100%'}" class="tabs-content">
              <el-scrollbar
                style="height: 100%;width:100%;"
              >
                <ibps-list-group v-if="data && data.system && data.system.length >0">
                  <ibps-list v-for="(d,i) in data.system" :key="i" :label="`${d.createTime}`">
                    <div slot="icon"><ibps-icon name="bolt" style="color:#5cb85c;margin:5px 0 0 5px;" /></div>
                    <el-link type="primary" :underline="false" @click="handleUnreadMessage(d.id)">{{ d.subject }}</el-link>
                    <div slot="extra">
                      <ibps-icon name="dot-circle-o" style="color:#36c6d3" />
                      {{ d.messageType | filterStatus('unreadMessage') }}
                    </div>
                  </ibps-list>
                </ibps-list-group>
                <el-alert
                  v-else
                  :closable="false"
                  title="当前没有记录。"
                  type="warning"
                />
              </el-scrollbar></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>
</template>
