/**
 * 默认值
 */
export const defauleValueTypeOptions = [{
  value: 'fixed',
  label: '固定值'
}, {
  value: 'today',
  label: '填写当天'
}, {
  value: 'present',
  label: '预设值'
},
{
  value: 'dynamic',
  label: '动态脚本'
},
{
  value: 'linkage',
  label: '联动数据'
},
{
  value: 'formula',
  label: '公式编辑'
},
{
  value: 'javascript',
  label: 'javascript脚本'
}
]

export const numberFormatOptions = [{
  value: 'orig',
  label: '原样输出'
}, {
  value: 'integer',
  label: '整型'
}, {
  value: 'number',
  label: '数字'
}, {
  value: 'currency',
  label: '货币'
}]

/**
 * 日期格式
 */
export const datefmtTypeOptions = [{
  value: 'date',
  label: '日期(yyyy-MM-dd)'
}, {
  value: 'datetime',
  label: '日期时间(yyyy-MM-dd HH:mm:ss)'
},
{
  value: 'time',
  label: '时间(HH:mm:ss)'
}, {
  value: 'custom',
  label: '自定义'
}
]

/**
 * 文件类型
 */
export const fileTypeOptions = [{
  value: 'images',
  label: '图片类'
}, {
  value: 'videos',
  label: '视频类'
},
{
  value: 'audios',
  label: '音频类'
}, {
  value: 'docs',
  label: '文档类'
}, {
  value: 'compress',
  label: '压缩包'
}, {
  value: 'custom',
  label: '自定义'
}
]
/**
 * 图片类型
 */
export const imageTypeOptions = [{
  value: '.jpeg',
  label: 'jpeg'
},
{
  value: '.png',
  label: 'png'
},
{
  value: '.bmp',
  label: 'bmp'
},
{
  value: '.gif',
  label: 'gif'
},
{
  value: '.jpg',
  label: 'jpg'
},
{
  value: '.psd',
  label: 'psd'
},
{
  value: '.tiff',
  label: 'tiff/tif'
}
]
/**
 * 上传类型
 */
export const uploadTypeOptions = [{
  value: 'default',
  label: '默认上传'
},
{
  value: 'attachment',
  label: '附件上传'
}
]
/**
 * 文件存储格式
 */
export const fileStoreOptions = [{
  value: 'id',
  label: '仅存ID'
}, {
  value: 'json',
  label: 'JSON格式'
}, {
  value: 'path',
  label: '仅存路径'
}]

/**
 * 选择器类型
 */
export const selectorTypeOptions = [{
  value: 'user',
  label: '用户'
},
{
  value: 'org',
  label: '组织'
},
{
  value: 'position',
  label: '岗位'
},
{
  value: 'role',
  label: '角色'
}
]

/**
 * 选择器存储格式
 */
export const selectorStoreOptions = [{
  value: 'id',
  label: '仅存ID'
}, {
  value: 'json',
  label: 'JSON格式'
}]

export const dialogStoreOptions = [{
  value: 'id',
  label: '仅存ID'
}, {
  value: 'json',
  label: 'JSON格式'
}]

/**
 * 区域
 */
export const areaOptions = [{
  value: 'country',
  label: '国家'
},
{
  value: 'province',
  label: '省/自治区/直辖市'
},
{
  value: 'city',
  label: '市'
},
{
  value: 'district',
  label: '区/县'
}
]

/**
 * 默认工具栏
 */
export const defaultToolbars = [
  'source', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'pasteplain', '|',
  'forecolor', 'backcolor', 'selectall', 'cleardoc', 'fontfamily', 'fontsize'
]
/**
     * 日期格式
     */
export const dateTypes = [{
  value: 'specific',
  label: '特定日期'
}, {
  value: 'today',
  label: '填写当天'
}, {
  value: 'before',
  label: '当天日期前'
}, {
  value: 'after',
  label: '当天日期后'
}]

/**
 * 数据格式【校验】
 */
export const dataFormatOptions = [{
  value: 'phone',
  label: '手机号',
  regexp: /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/
},
{
  value: 'telephone',
  label: '电话号码',
  regexp: /^((\(0[0-9]{2,3}\))|(0[0-9]{2,3})\-)?([2-9][0-9]{6,7})(\-[0-9]{1,4})?$/
},
{
  value: 'zip',
  label: '邮编',
  regexp: /^\d{6}$/
},
{
  value: 'idcard',
  label: '身份证',
  regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
},
{
  value: 'email',
  label: '邮箱',
  regexp: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
},
{
  value: 'custom',
  label: '自定义'
}]
const dataFormatMap1 = {}
dataFormatOptions.forEach(item => {
  dataFormatMap1[item.value] = item
})

export const dataFormatMap = dataFormatMap1
