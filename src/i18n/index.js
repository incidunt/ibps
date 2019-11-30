import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './lang/en'
import zhCNLocale from './lang/zh-CN'
import db from '@/utils/util.db'

Vue.use(VueI18n)
const messages = {
  'en': {
    ...enLocale,
    ...elementEnLocale
  },
  'zh-CN': {
    ...zhCNLocale,
    ...elementZhCNLocale
  }
}
// 默认国际化
const locale = db.get('sys.public.language.value').value() || 'zh-CN'

const i18n = new VueI18n({
  locale,
  messages // set locale messages
})

export default i18n
