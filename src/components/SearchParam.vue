<template>
  <div>
    <van-dropdown-menu class="select_dv">
      <van-dropdown-item :title="cityName"
                         ref="cities">
        <van-tree-select :items="city"
                         @click-nav="handleClickPrivince"
                         @click-item="handleClickCity"
                         :active-id.sync="activeCity"
                         :main-active-index.sync="activeCityIndex" />
      </van-dropdown-item>
      <van-dropdown-item :title="indestryName"
                         ref="industries">
        <van-tree-select :items="industry"
                         @click-nav="changeIndustry"
                         @click-item="handleClickIndustry"
                         :active-id.sync="activeIndus"
                         :main-active-index.sync="activeIndusIndex" />
      </van-dropdown-item>
      <van-dropdown-item :title="educat"
                         ref="educationList">
        <MuSelect v-model="educations"></MuSelect>
        <div class="edu_bg_tip_dv"><span>!</span><span>选择多个学历，能看更多好职位~</span></div>
        <div class="edu_bg_tip_btn default_back_color"
             @click="confirmEdu">确定</div>
      </van-dropdown-item>
      <van-dropdown-item v-model="value1"
                         title="职位排序"
                         @change="changeSorts"
                         :options="option" />
    </van-dropdown-menu>
  </div>
</template>

<script>
import MuSelect from './MuSelect'

export default {
  name: 'searchParam',
  data () {
    return {
      educations: [
        { label: '全部', value: 'all', disabled: false },
        { label: '不要求学历', value: 'not_education', disabled: false },
        { label: '初中', value: 'middle_school', disabled: false },
        { label: '高中/中专/中技', value: 'high_polytechnic_school_technical_skill', disabled: false },
        { label: '大专', value: 'junior_college', disabled: false },
        { label: '本科', value: 'undergraduate', disabled: false },
        { label: '硕士', value: 'master', disabled: false },
        { label: '博士', value: 'doctor', disabled: false }
      ],
      value1: 'time',
      option: [
        { text: '按发布时间排序', value: 'time' },
        { text: '按薪资排序', value: 'salary' },
      ],
      city: [],
      industry: [{
        text: '全部',
        id: '',
        children: [
          {
            text: '全部',
            id: ''
          }
        ]
      }],
      activeCity: '',
      activeIndus: '',
      activeCityIndex: 0,
      activeIndusIndex: 0,
      result: [],
      cityName: '城市',
      indestryName: '所属行业',
      leftIndys: '',   //左侧的行业
      educat: '学历',
      province: '',    //选择的省份
    }
  },
  props: ['jobCategory'],
  components: {
    MuSelect // 多选
  },
  created () {
    this.getCityData()
    this.getIndustryData()
  },
  mounted () {
  },
  watch: {
    //监听在首页选择的行业 
    jobCategory (val) {
      this.activeIndus = val.id
      this.indestryName = val.name
      this.activeIndusIndex = val.index - 0 + 1
      this.$refs.industries.toggle(false)
    }
  },
  methods: {
    //点击左侧省份
    handleClickPrivince (e) {
      this.province = this.city[e].text;
      this.activeCity = this.cityName
    },
    //点击右侧城市
    handleClickCity (e) {
      if (this.province != '') {
        this.$store.state.provinceName = this.province
        this.$emit('cityVal', { city: e.text, province: this.province })
      } else {
        this.$emit('cityVal', { city: e.text, province: this.$store.state.provinceName })
      }
      this.$refs.cities.toggle()
      this.cityName = e.text
    },
    //点击左侧行业
    changeIndustry (e) {
      if (e == 0) {
        this.leftIndys = 0
      } else {
        this.leftIndys = e
      }
    },
    //点击右侧行业
    handleClickIndustry (e) {
      if (e.text != '全部') {
        this.$emit('IndustryVal', e.id, this.leftIndys)
      } else {
        let index = this.leftIndys
        this.$emit('IndustryVal', this.industry[index].id, this.leftIndys)
      }
      this.$refs.industries.toggle()
      this.indestryName = e.text
    },
    //改变排序方式
    changeSorts (e) {
      this.$emit('sortedVal', e)
    },
    // 获取城市数据
    getCityData () {
      let vm = this
      this.$get(`${vm.$global.PREFIX}/city/tree`).then(res => {
        let list = res.data.root
        // this.$store.state.provinceName = '全国'
        if (this.$store.state.provinceName === '全国') {
          this.city.push({
            text: '全国',
            children: [{
              text: '全部',
              id: ''
            }]
          })
          for (let i = 0; i < list.length; i++) {
            this.getCityInfo(list[i], '全国')
          }
        } else {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.includes(this.$store.state.provinceName)) {
              this.getCityInfo(list[i])
            }
          }
        }
      })
    },
    //获取行业数据
    getIndustryData () {
      this.$get(`${this.$global.PREFIX}/category/industry`).then(res => {
        let list = res.data.root
        for (let i = 0; i < list.length; i++) {
          let childrens = []
          childrens.push({
            text: '全部',
            id: i
          })
          let lists = list[i].subList
          for (let j = 0; j < lists.length; j++) {
            childrens.push({
              text: lists[j].name,
              id: lists[j].id
            })
          }
          this.industry.push({
            text: list[i].name,
            id: list[i].id,
            children: childrens
          })
        }
      })
    },
    // 教育选项-点击确定
    confirmEdu () {
      let arr = []
      for (let i = 0; i < this.educations.length; i++) {
        if (this.educations[i].disabled) {
          arr.push(this.educations[i].value)
        }
      }
      if (arr.includes('all')) {
        this.$emit('eduVal', ['all'])
        this.educat = `学历`
      } else {
        this.$emit('eduVal', arr)
        this.educat = `学历(${arr.length})`
      }
      this.$refs.educationList.toggle()
    },
    //获取省市列表
    getCityInfo (list, str) {
      if (list.subList && list.subList.length > 0) {
        let lists = list.subList
        let childrens = []
        childrens.push({
          text: '全部',
          id: ''
        })
        for (let i = 0; i < lists.length; i++) {
          childrens.push({
            text: lists[i].name,
            id: lists[i].id
          })
        }
        if (str === '全国') {
          this.city.push({
            text: list.name,
            children: childrens
          })
        } else {
          this.city.push({
            text: this.$store.state.provinceName,
            children: childrens
          })
        }
      } else if (list.subList == null) {
        this.city.push({
          text: list.name,
          children: [{
            text: '全部',
            id: ''
          }]
        })
      }
    }
  }
}
</script>

