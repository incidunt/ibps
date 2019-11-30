<template>
  <el-card
    :style="{height:getDashboardHeight(),width:'100%'}"
    class="ibps-desktop-dashboard"
  >
    <el-row ref="row" :gutter="12">
      <template v-if="data && data.length >0">
        <el-col v-for="item in data" :key="item.id" :span="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div :class="'bg-'+item.color" class="item" @click="openPlate(item.url)">
            <div class="item-header">
              <p>{{ item.dataContent }}</p>
            </div>
            <div class="item-body">
              <h2><count-to :end-val="parseInt(item.dataText,10)" :duration="4000" /></h2>
            </div>
            <p class="item-tip">{{ item.dataContent |firstStr }}</p>
          </div>
        </el-col>
      </template>
      <template v-else>
        <el-col v-for="(item,i) in 8" :key="i" :span="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="item bg-grey-steel">
            <div class="item-header">&nbsp;</div>
            <div class="item-body">
              <h2>&nbsp;</h2>
            </div>
            <p class="item-tip">&nbsp;</p>
          </div>
        </el-col>
      </template>
    </el-row>
  </el-card>

</template>
