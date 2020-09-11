<template>
  <van-tabbar route>
    <van-tabbar-item replace
                     :to="'/' + appID + '/home'">
      <span>首页</span>
      <template #icon="props">
        <img :src="props.active ? icon1.active : icon1.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace
                     :to="'/' + appID +'/news'">
      <span>资讯</span>
      <template #icon="props">
        <img :src="props.active ? icon2.active : icon2.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace
                     :to="'/' + appID +'/job'">
      <span>求职招聘</span>
      <template #icon="props">
        <img :src="props.active ? icon3.active : icon3.inactive" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace
                     :to="'/' + appID +'/mine'">
      <span>我的</span>
      <template #icon="props">
        <img :src="props.active ? icon4.active : icon4.inactive" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'page-tabbar',
  components: {},
  data () {
    return {
      icon1: {
        active: 'home_icon_active.png?time=' + new Date().getTime(),
        inactive: 'home_icon.png?time=' + new Date().getTime(),
      },
      icon2: {
        active: 'news_icon_active.png?time=' + new Date().getTime(),
        inactive: 'news_icon.png?time=' + new Date().getTime(),
      },
      icon3: {
        active: 'job_icon_active.png?time=' + new Date().getTime(),
        inactive: 'job_icon.png?time=' + new Date().getTime(),
      },
      icon4: {
        active: 'my_icon_active.png?time=' + new Date().getTime(),
        inactive: 'my_icon.png?time=' + new Date().getTime(),
      },
      appID: ''
    }
  },
  created () {
    let url = window.location.href;
    this.appID = this.appid
    let publicPath = this.stylePath + this.appid + '/img/';
    this.icon1.active = publicPath + this.icon1.active;
    this.icon1.inactive = publicPath + this.icon1.inactive;

    this.icon2.active = publicPath + this.icon2.active;
    this.icon2.inactive = publicPath + this.icon2.inactive;

    this.icon3.active = publicPath + this.icon3.active;
    this.icon3.inactive = publicPath + this.icon3.inactive;

    this.icon4.active = publicPath + this.icon4.active;
    this.icon4.inactive = publicPath + this.icon4.inactive;
  },
  mounted () {
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  methods: {
  }
}
</script>

<style scoped>
a {
  color: #000;
}
.mint-tabbar {
  border-top: 1px solid #ccc;
}
.mint-tabbar a {
  width: 25%;
  display: flex;
  justify-content: space-around;
}
.mint-tabbar .mint-tab-item {
  display: block;
}
</style>