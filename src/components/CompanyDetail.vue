<template>
  <div class="company_detail" id="all_ontent">
    <div>
      <div class="company_inf">
        <!--inf_card-->
        <div class="inf_card">
          <h2 class="name default_color">{{company.companyName}}</h2>
          <p class="inf">
            <span>{{company.companyNatureText}}</span>&nbsp;|&nbsp;
            <span>{{company.companyScaleText}}</span>人
          </p>
          <p class="nature" v-if="company.companyIndustryText">{{company.companyIndustryText}}</p>
          <p class="place">
            <span class="fa fa-map-marker default_color"></span>
            &nbsp;&nbsp;{{company.companyAddress}}
          </p>
        </div>
        <!--公司介绍-->
        <div class="company_introduce">
          <h2 class="default_color">公司介绍</h2>
          <p class="inf">{{infSet}}</p>
          <p class="open default_color" @click="openInf = !openInf" v-if="infLength">
            {{openInf ? '关闭' : '展开'}}&nbsp;&nbsp;
            <span
              class="fa"
              :class="openInf ? 'fa-angle-up' : 'fa-angle-down'"
            ></span>
          </p>
        </div>
      </div>
      <!--招聘职位-->
      <div class="company_job" v-if="!signs">
        <div class="compony_title">
          <span class="company_left_pic"></span>
          <h2 class="default_color">招聘职位</h2>
        </div>
        <template v-if="jobItems.length > 0">
          <ul class="jobs_list_dv">
            <li v-for="(item,index) in jobItems" :key="item.id" @click="jobDetail(item.id)">
              <div class="job_ctn_top_dv">
                <h3>
                  <span class="job_name_spa">{{item.jobTitle}}</span>
                  <span
                    class="default_back_color"
                    :class="item.priority==0?'job_type_spa':'job_type_spa1'"
                  >{{item.priority==0?'军人优先':'军属优选'}}</span>
                  <span class="release_time_spa">{{item.updateTime | moment}}</span>
                </h3>
                <p
                  class="salary_p"
                >{{(item.salaryMin==0&&item.salaryMax==0)?'面议':(item.salaryMin+'-'+item.salaryMax)+'/月'}}</p>
                <p class="palce_p">
                  <span>{{item.cityName}}</span>
                  <span>|</span>
                  <span>{{item.educationText}}</span>
                  <span>|</span>
                  <span>{{item.jobNatureText}}</span>
                </p>
                <span
                  class="delivery_spa default_back_color"
                  :class="(item.isDeliver==0)?'':' deliveryed_spa_bgc'"
                  @click.stop
                  @click="deliveryResumes(item.isDeliver==0, index, item.id)"
                >{{(item.isDeliver==0)?'立即投递':'已投递'}}</span>
              </div>
            </li>
          </ul>
          <div class="no-more">{{buttonText}}</div>
        </template>
        <div class="no-result" v-else>{{loadingText}}</div>
      </div>
      <div class="guide_hint default_color" v-if="signs" @click="goJobList">
        查看企业热招职位
        <div class="icon_div2">
          <img
            class="img"
            :src="publicPath + 'company_link_icon.png' + '?time=' + new Date().getTime()"
          />
        </div>
      </div>
    </div>
    <transition name="guide">
      <div class="guide_btn default_back_color" v-if="isShare" @click="goToPage">
        <div class="icon_div">
          <img class="img" :src="publicPath + 'icon_company.png' + '?time=' + new Date().getTime()" />
        </div>
        <div class="guide_text" v-if="ismore">更多企业</div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Toast } from "vant";
import { requireShare } from "../utils/share.js";
import { mapActions, mapState } from "vuex";
import BScroll from "better-scroll";

