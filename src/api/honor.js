import request from '@/utils/request'


export function getDictionary() {
  return request({
    url: '/dic/list',
    method: 'get'
  })
}

export function uploadFile(data) {
  return request({
    url: '/honor/upload',
    method: 'post',
    data
  })
}


export function addHonor(data) {
  return request({
    url: '/honor/insert',
    method: 'post',
    data
  })
}
