import request from '@/utils/request'
import ActionUtil from '@/utils/action'
import { SYSTEM_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: SYSTEM_URL + '/desktop/column/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SYSTEM_URL + '/desktop/column/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: SYSTEM_URL + '/desktop/column/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: SYSTEM_URL + '/desktop/column/get',
    method: 'get',
    params: params
  })
}

/**
 * 校验模板别名
 * @param {*} params
 */
export function checkCode(params) {
  return request({
    url: SYSTEM_URL + '/desktop/column/checkCode',
    method: 'get',
    params: params
  })
}
/**
 * 初始化模版
 * @param {*} params
 */
export function initTemplate() {
  return request({
    url: SYSTEM_URL + '/desktop/column/initTemplate',
    method: 'post'
  })
}

/**
 * 设置 桌面栏目 启用/禁用
 * @param {*} params
 */
export function setEnable(params) {
  return request({
    url: SYSTEM_URL + '/desktop/column/setEnable',
    method: 'post',
    params: params
  })
}

/**
 * 获得有权限的桌面栏目
 */
export function findHashRightsColumn(params) {
  return request({
    url: SYSTEM_URL + '/desktop/column/findHashRightsColumn',
    method: 'get',
    params: params
  })
}

/**
 * 获取每个栏目的数据
 * @param {*} params 参数
 * <p>
 *    alias 栏目别名
 *    params 参数 包含分页或者其他固定参数
 * </p>
 */
