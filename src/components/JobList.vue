<template>
  <div class="jobs_list_dv">
    <div class="down">{{text}}</div>
    <div class="li"
         v-for="(item, index) in listData"
         :key="index"
         @click="goJobDetail(item.id)">
      <div class="job_ctn_top_dv">
        <div class="h3">
          <div class="span">
            <div class="job_name_spa">{{item.jobTitle}}</div>
            <div class="job-city default_color">
              <span>[</span><span>{{item.cityName}}</span><span>]</span>
            </div>
          </div>
          <div class="create-time">{{item.updateTime.slice(0, 10)}}</div>
        </div>
        <div class="salary_p">{{(item.salaryMin==0&&item.salaryMax==0)?'面议':(item.salaryMin+'-'+item.salaryMax)+'/月'}}</div>
        <div class="palce_p">
          <!--<span>|</span>-->
          <div class="span">{{item.educationText}}</div>
          <div class="span">{{item.jobNatureText}}</div>
        </div>
        <div v-if="item.isDeliver!='1'"
             class="delivery_spa default_back_color"
             @click.stop="deliveryResumes(item.id, index)">
          立即投递
        </div>
        <div v-else
             @click.stop
             class="delivery_spa deliveryed_spa_bgc">
          已投递
        </div>
      </div>
    </div>
    <!-- 添加跳转 -->
    <div class="other_web">
      <!-- <div class="no-more">{{buttonText}}</div> -->
      <div class="no-more">
        <div class="pre_page"
             :class="isFirstPage ? 'no_page' : 'default_color'"
             @click="handleClickPre">上一页</div>
        <div class="next_page"
             :class="isFinalPage ? 'no_page' : 'default_color'"
             @click="handleClickNext">下一页</div>
      </div>
      <template v-if="finished">
        <p class="not-data" v-if="listData.length === 0">暂无数据!</p>
        <p 
          style="margin-top: 20px"
          @click="getService"
          v-if="$store.state.appid !== '74web89ynsg'"
        >
          更多招聘职位，可访问
          <span class="web">{{linkTitle}}</span>
        </p>
        <template v-if="$store.state.appid === '74web89ynsg'">
          <div class="shanxi_logo" v-if="listData.length === 0">
            <img @click="getService"
                :src="publicPath + 'warp_link.png?time=' + new Date().getTime() "
                mode="" />
          </div>
        </template>
        <template v-else>
          <div class="shanxi_logo">
            <img @click="getService"
                :src="publicPath + 'warp_link.png?time=' + new Date().getTime() "
                mode="" />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { mapState, mapActions } from 'vuex'

