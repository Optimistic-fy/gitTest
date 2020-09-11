<template>
  <div class="result">
    <div class="sign-result">
      <div class="top">
        <div class="pic">
          <img :src="publicPath + 'sing_up_succeed.png' + '?time=' + new Date().getTime()" />
        </div>
        <div class="signSuccess">您已经成功报名了</div>
        <div class="signSchool" v-if="result !== [] && result !== null">《{{result.schoolName}}》{{result.majorName}}{{result.courseName}}！</div>
      </div>
      <div class="bottom" v-if="result !== []">
        <div class="title">
          学院信息
        </div>
        <p v-if="result.schoolAddress">学院地址：{{result.schoolAddress}}</p>
        <p v-if="result.schoolPhone">联系电话：{{result.schoolPhone}}</p>
        <p v-if="result.schoolEmail">学院邮箱：{{result.schoolEmail}}</p>
        <p v-if="result.schoolHomePage">学院官网：{{result.schoolHomePage}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { requireShare } from '../utils/share.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      result: [],
      publicPath: ''
    }
  },
  created() {
    this.publicPath = this.stylePath + this.appid + "/img/";
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  mounted() {
    requireShare();
    let vm = this
    let id = this.$route.query.id
    vm.$get(`${vm.$global.PREFIX}/enroll/info/` + id).then(res => {
      if (res.data.code === 200) {
        vm.result = res.data.root
      }
    })
  }
}
</script>

<style scoped>
.result,
.sign-result {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.sign-result {
  background: #f4f4f4;
}
.top {
  width: 100%;
  margin: 0 auto;
  background: #fff;
  margin-bottom: 10px;
}
.top .pic {
  width: 100%;
  display: flex;
  justify-content: center;
}
.top img {
  display: block;
  width: 480px;
  height: 480px;
}
.signSuccess,
.signSchool {
  width: 85%;
  margin: 0 auto;
  text-align: center;
  font-size: 45px;
  letter-spacing: 5px;
}
.signSchool {
  font-size: 30px;
  padding-top: 10px;
}
.bottom {
  padding: 20px 30px;
}
.bottom .title {
  font-size: 35px;
  text-align: center;
}
.bottom p {
  font-size: 30px;
  padding-top: 15px;
}
</style>