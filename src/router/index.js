import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: '/merge/',
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/:appid/home'
    },
    {
      path: '/:appid/home',
      name: 'home',
      component: () => import('@/components/Home'),
      meta: {
        keepAlive: true,
        title: '退役军人就业创业服务平台',
        showTabbar: true
      }
    },
    {
      path: '/:appid/news',
      name: 'news',
      component: () => import('@/components/News'),
      meta: {
        keepAlive: true,
        title: '资讯',
        showTabbar: true
      }
    },
    {
      path: '/:appid/policy',
      name: 'policy',
      component: () => import('@/components/Policy'),
      meta: {
        keepAlive: true,
        title: '政策法规'
      }
    },
    {
      path: '/:appid/job',
      name: 'job',
      component: () => import('@/components/Job'),
      meta: {
        keepAlive: true,
        title: '求职招聘',
        showTabbar: true
      }
    },
    {
      path: '/:appid/jobDetail',
      name: 'jobDetail',
      component: () => import('@/components/JobDetail'),
      meta: {
        keepAlive: false,
        title: '职位详情'
      }
    },
    {
      path: '/:appid/companyDetail',
      name: 'companyDetail',
      component: () => import('@/components/CompanyDetail'),
      meta: {
        keepAlive: false,
        title: '公司详情'
      }
    },
    {
      path: '/:appid/mine',
      name: 'mine',
      component: () => import('@/components/Mine'),
      meta: {
        keepAlive: true,
        title: '个人中心',
        showTabbar: true
      }
    },
    {
      path: '/:appid/newsDetail',
      name: 'newsDetail',
      component: () => import('@/components/NewsDetail'),
      meta: {
        keepAlive: false,
        title: '资讯详情'
      }
    },
    {
      path: '/:appid/policyDetail',
      name: 'policyDetail',
      component: () => import('@/components/PolicyDetail'),
      meta: {
        keepAlive: false,
        title: '政策详情'
      }
    },
    {
      path: '/:appid/jobGuide',
      name: 'jobGuide',
      component: () => import('@/components/JobGuide'),
      meta: {
        keepAlive: false,
        title: '求职指南'
      }
    },
    {
      path: '/:appid/jobGuideDetail',
      name: 'jobGuideDetail',
      component: () => import('@/components/JobGuideDetail'),
      meta: {
        keepAlive: false,
        title: '指南详情'
      }
    },
    {
      path: '/:appid/infoCollectEditDetail',
      name: 'infoCollectEditDetail',
      component: () => import('@/components/InfoCollectEditDetail'),
      meta: {
        keepAlive: false,
        title: '信息采集详情'
      }
    },
    {
      path: '/:appid/infoCollectEdit',
      name: 'infoCollectEdit',
      component: () => import('@/components/InfoCollectEdit'),
      meta: {
        keepAlive: true,
        title: '信息采集'
      }
    },
    {
      path: '/:appid/myTrainSignUp',
      name: 'myTrainSignUp',
      component: () => import('@/components/MyTrainSignUp'),
      meta: {
        keepAlive: false,
        title: '我的培训报名'
      }
    },
    {
      path: '/:appid/industryChoose',
      name: 'industryChoose',
      component: () => import('@/components/IndustryChoose'),
      meta: {
        keepAlive: true,
        title: '行业选择'
      }
    },
    {
      path: '/:appid/resume',
      name: 'resume',
      component: () => import('@/components/Resume'),
      meta: {
        keepAlive: false,
        title: '个人简历'
      }
    },
    {
      path: '/:appid/baseInfo',
      name: 'baseInfo',
      component: () => import('@/components/BaseInfo'),
      meta: {
        keepAlive: false,
        title: '基本信息'
      }
    },
    {
      path: '/:appid/userSkill',
      name: 'userSkill',
      component: () => import('@/components/UserSkill'),
      meta: {
        keepAlive: false,
        title: '个人标签'
      }
    },
    {
      path: '/:appid/serviceHistory',
      name: 'serviceHistory',
      component: () => import('@/components/ServiceHistory'),
      meta: {
        keepAlive: false,
        title: '服役经历'
      }
    },
    {
      path: '/:appid/expectedinfo',
      name: 'expectedinfo',
      component: () => import('@/components/Expectedinfo'),
      meta: {
        keepAlive: false,
        title: '求职意向'
      }
    },
    {
      path: '/:appid/eduinfo',
      name: 'eduinfo',
      component: () => import('@/components/Eduinfo'),
      meta: {
        keepAlive: false,
        title: '教育经历'
      }
    },
    {
      path: '/:appid/workExperience',
      name: 'workExperience',
      component: () => import('@/components/WorkExperience'),
      meta: {
        keepAlive: true,
        title: '工作经验'
      }
    },
    {
      path: '/:appid/recruitColleges',
      name: 'recruitColleges',
      component: () => import('@/components/RecruitColleges'),
      meta: {
        keepAlive: true,
        title: '院校'
      }
    },
    {
      path: '/:appid/recruitCollegesDetail',
      name: 'recruitCollegesDetail',
      component: () => import('@/components/RecruitCollegesDetail'),
      meta: {
        keepAlive: true,
        title: '院校详情',
        isBack: false
      }
    },
    {
      path: '/:appid/courseDetail',
      name: 'courseDetail',
      component: () => import('@/components/CourseDetail'),
      meta: {
        keepAlive: false,
        title: '课程详情',
      }
    },
    {
      path: '/:appid/signResult',
      name: 'signResult',
      component: () => import('@/components/SignResult'),
      meta: {
        keepAlive: false,
        title: '报名结果提示'
      }
    },
    {
      path: '/:appid/myDelivery',
      name: 'myDelivery',
      component: () => import('@/components/MyDelivery'),
      meta: {
        keepAlive: false,
        title: '我的投递'
      }
    }
  ],
  // scrollBehavior(to, from, savedPosition) {
  //   console.log('savedPosition', savedPosition)
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return {
  //       x: 0,
  //       y: 0
  //     }
  //   }
  // }
})