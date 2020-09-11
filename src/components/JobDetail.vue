<template>
  <div>
    <div class="job_detail" id="all_ontent">
      <!--信息-->
      <div class="job_main">
        <div class="block">
          <div class="job_company_inf">
            <div class="company_position clearboth">
              <div class="company_position_left">
                <div class="company_name">{{job.jobTitle}}</div>
                <div class="label" :class="job.priority === 0 ? '' : 'default_back_color'">
                  <div class="i default_back_color" v-if="job.priority === 0">军人优先</div>
                  <div class="i default_back_color" v-if="job.priority === 1">军属优选</div>
                </div>
              </div>
              <div class="time">{{dataTransform}}</div>
            </div>
            <div class="price">{{job.salaryMin}}-{{job.salaryMax}}/月</div>
            <div class="company_require clearboth">
              <div class="span default_color">
                <img class="img" :src="publicPath + 'icon_area.png?time=' + newDate" mode="" />&nbsp;{{job.cityName}}</div>
              <div class="span default_color">
                <img class="img" :src="publicPath + 'icon_edu.png?time=' + newDate" mode="" />&nbsp;{{job.educationText}}</div>
              <div class="span default_color">
                <img class="img" :src="publicPath + 'icon_job_type.png?time=' + newDate" mode="" />&nbsp;{{job.jobNatureText}}</div>
              <div class="span default_color">
                <img class="img" :src="publicPath + 'icon_people.png?time=' + newDate" mode="" />&nbsp;招{{job.numberOfRecruits.indexOf('人') !== -1 ? job.numberOfRecruits : job.numberOfRecruits + '人'}}</div>
            </div>
          </div>
          <div class="job_company_brief" v-if="shareShow" @click="goJobList()">
            <div>
              <div class="name">{{company.companyName}}</div>
              <div class="p">
                <div class="span">查看该企业更多在招职位</div>
              </div>
              <div class="fa fa-angle-right"></div>
            </div>
            <van-icon name="arrow" class="icon_right" color="#bbb" size="20" type="arrowright" />
          </div>
          <div class="job_company_brief" v-if="!shareShow" @click="goJobInf">
            <div>
              <div class="name">{{company.companyName}}</div>
              <div class="p">
                <div class="span">{{company.companyNatureText}}</div>
                <div class="span"> | {{company.companyScaleText}}</div>
                <div class="span"> | {{company.companyIndustryText}}</div>
              </div>
              <div class="fa fa-angle-right"></div>
            </div>
            <van-icon name="arrow" class="icon_right" color="#bbb" size="20" type="arrowright" />
          </div>
        </div>
        <div class="block describe">
          <div class="title">
            <div class="span"></div>职位描述
          </div>
          <div class="text" v-html="job.jobDesciption"></div>
        </div>
      </div>
    </div>

    <!--bottom-->
    <div class="bottom_sign_up" :class="[disabled ? 'hasChecked' : 'default_back_color']" @click.stop="deliveryResumes">
      <div class="text">{{disabled ? '已投递' : '立即投递'}}</div>
    </div>
    <div v-html="htmlT"></div>
    <transition name="guide">
      <div class="guide_btn default_back_color" v-if="isShare" @click="goToPage">
        <div class="icon_div"><img class="img" :src="publicPath + 'icon_position.png' + '?time=' + new Date().getTime()" /></div>
        <div class="guide_text" v-if="ismore">更多职位</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Icon, Toast } from 'vant'
