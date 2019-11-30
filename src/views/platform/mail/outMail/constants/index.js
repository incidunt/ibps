export const treeDatas = [
  {
    name: '收件箱',
    icon: 'inbox',
    type: 'inbox'
  }, {
    name: '发件箱',
    icon: 'envelope-o',
    type: 'outbox'
  }, {
    name: '草稿箱',
    icon: 'file-text-o',
    type: 'drafts'
  }, {
    name: '垃圾箱',
    icon: 'trash',
    type: 'dustbin'
  }, {
    name: '已删除',
    icon: 'delete',
    type: 'deleted'
  }
]
export const renderHeader = function(h, { column, $index }) {
  return h('span', [
    h('el-tooltip', {
      props: {
        content: '是否已读'
      }
    }, [h('i', { class: 'ibps-icon-envelope-o' })]),
    h('el-tooltip', {
      props: {
        content: '是否有附件'
      }
    }, [h('i', { class: 'ibps-icon-paperclip' })]
    )
  ])
}
