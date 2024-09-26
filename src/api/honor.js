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

export function downloadFile(data) {
  return request({
    url: '/honor/download/' + data.fileIndex,
    method: 'get',
    responseType: 'blob'
  })
}


export function addHonor(data) {
  return request({
    url: '/honor/insert',
    method: 'post',
    data
  })
}

export function updateHonor(data) {
  return request({
    url: '/honor/update',
    method: 'post',
    data
  })
}


export function listHonor(data) {
  return request({
    url: '/honor/list',
    method: 'post',
    data
  })
}
export function exportHonor(data) {
  return request({
    url: '/honor/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function auditHonor(data) {
  return request({
    url: '/honor/audit',
    method: 'post',
    data,
  })
}
