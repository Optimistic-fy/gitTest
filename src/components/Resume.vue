<template>
  <div>
    <div class="resume_list">
      <div class=""
           style="border: 5px solid #DCDCDC;"></div>
      <resumeList listTitle="基本信息"
                  :thumb="publicPath + 'icon_basic_info.png' + '?time=' + new Date().getTime()"
                  :base="base"
                  :require="true"
                  @click="goBaseInfo" />
      <div class=""
           style="border: 5px solid #DCDCDC;"></div>
      <resumeList listTitle="个人标签"
                  :thumb="publicPath + 'icon_person_label.png' + '?time=' + new Date().getTime()"
                  :tips="tips"
                  :require="true"
                  @click="goUserSkill" />
      <div class=""
           style="border: 5px solid #DCDCDC;"></div>
      <resumeList listTitle="服役经历"
                  :thumb="publicPath + 'icon_service.png' + '?time=' + new Date().getTime()"
                  :troopExperience="troopExperience || no"
                  :require="true"
                  @click="goTroopExperience" />
      <div class=""
           style="border: 5px solid #DCDCDC;"></div>
      <resumeList listTitle="求职意向"
                  :thumb="publicPath + 'icon_intention.png' + '?time=' + new Date().getTime()"
                  :intentionPage="intentionPage"
                  @click="goExpectedInfo"
                  :require="false" />
      <div class=""
           style="border: 5px solid #DCDCDC;"></div>
      <resumeList listTitle="教育经历"
                  :thumb="publicPath + 'icon_edu_exp.png' + '?time=' + new Date().getTime()"
                  :education="education"
                  @click="goEduInfo"
                  :require="false" />
      <div class=""
           style="border: 5px solid #DCDCDC;"></div>
      <resumeList listTitle="工作经验"
                  :thumb="publicPath + 'icon_job_exp.png' + '?time=' + new Date().getTime()"
                  :job="job"
                  @click="goWorkInfo"
                  :require="false" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import resumeList from '../common/resume/uni-list-item.vue';
import { requireShare } from '../utils/share.js'

export default {
  components: { resumeList },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  data () {
    return {
      //基本信息
      base: {
        actualName: '',
        sexText: '',
        age: 0,
        nowAddressCity: '',
        politicalTroubleText: '' || '暂无工作',
        troopExperience: ''
      },
      tips: [],
      troopExperience: '',
      no: 'no',
      intentionPage: {
        industry: '',
        city: '',
        expectedSalaryMin: '',
        expectedSalaryMax: ''
      },
      education: {},
      job: {},
      loginState: false,
      publicPath: '',
    }
  },
  mounted () {
    requireShare();
    this.getBaseInfo();
    this.getSkillQuery();
    this.getTroopExperience();
    this.getExpectedInfo();
    this.getEduInfo();
    this.getWorkInfo();
    this.publicPath = this.stylePath + this.appid + "/img/";
  },
  methods: {
    // 获取基本信息
    getBaseInfo () {
      var vm = this;
      vm.$get(`${vm.$global.PREFIX}/basic/info`).then(res => {
        console.log('base-info', res)
        if (res.data.code == 200 && res.data.root) {
          vm.base = res.data.root;
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },
    getSkillQuery () {
      var vm = this;
      vm.$get(`${vm.$global.PREFIX}/skill/query`).then(res => {
        console.log('skill-info', res)
        if (res.data.code == 200 && res.data.root) {
          vm.tips = res.data.root;
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },
    getTroopExperience () {
      var vm = this;
      vm.$get(`${vm.$global.PREFIX}/troop/experience`).then(res => {
        console.log('exprience-info', res)
        if (res.data.code == 200 && res.data.root) {
          vm.troopExperience = res.data.root[0].description;
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },
    getExpectedInfo () {
      var vm = this;
      vm.$get(`${vm.$global.PREFIX}/expected/info`).then(res => {
        console.log('expect-info', res)
        if (res.data.code == 200 && res.data.root) {
          vm.intentionPage = res.data.root;
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },
    getEduInfo () {
      var vm = this;
      vm.$get(`${vm.$global.PREFIX}/edu/info`).then(res => {
        console.log('Edu-Info', res);
        if (res.data.code == 200 && res.data.root) {
          res.data.root.beginTime = res.data.root.beginTime
            .substring(0, 7)
            .replace('年', '/')
            .replace('月', '')
            .replace('-', '/');
          res.data.root.endTime = res.data.root.endTime
            .substring(0, 7)
            .replace('年', '/')
            .replace('月', '')
            .replace('-', '/');
          vm.education = res.data.root;
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },
    getWorkInfo () {
      var vm = this;
      vm.$get(`${vm.$global.PREFIX}/work/info`).then(res => {
        console.log('Work-Info', res)
        if (res.data.code === 200 && res.data.root) {
          res.data.root.startTime = res.data.root.startTime.substring(0, 7).replace('-', '/');
          res.data.root.endTime = res.data.root.endTime.substring(0, 7).replace('-', '/');
          vm.job = res.data.root;
        }
      }).catch((err) => {
        console.log('err', err)
      });
    },

    goBaseInfo () {
      this.$router.push({ path: `/${this.appid}/baseInfo` });
    },
    goUserSkill () {
      this.$router.push({ path: `/${this.appid}/UserSkill` });
    },
    goTroopExperience () {
      this.$router.push({ path: `/${this.appid}/ServiceHistory` });
    },
    goExpectedInfo () {
      this.$router.push({ path: `/${this.appid}/Expectedinfo` });
    },
    goEduInfo () {
      this.$router.push({ path: `/${this.appid}/Eduinfo` });
    },
    goWorkInfo () {
      this.$router.push({ path: `/${this.appid}/WorkExperience` });
    }
  }
};
</script>

<style scoped>
.resume_list {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background: #f4f4f4;
}
</style>