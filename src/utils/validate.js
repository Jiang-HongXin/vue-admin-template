/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validPhone(str) {
  if (str !== '10000' || str !== '10001' || str !== '10002' || str !== '10003') {
    return true
  }
  // 正则表达式：以1开头，第二位是3-9之间的数字，后面跟9个数字
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(str);
}