export default {
  data() {
    return {
      company: {
        companyName: "",
        companyNatureText: "",
        inf: "",
        companyAddress: "",
        companyScaleText: "",
        companyIndustryText: "",
        companyInfo: "",
      },
      noMore: false, // 是否还有更多
      buttonText: "上拉加载更多...",
      loadingText: "加载中...",
      searchBody: {
        pageNumber: 1,
        pageSize: 10,
      },
      jobItems: [],
      searchParam_data: {
        pageNumber: 1,
        pageSize: 10,
        keyword: "",
        sorted: "",
        city: "",
        educations: [],
        jobCategory: "",
        priority: this.priority,
      },
      openInf: false,
      companyID: "",
      disabled: false,
      idArr: [],
      loadingShow: true,
      publicPath: "",
      ismore: true,
      isShare: false,
      signs: true,
      shareParam: {
        type: "",
        imgUrl: "",
        desc: "",
        title: "",
        link: "",
      },
      scrollInterval: 0,
    };
  },
  computed: {
    ...mapState(["appid", "stylePath"]),
    infSet() {
      if (this.company.companyInfo) {
        if (this.openInf) {
          return this.company.companyInfo;
        } else {
          return this.company.companyInfo.substring(0, 80) + "...";
        }
      } else {
        return "该公司还没有信息";
      }
    },
    infLength() {
      if (this.company.companyInfo) {
        return this.company.companyInfo.length > 100;
      } else {
        return false;
      }
    },
  },
  created() {
    this.publicPath = this.stylePath + this.appid + "/img/";
  },
  mounted() {
    // if (window.history && window.history.pushState) {
    //   // 往历史记录里面添加一条新的当前页面的url
    //   history.pushState(null, null, document.URL);
    //   // 给 popstate 绑定一个方法 监听页面刷新
    //   window.addEventListener('popstate', this.backChange, false);//false阻止默认事件
    // }
    this.storeInfo();
    let vm = this;
    let pageUrl = window.location.href;
    if (pageUrl.indexOf("isshare") != -1) {
      vm.signs = true;
      vm.isShare = true;
    } else {
      vm.signs = false;
    }

    let id = this.$route.query.id;
    if (id) {
      this.companyID = id;
      this.getCompany();
    } else {
      Toast({
        title: "暂无公司相关信息",
        icon: "fail",
        success: function () {
          setTimeout(function () {
            vm.$router.back();
          }, 2500);
        },
      });
    }
  },
  methods: {
    ...mapActions(["storeInfo"]),
    // 初始化获取公司详情
    getCompany() {
      let vm = this;
      this.$get(`${vm.$global.PREFIX}/company/detail/` + this.companyID).then(
        (res) => {
          let data = res.data.root;
          vm.company = data;
          //初始化分享
          vm.initShare().then((res) => {
            requireShare(vm.shareParam);
          });
        }
      );

      if (!vm.isShare) {
        this.getData();
      } else {
        this.$nextTick(() => {
          this.pageScroll = new BScroll(".company_detail", {
            scrollY: true,
            click: true,
            probeType: 2,
            scrollbar: {
              fade: true,
              interactive: false,
            },
          });
          this.pageScroll.on("scroll", (position) => {
            if (vm.signs) {
              let top = -position.y;
              let scroll = top - vm.scrollInterval;
              vm.scrollInterval = top;
              if (scroll < 0) {
                vm.ismore = true;
              } else {
                vm.ismore = false;
              }
            }
          });
        });
      }
    },
    // 点击去往公司职位列表详情
    async jobDetail(id) {
      this.$router.push({ path: `/${this.appid}/jobDetail`, query: { id } });
    },
    // 点击立即投递
    deliveryResumes(disabled, index, id) {
      let vm = this;
      // 判断是否登录
      // 已经登录
      this.$store.dispatch("hasInfo").then((res) => {
        if (disabled) {
          vm.$store.dispatch("resumePerfect").then((res) => {
            if (res.data.root) {
              this.$get(`${vm.$global.PREFIX}/deliver/` + id).then((res) => {
                if (res.data.root !== null) {
                  this.disabled = true;
                  this.jobItems[index].isDeliver = 1;
                  this.showToast("投递成功", "success");
                } else {
                  this.showToast(res.msg, "success");
                }
              });
            }
          });
        }
      });
    },
    // 判断是否已经投递
    deliverJudgeThis(isDeliver, deliverYes) {
      return isDeliver ? true : this.idArr.includes(deliverYes);
    },
    // 判断是否投递
    deliverJudge(isDeliver, deliverYes) {
      return this.idArr.includes(deliverYes) ? false : isDeliver;
    },
    showToast(text, icon) {
      console.log("text", text);
      Toast({ message: text, icon: icon || "none" });
    },
    // backChange() {
    //   const that = this;
    //   this.$router.replace(`/jobDetail?id=${localStorage.getItem('jobid')}`)
    // }
    initShare() {
      let vm = this;
      return new Promise((resolve, reject) => {
        let typeName = vm.$route.name;
        let currentUrl = window.location.href;
        if (currentUrl.indexOf("isshare") == -1) {
          currentUrl = currentUrl + "&isshare=true";
        }
        vm.shareParam.type = typeName;
        vm.shareParam.imgUrl =
          vm.stylePath +
          vm.appid +
          "/img/company_detail_share.jpg" +
          "?" +
          new Date().getTime();
        vm.shareParam.desc = "";
        vm.shareParam.link = currentUrl;
        vm.shareParam.title = "【急招】" + vm.company.companyName + "招聘中";
        resolve();
      });
    },
    goToPage() {
      this.$store.state.companyName = "";
      this.$router.push({ path: `/${this.appid}/job` });
    },
    goJobList() {
      this.$store.state.companyName = this.company.companyName;
      this.$router.push({ path: `/${this.appid}/job` });
    },
    getData() {
      let vm = this;
      const searchBody = { ...this.searchBody };
      searchBody.appId = this.appid;
      searchBody.companyId = this.companyID;
      const url = `/sys-server/open-api/job/company/page`;
      this.$post(url, searchBody)
        .then((res) => {
          if (res.data.success === true) {
            if (
              res.data.data.content.length === 0 &&
              vm.jobItems.length === 0
            ) {
              vm.jobItems = [];
              vm.noMore = true;
              vm.loadingText = "暂无资讯！";
            } else {
              if (res.data.data.content && res.data.data.content.length < 10) {
                vm.noMore = true;
                vm.buttonText = "我是有底线的！";
              } else {
                vm.noMore = false;
                vm.buttonText = "上拉加载更多...";
              }
              if (searchBody.pageNumber == 1) {
                vm.jobItems = res.data.data.content;
              } else {
                vm.jobItems = vm.jobItems.concat(res.data.data.content);
              }
            }
          }
        })
        .catch((err) => {
          vm.noMore = true;
          vm.buttonText = "我是有底线的！";
        });
    },
    onLoad() {
      if (!this.noMore) {
        this.searchBody.pageNumber = this.searchBody.pageNumber + 1;
        this.getData();
      }
      this.pageScroll.finishPullUp();
    },
  },
  watch: {
    jobItems() {
      this.$nextTick(() => {
        if (!this.pageScroll) {
          this.pageScroll = new BScroll(".company_detail", {
            scrollY: true,
            pullUpLoad: {
              threshold: -40, // 在上拉到超过底部 20px 时，触发 pullingUp 事件
            },
            click: true,
            scrollbar: {
              fade: true,
              interactive: false,
            },
          });

          this.pageScroll.on("pullingUp", () => {
            this.onLoad();
          });
        } else {
          this.pageScroll.refresh();
        }
      });
    },
    openInf() {
      if (this.pageScroll) {
        this.$nextTick(() => {
          this.pageScroll.refresh();
        });
      }
    },
  },
  // destroyed() {
  //   window.removeEventListener('popstate', this.backChange, false);//false阻止默认事件
  // }
};
</script>

