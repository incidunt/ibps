<template>
  <el-card :style="{height:cardHeight}" class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
      <ibps-desktop-toolbar ref="toolbar" :actions="[{key:'refresh'},{key:'fullscreen'},{key:'collapse'}]" @action-event="handleActionEvent" />
    </div>
    <div ref="body" :style="{height:showHeight,width:'100%'}" class="text item">
      <el-table :data="data" :height="getHeight()" stripe>
        <el-table-column label="订单号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.order_no }}
          </template>
        </el-table-column>
        <el-table-column label="价格" width="195" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>Q
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | optionsFilter"> {{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
