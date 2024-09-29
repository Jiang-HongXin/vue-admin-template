import defaultSettings from '@/settings'

const title = defaultSettings.title || '证书提交系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
