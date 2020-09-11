import * as Contants from './mutationType'

export default {
  [Contants.SHOWLOADING](state) {
    state.showLoading = true
  },
  [Contants.HIDELOADING](state) {
    state.showLoading = false
  },
  userOption(state, info) {
    if (info.openid) {
      localStorage.setItem('Openid', info.openid)
    }
    if (info.mobile) {
      localStorage.setItem('mobile', info.mobile)
    }
    if (info.snowflakeId) {
      localStorage.setItem('SnowflakeId', info.snowflakeId)
    }
    if (info.accessToken) {
      localStorage.setItem('Access-Token', info.accessToken)
    }
  },
  getAppidInfo(state, data) {
    state.title = data.title;
    state.linkTitle = data.remark;
    state.linkRouter = data.url;
    state.provinceName = data.provinceName;
    state.zphUrl = data.zphUrl;
  },
  updateModuleStatus(state, {data}) {
    state.moduleStatus = data;
  }
}