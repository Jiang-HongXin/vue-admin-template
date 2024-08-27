import {info, login, logout} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {addRoutes, resetRouter} from '@/router'
import {Message} from "element-ui";
import store from "@/store";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    createTime: '',
    modifyTime: '',
    role: '',
    phone: '',
    password: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password }).then(response => {
        const data = response.data
        Object.assign(state, data);
        setToken(data.token)
        addRoutes(store.getters.role)

        resolve()
      }).catch(error => {
        Message({
          message: error || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        reject(error)
      })
    })
  },

  info() {
    return new Promise((resolve, reject) => {
      info().then(response => {
        const data = response.data
        Object.assign(state, data);
        addRoutes(data.role)

        resolve()
      }).catch(error => {
        Message({
          message: error || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

