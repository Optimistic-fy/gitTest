<template>
  <div>
    <div class="mine page_box">
      <button class="btn header_user_info" @click="getuserinfo">
        <div class="nick_name"> {{tel !== '' ? tel : '点击登录'}} </div>
      </button>

      <div class="user_center_list">
        <div v-for="(item,index) in userList" :key="index" class="block" @click="userInfoEdit(item.url)">
          <div class="icon"><img class="img" :src="item.icon" mode="" /></div>
          <div class="title">{{item.title}}</div>
          <img class="icon_right" :src="publicPath + 'right_icon.png' + '?time=' + new Date().getTime()" />
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { telStart } from '../utils/public'
import { requireShare } from '../utils/share.js'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Mine',
  data() {
    return {
      popupShow: false,
      title: 'makePhoneCall',
      disabled: true,
      servicePhone: '400-013-0365',
      userList: [],
      tel: '',
      publicPath: ''
      // isPerfect: false
    }
  },
  activated() {
    this.storeInfo();
    if (localStorage.getItem('mobile') !== null && localStorage.getItem('SnowflakeId') !== null) {
      let call = localStorage.getItem('mobile')
      this.tel = telStart(call)
    } else {
      this.tel = ''
    }
    this.initShare().then((res) => {
      requireShare(this.shareParam);
    });
  },
  computed: {
    ...mapState(['appid', 'stylePath', 'moduleStatus'])
  },
  created() {
    this.publicPath = this.stylePath + this.appid + "/img/";
    this.$store.dispatch('getModuleStatus', () => {
      this.initList(); //初始化显示列表
    });
  },
  methods: {
    ...mapActions(['storeInfo']),
    // 路由跳转
    userInfoEdit(url) {
      let vm = this
      vm.$store.dispatch('hasInfo').then(res => {
        this.$get(`${this.$global.PREFIX}/user/info/perfect`).then(res => {
          if (res.data.root && url == '/infoCollectEditDetail') {
            vm.$router.push({ path: `/${vm.appid}/infoCollectEditDetail` })
          } else if (!res.data.root && url == '/infoCollectEditDetail') {
            vm.$router.push({ path: `/${vm.appid}/infoCollectEdit` })
          } else {
            vm.$router.push({ path: `/${vm.appid}` + url })
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    //联系客服
    callService() {
      this.popupShow = true;
    },
    closeService() {
      this.popupShow = false;
    },
    callPhoneCall(tel) {
      window.location.href = "tel:" + tel
    },
    clickName() {
      this.$router.push({ path: `/${this.appid}/userIformation` })
    },
    // 获取用户权限
    getuserinfo() {
      // 判断用户是否登陆
      this.$store.dispatch('hasInfo').then(res => {
        this.$router.push({ path: `/${this.appid}/userIformation` })
      })
    },
    //初始化显示列表
    initList() {
      let list = [
        { icon: 'icon_resume.png', title: '我的简历', url: '/resume', show: true },
        { icon: 'icon_send.png', title: '我的投递', url: '/myDelivery', show: true },
        { icon: 'icon_collect.png', title: '我的信息采集', url: '/infoCollectEditDetail', show: true },
        // { icon: 'icon_train.png', title: '我的培训报名', url: '/myTrainSignUp', show: true }
      ];
      const items = ['myResumeHide', 'myDeliverHide', 'myInfoHide'];
      console.log(this.moduleStatus);
      for(let i = 0; i < items.length; i++) {
        if (this.moduleStatus[items[i]]) {
          list[i].show = false;
        } 
      }
      var prefixUrl = this.stylePath + this.appid;
      for (var key in list) {        
        list[key].icon = prefixUrl + "/img/" + list[key].icon + '?time=' + new Date().getTime();
      }
      this.userList = list.filter((item) => item.show);
    },
    initShare() {
      let vm = this;
      return new Promise((resolve, reject) => {
        let typeName = "home";
        let currentUrl = window.location.href;
        let urlArr = currentUrl.split("/");
        let newArr = urlArr.slice(0);
        newArr.pop();
        let newCurrentUrl = newArr.join('/');
        vm.shareParam = {
          type: typeName,
          imgUrl: vm.stylePath + vm.appid + "/img/sd_share_img.jpg" + "?" + new Date().getTime(),
          desc: "",
          title: "",
          link: newCurrentUrl + "/home?isshare=true"
        }
        resolve()
      })
    }

  }
}
</script>
<style scoped>
.page_box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f4f4f4;
}
body {
  background: #f4f4f4;
}
.header_user_info {
  width: 100%;
  display: flex;
  align-items: center;
  height: 184px;
  padding: 0 30px;
  margin-bottom: 10px;
  background: #ffffff;
}
.header_user_info .avatar {
  width: 100px;
  height: 100px;
  border-radius: 100px;
  overflow: hidden;
  margin-right: 30px;
}
.header_user_info .avatar .img {
  width: 100%;
  height: 100%;
}
.nick_name {
  font-weight: bold;
  font-size: 35px;
  padding-left: 30px;
}
.user_center_list {
  background: #ffffff;
}
.user_center_list .block {
  display: flex;
  margin: 0 30px;
  height: 115px;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
  position: relative;
}
.user_center_list .block:last-child {
  border-bottom: none;
}
.user_center_list .block .icon {
  width: 36px;
  height: 36px;
  margin-right: 30px;
}
.user_center_list .block .icon .img {
  display: block;
  width: 100%;
  height: 100%;
}
.user_center_list .block .title {
  font-size: 30px;
}
.icon_right {
  position: absolute;
  right: 10px;
  height: 22px;
  width: 15px;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
.popup_content {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 550px;
  margin-left: -250px;
  margin-top: -300px;
  border-radius: 10px;
  font-size: 28px;
  background: #fff;
  z-index: 100;
}
.popup_content div {
  text-align: center;
  align-items: center;
}
.call_title {
  height: 100px;
  line-height: 100px;
  margin-top: 40px;
}
.btn_box {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #c8c7cc;
  margin-top: 20px;
  padding: 20px 0;
}
.btn_cancel {
  height: 80px;
  line-height: 80px;
  width: 49%;
  text-align: center;
}
.btn_call {
  width: 290px;
  color: red;
  text-align: center !important;
}
.btn_cancel {
  color: #000;
  border-right: 1px solid #c8c7cc;
}
</style>