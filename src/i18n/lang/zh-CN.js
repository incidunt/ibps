export default {
  loading: '加载中',
  company: '广州流辰信息技术有限公司',
  copyright: '版权所有',
  platform: 'IBPS 平台',
  welcome: '欢迎使用 IBPS 平台',
  route: {
    untitled: '未命名',
    login: '登录',
    register: '注册账号',
    forget: '忘记密码',
    systemSelect: '选择子系统',
    locking: '锁屏',
    error404: '404-页面不存在',
    error401: '401- 未授权',
    error403: '403-权限不足',
    dashboard: '首页'
    // userAndGroup: '用户管理',
    // formManagement: '表单管理',
    // bpmnManagement: '流程管理',
    // officeDesk: '个人办公',
    // systemManagement: '系统管理',
    // codegen: '代码管理'
  },
  size: {
    default: '默认',
    medium: '中',
    small: '小',
    mini: '最小'
  },
  theme: {
    ibps: '经典',
    violet: '紫罗兰',
    line: '简约线条',
    star: '流星',
    'tomorrow-night-blue': '深夜蓝(vsCode)',
    status: {
      activate: '已激活',
      select: '使用'
    }
  },
  navbar: {
    logo: {
      title: 'IBPS 开发平台'
    },
    dashboard: '首页',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    setting: '整体风格设置',
    theme: '自定义主题',
    color: '主题色',
    size: '尺寸大小',
    language: '语言',
    lockScreen: '锁屏',
    welcome: '欢迎您',
    userInfo: '用户信息',
    changePassword: '修改密码',
    exitSwitchUser: '退出切换用户',
    logOut: '注销'
  },
  layout: {
    'header-aside': {
      'menu-item': {
        'label-default': '未命名菜单'
      },
      'menu-side': {
        'empty': '没有侧栏菜单'
      }
    }
  },
  errorlog: {
    empty: '没有日志或异常',
    logInfo: '{logLength} 条日志',
    logError: ' {logLength} 条日志 |包含 {logLengthError} 个异常',
    type: {
      log: '日志',
      exception: '异常'
    },
    table: {
      'empty-text': '暂无日志信息',
      'label': {
        'component': '触发组件',
        'message': '信息',
        'more': '查看详细信息',
        'time': '时间',
        'url': '触发页面'
      }
    },
    upload: {
      button: '上传'
    }
  },
  search: {
    placeholder: '搜索页面',
    tip: '您可以使用快捷键',
    press: '按',
    panel: '唤醒搜索面板',
    close: '关闭'
  },
  tagsView: {
    close: '关闭',
    closeOther: '关闭其它',
    closeAll: '关闭所有',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧'
  },
  login: {
    title: 'IBPS 平台',
    method: {
      userPassword: '用户密码',
      smsCode: '短信验证码',
      thirdparty: '第三方授权登录'
    },
    userLogin: '用户登录',
    logIn: '登录',
    logOut: '注销',
    username: '请输入用户名',
    password: '请输入密码',
    code: '请输入验证码',
    capsTooltip: '大写锁定已开启',
    mobile: '请输入手机号',
    qq: 'QQ',
    wechat: '微信',
    usernameCorrect: '请输入正确的用户名.',
    passwordCorrect: '请输入至少5位的密码.',
    mobileCorrect: '请正确输入手机号码',
    codeCorrect: '请输入正确的验证码.',
    codeLength: '验证码长度为6位',
    msgInit: '发送验证码',
    msgScuccess: '{time}秒后重发',
    remember: '记住账号',
    forget: '忘记密码',
    register: '注册账号',
    backLogin: '返回登录',
    resetPassword: '重置密码',
    registration: '注册',
    fullName: '姓名/称呼',
    company: '公司名称',
    gender: {
      male: '男',
      female: '女'
    },
    selectSystem: '选择子系统'
  },
  logout: {
    message: '注销当前账户吗? 打开的标签页和用户设置将会被保存。',
    title: '确认操作',
    confirmButtonText: '确定注销',
    cancelButtonText: '放弃'
  },
  validate: {
    required: '必填',
    number: '只能包含数字字符',
    integer: '只能是整数的数字',
    boolean: '只能是布尔值',
    float: '只能是浮点数',
    date: '请输入一合法的日期',
    regexp: '请输入正确格式',
    key: '只能为字母开头,允许字母、数字和下划线',
    mobile: {
      empty: '手机号不能为空',
      length: '手机号码长度不为11位',
      format: '手机号码格式不正确'
    },
    'phone': '请输入正确的手机号码.',
    'telephone': '请输入正确的电话号码.',
    'zip': '邮政编码.',
    'idcard': '请输入正确的身份证号.',
    'email': '请输入正确邮箱格式.'
  },
  notify: {
    'special': {
      'component-size': {
        'changed': {
          'message': '全局组件尺寸已经变更',
          'title': '提示'
        }
      },
      'show-log': {
        'message': '完整的日志内容已经打印到控制台',
        'title': '日志详情'
      },
      'upload': {
        'error': {
          'message': '数据上传失败',
          'title': '上传失败'
        },
        'start': {
          'message': '正在上传数据，请稍后',
          'title': '开始上传'
        },
        'success': {
          'message': '数据上传成功',
          'title': '上传成功'
        }
      }
    }
  },
  common: {
    loading: '加载中',
    saving: '保存中',
    noData: '暂无数据',
    dialog: {
      warn: '温馨提示',
      title: '提示',
      multipleSelected: '已经选择了多项,请选择一项进行操作!',
      selectedRecords: '请选择记录!',
      removeRecord: '此操作将永久删除该数据, 是否确定?',
      operateSuccess: '操作成功',
      removeSuccess: '删除成功!',
      saveSuccess: '{message}, 是否继续?',
      saveConfirmButtonText: '继续操作',
      saveCancelButtonText: '关闭',
      saveError: '请检查表单数据是否填写正确'
    },
    buttons: {
      search: '搜索',
      resetSearch: '重置',
      moreSearch: '更多',
      add: '添加',
      edit: '编辑',
      remove: '删除',
      detail: '明细',
      save: '保存',
      close: '关闭',
      confirm: '确定',
      cancel: '取消',
      refresh: '刷新',
      expand: '展开',
      compress: '收缩',
      'export': '导出',
      'import': '导入',
      print: '打印',
      more: '更多',
      collapse: '收缩',
      expansion: '展开',
      clean: '清空',
      fullscreen: '全屏',
      fullscreenOn: '小屏'
    }
  },
  components: {
    address: {
      china: '中国',
      defaultPlaceholder: ['请选择国家', '请选择省', '请选择市', '请选择县区', '请选择乡镇街'],
      defaultnotFoundText: ['无匹配国家', '无匹配省', '无匹配市', '无匹配县区', '无匹配乡镇街']
    },
    backToTop: {
      tip: '返回顶部'
    },
    lockScreen: {
      unlock: '解锁',
      locked: '已锁定',
      placeholder: '密码同登录密码',
      tip: '密码错误,请重新输入。如果忘了密码,请与管理员联系!'
    },
    screenfull: {
      notSupport: '您的浏览器不支持'
    },
    cardList: {
      pagination: {
        pageInfo: `第{start}到第{end}条 共{total}条`,
        noData: '暂无数据'
      }
    },
    crud: {
      expand: '展开',
      collapse: '收缩',
      index: '序号',
      manage: '管理',
      pagination: {
        pageInfo: `第{start}到第{end}条 共{total}条`,
        noData: '暂无数据'
      }
    },
    queryBuilder: {
      'add_rule': '添加规则',
      'add_group': '添加组',
      'remove_rule': '删除',
      'remove_group': '删除组',

      'conditions': {
        'AND': '并且',
        'OR': '或者'
      },

      'operators': {
        'equal': '等于',
        'not_equal': '不等于',
        'in': '在...之內',
        'not_in': '不在...之內',
        'less': '小于',
        'less_or_equal': '小于或等于',
        'greater': '大于',
        'greater_or_equal': '大于或等于',
        'between': '在...之间',
        'not_between': '不在...之间',
        'begins_with': '以...开始',
        'not_begins_with': '不以...开始',
        'contains': '包含以下内容',
        'not_contains': '不包含以下内容',
        'ends_with': '以...结束',
        'not_ends_with': '不以...结束',
        'is_empty': '为空',
        'is_not_empty': '不为空',
        'is_null': '为 null',
        'is_not_null': '不为 null'
      },
      'sources': {
        'fixed': '固定值',
        'dynamic': '动态值',
        'script': 'Groovy脚本值'
      },

      'errors': {
        'no_filter': '没有选择过滤器',
        'empty_group': '该组为空',
        'radio_empty': '没有选中项',
        'checkbox_empty': '没有选中项',
        'select_empty': '没有选中项',
        'string_empty': '没有输入值',
        'string_exceed_min_length': '必须至少包含{0}个字符',
        'string_exceed_max_length': '必须不超过{0}个字符',
        'string_invalid_format': '无效格式({0})',
        'number_nan': '值不是数字',
        'number_not_integer': '不是整数',
        'number_not_double': '不是浮点数',
        'number_exceed_min': '必须大于{0}',
        'number_exceed_max': '必须小于{0}',
        'number_wrong_step': '必须是{0}的倍数',
        'number_between_invalid': '无效值, {0} 大于 {1}',
        'datetime_empty': '值为空',
        'datetime_invalid': '不是有效日期({0})',
        'datetime_exceed_min': '必须在{0}之后',
        'datetime_exceed_max': '必须在{0}之前',
        'datetime_between_invalid': '无效值,  {0} 大于{1}',
        'boolean_not_valid': '不是布尔值',
        'operator_not_multiple': '选项"{1}"无法接受多个值'
      }
    },
    clipboard: {
      success: '复制成功',
      failed: '复制失败'
    }
  },
  formula: {
    'omit': '略',
    'logicFunc': '逻辑函数',
    'textFunc': '文本函数',
    'mathFunc': '数学函数',
    'dateFunc': '日期函数',
    'advanceFunc': '高级函数',
    abs: {
      intro: 'ABS函数可以获取一个数的绝对值',
      usage: 'ABS(数字)',
      example: 'ABS(-8)可以返回8，也就是-8的绝对值'
    },
    and: {
      'intro': '如果所有参数都为真，AND函数返回布尔值true，否则返回布尔值 false',
      'usage': 'AND(逻辑表达式1,逻辑表达式2,...)',
      'example': 'AND({语文成绩}>90,{数学成绩}>90,{英语成绩}>90)，如果三门课成绩都> 90，返回true，否则返回false'
    },
    average: {
      'intro': 'AVERAGE函数可以获取一组数值的算术平均值',
      'usage': 'AVERAGE(数字1,数字2,...)',
      'example': 'AVERAGE({语文成绩},{数学成绩}, {英语成绩})返回三门课程的平均分'
    },
    ceiling: {
      'intro': 'CEILING函数可以将数字增大到最接近原值的指定因数的倍数',
      'usage': 'CEILING(数字,因数)',
      'example': 'CEILING(7,6)返回12，因为12比7大的同时，也是6的倍数中最接近7的数字'
    },
    char: {
      'intro': 'CHAR函数可以将计算机字符集的数字代码转换为对应字符',
      'usage': 'CHAR(数字)',
      'example': 'CHAR(10)会返回换行字符'
    },
    count: {
      'intro': 'COUNT函数可以获取参数的数量',
      'usage': 'COUNT(值,值,...)',
      'example': 'COUNT(小明,小王,小张,小李)返回4，也就是人员的数量'
    },
    concatenate: {
      'intro': 'CONCATENATE函数可以将多个文本合并成一个文本',
      'usage': 'CONCATENATE(文本1,文本2,...)',
      'example': 'CONCATENATE("三年二班","周杰伦")会返回"三年二班周杰伦"'
    },
    countif: {
      'intro': 'COUNTIF函数可以获取数组中满足条件的参数个数',
      'usage': 'COUNTIF(数组,"条件")',
      'example': 'COUNTIF(子表单.性别, "女")，可得到子表单中性别填的是"女"的数据条数；COUNTIF([1,2,3,4],">2")，可得到1,2,3,4中大于2的数字数量，结果为2。'
    },
    date: {
      'intro': 'DATE函数可以将时间戳转换为日期对象',
      'usage': 'DATE(时间戳)'
    },
    datedelta: {
      'intro': 'DATEDELTA函数可以将指定日期加/减指定天数',
      'usage': 'DATEDELTA(指定日期,需要加减的天数)'
    },
    day: {
      'intro': 'DAY函数可以获取某日期是当月的第几日',
      'usage': 'DAY(时间戳)'
    },
    days: {
      'intro': 'DAYS函数可以返回两个日期之间相差的天数。',
      'usage': 'DAYS(结束日期,开始日期)'
    },
    days360: {
      'intro': 'DAYS360按照一年 360 天的算法，返回两个日期间相差的天数',
      'usage': 'DAYS360(结束日期,开始日期)'
    },
    exact: {
      'intro': 'EXACT函数可以比较两个文本是否完全相同，完全相同则返回true，否则返回false',
      'usage': 'EXACT(文本1, 文本2)',
      'example': 'EXACT({手机号},{中奖手机号})，如果两者相同，返回true，如果不相同，返回false'
    },
    'false': {
      'intro': 'FALSE函数返回布尔值false',
      'usage': 'FALSE()'
    },
    fixed: {
      'intro': 'FIXED函数可将数字舍入到指定的小数位数并输出为文本',
      'usage': 'FIXED(数字,小数位数)',
      'example': 'FIXED(3.1415,2)返回"3.14"'
    },
    floor: {
      'intro': 'FLOOR函数可将数字减小到最接近原值的指定因数的倍数',
      'usage': 'FLOOR(数字,因数)',
      'example': 'FLOOR(7,6)返回6，因为6比7小的同时，也是6的倍数中最接近7的数字'
    },
    getusername: {
      'intro': 'GETUSERNAME函数可以获取当前用户的昵称',
      'usage': 'GETUSERNAME()'
    },
    hour: {
      'intro': 'HOUR函数可以返回某日期的小时数',
      'usage': 'HOUR(时间戳)'
    },
    'if': {
      'intro': 'IF函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值',
      'usage': 'IF(逻辑表达式,为true时返回的值,为false时返回的值)',
      'example': 'IF({语文成绩}>60,"及格","不及格")，当语文成绩>60时返回及格，否则返回不及格。'
    },
    'int': {
      'intro': 'INT函数可以获取一个数的整数部分',
      'usage': 'INT(数字)',
      'example': 'INT(3.1415)返回3，也就是3.1415的整数部分'
    },
    isempty: {
      'intro': 'ISEMPTY函数可以用来判断值是否为空文本、空对象或者空数组',
      'usage': 'ISEMPTY(文本)'
    },
    isoweeknum: {
      'intro': 'ISOWEEKNUM函数可以返回指定日期在全年中的ISO周数',
      'usage': 'ISOWEEKNUM(指定日期)'
    },
    large: {
      'intro': 'LARGE函数可以获取数据集中第k个最大值',
      'usage': 'LARGE(数组,k)',
      'example': 'LARGE({学生成绩.数学成绩},1)返回子表单"学生成绩"中排名第1的"数学成绩"'
    },
    left: {
      'intro': 'LEFT函数可以从一个文本的第一个字符开始返回指定个数的字符',
      'usage': 'LEFT(文本,文本长度)',
      'example': 'LEFT("三年二班周杰伦",2)返回"三年"，也就是"三年二班周杰伦"的从左往右的前2个字符'
    },
    len: {
      'intro': 'LEN函数可以获取文本中的字符个数',
      'usage': 'LEN(文本)',
      'example': 'LEN("朝辞白帝彩云间")返回7，因为这句诗中有7个字符'
    },
    log: {
      'intro': 'LOG函数可以根据指定底数返回数字的对数',
      'usage': 'LOG(数字,底数)',
      'example': 'LOG(100,10)返回2，也就是以10为底数100的对数'
    },
    lower: {
      'intro': 'LOWER函数可以将一个文本中的所有大写字母转换为小写字母',
      'usage': 'LOWER(文本)',
      'example': 'LOWER("JAYZ")返回"jayz"'
    },
    mapx: {
      'intro': 'MAPX函数是一个可以用来进行跨表单取数的高级函数',
      'usage': 'MAPX(operation,map_value,map_field,result_field)'
    },
    max: {
      'intro': 'MAX函数可以获取一组数值的最大值',
      'usage': 'MAX(数字1,数字2,...)',
      'example': 'MAX({语文成绩},{数学成绩},{英语成绩})返回三门课程中的最高分'
    },
    mid: {
      'intro': 'MID返回文本中从指定位置开始的指定数目的字符',
      'usage': 'MID(文本,开始位置_数字,指定数目)',
      'example': 'MID("流辰快速开发平台",4,6)返回"快速开发平台"'
    },
    min: {
      'intro': 'MIN函数可以获取一组数值的最小值',
      'usage': 'MIN(数字1,数字2,...)',
      'example': 'MIN({语文成绩},{数学成绩},{英语成绩})返回三门课程中的最低分'
    },
    minute: {
      'intro': 'MINUTE函数可以返回某日期的分钟数',
      'usage': 'MINUTE(时间戳)'
    },
    mod: {
      'intro': 'MOD函数可以获取两数相除的余数',
      'usage': 'MOD(被除数,除数)',
      'example': 'MOD(4,3)返回1，也就是4/3的余数'
    },
    month: {
      'intro': 'MONTH返回某日期的月份',
      'usage': 'MONTH(时间戳)'
    },
    not: {
      'intro': 'NOT函数返回与指定表达式相反的布尔值。',
      'usage': 'NOT(逻辑表达式)',
      'example': 'NOT({语文成绩}>60)，如果语文成绩大于60返回false，否则返回true'
    },
    now: {
      'intro': 'NOW函数可以获取当前时间',
      'usage': 'NOW()'
    },
    or: {
      'intro': '如果任意参数为真，OR 函数返回布尔值true；如果所有参数为假，返回布尔值false。',
      'usage': 'OR(逻辑表达式1,逻辑表达式2,...)',
      'example': 'OR({语文成绩}>90,{数学成绩}>90,{英语成绩}>90)，任何一门课成绩> 90，返回true，否则返回false'
    },
    power: {
      'intro': 'POWER函数可以获取数字乘幂的结果',
      'usage': 'POWER(数字,指数)',
      'example': 'POWER(3，2)返回9，也就是3的2次方'
    },
    product: {
      'intro': 'PRODUCT函数可以获取一组数值的乘积',
      'usage': 'PRODUCT(数字1,数字2,...)',
      'example': 'PRODUCT({单价}, {数量})获取总价，也就是单价和数量的乘积'
    },
    rand: {
      'intro': 'RAND函数可返回大于等于0且小于1的均匀分布随机实数',
      'usage': 'RAND()',
      'example': 'RAND()返回0.424656'
    },
    replace: {
      'intro': 'REPLACE函数可以根据指定的字符数，将部分文本替换为不同的文本',
      'usage': 'REPLACE(文本,开始位置,替换长度,新文本)',
      'example': 'REPLACE("流辰快速开发平台",4,6,"企业数据管理平台")返回"流辰企业数据管理平台"'
    },
    rept: {
      'intro': 'REPT函数可以将文本重复一定次数',
      'usage': 'REPT(文本,重复次数)',
      'example': 'REPT("流辰",3)返回"流辰流辰流辰"'
    },
    right: {
      'intro': 'RIGHT函数可以获取由给定文本右端指定数量的字符构成的文本值',
      'usage': 'RIGHT(文本,文本长度)',
      'example': 'RIGHT("三年二班周杰伦",3)返回"周杰伦"，也就是"三年二班周杰伦"从右往左的前3个字符'
    },
    round: {
      'intro': 'ROUND函数可以将数字四舍五入到指定的位数',
      'usage': 'ROUND(数字,数字位数)',
      'example': 'ROUND(3.1485,2)返回3.15'
    },
    small: {
      'intro': 'SMALL函数可以返回数据集中第k个最小值',
      'usage': 'SMALL(数组,k)',
      'example': 'SMALL({学生成绩.数学成绩}, 1)返回子表单"学生成绩"中排名倒数第一的"数学成绩"'
    },
    sqrt: {
      'intro': 'SQRT函数可以获取一个数字的正平方根',
      'usage': 'SQRT(数字)',
      'example': 'SQRT(9)返回3，也就是9的正平方根'
    },
    sum: {
      'intro': 'SUM函数可以获取一组数值的总和',
      'usage': 'SUM(数字1,数字2,...)',
      'example': 'SUM({语文成绩},{数学成绩}, {英语成绩})返回三门课程的总分'
    },
    sumproduct: {
      'intro': 'SUMPRODUCT函数可以将数组间对应的元素相乘，并返回乘积之和，适用于加权求和',
      'usage': 'SUMPRODUCT(数组,数组...)',
      'example': 'SUMPRODUCT([1,2,3],[0.1,0.2,0.3])返回1.4，也就是 1×0.1 + 2×0.2 + 3×0.3的值'
    },
    search: {
      'intro': 'SEARCH函数可以获取文本1在文本2中的开始位置',
      'usage': 'SEARCH(文本1,文本2)',
      'example': 'SEARCH("2016","流辰2016")返回4'
    },
    second: {
      'intro': 'SECOND函数可以返回某日期的秒数',
      'usage': 'SECOND(时间戳)'
    },
    split: {
      'intro': 'SPLIT函数可以将文本按指定分割符分割成数组',
      'usage': 'SPLIT(文本,分隔符_文本)',
      'example': 'SPLIT("流辰-快速开发平台","-")返回"流辰，快速开发平台"'
    },
    systime: {
      'intro': 'SYSTIME函数可以获取当前服务器时间',
      'usage': 'SYSTIME()'
    },
    text: {
      'intro': 'TEXT函数可以将数字转化成文本',
      'usage': 'TEXT(数字)',
      'example': 'TEXT(3.1415)返回"3.1415"'
    },
    time: {
      'intro': 'TIME函数可以返回特定时间的十进制数字',
      'usage': 'TIME(时_数字,分_数字,秒_数字)'
    },
    timestamp: {
      'intro': 'TIMESTAMP函数可以将日期对象转换成时间戳。',
      'usage': 'TIMESTAMP(日期)'
    },
    today: {
      'intro': 'TODAY函数可以返回今天',
      'today.usage': 'TODAY()'
    },
    trim: {
      'intro': 'TRIM函数可以删除文本首尾的空格',
      'usage': 'TRIM(文本)',
      'example': 'TRIM("   流辰   ")返回"流辰"'
    },
    'true': {
      'intro': 'TRUE函数返回布尔值true',
      'usage': 'TRUE()'
    },
    upper: {
      'intro': 'UPPER函数可以将一个文本中的所有小写字母转换为大写字母',
      'usage': 'UPPER(文本)',
      'example': 'UPPER("jayz")返回"JAYZ"'
    },
    uuid: {
      'intro': 'UUID函数随机码生成器。可适用于随机流水号的使用场景等',
      'usage': 'UUID()'
    },
    value: {
      'intro': 'VALUE函数可以将文本转化为数字',
      'usage': 'VALUE(文本)',
      'example': 'VALUE("3.1415")返回3.1415'
    },
    weeknum: {
      'intro': 'WEEKNUM函数可以返回指定日期在当年是第几周',
      'usage': 'WEEKNUM(指定日期)'
    },
    xor: {
      'intro': 'XOR函数可以返回所有参数的异或值',
      'usage': 'XOR(逻辑表达式1, 逻辑表达式2,...)',
      'example': 'XOR({语文成绩}>90,{数学成绩}>90)，如果两门成绩都>90,返回false；如果两门成绩都<90，返回false；如果其中一门>90，另外一门<90，返回true'
    },
    year: {
      'intro': 'YEAR函数可以返回某日期的年份',
      'usage': 'YEAR(时间戳)'
    }
  },
  error: {
    network: '服务器君开小差了，请稍后再试',
    logout: {
      message: '您已被登出，可以取消继续留在该页面，或者重新登录',
      title: '确定登出',
      confirmButtonText: '重新登录',
      cancelButtonText: '取消'
    },
    back: '返回',
    backHome: '返回首页',
    reLogin: '重新登录',
    page404: {
      message: '这个页面你不能进......',
      info: '请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告'
    },
    page401: {
      tip1: '你没有权限去该页面',
      tip2: '如有不满请联系你领导',
      maybe: '或者你可以去'
    },
    page403: {
      tip1: '你没有权限去该页面',
      tip2: '如有不满请联系你领导',
      maybe: '或者你可以去'
    },
    page500: {
      tip1: '服务器内部页面出错了',
      tip2: '请联系管理员或者发送错误报告',
      maybe: '或者你可以去'
    },
    message: '{message}',
    messageCause: '{message}</br>错误原因：{cause}',
    cause: '错误原因：{cause}',
    unknown: '未知错误，错误码：{state}',
    status: {
      400: '[400]请求错误',
      401: '[401]未授权，请联系管理员',
      403: '[403]拒绝访问',
      404: '[404]请求地址出错: {url}',
      408: '[408]请求超时',
      500: '[500]服务器内部错误',
      501: '[501]服务未实现',
      502: '[502]网关错误',
      503: '[503]服务不可用',
      504: '[504]网关超时',
      505: '[505]HTTP版本不受支持',
      6010101: '非法请求',
      6020101: '用户名或密码错误'
    }
  }
}
