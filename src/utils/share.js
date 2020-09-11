import { post, get } from './request'
import global from '../utils/global.js'
import wx from 'weixin-js-sdk'
import state from '../store/state.js'

// 分享配置
function requireConfig() {
  var currentUrl = window.location.href;
  // console.log("currentUrl", currentUrl)
  post(`${global.PREFIX}/config`, { url: currentUrl }).then(res => {
    if (res.data.root) {
      let data = res.data.root;
      wx.config({
        debug: false, // 开启调试模式
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
      });
    }
  }).catch(err => {
    console.log(err)
  })
}

//分享设置
function requireShare(madeShare) {
  requireConfig();
  // console.log("madeShare", madeShare)
  if (madeShare != null) {
    allotShare(madeShare);
  } else {
    //初始化默认分享
    let shareState = state;
    let typeName = "home";
    let currentUrl = window.location.href;
    let urlArr = currentUrl.split("/");
    let newArr = urlArr.slice(0);
    newArr.pop();
    let newCurrentUrl = newArr.join('/');
    let shareParam = {
      type: typeName,
      imgUrl: shareState.stylePath + shareState.appid + "/img/sd_share_img.jpg" + "?" + new Date().getTime(),
      desc: "",
      title: "",
      link: newCurrentUrl + "/home?isshare=true"
    }
    allotShare(shareParam);
  }
}

function allotShare(param) {
  post(`${global.PREFIX}/share`, param).then(res => {
    let data = res.data.root;
    if (data) {
      wx.ready(function () {
        console.log("当前defaultShare", data)
        wx.updateAppMessageShareData(data);
        wx.updateTimelineShareData(data);
        // 自定义“分享给朋友”
        wx.onMenuShareAppMessage(data);
        // 自定义“分享到朋友圈”     
        wx.onMenuShareTimeline(data);
      })
    }
  })

}




export {
  requireShare
}
