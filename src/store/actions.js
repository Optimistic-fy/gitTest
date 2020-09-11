import * as Contants from './mutationType'
import {
  Dialog,
  Toast
} from 'vant'
import router from '../router/index'
import {
  getRequest
} from '../utils/public'
import global from '../utils/global.js'
import {
  post,
  get
} from '../utils/request'
import {
  encryption
} from '../utils/public'

export default {
  showloader: ({
    commit
  }) => {
    commit(Contants.SHOWLOADING)
  },
  hideloader: ({
    commit
  }) => {
    commit(Contants.HIDELOADING)
  },
  ifAuthorization({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      //登录页面链接
      let url = window.location.href
      if (getRequest(url).hasOwnProperty('code')) {
        // 在这里向后台请求openID
        get(`${global.PREFIX}/auth/sj/` + getRequest(url).code).then((res) => {
          console.log('code-res', res)
          if (res.data.code === 200) {
            if (res.data.root !== null) {
              commit('userOption', res.data.root)
              resolve(res.data.root)
            }
          }
        }).catch(err => {
          reject(err)
        })
      } else {
        let logurl = 'https://guidance.81lianpin.com/sd/login'
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5dffe7c6e0a20566&redirect_uri=' + encodeURIComponent(logurl) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect'
      }
    })
  },
  hasInfo({
    dispatch,
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      let openid = state.userInfo.openid || localStorage.getItem('Openid')
      let snowflakeId = state.userInfo.snowflakeId || localStorage.getItem('SnowflakeId')
      if (openid !== null && openid !== '' && openid !== undefined) {
        if (snowflakeId !== null) {
          new Promise((resolve, reject) => {
            post(`${global.PREFIX}/access/token`, {
              uid: snowflakeId
            }).then(res => {
              if (res.data.root !== null) {
                localStorage.setItem('Access-Token', res.data.root);
                state.userInfo.accessToken = res.data.root;
                resolve(res.data.root);
              }
            }).catch(err => {
              console.log(err)
            })
          }).then(res => {
            resolve()
          })
        } else {
          dispatch('toLogin')
        }
      } else {
        dispatch('toLogin')
      }
    })
  },
  // 判断用户是否完善简历
  resumePerfect({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      get(`${global.PREFIX}/resume/perfect`).then(res => {
        if (!res.data.root) {
          Dialog.confirm({
            message: '您的简历未完善，请先完善简历'
          }).then(() => {
            router.push({
              path: `/${state.appid}/resume`
            })
          }).catch(() => {
            // on cancel
          })
        } else {
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  storeInfo({
    commit
  }) {
    let url = window.location.href;
    let arg = getRequest(url);

    if (arg.snowflakeId !== undefined && arg.accessToken !== undefined) {
      if (arg.openid != undefined && arg.openid != '') {
        commit('userOption', arg)
      } else {
        Dialog.alert({
          message: '请在微信进行登录！',
        }).then(() => {
          // on close
        });
      }
    }
  },
  toLogin() {
    Dialog.confirm({
      message: '您还未登录，请先登录'
    }).then(() => {
      let url = window.location.href
      window.location.href = `https://guidance.81lianpin.com/li/login?from=${encryption(url)}`
    }).catch(() => {
      // on cancel
    })
  },
  getAppidInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      get(`${global.PREFIX}/bottom/${state.appid}`).then(res => {
        if (res.data.root) {
          commit('getAppidInfo', res.data.root)
          resolve(res.data.root.provinceName)
        }
      }).catch(err => {
        console.log(err);
      })
    })
  },

  // 获取页面组件开关状态
  getModuleStatus({state, commit}, cb) {
    get(`${global.PREFIX}/show/${state.appid}`).then(res => {
      if (res.data.root) {
        commit('updateModuleStatus', {'data': res.data.root});
        cb && cb();
      }
    });
  }
}