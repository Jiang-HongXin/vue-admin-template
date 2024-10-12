import request from '@/utils/request'

export function exportTpl() {
  return request({
    url: '/admin/user/exportTpl',
    method: 'post',
    responseType: 'blob'
  })
}

export function importData(data) {
  return request({
    url: '/admin/user/importData',
    method: 'post',
    data
  })
}

export function getDictionaryV2(data) {
  return request({
    url: '/admin/dic/listV2',
    method: 'post',
    data
  })
}

export function operateDictionary(data) {
  return request({
    url: '/admin/dic/operate',
    method: 'post',
    data
  })
}

export function deleteDictionary(data) {
  return request({
    url: '/admin/dic/delete',
    method: 'post',
    data
  })
}
