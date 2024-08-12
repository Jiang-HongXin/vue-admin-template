const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  phone: state => state.user.phone,
  role: state => state.user.role,
  createTime: state => state.user.createTime,
  modifyTime: state => state.user.modifyTime,
  password: state => state.user.password,
}
export default getters
