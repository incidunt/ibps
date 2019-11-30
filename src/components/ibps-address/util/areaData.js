import { getAreaData as getData } from '@/api/platform/cat/area'

export function getAreaData() {
  return new Promise((resolve, reject) => {
    getData().then(response => {
      resolve(response.data)
    }).catch((error) => {
      // 异常
      reject(error)
    })
  })
}

