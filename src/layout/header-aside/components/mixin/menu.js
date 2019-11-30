import Utils from '@/utils/util'

export default {
  methods: {
    handleMenuSelect(index, indexPath, item) {
      if (item && item.$attrs.type && item.$attrs.type === 'header') {
        // 设置左侧的菜单
        return this.$store.dispatch('ibps/menu/activeHeaderSet', { activeHeader: index, vm: this })
      }
      if (/^ibps-menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.closeAll()
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        Utils.open(index)
      } else {
        this.$router.push({
          path: index
        })
      }
    }
  }
}
