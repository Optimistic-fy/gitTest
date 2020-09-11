<template>
  <div class="home">
    <div class="content"
         ref="homeRef">
      <div class="index-content">
        <div class="down">{{text}}</div>
        <!-- 滚动条 -->
        <div class="banner">
          <div class="uni-padding-wrap">
            <div class="page-section swiper">
              <div class="page-section-spacing">
                <van-swipe class="swiper"
                           :autoplay="4000">
                  <van-swipe-item v-for="(item, index) in imgs"
                                  :key="index"
                                  @touchstart="onTouchStart"
                                  @touchmove="onTouchMove"
                                  @touchend="onTouchEnd(item.articleType, item.articleSnowflakeId, item.url)">
                    <div class="swiper-img">
                      <img v-lazy="item.imageUrl" />
                    </div>
                  </van-swipe-item>
                </van-swipe>
              </div>
            </div>
          </div>
        </div>
        <!-- 四个跳转链接 -->
        <div class="link-lits">
          <ul>
            <li @click="clickConsulting">
              <div>
                <img class="consulting"
                     :src="publicPath + 'list_icon1.png' + '?time=' + new Date().getTime()" />
                最新资讯
              </div>
            </li>
            <li>
              <div @click="clickRecruitment">
                <img class="recruitment"
                     :src="publicPath + 'list_icon2.png' + '?time=' + new Date().getTime()" />
                求职招聘
              </div>
            </li>
            <li @click="clickSign">
              <div>
                <img class="sign-up"
                     :src="publicPath + 'list_icon3.png' + '?time=' + new Date().getTime()" />
                政策法规
              </div>
            </li>
            <li @click="clickInformat"
                v-if="!this.moduleStatus.infoIconHide">
              <div>
                <img class="collect"
                     :src="publicPath + 'list_icon4.png' + '?time=' + new Date().getTime()" />
                信息采集
              </div>
            </li>
          </ul>
        </div>
        <!-- 政策 、 线上 -->
        <div class="rules">
          <div class="online">
            <ul>
              <li @click="clickOnline">
                <div>
                  <img :src="publicPath + 'item_pic1.png' + '?time=' + new Date().getTime()" />
                  线上招聘会
                </div>
              </li>
              <li @click="jumpEdu">
                <div>
                  <img :src="publicPath + 'item_pic2.png' + '?time=' + new Date().getTime()" />
                  在线课程
                </div>
              </li>
              <li @click="clickMeasurement">
                <div>
                  <img :src="publicPath + 'item_pic3.png' + '?time=' + new Date().getTime()" />
                  在线测评
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 最新咨询 -->
        <div class="news-consulting">
          <div class="consulting-head"
               @click="clickConsultingMore">
            <div class="left">
              <img :src="publicPath + 'list_title1.png' + '?time=' + new Date().getTime()" />
              <span class="default_color">最新资讯</span>
            </div>
            <div class="right">
              <span>更多</span>
              <img :src="publicPath + 'more_icon.png' + '?time=' + new Date().getTime()" />
            </div>
          </div>
          <ul class="consulting-list">
            <template v-for="(newsitem, index) in news">
              <li @click="clickConsultingItem(newsitem.snowflakeId)"
                  :key="index"
                  v-if="index < 7">
                <div class="consulting-content">
                  {{newsitem.title}}
                </div>
                <div class="time">
                  {{newsitem.createTime.split(' ')[0]}}
                  <img :src="publicPath + 'right_icon.png' + '?time=' + new Date().getTime()" />
                </div>
              </li>
            </template>
          </ul>
        </div>
        <!-- 最热招聘 -->
        <div class="news-recruitment">
          <div class="recruitment-head"
               @click="clickHot">
            <div class="left">
              <img :src="publicPath + 'list_title2.png' + '?time=' + new Date().getTime()" />
              <span class="default_color">最热招聘</span>
            </div>
            <div class="right">
              <span>更多</span>
              <img :src="publicPath + 'more_icon.png' + '?time=' + new Date().getTime()" />
            </div>
          </div>
          <ul class="recruitment-list">
            <template v-for="(recruitment, index) in hot">
              <li :key="recruitment.id"
                  @click="clickHotList(recruitment.id)"
                  v-if="index < 7">
                <div class="recruitment-content"
                     v-if="recruitment.jobTitle.includes(recruitment.cityName)">
                  {{recruitment.jobTitle}}
                </div>
                <div class="recruitment-content"
                     v-else>
                  {{recruitment.jobTitle}}[{{recruitment.cityName}}]
                </div>
                <div class="time">
                  {{recruitment.createTime.split(' ')[0]}}
                  <img :src="publicPath + 'right_icon.png' + '?time=' + new Date().getTime()" />
                </div>
              </li>
            </template>
          </ul>
        </div>
        <!-- 热门培训 -->
        <div class="news-training" v-if="appid === 'app71rrf9ksr'">
          <div class="training-head" @click="clickTrainingMore">
            <div class="left">
              <img :src="publicPath + 'list_title4.png' + '?time=' + new Date().getTime()" />
              <span class="default_color">热门培训</span>
            </div>
            <div class="right">
              <span>更多</span>
              <img :src="publicPath + 'more_icon.png' + '?time=' + new Date().getTime()" />
            </div>
          </div>
          <ul class="training-list">
            <template v-for="(train, index) in training">
              <li v-if="index < 7" :key="train.id" @click="clickTrainingItem(train.snowflakeId)">
                <div class="training-content">
                  {{train.name}}
                </div>
                <div class="time">
                  {{train.createTime.split(' ')[0]}}
                  <img :src="publicPath + 'right_icon.png' + '?time=' + new Date().getTime()" />
                </div>
              </li>
            </template>
          </ul>
        </div>
        <!-- 求职指南 -->
        <div class="news-guide"
             v-if="!this.moduleStatus.jobGuideHide">
          <div class="guide-head"
               @click="clickGuide">
            <div class="left">
              <img :src="publicPath + 'list_title3.png' + '?time=' + new Date().getTime()" />
              <span class="default_color">求职指南</span>
            </div>
            <div class="right">
              <span>更多</span>
              <img :src="publicPath + 'more_icon.png' + '?time=' + new Date().getTime()" />
            </div>
          </div>
          <ul class="guide-list">
            <template v-for="(item, index) in guideList">
              <li @click="clickGuideList(item.snowflakeId)"
                  :key="item.id"
                  v-if="index < 3">
                <div class="guide-content">
                  {{item.title}}
                </div>
                <div class="time">
                  {{item.publishTime.split(' ')[0]}}
                  <img :src="publicPath + 'right_icon.png' + '?time=' + new Date().getTime()" />
                </div>
              </li>
            </template>
          </ul>
        </div>
        <!-- 生活技能 -->
        <ul class="skill-content">
          <li v-for=" (item1, index) in skillList"
              :key="item1.id">
            <div class="skill-head">
              {{item1.name}}
            </div>
            <ul class="skill-item">
              <li v-for="item2 in item1.subList"
                  :key="item2.id"
                  @click="goRecruit(item2, index)">{{item2.name}}</li>
            </ul>
          </li>
        </ul>
        <!-- 底部 -->
        <div class="bottom">
          <div class="bottom-link">
            <div class="recruitment-platform">
              <img :src="publicPath + 'lp_small_logo.png' + '?time=' + new Date().getTime()" />
              <span>招聘平台</span>
            </div>
            <span class="line">|</span>
            <div class="employment-guidance">
              退役军人就业辅导
            </div>
          </div>
          <div class="bottom-connect">
            <p v-if="$store.state.appid !== '74web89ynsg'">
              主管部门：{{this.$store.state.provinceName}}退役军人事务厅
            </p>
            <p>
              <!-- 主管部门：{{this.$store.state.provinceName}}退役军人事务厅<br /> -->
              版权所有：北京军融英杰信息技术服务有限公司<br />
              <!-- 政策咨询邮箱：12jvio@133.com<br /> -->
              就业指导邮箱：hr@81lianpin.com
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 在线测评弹窗 -->
    <div class="mask"
         v-if="showMask">
      <div class="prompt">
        <div class="tittle_problem">
          <div class="close_icon_div">
            <div class="close_icon"
                 @click="closeMask">
              <img class="img"
                   :src="publicPath + 'close_icon.png' + '?time=' + new Date().getTime()" />
            </div>
          </div>
          <div class="content_pro">
            <p class="title1 default_color">退役军人求职30讲</p>
            <p class="title2">大咖“点石成金”，助你快人一步！</p>
            <div class="content_img_box">
              <img class="img"
                   :src="publicPath + 'edu_ma_30.png' + '?time=' + new Date().getTime()" />
            </div>
            <p class="renize">长按扫描二维码，探索求职那些事儿</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requireShare } from '@/utils/share.js'
