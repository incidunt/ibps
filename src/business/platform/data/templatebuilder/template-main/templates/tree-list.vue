<template>
  <div>
    <div style="color:red;">tree-list 左树右表</div>
    <ibps-tree
      ref="tree"
      :width="width"
      :height="height"
      :data="data"
      :options="options"
      :toolbars="toolbars"
      :contextmenus="contextmenus"
    />
    <ibps-crud
      :data="data"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :height="350"
      :style="{
        width:width+'px'
      }"
    />
  </div>
</template>

<script>
export default {
  props: {
    template: [Object, Array]
  },
  data() {
    return {
      width: document.body.clientWidth - 570,
      data: [
        { ke_hu_bian_hao_: '编号1', ke_hu_lei_bie_: '类别1', ke_hu_ming_chen_: '名称1', suo_shu_qu_yu_: '区域1', kai_hu_yin_heng_: '银行1', lian_xi_ren_: '联系人1', shou_ji_hao_ma_: 1234567 },
        { ke_hu_bian_hao_: '编号2', ke_hu_lei_bie_: '类别2', ke_hu_ming_chen_: '名称2', suo_shu_qu_yu_: '区域2', kai_hu_yin_heng_: '银行2', lian_xi_ren_: '联系人2', shou_ji_hao_ma_: 7654321 },
        { ke_hu_bian_hao_: '编号3', ke_hu_lei_bie_: '类别3', ke_hu_ming_chen_: '名称3', suo_shu_qu_yu_: '区域3', kai_hu_yin_heng_: '银行3', lian_xi_ren_: '联系人3', shou_ji_hao_ma_: 1334567 }
      ],
      pkKey: 'id',
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'edit' },
          { key: 'remove' }
        ],
        columns: [],
        searchForm: null
      },
      pagination: {
        page: 1,
        limit: 20
      },
      height: 200,
      toolbars: [],
      contextmenus: [],
      options: {
        emptyText: '未设置显示字段'
      }
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        if (!this.template[0]) { return }
        const toolbarButtons = this.template[0].buttons ? this.template[0].buttons.function_buttons || [] : []
        // 工具栏
        const toolbars = []
        toolbarButtons.forEach(button => {
          toolbars.push({
            key: button.button_type,
            label: button.label
          })
        })

        // 显示字段
        const columns = []
        const displayColumns = this.template[0].display_columns || []
        displayColumns.forEach(column => {
          columns.push({
            prop: column.name,
            label: column.label
          })
        })

        // 查询字段
        const searchForms = []
        const queryColumns = this.template[0].query_columns || []
        queryColumns.forEach(column => {
          searchForms.push({
            prop: column.name,
            label: column.label
          })
        })

        this.listConfig = {
          toolbars: toolbars,
          columns: columns,
          searchForm: searchForms.length > 0 ? {
            forms: searchForms
          } : null
        }
        // 分页
        this.pagination.limit = this.template[0].attrs ? parseInt(this.template[0].attrs.page_size, 10) || 20 : 20
        console.log(this.template[0], this.listConfig, 'hhhhhhhhhhhhhhhhhhhh')
      },
      immediate: true
    }
  }
}
</script>

