const URL = {
  DEFAULT_URL: '/platform/v3',
  OAUTH2_URL: '/oauth2/v3',

  PLATFORM_URL: '/platform/v3',
  ORG_URL: '/platform/v3', // org/v3
  FORM_URL: '/business/v3',
  DATA_URL: '/business/v3',
  CODEGEN_URL: '/business/v3',
  BPMN_URL: '/business/v3',

  AUTH_URL: '/platform/v3',
  CAT_URL: '/platform/v3',
  JOB_URL: '/platform/v3',
  SYSTEM_URL: '/platform/v3',
  LOG_URL: '/platform/v3',
  MSG_URL: '/platform/v3',
  MAIL_URL: '/platform/v3',
  OFFICE_URL: '/platform/v3',
  SERV_URL: '/platform/v3',

  DS_URL: '/platform/v3',
  INFO_URL: '/platform/v3',

  SOCKET_URL: '/platform/v3'
}

export default URL

export const OAUTH2_URL = URL.OAUTH2_URL
export const PLATFORM_URL = URL.PLATFORM_URL
export const ORG_URL = URL.ORG_URL
export const AUTH_URL = URL.AUTH_URL
export const CAT_URL = URL.CAT_URL
export const JOB_URL = URL.JOB_URL
export const SYSTEM_URL = URL.SYSTEM_URL
export const FORM_URL = URL.FORM_URL
export const BPMN_URL = URL.BPMN_URL
export const LOG_URL = URL.LOG_URL
export const MSG_URL = URL.MSG_URL
export const MAIL_URL = URL.MAIL_URL
export const OFFICE_URL = URL.OFFICE_URL
export const CODEGEN_URL = URL.CODEGEN_URL
export const DATA_URL = URL.DATA_URL
export const DS_URL = URL.DS_URL
export const INFO_URL = URL.INFO_URL
export const SOCKET_URL = URL.SOCKET_URL
export const SERV_URL = URL.SERV_URL
// 默认url
export const BASE_URL = process.env.VUE_APP_BASE_API
// 网关API 解决上传乱码问题
export const BASE_GATEWAY_API = process.env.VUE_APP_BASE_API
// websocket地址
export const BASE_WEBSOCKET_API = process.env.VUE_APP_BASE_WEBSOCKET_API

