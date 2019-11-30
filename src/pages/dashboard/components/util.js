
import { getData } from '@/api/platform/desktop/column'
import { getFile } from '@/utils/avatar'
import { mapState } from 'vuex'
import { taskTypeOptions, status, genderOptions, favoritesOptions, noticeOptions, unreadMessageOptions, imgOptionsData } from '@/business/platform/bpmn/constants'
import ActionUtils from '@/utils/action'
import Utils from '@/utils/util'

/**
 * 创建组件
 */
export function buildComponent(name, column) {
  try {
    return {
      name: name,
      props: {
        params: {
          type: Object,
          default: function() {
            return {}
          }
        },
        height: {
          type: Number,
          default: column.height ? column.height : 300
        },
        visible: {
          type: Boolean,
          default: false
        }
      },
      filters: {
        filterStatus(val, type) {
          if (type === 'pending') {
            const opt = taskTypeOptions.find(x => x['value'] === val)
            return opt['label']
          } else if (type === 'already') {
            const opt = status.find(x => x['value'] === val)
            return opt['label']
          } else if (type === 'gender') {
            const opt = genderOptions.find(x => x['value'] === val)
            return opt['label']
          } else if (type === 'favorites') {
            const opt = favoritesOptions.find(x => x['value'] === val)
            return opt['label']
          } else if (type === 'notice') {
            const opt = noticeOptions.find(x => x['value'] === val)
            return opt['label']
          } else if (type === 'unreadMessage') {
            const opt = unreadMessageOptions.find(x => x['value'] === val)
            return opt['label']
          }
          return val
        }
      },
      data() {
        return {
          loading: false,
          title: `${column.name}`,
          alias: `${column.alias}`,
          attrs: this.getAttrs(),
          variables: {}, // 一些变量，比如分页信息
          data: null,
          quickNavigationData: [],

          bpmnFormrenderDialogVisible: false, // 表单
          editId: '',
          imgOptionsData: imgOptionsData,
          bodyShow: true,
          show: false,
          showHeight: '',
          cardHeight: 100 + '%',
          activeName: 'innerMessage',

          formName: 'form',
          dialogFormVisible: false,
          formLabelWidth: '120px',
          form: {
            label: '',
            url: '',
            target: ''
          },
          defaultForm: {},
          rules: {
            label: [{ required: true, message: this.$t('validate.required') }],
            url: [{ required: true, message: this.$t('validate.required') }],
            target: [{ required: true, message: this.$t('validate.required') }]
          }
        }
      },
      computed: {
        ...mapState({
          userInfo: state => state.ibps.user.info
        })
      },
      mounted() {
        this.defaultForm = JSON.parse(JSON.stringify(this.form))
        this.$nextTick(() => {
          this.fetchData()
        })
      },
      methods: {
        fetchData(params = {}) {
          this.loading = true
          this.showHeight = this.getHeight()
          getData(column, params).then(response => {
            const data = Utils.parseData(response.data)
            // ====================
            if (column.alias === 'userInfo') {
              data.photo = getFile(data.photo)
            }
            this.data = data
            console.log(typeof this.data)
            this.variables = response.variables
            this.loading = false
          }).catch((e) => {
            this.loading = false
          })
        },
        getHeightNoUnit() {
          // 高度 - header - 边框
          if (!this.visible) {
            return this.height ? (this.height - 60 - 20) : 150
          } else {
            return 150
          }
        },
        getHeight() {
          // 高度 - header - 边框
          if (!this.visible) {
            return this.height ? (this.height - 60 - 20) + 'px' : '150px'
          } else {
            return 100 + '%'
          }
        },
        getDashboardHeight() {
          return this.height ? (this.height + 20) + 'px' : '150px'
        },
        getAttrs() {
          const item = JSON.parse(JSON.stringify(column))
          item.templateHtml = null
          return item
        },
        getFullCalendarEvents(data) {
          if (data === null) {
            return []
          }
          return JSON.parse(data)
        },
        getFullCalendarConfig() {
          return {
            height: this.height ? this.height - 40 : 150,
            header: {
              left: 'title',
              center: '',
              right: 'prev,next,today,month,agendaWeek,agendaDay,listWeek'
            },
            selectable: true,
            selectHelper: true,
            editable: false,
            eventLimit: true, // 更多
            locale: this.$i18n.locale ? this.$i18n.locale.toLowerCase() : 'zh-cn'
          }
        },
        refreshData() {
          this.fetchData()
        },
        /**
         * 处理按钮事件
         * @param {*} command
         * @param {*} position
         * @param {*} data
         * @param {*} actions
         */
        handleActionEvent(command, position, data, actions) {
          switch (command) {
            case 'refresh':// 刷新
              this.refreshData()
              break
            case 'fullscreen':// 全屏
              this.handleFullscreen()
              break
            case 'more':// 更多
              this.handleMore()
              break
            case 'collapse': // 收缩
            case 'expansion': // 展开
              this.handleCollapseExpand(command, data, actions)
              break
            default:
              break
          }
        },

        emitActionEventHandler(command) {
          this.$emit('action-event', command, ...Array.from(arguments).slice(1))
        },

        handleApprove(id) {
          this.$emit('action-event', 'approve', id)
        },

        handleUnreadMessage(id) {
          this.$emit('action-event', 'unRead', id)
        },
        // 处理全屏
        handleFullscreen() {
          this.emitActionEventHandler('fullscreen', {
            id: this.attrs.id
          })
        },
        openPlate(url) {
          this.$router.push(url)
        },
        /**
         * 处理更多
         */
        handleMore() {
          if (this.attrs.colUrl === '') {
            this.$message({
              message: '未设置更多路径的url',
              type: 'warning'
            })
            return
          }
          this.$router.push(this.attrs.colUrl)
        },
        handleClick(tab, event) {
          console.log(tab, event)
        },
        handleFlowClick(params) {
          params.$alias = this.alias
          this.emitActionEventHandler('flow', params)
        },
        addBreadcrumb() {
          let i = this.data.length
          i++
          this.data.push({
            url: 'http://bpmhome.cn/index.html',
            label: '地址' + i
          })
        },
        handleCollapseExpand(command, data, actions) {
          this.bodyShow = !this.bodyShow
          const index = actions.findIndex(action => action.key === data.key)
          actions[index].key = this.bodyShow ? 'collapse' : 'expansion'
          if (!this.visible) {
            this.emitActionEventHandler(command, {})
            return
          }
          this.showHeight = this.bodyShow ? this.getHeight() : 0
          this.$refs['toolbar'].callback(actions)
        },

        formValidate() {
          this.$nextTick(() => {
            this.$refs[this.formName].validate(() => {})
          })
        },
        getFormData() {
          // 固定模拟数据
          this.form = JSON.parse(JSON.stringify(this.defaultForm))
          this.formValidate()
          this.dialogFormVisible = true
          // this.$refs[this.formName] ? this.$refs[this.formName].resetFields() : null
          // TODO接口暂未构建，先隐藏。
          // this.fetchData()
        },
        handleClose(i) {
          this.quickNavigationData.splice(i, 1)
          // TODO 传递后台删减后得数据。
        },
        // 错误头像的照片
        errorAvatarHandler(data) {
          // data.photo = require('https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png')
          return true
        },
        close() {
          this.$refs[this.formName].resetFields()
          this.dialogFormVisible = false
        },
        confirm() {
          // 未有API接口 模拟数据不会因添加而变化 TODO
          this.$refs[this.formName].validate(valid => {
            if (valid) {
              this.quickNavigationData.push(this.form)
              this.dialogFormVisible = false
            } else {
              ActionUtils.saveErrorMessage()
            }
          })
        }
      },
      template: column.templateHtml !== '' ? `${column.templateHtml}` : `<div></div>`
    }
  } catch (error) {
    console.error(error)
  }
}

