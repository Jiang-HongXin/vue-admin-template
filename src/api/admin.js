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