export function getData({ alias, dataMode, dataFrom }, params) {
  if (dataMode === 2) { // api
    return request({
      url: dataFrom,
      method: 'get',
      params
    })
  } else {
    return request({
      url: SYSTEM_URL + '/desktop/column/getData',
      method: 'post',
      data: ActionUtil.formatParams({
        alias: alias,
        params: JSON.stringify(params)
      })
    })
  }

  // return new Promise((resolve, reject) => {
  //   var data = null
  //   var variables = {}
  //   if (alias === 'dashboard') {
  //     data = [{
  //       title: '待办事宜',
  //       subtitle: '实时',
  //       count: 7994,
  //       color: 'rgb(49, 180, 141)',
  //       key: '待'
  //     },
  //     {
  //       title: '已办事宜',
  //       subtitle: '实时',
  //       count: 3112,
  //       color: 'rgb(56, 161, 242)',
  //       key: '已'
  //     },
  //     {
  //       title: '办结事宜',
  //       subtitle: '实时',
  //       count: 238,
  //       color: 'rgb(117, 56, 199)',
  //       key: '办'
  //     },
  //     {
  //       title: '转办代理事宜',
  //       subtitle: '实时',
  //       count: 908,
  //       color: 'rgb(59, 103, 164)',
  //       key: '转'
  //     },
  //     {
  //       title: '新建流程',
  //       subtitle: '实时',
  //       count: 5333,
  //       color: '#e7505a',
  //       key: '新'
  //     },
  //     {
  //       title: '我的请求',
  //       subtitle: '实时',
  //       count: 7512,
  //       color: '#32c5d2',
  //       key: '请'
  //     },
  //     {
  //       title: '我的办结',
  //       subtitle: '实时',
  //       count: 908,
  //       color: '#f3c200',
  //       key: '结'
  //     },
  //     {
  //       title: '我的草稿',
  //       subtitle: '实时',
  //       count: 214,
  //       color: '#80898e',
  //       key: '草'
  //     }
  //     ]
  //   } else if (alias === 'line') {
  //     data = {
  //       tooltip: {
  //         trigger: 'axis',
  //         axisPointer: {
  //           type: 'cross',
  //           label: {
  //             backgroundColor: '#6a7985'
  //           }
  //         }
  //       },
  //       legend: {
  //         data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
  //       },
  //       toolbox: {
  //         feature: {
  //           saveAsImage: {}
  //         }
  //       },
  //       grid: {
  //         left: '3%',
  //         right: '4%',
  //         bottom: '3%',
  //         containLabel: true
  //       },
  //       xAxis: [{
  //         type: 'category',
  //         boundaryGap: false,
  //         data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  //       }],
  //       yAxis: [{
  //         type: 'value'
  //       }],
  //       series: [{
  //         name: '邮件营销',
  //         type: 'line',
  //         stack: '总量',
  //         areaStyle: {
  //           normal: {}
  //         },
  //         data: [120, 132, 101, 134, 90, 230, 210]
  //       },
  //       {
  //         name: '联盟广告',
  //         type: 'line',
  //         stack: '总量',
  //         areaStyle: {
  //           normal: {}
  //         },
  //         data: [220, 182, 191, 234, 290, 330, 310]
  //       },
  //       {
  //         name: '视频广告',
  //         type: 'line',
  //         stack: '总量',
  //         areaStyle: {
  //           normal: {}
  //         },
  //         data: [150, 232, 201, 154, 190, 330, 410]
  //       },
  //       {
  //         name: '直接访问',
  //         type: 'line',
  //         stack: '总量',
  //         areaStyle: {
  //           normal: {}
  //         },
  //         data: [320, 332, 301, 334, 390, 330, 320]
  //       },
  //       {
  //         name: '搜索引擎',
  //         type: 'line',
  //         stack: '总量',
  //         label: {
  //           normal: {
  //             show: true,
  //             position: 'top'
  //           }
  //         },
  //         areaStyle: {
  //           normal: {}
  //         },
  //         data: [820, 932, 901, 934, 1290, 1330, 1320]
  //       }
  //       ]
  //     }
  //   } else if (alias === 'scattergram') {
  //     data = {
  //       title: {
  //         text: '某地区蒸发量和降水量',
  //         subtext: '纯属虚构'
  //       },
  //       tooltip: {
  //         trigger: 'axis'
  //       },
  //       legend: {
  //         data: ['蒸发量', '降水量']
  //       },
  //       toolbox: {
  //         show: true,
  //         feature: {
  //           dataView: { show: true, readOnly: false },
  //           magicType: { show: true, type: ['line', 'bar'] },
  //           restore: { show: true },
  //           saveAsImage: { show: true }
  //         }
  //       },
  //       calculable: true,
  //       xAxis: [
  //         {
  //           type: 'category',
  //           data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  //         }
  //       ],
  //       yAxis: [
  //         {
  //           type: 'value'
  //         }
  //       ],
  //       series: [
  //         {
  //           name: '蒸发量',
  //           type: 'bar',
  //           data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
  //           markPoint: {
  //             data: [
  //               { type: 'max', name: '最大值' },
  //               { type: 'min', name: '最小值' }
  //             ]
  //           },
  //           markLine: {
  //             data: [
  //               { type: 'average', name: '平均值' }
  //             ]
  //           }
  //         },
  //         {
  //           name: '降水量',
  //           type: 'bar',
  //           data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
  //           markPoint: {
  //             data: [
  //               { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
  //               { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
  //             ]
  //           },
  //           markLine: {
  //             data: [
  //               { type: 'average', name: '平均值' }
  //             ]
  //           }
  //         }
  //       ]
  //     }
  //   } else if (alias === 'pieChart') {
  //     data = {
  //       tooltip: {
  //         trigger: 'item',
  //         formatter: '{a} <br/>{b}: {c} ({d}%)'
  //       },
  //       legend: {
  //         orient: 'vertical',
  //         x: 'left',
  //         data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  //       },
  //       series: [
  //         {
  //           name: '访问来源',
  //           type: 'pie',
  //           radius: ['50%', '70%'],
  //           avoidLabelOverlap: false,
  //           label: {
  //             normal: {
  //               show: false,
  //               position: 'center'
  //             },
  //             emphasis: {
  //               show: true,
  //               textStyle: {
  //                 fontSize: '30',
  //                 fontWeight: 'bold'
  //               }
  //             }
  //           },
  //           labelLine: {
  //             normal: {
  //               show: false
  //             }
  //           },
  //           data: [
  //             { value: 335, name: '直接访问' },
  //             { value: 310, name: '邮件营销' },
  //             { value: 234, name: '联盟广告' },
  //             { value: 135, name: '视频广告' },
  //             { value: 1548, name: '搜索引擎' }
  //           ]
  //         }
  //       ]
  //     }
  //   } else if (alias === 'table') {
  //     data = [
  //       {
  //         'order_no': '5DFdFdE9-dBF3-89CA-44D8-5888dCdFdB8F',
  //         'timestamp': 1188043889779,
  //         'username': 'Helen Lopez',
  //         'price': 13208.3,
  //         'status': 'pending'
  //       },
  //       {
  //         'order_no': 'A8eb9D2f-C5ab-E7fb-bA05-bAecCfCE96c6',
  //         'timestamp': 1426106751961,
  //         'username': 'Jose Lewis',
  //         'price': 9064.13,
  //         'status': 'pending'
  //       },
  //       {
  //         'order_no': 'BbD7F0C7-321B-d08e-759D-2A0C4702c1d7',
  //         'timestamp': 1378962705915,
  //         'username': 'Elizabeth Moore',
  //         'price': 2048,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': 'd4eBCcDF-2e75-c922-1fF7-0DBEeEfDFB7e',
  //         'timestamp': 1176237127176,
  //         'username': 'Jennifer Harris',
  //         'price': 5622.56,
  //         'status': 'pending'
  //       },
  //       {
  //         'order_no': 'DAb322A8-ff8E-806E-DaDf-24bF91Fc2989',
  //         'timestamp': 453605364465,
  //         'username': 'Sandra Gonzalez',
  //         'price': 8216.3,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': '1dB1D666-79D1-cdE7-ffAF-5Bda6c44fbbB',
  //         'timestamp': 373538598506,
  //         'username': 'William Moore',
  //         'price': 9780,
  //         'status': 'pending'
  //       },
  //       {
  //         'order_no': 'B626eAcF-3aFD-dA62-9F8A-3daEBABBe9e1',
  //         'timestamp': 659190878413,
  //         'username': 'William Lewis',
  //         'price': 13918.42,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': '4dfbbFCA-7F94-B005-F6eb-e1A7dedc75AD',
  //         'timestamp': 1154374043496,
  //         'username': 'Ruth Hernandez',
  //         'price': 6206.87,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': 'A492CD53-bB74-58AF-d525-c02f6Fc1cA9e',
  //         'timestamp': 1174885910081,
  //         'username': 'Mark Perez',
  //         'price': 8694.4,
  //         'status': 'pending'
  //       },
  //       {
  //         'order_no': 'BBAccBcf-027F-29C8-Af7A-7d93A0dBC6f5',
  //         'timestamp': 246326679660,
  //         'username': 'Sandra Thomas',
  //         'price': 14896.2,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': 'bf5dCBB8-EDCE-9499-29Bc-E5D66b11b161',
  //         'timestamp': 779327079881,
  //         'username': 'Michael Rodriguez',
  //         'price': 10397.4,
  //         'status': 'pending'
  //       },
  //       {
  //         'order_no': '6444bFa4-161e-c8e2-9244-Cf612B5f6CFD',
  //         'timestamp': 466401791656,
  //         'username': 'Jennifer Brown',
  //         'price': 2406.4,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': 'AEB207eA-70eB-CE20-5B90-DC7Cb1F816bc',
  //         'timestamp': 1038053127008,
  //         'username': 'Jeffrey Perez',
  //         'price': 12491.88,
  //         'status': 'pending'
  //       },
  //       {
  //         'order_no': 'EDcc64cF-7A3D-D9Cc-4328-Ff66C2d8eBDd',
  //         'timestamp': 963930944023,
  //         'username': 'Linda Taylor',
  //         'price': 4241,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': 'e1B7D8e6-F2b9-0f6b-B2D2-dC5B2dfeB01E',
  //         'timestamp': 1478967367743,
  //         'username': 'Edward Gonzalez',
  //         'price': 13398,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': '7A71828B-f5bd-4ffF-4caD-B42957BcaDEB',
  //         'timestamp': 763092338138,
  //         'username': 'Daniel Johnson',
  //         'price': 6084,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': '68FDaC87-aFd9-e420-feD8-ff3cedaAC61e',
  //         'timestamp': 1038721098217,
  //         'username': 'Jennifer Harris',
  //         'price': 8512.2,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': 'A5293E6f-4cEB-BA9a-3dc0-AdAfB1D6E04F',
  //         'timestamp': 741398923303,
  //         'username': 'Steven Jones',
  //         'price': 3448.6,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': '19fFE1d2-66BE-BBEF-6B28-FcdDBfEdbeb6',
  //         'timestamp': 8338283919,
  //         'username': 'Cynthia Moore',
  //         'price': 5984.25,
  //         'status': 'success'
  //       },
  //       {
  //         'order_no': 'cd36c9A4-0FB7-ABc6-21ee-Edbdf97Cd4B2',
  //         'timestamp': 1471846634057,
  //         'username': 'Richard Thompson',
  //         'price': 12171.9,
  //         'status': 'success'
  //       }
  //     ]
  //   } else if (alias === 'carousel') {
  //     data = {

  //     }
  //   } else if (alias === 'unreadMessage') {
  //     data = {
  //       system: [],
  //       innerMessage: [{
  //         name: '审批提醒',
  //         createTime: '2018-08-29'
  //       }, {
  //         name: '审批提醒',
  //         createTime: '2018-08-30'
  //       }, {
  //         name: '审批提醒',
  //         createTime: '2018-08-31'
  //       }, {
  //         name: '审批提醒',
  //         createTime: '2018-04-30'
  //       }, {
  //         name: '审批提醒',
  //         createTime: '2018-09-30'
  //       }, {
  //         name: '审批提醒',
  //         createTime: '2018-10-30'
  //       }, {
  //         name: '审批提醒',
  //         createTime: '2018-10-30'
  //       }]
  //     }
  //   } else if (alias === 'myRequest') {
  //     data = [{
  //       subject: '管理员在2018-12-18 11:36:49发起房产项目申报流程',
  //       status: 'running',
  //       createTime: '2018-12-18 11:36:49'
  //     }, {
  //       subject: '管理员在2018-12-17 17:21:41发起请假流程',
  //       status: 'running',
  //       createTime: '2018-12-17 17:21:41'
  //     }, {
  //       subject: '管理员在2018-12-13 11:46:40发起请假申请流程',
  //       status: 'running',
  //       createTime: '2018-12-13 11:46:40'
  //     }, {
  //       subject: '管理员在2018-11-15 16:25:19发起并会签',
  //       status: 'running',
  //       createTime: '2018-11-15 16:25:19'
  //     }]
  //   } else if (alias === 'myCompleted') {
  //     data = [{
  //       subject: '管理员在2018-12-18 11:36:49发起房产项目申报流程',
  //       status: 'running',
  //       createTime: '2018-12-18 11:36:49'
  //     }, {
  //       subject: '管理员在2018-12-17 17:21:41发起请假流程',
  //       status: 'running',
  //       createTime: '2018-12-17 17:21:41'
  //     }, {
  //       subject: '管理员在2018-12-13 11:46:40发起请假申请流程',
  //       status: 'running',
  //       createTime: '2018-12-13 11:46:40'
  //     }, {
  //       subject: '管理员在2018-11-15 16:25:19发起并会签',
  //       status: 'running',
  //       createTime: '2018-11-15 16:25:19'
  //     }]
  //   } else if (alias === 'completedMatters') {
  //     data = [{
  //       subject: '管理员在2018-12-18 11:36:49发起房产项目申报流程',
  //       status: 'running',
  //       createTime: '2018-12-18 11:36:49'
  //     }, {
  //       subject: '管理员在2018-12-17 17:21:41发起请假流程',
  //       status: 'running',
  //       createTime: '2018-12-17 17:21:41'
  //     }, {
  //       subject: '管理员在2018-12-13 11:46:40发起请假申请流程',
  //       status: 'running',
  //       createTime: '2018-12-13 11:46:40'
  //     }, {
  //       subject: '管理员在2018-11-15 16:25:19发起并会签',
  //       status: 'running',
  //       createTime: '2018-11-15 16:25:19'
  //     }]
  //   } else if (alias === 'alreadyMatters') {
  //     data = [{
  //       subject: '管理员在2018-12-18 11:36:49发起房产项目申报流程',
  //       status: 'running',
  //       createTime: '2018-12-18 11:36:49'
  //     }, {
  //       subject: '管理员在2018-12-17 17:21:41发起请假流程',
  //       status: 'running',
  //       createTime: '2018-12-17 17:21:41'
  //     }, {
  //       subject: '管理员在2018-12-13 11:46:40发起请假申请流程',
  //       status: 'running',
  //       createTime: '2018-12-13 11:46:40'
  //     }, {
  //       subject: '管理员在2018-11-15 16:25:19发起并会签',
  //       status: 'running',
  //       createTime: '2018-11-15 16:25:19'
  //     }]
  //   } else if (alias === 'userInfo') {
  //     data = {
  //       account: 'admin',
  //       fullname: 'xxx',
  //       org: {
  //         orgName: '--专家|--部门--'
  //       },
  //       pos: {
  //         posName: '--总监--XXXXXXX'
  //       },
  //       loginTime: new Date().toLocaleString(),
  //       mobile: '+86-159xxxxxxxxx',
  //       picture: '/static/images/theme/star/bg.jpg'
  //     }
  //   } else if (alias === 'notice') {
  //     data = {
  //       interior: []
  //     }
  //   } else if (alias === 'slide') {
  //     data = [{
  //       picture: '/static/images/theme/star/bg.jpg',
  //       label: '图片一'
  //     }, {
  //       picture: '/static/images/theme/line/bg.jpg',
  //       label: '图片二'
  //     }, {
  //       picture: '/static/images/theme/star/bg.jpg',
  //       label: '图片三'
  //     }]
  //   } else if (alias === 'newProcess') {
  //     data = [{
  //       name: '测试流程',
  //       version: '2.1',
  //       creator: '张三'
  //     },
  //     {
  //       name: '测试流程',
  //       version: '2.1',
  //       creator: '张三'
  //     }]
  //   } else if (alias === 'quickNavigation') {
  //     data = [{
  //       url: 'https://www.baidu.com/',
  //       label: '百度',
  //       target: '_blank'
  //     },
  //     {
  //       url: 'http://fontawesome.dashgame.com/',
  //       label: 'fontawesome',
  //       target: '_blank'
  //     },
  //     {
  //       url: 'http://element-cn.eleme.io/#/zh-CN',
  //       label: 'element',
  //       target: '_blank'
  //     }]
  //   } else if (alias === 'pendingMatters') {
  //     data = [{
  //       subject: '测试流程123',
  //       createTime: '2019-01-01',
  //       creator: '张三',
  //       status: 'pending',
  //       remindTimes: 2
  //     },
  //     {
  //       subject: '测试流程456',
  //       createTime: '2019-01-02',
  //       creator: '李四',
  //       status: 'pending',
  //       remindTimes: 4
  //     }]
  //   }
  //   resolve({
  //     state: 200,
  //     data: data,
  //     variables: variables
  //   })
  // })
}
