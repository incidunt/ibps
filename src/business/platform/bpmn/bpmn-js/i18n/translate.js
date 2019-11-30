import Lang from '@/utils/i18n'
import I18n from '@/i18n/bpmn-js'

export default function translate(template, replacements) {
  const locale = Lang.getLanguage() || 'zh-CN'
  const translations = I18n[locale]
  replacements = replacements || {}

  // Translate
  template = translations[template] || template

  // Replace修复 格式bug
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] ? (translations[replacements[key]] || replacements[key]) : ''
  })
}
