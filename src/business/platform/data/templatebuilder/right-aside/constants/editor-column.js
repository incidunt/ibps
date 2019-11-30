export const queryFieldTypeOptions = [{
  value: 'text',
  label: '单行文本'
}, {
  value: 'hidden',
  label: '隐藏域'
}, {
  value: 'number',
  label: '数字'
}, {
  value: 'numberRange',
  label: '数字范围'
}, {
  value: 'datePicker',
  label: '日期控件'
}, {
  value: 'dateRange',
  label: '日期范围'
}, {
  value: 'select',
  label: '下拉框'
}, {
  value: 'dictionary',
  label: '数据字典'
}, {
  value: 'selector',
  label: '选择器'
}, {
  value: 'customDialog',
  label: '自定义对话框'
}]

export const displayFieldTypeOptions = [{
  value: 'text',
  label: '原样输出'
}, {
  value: 'hidden',
  label: '隐藏'
}, {
  value: 'datePicker',
  label: '日期格式'
}, {
  value: 'number',
  label: '数字格式'
}, {
  value: 'select',
  label: '枚举值格式'
}, {
  value: 'editor',
  label: '富文本格式'
}, {
  value: 'dictionary',
  label: '数据字典格式'
}, {
  value: 'selector',
  label: '选择器格式'
}, {
  value: 'customDialog',
  label: '自定义对话框'
}, {
  value: 'attachment',
  label: '附件格式'
}]

export const resultFieldTypeOptions = [{
  value: 'orig',
  label: '原样输出'
}, {
  value: 'datePicker',
  label: '日期格式'
}, {
  value: 'select',
  label: '枚举值格式'
}, {
  value: 'dictionary',
  label: '数据字典格式'
}, {
  value: 'selector',
  label: '选择器格式'
}, {
  value: 'attachment',
  label: '附件格式'
}]

export const numberTypeOptions = [{
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
export const numberFormatOptions = [{
  value: 'orig',
  label: '原样输出'
}, {
  value: 'thousands',
  label: '千分位'
}, {
  value: 'capital',
  label: '人民币大写'
}, {
  value: 'percent',
  label: '百分比'
}]

export const storageFormatOptions = [{
  value: 'json',
  label: 'json'
}, {
  value: 'id',
  label: '仅ID'
}, {
  value: 'bind',
  label: '绑定ID'
}]

export const treeDisplayOptions = [
  { value: 'id_', label: '主键' },
  { value: 'ip_', label: 'IP地址' },
  { value: 'create_by_', label: '创建人' },
  { value: 'create_time_', label: '创建时间' },
  { value: 'update_by_', label: '更新人' },
  { value: 'update_time_', label: '更新时间' },
  { value: 'chan_wei_', label: '单位名' },
  { value: 'bu_men_', label: '部门名' },
  { value: 'xing_ming_', label: '姓名' },
  { value: 'zhi_wu_', label: '职务' },
  { value: 'chu_cha_shi_jian', label: '出差时间' },
  { value: 'chu_ci_shi_jian1_', label: '返回时间' },
  { value: 'chu_chai_di_dian_', label: '出差地点' },
  { value: 'ren_wu_', label: '任务' },
  { value: 'jtsds', label: '交通实得数' },
  { value: 'jtfps', label: '交通发票数' },
  { value: 'zssds', label: '住宿实得数' },
  { value: 'zsfps', label: '住宿发票数' },
  { value: 'jin_tie_bu_zhu_', label: '津贴补助' },
  { value: 'he_ji_', label: '合计' },
  { value: 'ge_ji_dai_xie_', label: '合计大写' },
  { value: 'tian_bao_ren_', label: '填报人' },
  { value: 'bmfzryj', label: '审核意见' },
  { value: 'bmspr', label: '审批人' },
  { value: 'bmspsj', label: '审批时间' },
  { value: 'bmbz', label: '备注' },
  { value: 'ren_shi_yi_xian_', label: '审批意见' },
  { value: 'rsspr', label: '审批人' },
  { value: 'rsspsj', label: '审批时间' },
  { value: 'bz1', label: '备注' },
  { value: 'cai_wu_yi_xian_', label: '审批意见' },
  { value: 'cai_wu_shen_pi_ren', label: '审批人' },
  { value: 'cwspsj', label: '审批时间' },
  { value: 'cai_wu_bei_zhu_', label: '备注' },
  { value: 'cwfzryj', label: '审批意见' },
  { value: 'cwfzrspr', label: '审批人' },
  { value: 'cwfzrspsj', label: '审批时间' },
  { value: 'bz2', label: '备注' },
  { value: 'dwfzryj', label: '审批意见' },
  { value: 'dwfzspr', label: '审批人' },
  { value: 'dwfzrspsj', label: '审批时间' },
  { value: 'bz3', label: '备注' },
  { value: 'chu_na_yi_jian_', label: '审核意见' },
  { value: 'chu_na_ren_', label: '审核人' },
  { value: 'chu_na_shi_jian_', label: '审核时间' },
  { value: 'chu_na_bei_zhu_', label: '备注' },
  { value: 'kuai_ji_ji_zhang_', label: '审核意见' },
  { value: 'kuai_ji_ren_yuan_', label: '记账人' },
  { value: 'ji_zhang_shi_jian_', label: '记账时间' },
  { value: 'bz4_', label: '备注' },
  { value: 'chan_wei_i_d_', label: '单位' },
  { value: 'bu_men_i_d_', label: '部门' },
  { value: 'yong_hu_i_d_', label: '用户id' },
  { value: 'zong_tian_shu_', label: '总天数' },
  { value: 'zong_e_', label: '总额' },
  { value: 'zong_e_dai_xie_', label: '总额大写' },
  { value: 'zong_zhu_xiu_', label: '总住宿' }
]