import BScroll from 'better-scroll'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      news: [],
      hot: [],
      training: [],
      skillList: [],
      searchParam: {
        pageNumber: 1, // 几页
        pageSize: 7, // 一页的数量
      },
      guideList: [],
      searchKeyword: '',
      hotJobParams: {
        pageNumber: 1, // 几页
        pageSize: 7, // 一页的数量
        provinceName: this.$store.state.provinceName,
      },
      showMask: false,
      bannerParam: {
        pageNumber: 1, // 几页
        pageSize: 4, // 一页的数量
      },
      imgs: [],
      homeScroll: null,
      text: '',
      clickFlag: false,
      publicPath: '',
      shareParam: {}
    }
  },
  created () {
    let vm = this;
    this.getInfo();
    this.getAppidInfo();
    this.publicPath = this.stylePath + this.appid + "/img/";
  },
  mounted () {

  },
  computed: {
    ...mapState(['userInfo', 'appid', 'stylePath', 'moduleStatus'])
  },
  methods: {
    ...mapActions(['hasInfo', 'storeInfo']),
    // 修改首页title
    getAppidInfo () {
      this.$get(`${this.$global.PREFIX}/bottom/${this.appid}`).then(res => {
        if (res.data.root) {
          document.title = res.data.root.title;
        }
      })
    },
    onDownRefresh () {
      this.getInfo();
      this.homeScroll.finishPullDown();
    },
    getInfo () {
      let vm = this
      let imgp = new Promise((resolve, reject) => {
        vm.$post(`${vm.$global.PREFIX}/image/page?` + Math.random() / 9999, vm.bannerParam).then(res => {
          if (res.status === 200) {
            let data = res.data.root
            vm.imgs = data.content
            resolve()
          }
        }).catch(err => {
          console.log(err)
        })
      })

      let newp = new Promise((resolve, reject) => {
        vm.$post(`${vm.$global.PREFIX}/news/page?` + Math.random() / 9999, vm.searchParam).then(res => {
          if (res.status === 200) {
            let data = res.data.root
            vm.news = data.content
            resolve()
          }
        }).catch(err => {
          console.log(err)
        })
      })

      let jobp = new Promise((resolve, reject) => {
        vm.$post(`${vm.$global.PREFIX}/job/hot?` + Math.random() / 9999, vm.hotJobParams).then(res => {
          if (res.status === 200) {
            let data = res.data.root
            vm.hot = data.content
            resolve()
          }
        }).catch(err => {
          console.log(err)
        })
      })

      let schoolp = new Promise((resolve, reject) => {
        vm.$post(`${vm.$global.PREFIX}/school/list?` + Math.random() / 9999, vm.searchParam).then(res => {
          if (res.status === 200) {
            let data = res.data.root
            vm.training = data.content
            resolve()
          }
        }).catch(err => {
          console.log(err)
        })
      })

      let categoryp = new Promise((resolve, reject) => {
        vm.$get(`${vm.$global.PREFIX}/category/industry`).then(res => {
          if (res.status === 200) {
            vm.skillList = res.data.root
            resolve()
          }
        }).catch(err => {
          console.log(err)
        })
      })

      let guidep = new Promise((resolve, reject) => {
        vm.$post(`${vm.$global.PREFIX}/guide/list`, vm.searchParam).then(res => {
          if (res.status === 200) {
            let data = res.data.root
            vm.guideList = data.content
            resolve()
          }
        }).catch(err => {
          console.log(err)
        })
      })
      Promise.all([imgp, newp, jobp, categoryp, guidep]).then(res => {
        this.$nextTick(() => {
          this._initScroll();
        })
      })
    },
    clickPosite () {
      // this.$router.push('/pages/cityChoose/cityChoose')
    },
    clickOnline () {
      window.location.href = this.$store.state.zphUrl;
    },
    clickMeasurement () {
      window.location.href = " https://81lianpin.com/coupon/index/#/coupon";
    },
    clickConsulting () {
      this.$router.push({ path: `/${this.appid}/news` });
    },
    clickRecruitment () {
      this.$router.push({ path: `/${this.appid}/job` });
    },
    clickInformat () {
      this.hasInfo().then(res => {
        this.$get(`${this.$global.PREFIX}/user/info/perfect`).then(res => {
          if (res.data.root) {
            this.$router.push({ path: `/${this.appid}/infoCollectEditDetail` });
          } else {
            this.$router.push({ path: `/${this.appid}/infoCollectEdit` });
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    clickHot () {
      this.$router.push({ path: `/${this.appid}/job` });
    },
    clickSign () {
      this.$router.push({ path: `/${this.appid}/policy` });
    },
    clickConsultingMore () {
      this.$router.push({ path: `/${this.appid}/news` });
    },
    clickConsultingItem (id) {
      this.$router.push({ path: `/${this.appid}/newsDetail`, query: { id } });
    },
    clickTrainingMore () {
      this.$router.push({ path: `/${this.appid}/recruitColleges` });
    },
    clickTrainingItem (id) {
      this.$router.push({ path: `/${this.appid}/recruitCollegesDetail`, query: { id } });
    },
    clickGuide () {
      this.$router.push({ path: `/${this.appid}/jobGuide` });
    },
    clickGuideList (id) {
      this.$router.push({ path: `/${this.appid}/jobGuideDetail`, query: { id } });
    },
    clickHotList (id) {
      this.$router.push({ path: `/${this.appid}/jobDetail`, query: { id } });
    },
    // 查看求职招聘
    goRecruit (item, index) {
      localStorage.setItem('industryId', item.id)
      localStorage.setItem('industryName', item.name)
      localStorage.setItem('industryIndex', index)
      this.$router.push({ path: `/${this.appid}/job` });
    },
    _initScroll () {
      if (!this.homeScroll) {
        this.homeScroll = new BScroll(this.$refs.homeRef, {
          scrollY: true,
          pullDownRefresh: {
            threshold: 50,
          },
          click: true,
          scrollbar: {
            fade: true,
            interactive: false
          }
        })

        this.homeScroll.on('pullingDown', () => {
          this.onDownRefresh()
        })

        this.homeScroll.on('scroll', (position) => {
          if (position.y > 50) {
            this.text = '释放立即刷新'
          } else {
            this.text = '下拉刷新'
          }
        })
      } else {
        this.homeScroll.refresh()
      }
    },

    // 去往三十讲
    jumpEdu () {
      if (this.appid === '74web89ynsg') {
        document.location.href = 'http://m.px.81lianpin.com';
      } else {
        this.showMask = !this.showMask;
      }
    },
    closeMask () {
      this.showMask = !this.showMask;
    },
    onTouchStart (e) {
      // this.clickIndex = 0; // 为了兼容安卓部分情况而加，如果不需要可忽略
      this.clickFlag = false;
    },
    // 用于判断滑动还是点击
    onTouchMove (e) {
      this.clickFlag = true;
      // 为了兼容安卓部分情况而加的判断，如果不需要可忽略，若需要，注释上面一行代码，打开下面三行代码
      // this.clickIndex = this.clickIndex + 1;
      // if (this.clickIndex > 2) {
      //   this.clickFlag = true;
      // }
    },
    onTouchEnd (articleType, id, url) {
      if (!this.clickFlag) { // 点击
        if (url != null) {
          window.location.href = url
        } else {
          if (articleType === 'news') {
            this.$router.push({ path: `/${this.appid}/newsDetail`, query: { id } });
          } else {
            this.$router.push({ path: `/${this.appid}/policyDetail`, query: { id } });
          }
        }
      }
    },
    initShare () {
      let vm = this;
      return new Promise((resolve, reject) => {
        let typeName = vm.$route.name;
        let currentUrl = window.location.href;
        if (currentUrl.indexOf("isshare") == -1) {
          currentUrl = currentUrl + "?isshare=true";
        }
        vm.shareParam = {
          type: typeName,
          imgUrl: vm.stylePath + vm.appid + "/img/sd_share_img.jpg" + "?" + new Date().getTime(),
          desc: "",
          title: "",
          link: currentUrl
        }
        resolve()
      })
    }
  },
  activated () {
    let vm = this;
    if (this.homeScroll) {
      this.homeScroll.refresh();
    }
    this.storeInfo();
    vm.initShare().then((res) => {
      requireShare(vm.shareParam);
    });
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}
.img {
  width: 100%;
  height: 100%;
}
.content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 90px;
  background: #f4f4f4;
}
.tittle_name {
  padding: 0 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.head-search {
  position: fixed;
  left: 0;
  height: 80px;
  line-height: 80px;
  width: 100%;
  font-size: 30px;
  background: #f4f4f4;
  z-index: 1000;
  display: flex;
  align-items: center;
}
.posite {
  display: flex;
  align-items: center;
  /* float: left; */
  color: #ed4f4c;
}
.posite span {
  /* padding: 0 5px 0 20px; */
  padding-left: 20px;
  width: 120px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search_text {
  float: left;
  height: 100%;
  width: 520px;
  flex-shrink: 1;
}
.search_text .search {
  height: 50px;
  line-height: 50px;
  /* width: 600px; */
  width: 100%;
  text-align: left;
  font-size: 26px;
  margin: 15px 0 0 10px;
  background: #fff;
  border-radius: 10px;
}
.search .search-icon {
  display: inline-block;
  padding: 0 15px;
}
.uni-icon {
  color: #d1d1d1 !important;
}
.search span {
  color: #d1d1d1;
}
.search_text .search_input {
  /* width: 500px; */
  width: 427px;
  height: 50px;
  line-height: 50px;
  float: right;
  padding-right: 10px;
}
.icon-clock {
  float: left;
  width: 50px;
  height: 100%;
  padding: 0 0 0 40px;
}
.icon-clock img {
  padding: 15px 0;
  width: 40px;
  height: 40px;
}
.banner {
  width: 100%;
}
.banner .uni-padding-wrap {
  margin: 0;
}
.swiper,
.swiper .swiper-img {
  height: 428px;
  width: 100%;
}
.swiper .swiper-img img {
  height: 100%;
  width: 100%;
}
.link-lits {
  width: 100%;
  height: 170px;
  font-size: 24px;
  background: #fff;
}
.link-lits ul,
.online ul {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.link-lits li {
  width: 105px;
  height: 100%;
  display: flex;
  align-items: center;
}
.link-lits li img {
  display: block;
  height: 90px;
  width: 90px;
  margin: 0 auto 10px auto;
}
.rules {
  width: 100%;
  height: 210px;
}
.rules .policies {
  position: relative;
  height: 75px;
  width: 100%;
  padding: 15px 0;
}
.policies img {
  display: block;
  height: 100%;
  width: 100%;
}
.policies .more {
  position: absolute;
  top: 50%;
  right: 310px;
  margin-top: -10px;
  width: 26px;
  height: 26px;
}
.more img {
  height: 100%;
  width: 100%;
}
.rules .online {
  height: 200px;
  width: 100%;
  background: #fff;
}
.online ul li {
  width: 180px;
  height: 100%;
  font-size: 24px;
  display: flex;
  align-items: center;
}
.online ul li div {
  text-align: center;
}
.online ul li img {
  height: 120px;
  width: 180px;
  margin-bottom: 10px;
}
.news-consulting,
.news-recruitment,
.news-training,
.news-guide {
  margin-top: 10px;
  width: 100%;
  background: #fff;
}
.news-consulting {
  margin-top: 0;
}
.consulting-head,
.recruitment-head,
.training-head,
.guide-head {
  height: 90px;
  line-height: 90px;
  padding: 0 30px;
}
.consulting-head .left,
.consulting-head .right,
.recruitment-head .left,
.recruitment-head .right,
.training-head .left,
.training-head .right,
.guide-head .left,
.guide-head .right {
  height: 100%;
  float: left;
  font-size: 30px;
  display: flex;
  align-items: center;
}
.consulting-head .right,
.recruitment-head .right,
.training-head .right,
.guide-head .right {
  float: right;
  font-size: 24px;
  color: #bababa;
  display: flex;
  align-items: center;
}
.consulting-head .left img,
.recruitment-head .left img,
.training-head .left img,
.guide-head .left img {
  width: 34px;
  height: 30px;
  padding-right: 5px;
}
.consulting-head .right img,
.recruitment-head .right img,
.training-head .right img,
.guide-head .right img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-left: 5px;
}
.news-consulting .consulting-list,
.news-recruitment .recruitment-list,
.news-training .training-list,
.news-guide .guide-list {
  padding: 0 30px;
}
.consulting-list li,
.recruitment-list li,
.training-list li,
.guide-list li {
  height: 70px;
  line-height: 70px;
  font-size: 26px;
  color: #333333;
  border-top: 1px solid #f4f4f4;
}
.consulting-list .consulting-content,
.recruitment-list .recruitment-content,
.training-list .training-content,
.guide-list .guide-content {
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
}
.consulting-list .time,
.recruitment-list .time,
.training-list .time,
.guide-list .time {
  float: right;
  color: #888888;
}
.time img {
  height: 20px;
  padding-left: 15px;
}
.recruitment-platform img {
  height: 40px;
  width: 130px;
  padding-right: 10px;
  float: left;
}
.skill-content {
  margin-top: 10px;
  width: 100%;
  background: #fff;
}
.skill-content .skill-head {
  height: 90px;
  line-height: 90px;
  padding: 0 30px;
  font-size: 30px;
  color: #f04219;
}
.skill-head img {
  width: 30px;
  height: 30px;
  padding-right: 10px;
}
.skill-content .skill-item {
  padding: 0 30px;
  font-size: 26px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.skill-item:after {
  content: "";
  width: 210px;
}
.skill-item li {
  width: 210px;
  height: 65px;
  line-height: 65px;
  float: left;
  background: #f4f4f4;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bottom {
  width: 100%;
  margin: 20px 0;
}
.bottom .bottom-link {
  font-size: 30px;
  padding: 30px 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom-link .line {
  color: #888888;
}
.bottom-connect {
  text-align: center;
  font-size: 24px;
  color: #888888;
  padding: 20px 0 40px 0;
  line-height: 35px;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
}
.prompt {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -390px;
  margin-left: -320px;
  width: 640px;
  height: 780px;
  background: #fff;
  border-radius: 20px;
  font-size: 25px;
}
.close_icon_div {
  display: flex;
  justify-content: flex-end;
}
.close_icon {
  width: 45px;
  height: 45px;
  text-align: right;
  padding: 20px 20px 10px 10px;
}
.content_img_box {
  width: 342px;
  height: 343px;
  margin: 40px auto;
}
.content_pro .title1 {
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  padding: 10px 0;
}
.content_pro .title2 {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: #333333;
  padding: 10px 0;
}
.content_pro .renize {
  text-align: center;
  font-size: 28px;
  color: #333333;
  padding: 10px 0px;
}
</style>