import { requireShare } from '../utils/share'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    Icon
  },
  data() {
    return {
      company: {
        companyName: '', // 公司名称
        companyNatureText: '', // 公司性质 民营/国企
        companyScaleText: '', // 公司人数
        id: '',
        companyIndustryText: ''
      },
      job: {
        jobTitle: '', // 职位名称
        cityName: '', // 职位所在城市
        educationText: '', // 文聘
        jobNatureText: '', // 工作职位类型 全职/兼职
        numberOfRecruits: '', // 招聘人数
        jobDesciption: '', // 职位描述
        salaryMin: '', // 薪资区间
        salaryMax: '',
        priority: '', // 优先人群
        createTime: '', // 创建时间
        isDeliver: '', // 投递状态
        updateTime: '' // 简历时间
      },
      jobId: '',
      disabled: false,
      htmlT: '',
      publicPath: '',
      newDate: new Date().getTime(),
      ismore: true,
      shareShow: false,
      isShare: false,
      signs: '',
      shareParam: {
        type: "",
        imgUrl: "",
        desc: "",
        title: "",
        link: ""
      },
      scrollInterval: 0
    }
  },
  created() {
    this.publicPath = this.stylePath + this.appid + '/img/';
  },
  mounted() {
    // if (window.history && window.history.pushState) {
    //   // 往历史记录里面添加一条新的当前页面的url
    //   history.pushState(null, null, document.URL);
    //   // 给 popstate 绑定一个方法 监听页面刷新
    //   window.addEventListener('popstate', this.backChange, false);//false阻止默认事件
    // }

    // requireShare()
    this.storeInfo()
    let vm = this;
    let id = this.$route.query.id;
    localStorage.setItem('jobid', id);
    if (id) {
      this.jobId = id;
      this.getResumesDetail();
    } else {
      Toast({
        title: '该职位已下线',
        icon: 'fail',
        success: function () {
          setTimeout(function () {
            vm.$router.back();
          }, 2500)
        }
      })
    }

    let pageUrl = window.location.href;
    if (pageUrl.indexOf("isshare") != -1) {
      vm.signs = true;
      vm.isShare = true;
      vm.shareShow = true;
    }
    window.addEventListener("scroll", vm.showIcon, true);
  },
  computed: {
    ...mapState(['appid', 'stylePath']),
    // 日期转换
    dataTransform() {
      if (this.job.updateTime !== '') {
        let thatDate = new Date()
        // let thathours = thatDate.getHours()
        let mydate = thatDate.getFullYear() + '-' + (thatDate.getMonth() + 1) + '-' + thatDate.getDate() // 当前时间
        let jobDate = this.job.updateTime.split(' ') // 工作发布时间
        let hours = jobDate[1].split(':') // [11, 54, 10] = [时，分，秒]
        let dataArr = jobDate[0].split('-')
        let jobYear = { // 当前工作年月日
          year: dataArr[0],
          Month: dataArr[1],
          day: dataArr[2]
        }
        let thisYear = { // 当前时间年月日
          year: thatDate.getFullYear() + '',
          Month: thatDate.getMonth() + 1 + '',
          day: thatDate.getDate() + ''
        }
        if (jobDate[0] === mydate) {
          return hours[0] + ':' + hours[1]
        } else if (jobYear.year === thisYear.year && jobYear.Month === thisYear.Month) {
          if (thisYear.day - jobYear.day === 1) {
            return '昨天'
          }
          // thisYear.day - jobYear.day + '天前'
        } else {
          return jobDate[0]
        }
      }
    }
  },
  methods: {
    ...mapActions(['storeInfo']),
    // 职位详情获取
    getResumesDetail() {
      let vm = this
      vm.$get(`${vm.$global.PREFIX}/job/detail/` + vm.jobId).then(res => {
        if (res.data.root) {
          vm.company = res.data.root.company
          vm.job = res.data.root.job
          if (res.data.root.job.isDeliver === 0) {
            // 如果没有投递
            vm.disabled = false
          } else {
            vm.disabled = true
          }
          //初始化分享 
          vm.initShare().then((res) => {
            requireShare(vm.shareParam);
          })
        }
      })
    },
    // 点击投递
    deliveryResumes() {
      let vm = this
      // 是否登录
      vm.$store.dispatch('hasInfo').then(res => {
        if (vm.disabled) { // 已经投递
          return false;
        } else {
          // 是否完善简历
          vm.$store.dispatch('resumePerfect').then(res => {
            if (res.data.root) {
              vm.$get(`${vm.$global.PREFIX}/deliver/` + vm.jobId).then(res => {
                if (res.data.root !== null) {
                  vm.disabled = true;
                  vm.showToast('投递成功', 'success');
                } else {
                  vm.showToast(res.data.msg);
                }
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击跳转详情
    async goJobInf() {
      this.$router.push({ path: `/${this.appid}/companyDetail`, query: { id: this.company.id } })
    },
    back() {
      this.$router.back()
    },
    showToast(text, icon) {
      Toast({ message: text, icon: icon || 'none' })
    },
    // backChange() {
    //   const that = this;
    //   console.log('this.$router', this.$router)
    //   // this.$router.push('/job')
    // }
    // 查看求职招聘
    goJobList() {
      this.$store.state.companyName = this.company.companyName;
      this.$router.push({ path: `/${this.appid}/job` });
    },
    goToPage() {
      this.$store.state.companyName = '';
      this.$router.push({ path: `/${this.appid}/job` })
    },
    showIcon() {
      let vm = this;
      if (vm.signs) {
        let top = document.getElementById('all_ontent').scrollTop;
        let scroll = top - vm.scrollInterval;
        vm.scrollInterval = top;
        if (scroll < 0) {
          vm.ismore = true;
        } else {
          vm.ismore = false;
        }
      }
    },
    initShare() {
      let vm = this;
      return new Promise((resolve, reject) => {
        let typeName = vm.$route.name;
        let currentUrl = window.location.href;
        if (currentUrl.indexOf("isshare") == -1) {
          currentUrl = currentUrl + "&isshare=true";
        }
        vm.shareParam.type = typeName;
        vm.shareParam.imgUrl = vm.stylePath + vm.appid + "/img/job_detail_share.jpg" + "?" + new Date().getTime();
        vm.shareParam.desc = "";
        vm.shareParam.link = currentUrl;
        vm.shareParam.title = "【热招】" + vm.job.cityName + "招_" + vm.job.jobTitle;
        resolve()
      })
    },

  },
  // destroyed() {
  //   window.removeEventListener('popstate', this.backChange, false);//false阻止默认事件
  // }
}
</script>

<style>
.job_detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.job_main .block {
  padding: 30px;
  border-top: 6px #f4f4f4 solid;
}
.company_position {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.company_position_left {
  display: flex;
}
.company_position .time {
  align-self: flex-end;
  color: #b0b0b0;
  font-size: 26px;
  font-weight: normal;
}
.company_name {
  display: inline-block;
  max-width: 350px;
  overflow: hidden;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 30px;
  font-weight: 600;
}
.company_position .label .i {
  display: inline-block;
  padding: 0 20px;
  color: #ffffff;
  border-radius: 0.9rem;
  margin: 5px 0 0 15px;
  font-size: 0.4rem;
}
.company_position .job_priority .i {
  background: #1f7ec3;
}
.company_require {
  display: flex;
}
.company_require .span {
  display: flex;
  align-items: center;
  width: 25%;
  font-size: 28px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.company_require .span .img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.job_company_inf .price {
  color: #ff6844;
  font-size: 32px;
  line-height: 38px;
  font-weight: 600;
  margin: 30px 0;
}
.job_company_brief {
  margin: 10px 0 0;
  padding: 10px 0 0;
  border-top: 1px #dcdcdc solid;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.job_company_brief .name {
  line-height: 60px;
  font-size: 30px;
}
.job_company_brief .p {
  line-height: 45px;
  font-size: 0.8rem;
  display: flex;
}
.job_company_brief .p .span {
  color: #b0b0b0;
  font-size: 26px;
}
.job_company_brief .fa {
  font-size: 1.4rem;
  position: absolute;
  right: 0;
  top: 0;
  line-height: 4.4rem;
}
.describe .title {
  padding-bottom: 20px;
  font-size: 35px;
  font-weight: normal;
  border-bottom: 1px solid #dcdcdc;
}
.describe .text {
  font-size: 30px;
  padding: 30px 0 0 0;
  color: #333333;
  line-height: 144%;
}
.describe .title .span {
  color: #408745;
}
.circular {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  display: block;
  width: 5rem;
  height: 5rem;
  background: #408745;
  border-radius: 5rem;
  line-height: 5rem;
}
.circular .icon {
  height: 1.8rem;
  line-height: 3.2rem;
  font-size: 1.2rem;
}
.circular .text {
  height: 3.2rem;
  line-height: 3.2rem;
  font-size: 1rem;
}
.circular .fa {
  line-height: 2.5rem;
}
.bottom_sign_up {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  color: #ffffff;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 32px;
}
.hasChecked {
  background: #c8c9cc;
}
.icon_div {
  display: flex;
  align-items: center;
}
.icon_div img {
  vertical-align: baseline;
  width: 40px;
  height: 40px;
}
.guide_text {
  margin-left: 10px;
}
</style>