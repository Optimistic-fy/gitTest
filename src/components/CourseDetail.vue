<template>
  <div class="course-detail">
    <div class="course-content">
      <ul class="course-head">
        <li class="head-item"
            @click="changeShow('课程介绍')"
            :class="{'default_active_color': clickItem === '课程介绍'}">课程介绍</li>
        <!-- <li class="head-item"
            @click="changeShow('就业前景')"
            :class="{'default_active_color': clickItem === '就业前景'}">就业前景</li>
        <li class="head-item"
            @click="changeShow('招生简章')"
            :class="{'default_active_color': clickItem === '招生简章'}">招生简章</li> -->
      </ul>
      <div class="course_content">
        <div class="course-introduction"
             :style="{display: clickItem == '课程介绍' ? 'block' : 'none' }">
          <div class="course-name"
               v-if="courseDetail.name">
            {{courseDetail.name}}
          </div>
          <div class="article"
               v-html="courseDetail.introduce"></div>
        </div>
        <div class="job-prospects"
             :style="{display: clickItem == '就业前景' ? 'block' : 'none' }">
          <div class="article"
               v-html="courseDetail.prospect"></div>
        </div>
        <div class="general-rules"
             :style="{display: clickItem == '招生简章' ? 'block' : 'none' }">
          <div class="article"
               v-html="courseDetail.regulation"></div>
        </div>
      </div>
      <!-- <div class="sign-button btn_gradient_color "
           @click="signUpNow"
           :class="{'has-sign': hasSignUp}">
        立即报名
      </div> -->
      <div class="mask"
           v-if="showMask">
        <div class="prompt">
          <div class="school-name"
               v-if="courseDetail">
            您确定要报名《{{courseDetail.schoolName}}》的{{courseDetail.majorName}}{{courseDetail.name}}课程吗
          </div>
          <div class="btnSign">
            <div class="cancel"
                 @click="clickCancel">
              取消
            </div>
            <div class="sure default_color"
                 @click="clickSignUp(courseDetail.snowflakeId)">
              确定
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { requireShare } from '../utils/share.js'
import { mapActions, mapState } from 'vuex'


export default {
  data () {
    return {
      clickItem: '课程介绍',
      showMask: false,
      courseDetail: {},
      hasSignUp: false,
      start: '',
      end: '',
      now: '',
    }
  },
  created () {
    this.storeInfo()
  },
  mounted () {
    requireShare();
    let vm = this;
    let id = this.$route.query.id;
    vm.$get(`${vm.$global.PREFIX}/school/course/` + id).then(res => {
      let nowDate = new Date();
      if (res.data.code === 200) {
        vm.courseDetail = res.data.root;

        let introduce = vm.courseDetail.introduce;
        introduce = introduce.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"') || introduce.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"');
        vm.courseDetail.introduce = introduce;

        let prospect = vm.courseDetail.prospect || '';
        prospect = prospect.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"') || prospect.replace(/\< img/g, '<img style="width:100%;height:auto;display:block"');
        vm.courseDetail.prospect = prospect;

        let regulation = vm.courseDetail.regulation || '';
        regulation = regulation.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"') || regulation.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"');
        vm.courseDetail.regulation = regulation;

        let start = res.data.root.startTime;
        let end = res.data.root.endTime;

        let startDateTemp = start.split(" ");
        let endDateTemp = end.split(" ");

        let arrStartDate = startDateTemp[0].split("-");
        let arrEndDate = endDateTemp[0].split("-");

        let arrStartTime = startDateTemp[1].split(":");
        let arrEndTime = endDateTemp[1].split(":");

        let allStartDate = new Date(arrStartDate[0], arrStartDate[1] - 1, arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
        let allEndDate = new Date(arrEndDate[0], arrEndDate[1] - 1, arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);

        vm.start = allStartDate.getTime();
        vm.end = allEndDate.getTime();
        vm.now = nowDate.getTime();

        this.getReSign(id);
      }
    })
  },
  computed: {
    ...mapState(['appid'])
  },
  methods: {
    ...mapActions(['hasInfo', 'storeInfo']),
    changeShow (value) {
      this.clickItem = value
    },
    signUpNow () {
      this.showMask = true
    },
    clickSignUp (id) {
      let vm = this
      vm.hasInfo().then(() => {
        vm.$get(`${vm.$global.PREFIX}/user/info/perfect`).then(res => {
          if (res.data.code === 200) {
            let data = res.data.root
            if (data == false) {
              Dialog.confirm({
                title: '你的信息还未完善',
                message: '是否继续完善信息？'
              }).then(() => {
                vm.$router.push({ path: `/${this.appid}/infoCollectEdit` });
                vm.hasSignUp = false
              }).catch((err) => {
                console.log(err)
              });
            } else {
              //判断是否已经报名  以及时间是否合理
              if (vm.hasSignUp === false) {
                //未报名则进行报名
                vm.$get(`${vm.$global.PREFIX}/user/enroll/` + id).then(res => {
                  if (res.data.code === 200) {
                    if (res.data.root !== null) {
                      vm.$router.push({ path: `/${this.appid}/signResult`, query: { id: res.data.root } });
                      vm.hasSignUp = true
                    }
                  }
                }).catch(err => {
                  console.log(err)
                })
              }
            }
          }
        })
        this.showMask = false
      })
    },
    getReSign (id) {
      let vm = this
      //是否重复报名
      vm.$get(`${vm.$global.PREFIX}/enroll/whether/repeat/` + id).then(res => {
        if (res.data.code === 200) {
          if (res.data.root) {
            vm.hasSignUp = true
          } else {
            if (vm.start > vm.now || vm.end < vm.now) {
              vm.hasSignUp = true
            } else {
              vm.hasSignUp = false
            }
          }
        }
      })
    },
    clickCancel () {
      this.showMask = false
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
}
.course-detail,
.course-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.course_content {
    position: fixed;
    top: 85px;
    left: 0;
    right: 0;
    bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.course-head {
    position: fixed;
    top: 0;
  height: 85px;
  line-height: 85px;
  width: 100%;
  background: #f4f4f4;
  display: flex;
  justify-content: space-around;
}
.course-head li {
  display: inline-block;
  font-size: 32px;
  text-align: center;
}
.course-introduction {
  padding: 10px 30px;
}
.course-name {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  font-size: 40px;
}
.rule {
  text-align: left;
}
.article {
  font-size: 30px;
  letter-spacing: 5px;
}
.job-prospects,
.general-rules {
  padding: 0 30px;
}
.sign-button {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 10px;
  height: 80px;
  color: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
}
.specific-content {
  font-size: 30px;
  letter-spacing: 5px;
}
.prompt {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -250px;
  width: 500px;
  height: 300px;
  background: #fff;
  border-radius: 20px;
}
.school-name {
  height: 200px;
  font-size: 30px;
  border-bottom: 1px solid #f4f4f4;
  text-align: center;
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.btnSign {
  height: 100px;
  font-size: 30px;
  text-align: center;
}
.cancel,
.sure {
  height: 100%;
  line-height: 100px;
  width: 49%;
  text-align: center;
  display: inline-block;
}
.has-sign {
  background: #ccc;
  pointer-events: none;
}
</style>