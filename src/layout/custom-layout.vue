<template>
  <div
    :style="styleLayoutMainGroup"
    :class="{grayMode: grayActive}"
  >
    <!-- 半透明遮罩 -->
    <div class="ibps-layout-header-aside-mask" />
    <!-- 主体内容 -->
    <div class="ibps-layout-header-aside-content" flex="dir:top">
      <div class="ibps-theme-container" flex-box="1" flex>
        <div class="ibps-theme-container-main" flex-box="1" flex>
          <div class="ibps-theme-container-main-body" flex-box="1">
            <transition :name="transitionActive ? 'fade-transverse' : ''">
              <keep-alive>
                <router-view />
              </keep-alive>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('ibps', {
      grayActive: state => state.gray.active,
      keepAlive: state => state.page.keepAlive,
      transitionActive: state => state.transition.active
    })
  },
  methods: {
    /**
     * @description 最外层容器的背景图片样式
     */
    styleLayoutMainGroup() {
      return {
        ...this.themeActiveSetting.backgroundImage ? {
          backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')`
        } : {}
      }
    }
  }
}
</script>

