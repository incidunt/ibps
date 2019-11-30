import Vue from 'vue'

export default function(component, options = { dialog: {}}, cb) {
  return new Promise(async(resolve, reject) => {
    const data = {
      modalAppendToBody: true, // 对话框遮罩层是否插入至 body 元素上
      scrollToTop: false,
      ...options.dialog
    }
    const template = Vue.extend({
      components: {
        'ibps-dialog-component': component
      },
      data() {
        return {
          visible: true,
          wrap: null
        }
      },
      methods: {
        submit(data) {
          resolve(data)
        },
        cancel(data) {
          reject(data)
        },
        close(done) {
          done()
          this.cancel()
        },
        scrollToTop() {
          if (this.wrap.scrollTop) {
            this.wrap.scrollTop -= 200
            requestAnimationFrame(this.scrollToTop)
          }
        },
        toTop() {
          this.wrap = document.querySelector('.el-dialog__wrapper')
          this.scrollToTop()
        }
      },
      render() {
        return (
          <el-dialog
            {...{ attrs: data }}
            class={data.className}
            visible={this.visible}
            beforeClose={this.close}
          >
            {data.scrollToTop ? <div onClick={this.toTop} class={'scroll-to-top'} title={'回到顶部'}>
              <i class={'el-icon-top'}/>
            </div> : ''}
            <ibps-dialog-component onSubmit={this.submit} onCancel={this.cancel} {...options} />
            <div slot='footer' class='el-dialog--center'>
              <ibps-toolbar />
            </div>
          </el-dialog>
        )
      }
    })
    cb && cb(template)
  })
}
