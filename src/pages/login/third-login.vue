<template>
  <div class="third-container">
    <vue-qr
      :logo-src="qqLogo"
      :title="$t('login.qq')"
      :size="150"
      :text="qqCode"
      class="third-icon qq"
    />
    <vue-qr
      :logo-src="wechatLogo"
      :title="$t('login.wechat')"
      :size="150"
      :text="qqCode"
      class="third-icon wechat"
    />
  </div>
</template>

<script>
import VueQr from 'vue-qr'

export default {
  name: 'thirdlogin',
  components: {
    VueQr
  },
  data() {
    return {
      qqLogo: '',
      qqCode: 'http://www.bpmhome.cn',
      wechatLogo: '',
      wechatCode: 'http://www.bpmhome.cn'
    }
  },
  computed: {},
  created() { },
  mounted() { },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.third-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 250px;
  & > .third-icon {
    width: 150px;
    height: 150px;
    line-height: 100%;
    background-color: #fff;
    border-style: solid;
    border-width: 2px;
    border-radius: 5px;
    text-align: center;
  }
  & > .third-icon.qq {
    border-color: #409eff;
  }
  & > .third-icon.wechat {
    border-color: #67c23a;
  }
}
</style>
