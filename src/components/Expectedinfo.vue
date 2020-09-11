<template>
  <div>
    <div class="job-direct">
      <div class="work_experience">
        <div class="block">
          <div class="label must_fill">期望职业</div>
          <div>
            <input type="text"
                   placeholder="请填写"
                   v-model="expectedInfo.expectedPosition" />
          </div>
        </div>
        <div class="block">
          <div class="label must_fill">期望薪资</div>
          <div><input class="min"
                   type="text"
                   placeholder="请填写"
                   v-model="expectedInfo.expectedSalaryMin" /></div>
          <span class="span">至</span>
          <div>
            <input class="max"
                   type="text"
                   placeholder="请填写"
                   v-model="expectedInfo.expectedSalaryMax" /></div>
        </div>
        <div class="block">
          <div class="label must_fill">期望城市</div>
          <div class="uni-list-cell-db"
               @click="showProvince = true">
            <div :style="{ color: !defaultCity ? '' : '#777777' }">
              <div class="uni-input"
                   v-if="!defaultCity">{{ expectedInfo.expectedProvince || provinceName[provinceIndex] }},{{ expectedInfo.expectedCity || cityName[cityIndex] }}</div>
              <div class="uni-input"
                   v-else>{{defaultCity}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="save_info">
        <div class="btn default_back_color"
             @click="saveInfo"
             :disabled="canPost?'':'disabled'">保存</div>
      </div>
    </div>
    <van-popup v-model="showProvince"
               position="bottom"
               :style="{ height: '40%' }">
      <van-area :area-list="cityList"
                :columns-num="2"
                @cancel="onCancel"
                @confirm="onConfirm" />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Area, Toast, Picker } from 'vant'
import { requireShare } from '../utils/share.js'

export default {
  components: {
    Popup,
    Area,
    Toast
  },
  data () {
    return {
      expectedInfo: {
        expectedProvince: '',
        expectedCity: '',
        expectedSalaryMin: null,
        expectedSalaryMax: null,
        expectedPosition: ''
      },
      defaultCity: '请选择',
      provinceName: [],
      provinceIndex: 0,
      cityName: [],
      cityIndex: 0,
      cityList: {},
      canPost: true,
      dataPost: true,
      showProvince: false
    };
  },
  created () {
    this.getArea()
  },
  mounted () {
    requireShare();
    // vm._dataStat.accessRecord('div', '薪资小程序-求职意向页面-访问')
    this.getExpectedInfo();
  },
  methods: {
    //获取行政区三级联动数据
    getArea () {
      let vm = this;
      let randomnum = new Date().getTime();
      vm.$get(`${vm.$global.PREFIX}/area/tree?` + randomnum).then(res => {
        if (res.data.root) {
          vm.cityList = res.data.root;
        }
      })
    },
    //确定选择城市
    onConfirm (val) {
      this.defaultCity = ''
      this.expectedInfo.expectedProvince = val[0].name
      this.expectedInfo.expectedCity = val[1].name
      this.showProvince = false//关闭弹框
    },
    //取消选中城市
    onCancel () {
      this.showProvince = false
    },
    getExpectedInfo () {
      let vm = this;
      this.$get(`${vm.$global.PREFIX}/expected/info`).then(res => {
        console.log(res)
        if (res.data.code === 200 && res.data.root) {
          vm.expectedInfo = res.data.root;
          if (vm.expectedInfo.expectedCity) {
            vm.defaultCity = ''
          }
        }
      }).catch(err => {
        console.log(err)
      });
    },
    saveInfo () {
      let vm = this;
      let expectedInfo = Object.assign({}, vm.expectedInfo);
      let flag = true;
      if (flag && (expectedInfo.expectedPosition === null || expectedInfo.expectedPosition === undefined || expectedInfo.expectedPosition === '')) {
        Toast({
          message: '请填写期望职业',
          icon: 'none'
        });
        flag = false;
      }
      if (
        flag &&
        (expectedInfo.expectedCity === null || expectedInfo.expectedCity === undefined || expectedInfo.expectedCity === '') &&
        (expectedInfo.expectedProvince === null || expectedInfo.expectedProvince === undefined || expectedInfo.expectedProvince === '')) {
        Toast({
          message: '请填写期望省市',
          icon: 'none'
        });
        flag = false;
      }
      if (
        flag &&
        (expectedInfo.expectedSalaryMin === null || expectedInfo.expectedSalaryMin === undefined || expectedInfo.expectedSalaryMin === '') &&
        (expectedInfo.expectedSalaryMax === null || expectedInfo.expectedSalaryMax === undefined || expectedInfo.expectedSalaryMax === '')) {
        Toast({
          message: '请填写期望薪资',
          icon: 'none'
        });
        flag = false;
      }
      if (flag && vm.canPost) {
        console.log('expectedInfo', expectedInfo)
        vm.$post(`${vm.$global.PREFIX}/expected/edit`, expectedInfo).then(res => {
          vm.canPost = false
          console.log(res)
          if (res.data.code === 200 && res.data.root) {
            Toast.success('保存成功');
            vm.canPost = true
            vm.dataPost = false
            // vm._dataStat.dataStatistic('save_expected_info','','save','薪资小程序-求职意向页面-点击保存')
            setTimeout(function () {
              vm.$router.back()
            }, 1000)
          }
        }).catch(err => {
          console.log(err)
        });
      }
    }
  },
}
</script>
<style scoped>
.job-direct {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 40px;
  font-size: 32px;
}
.work_experience_outside {
  margin: 0 40px;
}
.work_experience .block {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px #dcdcdc solid;
  margin-bottom: 10px;
}
.work_experience .block div {
  line-height: 100px;
  color: #333333;
}
.work_experience .block div input {
  height: 100px;
  width: 400px;
  margin-bottom: 2px;
  text-align: right;
}
.work_experience .block div .min,
.work_experience .block div .max {
  height: 100px;
  width: 200px;
  text-align: right;
}
.must_fill:before {
  content: "* ";
  line-height: 100px;
  color: red;
}
.describe_txtarea {
  width: 100%;
  padding-bottom: 80px;
  position: relative;
}
.describe_txtarea .label {
  line-height: 80px;
}
.txtarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px #7f7f7f solid;
  padding: 20px;
  min-height: 400px;
}
.word_num {
  position: absolute;
  bottom: 0;
  right: 0;
  line-height: 80px;
  color: #bebdbd;
  font-size: 28px;
}
.job_time {
  display: flex;
  text-align: right;
}
.span {
  display: inline-block;
  line-height: 100px;
  text-align: right;
}
.data_picker {
  width: 140px;
}
.uni-input {
  flex-grow: 4;
  padding: 0;
  text-align: right;
  margin-right: 20px;
  height: 90px;
  line-height: 90px;
}
.btn {
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #ffffff;
  border-radius: 10px;
  font-size: 32px;
}
</style>