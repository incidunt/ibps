
## Build Setup

``` bash

# Install dependencies
npm install



# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 如果还是不行 取消ssl验证 
npm config set strict-ssl false
npm config set registry http://registry.npm.taobao.org/

#原来的npm
npm config set registry http://registry.npmjs.org 


# serve with hot reload at localhost:9528
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

#自动修复
npm run lint -- --fix
#内存设置
npm run fix-memory-limit

#版本检查 列出所以可以更新的包。免得再一个个去npm找相对于的可用版本了。
npm outdated
```
npm config set registry  http://tools.bpmhome.cn:8082/nexus/repository/npm-lc/

npm install --registry=http://tools.bpmhome.cn:8082/nexus/repository/npm-lc/
----注意/
--- 发布
npm login --registry=http://tools.bpmhome.cn:8082/nexus/repository/npm-ibps/
npm adduser  --registry=http://tools.bpmhome.cn:8082/nexus/repository/npm-ibps/
npm publish --registry=http://tools.bpmhome.cn:8082/nexus/repository/npm-ibps/

目录结构
├── build                      # 构建相关
│   ├──build.js                #生产环境构建
├── dist                       # 开发环境打包后的平台(index.html和static文件夹)【svn忽略】
├── node_modules               # npm 包【svn忽略】
├── public                     # 静态资源
│   │── static                 # 第三方资源（不打包资源）  富文本ueditor
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板

├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── business               # 业务组件（该组件是包含业务数据，比如人员选择器、上传附件、数据字典等）
│   ├── components             # 全局公用组件
│   ├── directives             # 全局指令
│   ├── filters                # 全局过滤
│   ├── i18n                   # 国际化 language
│   ├── icons                  # 项目所有 svg icons
│   ├── layout                 # 全局 layout,目前有header-aside布局
│   ├── router                 # 路由
│   ├── pages                  # 公用页面  不涉及过多业务，比如错误页面，登录
│   ├── plugins                # 插件 封装（或者集成第三方）了一些插件，方便开发者进行开发
│   ├── store                  # 全局 store管理 vuex
│   ├── utils                  # 全局公用方法(帮助类)
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
│   └── setting.js             # 全局默认配置
├── tests                      # 测试
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
└── package.json               # package.json


components                   # 组件目录
│   ├── ibps-address                  // 地址控件
│   ├── ibps-avatar                   // 头像
│   ├── ibps-back-to-top              // 返回顶部
│   ├── ibps-card-list                // 卡片列表
│   ├── ibps-container                // 页面容器组件
│   ├── ibps-container-frame          // 页面iframe容器组件
│   ├── ibps-crud                     // 增删改查组件
│   ├── ibps-drawer                   // 抽屉组件
│   ├── ibps-file-viewer              // 文件预览组件
│   ├── ibps-fullcalendar             // 日历组件
│   ├── ibps-icon                     // 图标
│   ├── ibps-icon-select              // 图标选择器
│   ├── ibps-icon-svg                 // svg 图标
│   ├── ibps-icon-svg-select          // svg 图标选择器
│   ├── ibps-layout                    // 布局
│   ├── ibps-link-btn                 // 链接按钮
│   ├── ibps-list                     // 列表组件
│   ├── ibps-toolbar                  // 工具栏组件
│   ├── ibps-tree                     // 树扩展组件
│   ├── ibps-tree-select               // 下拉树组件
│   ├── ibps-tree-table               // 树表格组件
│   ├── ibps-selector                  // 选择器
│   ├── ibps-ueditor                  // UEditor 组件