<style scoped>
.select_dv {
  position: fixed;
  width: 100%;
  top: 98px;
  left: 0;
  right: 0;
  background-color: #ffffff;
  z-index: 980;
  border: 2px solid #dcdcdc;
  border-left: 2px solid #fff;
}

.select_dv:nth-child(1) {
  border-right: none;
}

.select_ul_fake {
  width: 100%;
  overflow: hidden;
  display: flex;
  display: -webkit-flex;
  border-top: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
  height: 80px;
  line-height: 80px;
  background: #ffffff;
}

.select_ul_fake .li {
  -webkit-flex: 1;
  flex: 1;
  color: #888;
  font-size: 28px;
  text-align: center;
  line-height: 80px;
  border-right: 0.033333rem solid #dcdcdc;
  box-sizing: border-box;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.select_ul_fake .li .icon {
  width: 30px;
  height: 30px;
  position: relative;
  top: 5px;
  right: 0;
}
.select_dv .li:last-child {
  border-right: none;
}
.filter_fixed {
  position: fixed;
  width: 100%;
  z-index: 1200;
  top: 90px;
  left: 0;
  right: 0;
}
.ensure_btn {
  width: 22.3rem;
  height: 2.9rem;
  line-height: 2.9rem;
  border-radius: 5px;
  color: #ffffff;
  background-color: #3f8745;
  margin: 0.666667rem 1.27777rem;
  text-align: center;
}

.edu_bg_tip_dv {
  padding: 20px;
  font-size: 24px;
  color: #888;
}
.edu_bg_tip_btn {
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #fff;
  border-radius: 10px;
  font-size: 30px;
}
.edu_content {
  width: 100%;
  background-color: #ffffff;
  margin: 0;
  padding: 0;
}
.section {
  width: 100%;
  display: none;
}
.sort_section .sort_ul {
  width: 100%;
  background: #fff;
}
.sort_section {
  display: flex;
  display: -webkit-flex;
}
.sort_section .sort_ul .li:first-child {
  border-bottom: 1px solid #f4f4f4;
}
.sort_section .sort_ul .sort_head_li {
  font-weight: bold;
  color: #000;
}

.sort_section .sort_ul .li {
  width: 100%;
  height: 80px;
  line-height: 80px;
  margin: 0 20px;
  box-sizing: border-box;
}
.sort_section .sort_ul .li,
.eduBg_section .li {
  background-color: #fff;
  color: #888;
  font-size: 28px;
}
.mint-cell {
  background-color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: inherit;
  min-height: 2.4rem;
  display: block;
  overflow: hidden;
  position: relative;
  text-decoration: none;
}
.mask_bj {
  position: fixed;
  z-index: 900;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
}
/*20181212-weixixuan*/
.radio-group .radio {
  display: block;
  margin: 0 20px;
  height: 78px;
  line-height: 78px;
}
.radio-group .radio .label {
  float: left;
  font-size: 28px;
}
.radio-group .radio .checked {
  float: right;
}
</style>