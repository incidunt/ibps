<template>
  <ibps-container
    ref="dashboardContainer"
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    :scroll-delay="scrollDelay"
    type="full"
    class="ibps-desktop-page"
    @scroll="({x, y}) => { scrollTop = y }"
  >
    <ibps-grid-layout
      v-if="layout && layout.length >0"
      :layout.sync="layout"
      :col-num="colNum"
      :row-height="rowHeight"
      :is-draggable="isDraggable"
      :is-resizable="isResizable"
      :is-mirrored="isMirrored"
      :vertical-compact="verticalCompact"
      :margin="margin"
      :use-css-transforms="useCssTransforms"
    >
      <ibps-grid-item
        v-for="(item,index) in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <component
          :is="'ibps-desktop-'+item.alias"
          v-if="hasComponent(item.alias)"
          :id="item.i"
          :ref="'ibpsDesktop'+index"
          :alias="item.alias"
          :height="getHeight(item.h)"
          @action-event="(command,data)=> handleActionEvent(command,data,index)"
        />
      </ibps-grid-item>
    </ibps-grid-layout>
    <el-alert
      v-else-if="!loading"
      :closable="false"
      type="warning"
      show-icon
      style="height:50px"
    >
      <span slot="title">
        未设置个人桌面布局，可以通过“<a href="javascript:void(0)" @click="goMyLayout">个人办公-》个人桌面布局</a>”进行设置
      </span>
    </el-alert>
    <ibps-back-to-top
      :visibility-height="150"
      :scroll-top="scrollTop"
      transition-name="fade"
      @scrollToTop="scrollToTop"
    />
    <preview
      :id="id"
      :visible="dialogPreviewVisible"
      title="全屏预览"
      screen
      @close="visible => dialogPreviewVisible = visible"
    />
    <bpmn-formrender
      :visible="bpmnFormrenderDialogVisible"
      :def-id="defId"
      :task-id="taskId"
      :instance-id="instanceId"
      @close="visible => bpmnFormrenderDialogVisible = visible"
      @callback="handleFlowCallback"
    />

    <ibps-news-dialog
      :id="newsEditId"
      title="公告栏目明细"
      :visible="ibpsNewsDialogVisible"
      :readonly="true"
      @close="visible => ibpsNewsDialogVisible = visible"
    />

    <ibps-message-dialog
      :id="messageEditId"
      title="消息明细"
      :readonly="true"
      :visible="ibpsMessageDialogVisible"
      @close="visible => ibpsMessageDialogVisible = visible"
    />
  </ibps-container>
</template>

<script>

import { getMyDesktop } from '@/api/platform/desktop/myLayout'
import { initColumn, isInit, getComponents } from './components'
//  网格布局组件
import { GridLayout, GridItem } from 'vue-grid-layout'
import IbpsBackToTop from '@/components/ibps-back-to-top'
import Preview from '@/views/platform/desktop/column/preview'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

import IbpsNewsDialog from '@/views/platform/system/news/detail'
import IbpsMessageDialog from '@/views/platform/message/inner/detail/dialog'