export default {
  props: ['listData', 'childrenId', 'finished', 'text', 'buttonText', 'isFirstPage', 'isFinalPage', 'scrollHeight', 'pageNumber'],
  data () {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 1000,
      showDiv: false,
      pageStart: 0, // 开始页数
      pageEnd: 0, // 结束页数
      scrollData: {
        noFlag: false // 暂无更多数据显示
      },
      showCity: true,
      // 出参（返回参数）
      jobItems: [],
      idArr: [],
      keywordValue: '',
      scroll: null,
      preClick: false,
      nextClick: false
    }
  },
  created () {
    this.publicPath = this.stylePath + this.appid + '/img/';
    this.getAppidInfo();
  },
  computed: {
    ...mapState(['linkTitle', 'linkRouter', 'appid', 'stylePath'])
  },
  mounted () {
  },
  methods: {
    ...mapActions(['getAppidInfo']),
    // 职位详情
    goJobDetail (id) {
      if (id) {
        // this.$store.state.ifRefresh = false
        this.$router.push({ path: `/${this.appid}/jobDetail`, query: { id } })
      } else {
        Toast.fail('该职位已下线');
      }
    },
    // 点击投递
    deliveryResumes (id, index) {
      localStorage.setItem('scrollHeight', this.scrollHeight);
      localStorage.setItem('pageNumber', this.pageNumber);
      let vm = this
      // 判断用户是否登陆
      vm.$store.dispatch('hasInfo').then(res => {
        // 判断用户是否完善简历
        vm.$store.dispatch('resumePerfect').then(res => {
          if (res.data.root) {
            vm.$get(`${vm.$global.PREFIX}/deliver/${id}`).then(res => {
              if (res.data.root) {
                vm.showToast('投递成功', 'success')
                vm.$emit('changeState', index)
              } else {
                vm.showToast(res.data.msg)
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 判断是否已经报名
    deliverJudgeThis (isFollow, deliverYes) {
      return isFollow ? true : this.idArr.includes(deliverYes)
    },
    // 判断是否报名
    deliverJudge (isFollow, deliverYes) {
      return this.idArr.includes(deliverYes) ? false : isFollow
    },
    // formId请求
    postFormId (e) {
      let openid = app.globalData.user.data.openid
      this.$get('/bb/wechat/formid/' + e.mp.detail.formId, '', { openid: openid })
        .then(res => { })
    },
    showToast (text, icon) {
      Toast({ message: text, icon: icon || 'none' })
    },
    getService (event) {
      if (this.$store.state.appid !== '74web89ynsg') {
        window.location.href = this.linkRouter;
      }
    },
    //点击上一页
    handleClickPre () {
      this.$emit('getPrePageList')
    },
    //点击下一页
    handleClickNext () {
      this.$emit('getNextPageList')
    }
  },
  watch: {
    childrenId (data) {
      this.deliveryResumes(data.a, data.id, data.index)
    }
  }
}
</script>
<style scoped>
.list_content {
  overflow: hidden;
  padding-bottom: 5rem;
  position: relative;
  background-color: #f4f4f4;
  min-height: 36rem;
  z-index: 1;
}

.list_content_3 {
  overflow: hidden;
  padding-bottom: 5rem;
  position: relative;
  background-color: #f4f4f4;
  min-height: 36rem;
  z-index: 1;
  margin-top: 3.6rem;
}

.jobs_list_dv {
  width: 100%;
  background-color: #f4f4f4;
}

.jobs_list_dv .li {
  margin-bottom: 12px;
  background-color: #fff;
}
.jobs_list_dv .li:nth-last-child(2) {
  margin-bottom: 0;
}

.job_ctn_top_dv {
  padding: 20px 24px;
  position: relative;
}

.job_ctn_top_dv .h3 .span {
  display: inline-block;
}

.job_ctn_top_dv .h3 .job_name_spa {
  font-size: 30px;
  max-width: 300px;
  display: inline-block;
  /* max-width: 460px; */
  overflow: hidden;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-weight: bold;
  margin-right: 5px;
}

.job_ctn_top_dv .h3 .job-city {
  display: inline-block;
  line-height: 40px;
}

.job_ctn_top_dv .h3 .job-city span {
  font-size: 30px;
  max-width: 130px;
  display: inline-block;
  overflow: hidden;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-weight: bold;
}

.job_ctn_top_dv .job_type_spa {
  font-size: 24px !important;
  padding: 0 8px;
  border-radius: 0.9rem;
  background-color: #408745;
  color: #fff;
  font-weight: normal;
  margin-left: 20px;
}

.job_ctn_top_dv .job_type_spa1 {
  font-size: 24px !important;
  padding: 0 8px;
  border-radius: 0.9rem;
  color: #fff;
  font-weight: normal;
  margin-left: 20px;
  background-color: #1f7ec3;
}

.job_ctn_top_dv .release_time_spa {
  font-size: 28px;
  font-weight: normal;
  float: right;
  color: #b0b0b0;
}

.job_ctn_top_dv .salary_p {
  color: #e9464f;
  font-size: 30px;
  line-height: 56px;
  font-weight: 600;
  margin-top: 24px;
}

.job_ctn_top_dv .palce_p {
  font-size: 28px;
  line-height: 40px;
  color: #b0b0b0;
}
.job_ctn_top_dv .salary_p .span {
  color: #b0b0b0;
  font-size: 26px;
}
.job_ctn_top_dv .palce_p .span {
  display: inline-block;
  font-size: 26px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  background: #f8f8fa;
  border: 1px #eeeeee solid;
  padding: 0 6px;
  margin-right: 20px;
  border-radius: 2px;
}

/*立即投递按钮*/

.job_ctn_top_dv .delivery_spa {
  width: 182px;
  height: 56px;
  line-height: 56px;
  font-size: 28px;
  box-sizing: border-box;
  text-align: center;
  color: #fff;
  position: absolute;
  right: 33px;
  top: 136px;
  border-radius: 8px;
}
.job_ctn_top_dv .delivery_spa .i {
  line-height: 40px;
}
.job_ctn_top_dv .delivery_spa .i:nth-child(1) {
  margin-top: 70px;
}

.release_time_spa {
  font-size: 28px;
  font-weight: normal;
  float: right;
  color: #b0b0b0;
}

/* 回到顶部结束 */

.company_name_p {
  height: 70px;
  line-height: 70px;
  font-size: 24px;
  color: #b0b0b0;
  padding: 0 20px;
  display: flex;
  display: -webkit-flex;
}

.company_name_p span {
  -webkit-flex: auto;
  flex: auto;
  flex-grow: 0;
}

.company_name_p span:nth-child(3) {
  flex-shrink: 0;
}

.company_name_p .company_name_spa {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.job_ctn_top_dv .deliveryed_spa_bgc {
  background: #c8c9cc;
}
.deliveryed_spa_bgc .i {
  line-height: 220px !important;
  margin-top: 0 !important;
}
.swiper {
  height: 407px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.swiper image {
  height: 100%;
  width: 100%;
}

.mask_dv {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 100000;
  overflow: hidden;
}

.mask_dv .mask_ctn {
  position: absolute;
  width: 680px;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  overflow: hidden;
}

.mask_dv .mask_icon {
  position: absolute;
  width: 100%;
  height: 1326px;
}

.mask_ctn .ctn_dv {
  background-color: #fff;
  padding-bottom: 70px;
}

.mask_ctn .title_dv {
  height: 90px;
  line-height: 90px;
  text-align: center;
  color: #fff;
}

.mask_ctn .div_tips {
  text-align: center;
  font-size: 40px;
  line-height: 1.5;
  padding: 52px 0;
}

.ctn_dv button {
  width: 560px;
  height: 80px;
  line-height: 80px;
  border-radius: 40px;
  border: none;
}

.mask_ctn > image {
  width: 50px;
  height: 50px;
  margin: 20px 300px;
}
.swiper-box {
  width: 750px;
  height: 249px;
}
.swiper-box image {
  width: 100%;
  height: 100%;
}
.swiper-box .wx-swiper-dots.wx-swiper-dots-horizontal {
  margin-bottom: 150px;
}
.swiper-box .wx-swiper-dot {
  width: 40px;
  display: inline-flex;
  height: 10px;
  margin-left: 20px;
  justify-content: space-between;
}
.swiper-box .wx-swiper-dot::before {
  content: "";
  flex-grow: 1;
  background: #dbe0ff;
  border-radius: 8px;
}
.swiper-box .wx-swiper-dot-active::before {
  background: #206a3f;
}
.other_web {
  font-size: 28px;
  text-align: center;
  margin: 0 0 5px 0;
}
.no-more {
  line-height: 80px;
  overflow: hidden;
  background: #eaeaea;
  padding: 10px 0;
}
.pre_page,
.next_page {
  float: left;
  width: 50%;
  background: #f6f6f6;
}
.no_page {
  color: #ccc;
}
.web {
  color: #ff0000;
  text-decoration: underline;
}
.shanxi_logo img {
  display: block;
  height: 50px;
  width: 190px;
  margin: 20px auto 0 auto;
}
.down {
  position: absolute;
  top: -80px;
  left: 0;
  width: 100%;
  font-size: 25px;
  text-align: center;
  line-height: 80px;
}

.create-time {
  float: right;
  margin-right: 20px;
  font-size: 28px;
  color: #ccc;
}

.not-data {
  margin-top: 40px;
}
</style>