<style>
.company_detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* overflow-y: scroll; */
  /* -webkit-overflow-scrolling: touch; */
}
.company_inf {
  position: relative;
  background: url("http://img.81lianpin.com/wechat_app/edu/company_bj.png")
    center 0 no-repeat;
  background-size: 12.2rem 7.5rem;
  min-height: 13.5rem;
  padding-top: 100px;
}
.inf_card {
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  margin: 2rem 30px 0 30px;
  padding-top: 0.5rem;
}
.job_ctn_top_dv {
  padding: 30px;
  border-bottom: 1px solid #dcdcdc;
  position: relative;
}
.job_ctn_top_dv h3 span {
  font-size: 32px;
  font-weight: normal;
  line-height: 1rem;
  font-weight: 600;
  display: inline-block;
  max-width: 360px;
  overflow: hidden;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.job_ctn_top_dv .job_type_spa {
  font-size: 28px !important;
  padding: 0 15px;
  border-radius: 0.9rem;
  color: #fff;
  font-weight: normal;
  margin-left: 20px;
}
.job_ctn_top_dv .job_type_spa1 {
  font-size: 28px !important;
  padding: 0 8px;
  border-radius: 0.9rem;
  color: #fff;
  font-weight: normal;
  margin-left: 20px;
}
.job_ctn_top_dv .release_time_spa {
  font-size: 28px !important;
  font-weight: normal;
  float: right;
  color: #b0b0b0;
}
.job_ctn_top_dv .salary_p {
  color: #ff6844;
  font-size: 35px;
  line-height: 60px;
  margin-top: 0.3rem;
}
.job_ctn_top_dv .palce_p {
  font-size: 28px;
  line-height: 50px;
  color: #b0b0b0;
}
.job_ctn_top_dv .palce_p span {
  display: inline-block;
  max-width: 6.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
/*立即投递按钮*/
.job_ctn_top_dv .delivery_spa {
  width: 180px;
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  box-sizing: border-box;
  text-align: center;
  color: #fff;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  border-radius: 10px;
}
.company_job {
  border-top: 0.4rem #f4f4f4 solid;
}
.compony_title {
  overflow: hidden;
  height: 80px;
  line-height: 80px;
  border-bottom: 1px solid #dcdcdc;
}
.company_job h2 {
  float: left;
  font-size: 35px;
  font-weight: normal;
}
.company_introduce {
  padding: 1.3rem 0.8rem 0 0.8rem;
  margin-top: -1.2rem;
  background: #fff;
  z-index: 1;
}
.company_introduce h2 {
  font-size: 32px;
  font-weight: normal;
  height: 2rem;
  line-height: 2.5rem;
  vertical-align: bottom;
  position: relative;
}
.company_introduce .inf {
  margin-bottom: 0.6rem;
  font-size: 30px;
}
.company_introduce .open {
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-size: 30px;
}
.inf_card {
  position: relative;
  z-index: 10;
}
.inf_card .name {
  font-size: 32px;
  line-height: 24ux;
  margin: 10px;
  text-align: center;
}
.inf_card .inf {
  margin: 20px;
  font-size: 24px;
  line-height: 40px;
  color: #888;
  font-weight: lighter;
}
.inf_card .nature {
  margin: 20px;
  font-size: 24px;
  line-height: 40px;
  color: #888;
  font-weight: lighter;
}
.inf_card .place {
  font-size: 30px;
  line-height: 1.2rem;
  border-top: 1px solid #dcdcdc;
  text-align: center;
  padding: 0.1rem 1.2rem 0.1rem 1.2rem;
  position: relative;
}
.inf_card .place span {
  font-size: 30px;
}
.no_more {
  text-align: center;
  line-height: 100px;
  color: #dcdcdc;
  font-size: 30px;
}
.loading {
  line-height: 3rem;
  text-align: center;
}
.deliveryed_spa_bgc {
  background: #c8c9cc !important;
}
.guide_hint {
  height: 80px;
  line-height: 80px;
  text-align: center;
  text-decoration: underline;
}
.icon_div2 {
  display: inline-block;
}
.icon_div2 img {
  display: inline-block;
  width: 35px;
  height: 35px;
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
.no-more {
  line-height: 80px;
  text-align: center;
}
</style>