export default {
  components: {
    'ibps-news-dialog': IbpsNewsDialog,
    'ibps-message-dialog': IbpsMessageDialog,
    IbpsBackToTop,
    Preview,
    BpmnFormrender,
    'ibps-grid-layout': GridLayout,
    'ibps-grid-item': GridItem
  },
  data() {
    return {
      layout: null,
      colNum: 24,
      rowHeight: 30,
      isDraggable: false,
      isResizable: false,
      isMirrored: false,
      verticalCompact: true,
      margin: [15, 15],
      useCssTransforms: true,

      ibpsNewsDialogVisible: false,
      newsEditId: '',

      ibpsMessageDialogVisible: false,
      messageEditId: '',

      scrollDelay: 0,
      scrollTop: 0,
      loading: false,
      id: '',
      dialogPreviewVisible: false, // 预览
      defaultData: [],

      bpmnFormrenderDialogVisible: false, // 流程
      defId: '',
      taskId: '',
      instanceId: '',
      layoutIndex: '',
      initInterval: null
    }
  },
  computed: {
    systemAlias() {
      return this.$store.getters.system ? this.$store.getters.system.alias : ''
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    scrollToTop() {
      this.$refs.dashboardContainer.scrollToTop()
    },
    initData() {
      this.initInterval = setInterval(() => {
        if (this.$utils.isNotEmpty(this.systemAlias)) {
          this.fetchData()
          clearInterval(this.initInterval)
        }
      }, 100)
    },
    // 抓取数据
    fetchData() {
      initColumn(this.systemAlias)
      this.loading = true
      const interval = setInterval(() => {
        if (isInit()) {
          getMyDesktop({
            systemAlias: this.systemAlias
          }).then(response => {
            try {
              this.layout = this.$utils.parseData(response.data)
              this.defaultData = this.$utils.parseData(response.data)
            } catch (error) {
              console.error(error)
              this.layout = []
              this.defaultData = []
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
          clearInterval(interval)
        }
      }, 100)
    },
    getHeight(h) {
      return (h - 1) * (this.rowHeight + this.margin[1]) + this.margin[1]
    },
    hasComponent(alias) {
      const name = 'ibps-desktop-' + alias
      return getComponents().includes(name)
    },
    resizedHandler(i, newH, newW, newHPx, newWPx) {
      if (!this.layout) return
      this.layout.layout.find((n) => {
        if (i === n.i) {
          n.widthPx = this.getWidth(n.w)
          n.heightPx = this.getHeight(n.h)
        }
      })
    },
    goMyLayout() {
      this.$router.push({
        path: '/officeDesk/desktopMyLayout'
      })
    },
    handleActionEvent(command, params, index) {
      this.layoutIndex = index
      switch (command) {
        case 'fullscreen':
          this.handleFullscreen(params.id)
          break
        case 'collapse':
        case 'expansion':
          this.handleCollapseExpansion(index, command === 'collapse')
          break
        case 'flow':
          this.handleFlow(params)
          break
        case 'approve':
          this.handleApprove(params)
          break
        case 'unRead':
          this.handleUnreadMessage(params)
          break

        default:
          break
      }
    },
    /**
     * 全屏展示切换
     */
    handleFullscreen(id) {
      this.dialogPreviewVisible = true
      this.id = id
    },
    // 处理收缩/展开
    handleCollapseExpansion(index, isCollapse) {
      this.layout[index].h = isCollapse ? 2 : this.defaultData[index].h
      this.layout.push({ i: '0' })
      const deleteIndex = this.layout.findIndex(item => item.i === '0')
      this.layout.splice(deleteIndex, 1)
    },

    handleApprove(id) {
      this.ibpsNewsDialogVisible = true
      this.newsEditId = id
    },

    handleUnreadMessage(id) {
      this.ibpsMessageDialogVisible = true
      this.messageEditId = id
    },

    handleFlow(params) {
      this.defId = params.defId || null
      this.taskId = params.taskId || null
      this.instanceId = params.instanceId || null

      this.instanceId = params.instanceId || null
      this.instanceId = params.instanceId || null

      this.bpmnFormrenderDialogVisible = true
    },
    handleFlowCallback() {
      // 刷新数据
      this.$refs['ibpsDesktop' + this.layoutIndex][0].refreshData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/public.scss';
.ibps-desktop-page {
  .ibps-grid-item,
  .el-card{
    height: 100%;
  }
  .vue-grid-layout {
    border-radius: 4px;
    margin: -10px;
    .page_card {
      height: 100%;
      @extend %unable-select;
    }
    .vue-resizable-handle {
      opacity: .3;
      &:hover{
        opacity: 1;
      }
    }
  }
}
</style>

<style lang="scss" >
.ibps-desktop-dashboard{
  .item {
    position: relative;
    margin: 12px;
    padding: 12px;
    height: 90px;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
    color: #fff;
  }
  .item-header {
    position: relative;
    & > p {
      margin: 0px;
      font-size: 14px;
    }
    & > span {
      position: absolute;
      right: 0px;
      top: 0px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
  .item-body {
    & > h2 {
      margin: 0;
      font-size: 32px;
      line-height: 60px;
    }
  }
  // .item-footer {
  //   line-height: 16px;
  //   & > span {
  //     font-size: 10px;
  //   }
  //   & > p {
  //     margin: 0px;
  //     font-size: 12px;
  //   }
  // }
  .item-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 80px;
    height: 80px;
    bottom: -35px;
    right: 50px;
    border: 2px solid #fff;
    border-radius: 100%;
    font-size: 48px;
    transform: rotate(-40deg);
    opacity: 0.1;
  }
}
</style>

