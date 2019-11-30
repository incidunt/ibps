'use strict'
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const path = require('path')
const pkg = require('./package.json')

// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

// 当前版本
process.env.VUE_APP_VERSION = pkg.VUE_APP_VERSION

const name = 'IBPS平台-广州流辰信息技术有限公司' // page title
/**
 *  基础路径 注意发布之前如果不是根目录需先修改这里
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://cloud.bpmhome.cn/ibps/,
   * then publicPath should be set to "/ibps/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
const publicPath = '/'

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: publicPath,
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    }
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `http://127.0.0.1:${port}/mock`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // }
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  },
  chainWebpack(config) {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
    // element-ui 换色
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
        ],
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector
      }])
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg-icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'ibps-[name]'
      })
      .end()
    // image exclude(svg)
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config
    // 开发环境
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
    // 非开发环境
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()

          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 15, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                echarts: {
                  name: 'chunk-echarts', // 单独将 echarts 拆包
                  test: /[\\/]node_modules[\\/]_?echarts(.*)/,
                  priority: 20
                },
                vueEcharts: {
                  name: 'chunk-vue-echarts', // 单独将vue-echarts 拆包
                  test: /[\\/]node_modules[\\/]_?vue-echarts(.*)/,
                  priority: 21
                },
                pdfjs: {
                  name: 'chunk-pdfjs',
                  test: /[\\/]node_modules[\\/]_?pdfjs-dist(.*)/,
                  priority: 22
                },
                hlsjs: {
                  name: 'chunk-hlsjs',
                  test: /[\\/]node_modules[\\/]_?hls.js(.*)/,
                  priority: 23
                },
                fullcalendar: {
                  name: 'chunk-fullcalendar',
                  test: /[\\/]node_modules[\\/]_?fullcalendar(.*)/,
                  priority: 24
                },
                videojs: {
                  name: 'chunk-videojs',
                  test: /[\\/]node_modules[\\/]_?video.js(.*)/,
                  priority: 25
                },
                pinyin4js: {
                  name: 'chunk-pinyin4js',
                  test: /[\\/]node_modules[\\/]_?pinyin4js(.*)/,
                  priority: 26
                },
                bpmnjs: {
                  name: 'chunk-bpmnjs',
                  test: /[\\/]node_modules[\\/]_?bpmn-js(.*)/,
                  priority: 27
                },
                diagramjs: {
                  name: 'chunk-diagramjs',
                  test: /[\\/]node_modules[\\/]_?diagram-js(.*)/,
                  priority: 28
                },
                codemirror: {
                  name: 'chunk-codemirror',
                  test: /[\\/]node_modules[\\/]_?codemirror(.*)/,
                  priority: 29
                },
                highlightjs: {
                  name: 'chunk-highlightjs',
                  test: /[\\/]node_modules[\\/]_?highlight.js(.*)/,
                  priority: 30
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })

          // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
          // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
          // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
          // config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
