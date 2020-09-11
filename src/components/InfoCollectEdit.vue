<template>
  <div>
    <div class="info" id="info_box">
      <form action="">
        <div class="info_form_choose">
          <div class="info_form_block">
            <div class="info_title">
              <div class="info_title_header default_info_border_color">基本信息</div>
            </div>
            <div class="block">
              <div class="label mustfill">姓名</div>
              <div class="input" @click="inputName">
                <input ref="nameText" :class="isDisbale ? 'disabled' : ''" @blur="fixScroll" v-model.trim="userInfo.name" placeholder="请填写" />
              </div>
            </div>
            <div class="block">
              <div class="label mustfill">性别</div>
              <div class="input check_btn" :class="isDisbale ? 'disabled' : ''">
                <div class="uni-form-item uni-column">
                  <van-radio-group v-model="userInfo.sex">
                    <van-radio name="男">男</van-radio>
                    <van-radio name="女">女</van-radio>
                  </van-radio-group>
                </div>
              </div>
            </div>

            <div class="block" data-name="enlistProvince,enlistCity,enlistDistrict" @click="pickCityChoose('three', 'enlist')">
              <div class="label mustfill">入伍地</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''" :style="{color: (userInfo.enlistProvince && userInfo.enlistCity && userInfo.enlistDistrict) ? '' : '#888888' }">{{(userInfo.enlistProvince && userInfo.enlistCity &&
                userInfo.enlistDistrict) ? (userInfo.enlistProvince + ',' + userInfo.enlistCity + ',' + userInfo.enlistDistrict) : '请选择'}}</div>
            </div>

            <div class="block" data-name="political" :data-value="politicalList" @click="pickChoose('politicalList','political')">
              <div class="label mustfill">政治面貌</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''" :style="{color: userInfo.political ? '' : '#888888'} ">{{userInfo.political || '请选择'}}</div>
            </div>

            <div class="block" data-name="health" :data-value="healthyText" @click="pickChoose('healthyText','health')">
              <div class="label mustfill">健康情况</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''" :style="{color: userInfo.health ? '' : '#888888' }">{{userInfo.health || '请选择'}}</div>
            </div>

            <div class="block" data-name="education" :data-value="educationList" @click="pickChoose('educationList','education')">
              <div class="label mustfill">文化程度</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''" :style="{color: userInfo.education ? '' : '#888888' }">{{userInfo.education || '请选择'}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">入伍时间</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''">
                <div class="uni-list-cell-db">
                  <div color="#ed4f4c" mode="date" fields="month" @click="pickTimeChoose('serviceBeginTime')">
                    <div v-if="userInfo.serviceBeginTime" class="uni-input">{{userInfo.serviceBeginTime}}</div>
                    <div v-else class="uni-input" :style="{color: userInfo.serviceBeginTime ? '' : '#888888'} ">请选择</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="block">
              <div class="label mustfill">退伍时间</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''">
                <div class="uni-list-cell-db">
                  <div color="#ed4f4c" mode="date" fields="month" @click="pickTimeChoose('serviceEndTime')">
                    <div v-if="userInfo.serviceEndTime" class="uni-input">{{userInfo.serviceEndTime}}</div>
                    <div v-else class="uni-input" :style="{color: userInfo.serviceEndTime ? '' : '#888888' }">请选择</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="block">
              <div class="label mustfill">手机号码</div>
              <div class="input"><input class="disabled" type="number" v-model.trim="userInfo.mobile" placeholder="请填写" /></div>
            </div>

            <div class="block">
              <div class="label mustfill">邮箱或微信号</div>
              <div class="input" @click="inputEmail">
                <input ref="emailText" @blur="fixScroll" type="text" v-model.trim="userInfo.email" placeholder="请填写" />
              </div>
            </div>

            <!-- <div class="block" data-name="familyProvince,familyCity" :data-value="cityList"  @click="pickChoose">
							<div class="label mustfill">家庭住址</div>
							<div class="input" :style="{color: (userInfo.familyProvince && userInfo.familyCity) ? '' : '#888888' }" v-if="userInfo.familyProvince !== null && userInfo.familyCity !== null">{{(userInfo.familyProvince && userInfo.familyCity) ? (userInfo.familyProvince + ',' + userInfo.familyCity) : '请选择'}}</div>
						</div> -->

            <div class="block">
              <div class="label mustfill">家庭住址</div>
              <div class="input" @click="inputFamilyAddress">
                <input ref="familyAddressText" @blur="fixScroll" :class="isDisbale ? 'disabled' : ''" v-model.trim="userInfo.familyAddress" placeholder="请填写" />
              </div>
            </div>

            <div class="block">
              <div class="label mustfill">身份证号</div>
              <div class="input" @click="inputIdCard"><input ref="idCardText" @blur="fixScroll" :class="isDisbale ? 'disabled' : ''" type="text" v-model.trim="userInfo.idCard" placeholder="请填写" /></div>
            </div>

            <div class="block">
              <div class="label mustfill">退役证编号</div>
              <div class="input" @click="inputRetireNumber"><input ref="retireNumberText" @blur="fixScroll" :class="isDisbale ? 'disabled' : ''" type="text" v-model.trim="userInfo.retireNumber" placeholder="请填写" /></div>
            </div>

            <div class="block" data-name="retirePlacementMode" :data-value="retirePlacementModeList" @click="pickChoose('retirePlacementModeList','retirePlacementMode')">
              <div class="label mustfill">退役安置方式</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''" :style="{color: userInfo.retirePlacementMode ? '' : '#888888'} ">{{userInfo.retirePlacementMode || '请选择'}}</div>
            </div>

            <div class="block" data-name="placementProvince,placementCity,placementDistrict" @click="pickCityChoose('three', 'placement')">
              <div class="label mustfill">安置地</div>
              <div class="input" :class="isDisbale ? 'disabled' : ''" :style="{color: (userInfo.placementProvince && userInfo.placementCity && userInfo.placementDistrict) ? '' : '#888888'} ">{{(userInfo.placementProvince && userInfo.placementCity &&
                userInfo.placementDistrict) ? (userInfo.placementProvince + ',' + userInfo.placementCity + ',' + userInfo.placementDistrict) : '请选择'}}</div>
            </div>

            <!-- <div class="block">
              <div class="label mustfill">部队从事的主要岗位</div>
              <div class="input"><input @blur="fixScroll"
                       :class="isDisbale ? 'disabled' : ''"
                       type="text"
                       v-model="userInfo.armyPosition"
                       placeholder="请填写" /></div>
            </div> -->

            <div class="block">
              <div class="label mustfill">本人特长</div>
              <div class="input" @click="inputSpeciality"><input ref="specialityText" @blur="fixScroll" type="text" v-model.trim="userInfo.speciality" placeholder="请填写" /></div>
            </div>
          </div>

          <div class="info_form_block">
            <div class="info_title">
              <div class="info_title_header default_info_border_color">培训意愿</div>
            </div>

            <div class="block" data-name="trainType" :data-value="trainTypeList" @click="pickChoose('trainTypeList','trainType')">
              <div class="label mustfill">培训类型</div>
              <div class="input" :style="{color: userInfo.trainType ? '' : '#888888' }">{{userInfo.trainType || '请选择'}}</div>
            </div>

            <div class="block" data-name="trainProvince,trainCity,trainDistrict" @click="pickCityChoose('three', 'train')">
              <div class="label mustfill">培训地点</div>
              <div class="input" :style="{color: (userInfo.trainProvince && userInfo.trainCity && userInfo.trainDistrict) ? '' : '#888888' }">{{(userInfo.trainProvince && userInfo.trainCity && userInfo.trainDistrict) ? (userInfo.trainProvince + ','
                + userInfo.trainCity + ',' + userInfo.trainDistrict) : '请选择'}}</div>
            </div>

            <div class="block" data-name="trainMajor" :data-value="trainMajorList" @click="pickChoose('trainMajorList','trainMajor')">
              <div class="label mustfill">培训专业</div>
              <div class="input" :style="{color: userInfo.trainMajor ? '' : '#888888' }">{{userInfo.trainMajor || '请选择'}}</div>
            </div>

            <!-- <div class="block" data-name="trainClass" :data-value="trainClassList" @click="pickChoose('trainClassList','trainClass')">
							<div class="label mustfill">培训课程</div>
							<div class="input" :style="{color: userInfo.trainClass ? '' : '#888888' }">{{userInfo.trainClass || '请选择'}}</div>
						</div> -->
          </div>

          <div class="info_form_block">

            <div class="info_title">
              <div class="info_title_header default_info_border_color">就业需求</div>
            </div>

            <div class="block">
              <div class="label mustfill">是否需要马上就业</div>
              <div class="input check_btn">
                <div class="uni-form-item uni-column">
                  <van-radio-group v-model="userInfo.urgentNeedJob">
                    <van-radio name="是">是</van-radio>
                    <van-radio name="否">否</van-radio>
                  </van-radio-group>
                </div>
              </div>
            </div>

            <div class="block" data-name="employmentProvince,employmentCity" @click="pickCityChoose('two', 'employment')">
              <div class="label mustfill">就业地点</div>
              <div class="input" :style="{color: (userInfo.employmentProvince && userInfo.employmentCity) ? '' : '#888888' }">{{(userInfo.employmentProvince && userInfo.employmentCity) ? (userInfo.employmentProvince + ',' + userInfo.employmentCity)
                : '请选择'}}</div>
            </div>

            <div class="block" @click="chooseIndustry">
              <div class="label mustfill">期望行业</div>
              <div class="input" :style="{color: (userInfo.expectIndustryList !== null && userInfo.expectIndustryList.length > 0) ? '' : '#888888' }">
                {{userInfo.expectIndustryList !== null && userInfo.expectIndustryList.length > 0 ? userInfo.expectIndustryList : '请选择'}}
              </div>
            </div>
            <div class="industry_list" v-if="userInfo.expectIndustryList.length > 0">
              <div class="industry_block btn_gradient_color" v-for="(item,index) in userInfo.expectIndustryList.split(',')" :key="index">{{item}}</div>
            </div>

            <div class="block" data-name="expectSalaryRang" :data-value="expectSalaryRangList" @click="pickChoose('expectSalaryRangList','expectSalaryRang')">
              <div class="label mustfill">期望薪资</div>
              <div class="input" :style="{color: userInfo.expectSalaryRang ? '' : '#888888' }">{{userInfo.expectSalaryRang || '请选择'}}</div>
            </div>
          </div>
          <div class="btn submit_btn btn_gradient_color" @click="submit_form">提交</div>
        </div>

      </form>
    </div>

    <!-- 地区选择pick -->
    <van-popup v-model="showProvince" position="bottom" :style="{ height: '40%' }">
      <van-area :area-list="cityList" @confirm="onConfirm" @cancel="onCancel" :columns-num="num" />
    </van-popup>

    <!-- 类型选择pick -->
    <van-popup v-model="showselectType" position="bottom" :style="{ height: '40%' }">
      <van-picker show-toolbar :columns="selectType" @cancel="onCancel" @confirm="onConfirm" />
    </van-popup>
    <!-- 时间选择pick -->
    <van-popup v-model="showselectTime" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker v-model="currentDate" type="year-month" @cancel="onCancelTime" @confirm="onConfirmTime" />
    </van-popup>
    <!-- 弹窗 -->
    <div class="mask" v-if="showMask">
      <div class="prompt">
        <div class="tittle_problem">
          <div class="content_pro">
            <p v-if="showId">身份证号码已存在，无法提交</p>
            <p v-if="showTel">手机号码已存在，无法提交</p>
            <!-- <p class="renize">
							请重新核对后再提交<br />
							核对正确仍无法提交，请联系客服
						</p> -->
          </div>
        </div>
        <div class="btnSign">
          <div class="btn cancel" @click="clickCancel">关闭</div>
          <!-- <div class="btn sure" >联系客服</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function getDate(type) {
  const date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === 'start') {
    year = year - 60;
  } else if (type === 'end') {
    year = year + 2;
  }
  month = month > 9 ? month : '0' + month;;
  day = day > 9 ? day : '0' + day;

  return `${year}-${month}-${day}`;
}

import { Popup, Area, RadioGroup, Radio, Toast } from 'vant'
import { formatTime } from '../utils/index'
import { telStart } from '../utils/public'
import { requireShare } from '../utils/share.js'
import { mapState } from 'vuex'
Toast.setDefaultOptions({ duration: 2000 });

export default {
  components: {
    Radio,
    Popup,
    Area,
    RadioGroup
  },
  data() {
    return {
      userInfo: {
        name: "",// 姓名
        sex: "",  // 性别
        enlistProvince: "", //入伍地
        enlistCity: "",
        enlistDistrict: "",
        political: "", // 政治面貌
        health: "",  // 健康情况
        education: "",  // 文化程度
        serviceBeginTime: "", // 入伍时间(yyyy-MM)
        serviceEndTime: "",  // 退役时间(yyyy-MM)
        mobile: "",  // 手机号
        email: "",  // 邮箱
        // familyProvince:  "",  // 家庭住址所在省
        // familyCity:  "",  // 家庭住址所在市
        familyAddress: "",  // 家庭住址详细地址(必填)
        idCard: "",  // 身份证号
        retireNumber: "",  // 退役编号
        retirePlacementMode: "", // 退役安置方式
        placementProvince: "", // 安置地
        placementCity: "",
        placementDistrict: "",
        armyPosition: "",	 // 部队从事的主要岗位
        speciality: "",	 // 本人特长
        trainType: "",	 // 培训类型
        trainProvince: "",	//  意愿培训地
        trainCity: "",
        trainDistrict: "",
        trainMajor: "",	 // 意愿培训专业
        // trainClass:  "",	 // 意愿培训课程
        employmentProvince: "",	 // 就业地
        employmentCity: "",
        expectIndustryList: [],	 // 期望行业(字符串类型的Array)
        expectSalaryRang: '', // 期望薪资
        urgentNeedJob: ''
      },
      themeColor: '#ed4f4c',
      pickerValueArray: [],
      deepLength: 1,
      mode: '',
      pickerValueDefault: [0, 0, 1],
      // cityPickerValueDefault: [0, 0, 1],
      cityList: {},
      thatChooseParam: '',
      politicalList: ['党员', '团员', '群众', '预备党员'],
      healthyText: ['健康', '军残证9', '军残证8', '军残证7', '军残证6', '军残证5', '军残证4', '军残证3', '军残证2', '军残证1'],
      educationList: ['高中及以下', '大专', '本科在读', '本科及以上'],
      retirePlacementModeList: ['自主就业退役士兵', '复原干部', '自主择业军转干部'],
      trainTypeList: ['3个月短期培训', '6个月短期培训', '中职教育1~2年', '高职教育3年以上'],
      expectSalaryRangList: ['2千以下', '2千-3千', '3千-4.5千', '4.5千-6千', '6千-8千', '8千-1万', '1万-1.5万', '1.5万-2.5万', '3.5万-5万', '5万-7万', '7万-10万', '10万以上'],
      trainMajorList: ['计算机', '管理', '运营', '医学'],
      // trainClassList: ['前端','后端','会计','护士'],
      thatData: getDate({
        format: true
      }),
      showMask: false,
      showId: false,     //显示身份证错误
      showTel: false,    //显示电话错误
      showProvince: false,
      num: 3,
      valdetail: '',
      selectType: [],
      timeType: '',
      showselectType: false,
      showselectTime: false,
      currentDate: new Date(),
      scrollHeight: 0,
      isDisbale: false
    }
  },
  computed: {
    ...mapState(['appid'])
  },
  mounted() {
    requireShare();
    this.queryUserInfo();
    this.getArea();
  },
  methods: {
    inputName() {
      this.$refs.nameText.focus();
    },
    inputEmail() {
      this.$refs.emailText.focus();
    },
    inputFamilyAddress() {
      this.$refs.familyAddressText.focus();
    },
    inputIdCard() {
      this.$refs.idCardText.focus();
    },
    inputRetireNumber() {
      this.$refs.retireNumberText.focus();
    },
    inputSpeciality() {
      this.$refs.specialityText.focus();
    },
    handleScroll() {
      this.scrollHeight = document.getElementById('info_box').scrollTop;
    },
    //获取行政区三级联动数据
    getArea() {
      let vm = this;
      let randomnum = new Date().getTime();
      vm.$get(`${vm.$global.PREFIX}/area/tree?` + randomnum).then(res => {
        if (res.data.root) {
          // console.log("res",res.data.root)
          vm.cityList = res.data.root;
        }
      })
    },
    // 查询用户信息
    queryUserInfo() {
      let vm = this
      this.$get(`${vm.$global.PREFIX}/user/info`).then(res => {
        if (res.data.root) {
          if (res.data.root.expectIndustryList == null) {
            res.data.root.expectIndustryList = []
          }
          vm.userInfo = vm.dataCapture(res.data.root)
          if (res.data.root.type == '1') {
            vm.isDisbale = true
          } else if (res.data.root.type == '0') {
            if (res.data.root.printName != null && res.data.root.printName != '' && res.data.root.printName != undefined) {
              vm.isDisbale = true
            } else {
              vm.isDisbale = false
            }
          }
          else {
            vm.isDisbale = false
          }
        }
      }).catch((err) => {
        console.log('err', err)
      })
    },
    // 提交表单
    submit_form() {
      let vm = this
      let idNumber = vm.userInfo.idCard;
      let telNumber = vm.userInfo.mobile;
      if (vm.Nonempty(vm.userInfo)) {
        if (vm.userIDNumber(idNumber)) {
          vm.$get(`${vm.$global.PREFIX}/check/card/${idNumber}`).then(res => {
            if (res.data.root) {
              if (vm.userPhone(telNumber)) {
                vm.$get(`${vm.$global.PREFIX}/check/phone/${telNumber}`).then(res => {
                  if (res.data.root) {
                    vm.saveInfo();
                  } else {
                    this.showMask = !this.showMask
                    vm.showTel = true
                    vm.showId = false
                  }
                }).catch((err) => {
                  console.log('err', err)
                })
              }
            } else {
              this.showMask = !this.showMask
              vm.showTel = false
              vm.showId = true
            }
          }).catch((err) => {
            console.log('err', err)
          })
        }
      }
    },
    // 身份证号验证
    userIDNumber(idnumber) {
      let regNumber = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
      if (!idnumber) {
        this.infoToast('请先填写身份证号码')
        return false
      } else if (!regNumber.test(idnumber)) {
        this.infoToast('身份证号码格式不正确')
        return false
      } else {
        return true
      }
    },
    //电话号码验证
    userPhone(phone) {
      let regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (!phone) {
        this.infoToast('请先填写手机号码')
        return false
      } else if (!regPhone.test(phone)) {
        this.infoToast('手机号格式不正确')
        return false
      } else {
        return true
      }
    },

    // 选择期望行业
    chooseIndustry() {
      if (this.userInfo.expectIndustryList && this.userInfo.expectIndustryList.length > 0) {
        this.$router.push({ path: `/${this.appid}/industryChoose`, query: { chooseOption: this.userInfo.expectIndustryList } })
      } else {
        this.$router.push({ path: `/${this.appid}/industryChoose` })
      }
    },
    // 时间选择
    pickTimeChoose(timeType) {
      this.showselectTime = true
      this.timeType = timeType
    },
    onCancelTime() {
      this.showselectTime = false
    },
    onConfirmTime() {
      this.showselectTime = false
      let time = formatTime(this.currentDate, 'line')
      if (this.timeType === 'serviceBeginTime') {
        this.userInfo.serviceBeginTime = time.slice(0, 7)
      } else if (this.timeType === 'serviceEndTime') {
        this.userInfo.serviceEndTime = time.slice(0, 7)
      }
    },
    //类型选择
    pickChoose(val, valdetail) {
      // console.log("selectType",val)  
      if (this.isDisbale) {
        if (valdetail === 'political' || valdetail === 'health' || valdetail === 'education' || valdetail === 'retirePlacementMode') {
          this.showselectType = false
        } else {
          this.showselectType = true
        }
      } else {
        this.showselectType = true
      }
      this.valdetail = valdetail

      if (val === "politicalList") {
        this.selectType = this.politicalList
      } else if (val === "healthyText") {
        this.selectType = this.healthyText
      } else if (val === "educationList") {
        this.selectType = this.educationList
      } else if (val === "retirePlacementModeList") {
        this.selectType = this.retirePlacementModeList
      } else if (val === "trainTypeList") {
        this.selectType = this.trainTypeList
      } else if (val === "trainMajorList") {
        this.selectType = this.trainMajorList
      } else if (val === "expectSalaryRangList") {
        this.selectType = this.expectSalaryRangList
      }
    },
    pickCityChoose(val, valdetail) {
      if (this.isDisbale) {
        if (valdetail === 'enlist' || valdetail === 'placement') {
          this.showProvince = false
        } else {
          this.showProvince = true
        }
      } else {
        this.showProvince = true
      }
      if (val === 'three') {
        this.num = 3
      } else {
        this.num = 2
      }
      this.valdetail = valdetail
    },
    // picker点击取消
    onCancel() {
      this.showProvince = false
      this.showselectType = false
    },
    // picker点击确定
    onConfirm(val) {
      // console.log("选择val",val)
      this.showProvince = false
      this.showselectType = false
      if (this.valdetail === 'enlist') {
        this.userInfo.enlistProvince = val[0].name
        this.userInfo.enlistCity = val[1].name
        this.userInfo.enlistDistrict = val[2].name
      } else if (this.valdetail == 'placement') {
        this.userInfo.placementProvince = val[0].name
        this.userInfo.placementCity = val[1].name
        this.userInfo.placementDistrict = val[2].name
      } else if (this.valdetail == 'train') {
        this.userInfo.trainProvince = val[0].name
        this.userInfo.trainCity = val[1].name
        this.userInfo.trainDistrict = val[2].name
      } else if (this.valdetail == 'employment') {
        this.userInfo.employmentProvince = val[0].name
        this.userInfo.employmentCity = val[1].name
      } else if (this.valdetail === 'political') {
        this.userInfo.political = val
      } else if (this.valdetail === 'health') {
        this.userInfo.health = val
      } else if (this.valdetail === 'education') {
        this.userInfo.education = val
      } else if (this.valdetail === 'retirePlacementMode') {
        this.userInfo.retirePlacementMode = val
      } else if (this.valdetail === 'trainType') {
        this.userInfo.trainType = val
      } else if (this.valdetail === 'trainMajor') {
        this.userInfo.trainMajor = val
      } else if (this.valdetail === 'expectSalaryRang') {
        this.userInfo.expectSalaryRang = val
      }
    },

    cityOnConfirm(e) {
      let chooseVal = e.label
      let thatParam = this.thatChooseParam
      // console.log(e)

      let val1 = chooseVal.split('-')[0]
      let val2 = chooseVal.split('-')[1]
      let val3 = chooseVal.split('-')[2]

      let param1 = thatParam.split(',')[0]
      let param2 = thatParam.split(',')[1]
      let param3 = thatParam.split(',')[2]
      this.userInfo[param1] = val1
      this.userInfo[param2] = val2
      this.userInfo[param3] = val3
      // console.log(thatParam)
    },
    //日期截取处理
    dataCapture(param) {
      var newParam = param
      newParam.serviceBeginTime = newParam.serviceBeginTime ? newParam.serviceBeginTime.substr(0, 7) : ''
      newParam.serviceEndTime = newParam.serviceEndTime ? newParam.serviceEndTime.substr(0, 7) : ''
      let list = newParam.expectIndustryList
      let arr = []
      for (let i in list) {
        arr.push(list[i])
      }
      newParam.expectIndustryList = newParam.expectIndustryList ? arr.join(',') : ''
      return newParam
    },
    //保存信息
    saveInfo() {
      let vm = this;
      vm.submitState = false;
      let newParam = {};

      for (let item in vm.userInfo) {
        if (item == 'serviceBeginTime' || item == 'serviceEndTime') {
          if (vm.userInfo[item] != '') {
            newParam[item] = vm.userInfo[item] + '-01'
          } else {
            newParam[item] = vm.userInfo[item]
          }
        } else if (item == 'expectIndustry') {
          newParam[item] = ""
        } else if (item == 'expectIndustryList') {
          newParam[item] = vm.userInfo.expectIndustryList.split(',')
        } else if (item == 'armyPosition') {
          newParam[item] = '默认值'
        } else {
          newParam[item] = vm.userInfo[item]
        }
      };

      // console.log("newParam", newParam)
      vm.$post(`${vm.$global.PREFIX}/user/edit`, newParam).then(res => {
        vm.submitState = true;
        if (res.data.root) {
          vm.infoToast('保存成功');
          vm.showTel = false;
          vm.showId = false;
          vm.$router.push({ path: `/${this.appid}/infoCollectEditDetail` });
        } else {
          vm.infoToast(res.data.msg);
        }
      }).catch(err => {
        vm.submitState = true;
        vm.infoToast('信息填写不完整，完善后再试');
      });
    },

    //为空提示
    Nonempty(formObj) {
      // console.log("formObj", formObj)
      if (formObj.name === '') {
        this.infoToast('请填写姓名');
      } else if (formObj.sex === '') {
        this.infoToast('请选择性别');
      } else if (formObj.enlistProvince === '') {
        this.infoToast('请选择入伍地');
      } else if (formObj.political === '') {
        this.infoToast('请选择政治面貌');
      } else if (formObj.health === '') {
        this.infoToast('请选择健康情况');
      } else if (formObj.education === '') {
        this.infoToast('请选择文化程度');
      } else if (formObj.serviceBeginTime === '') {
        this.infoToast('请选择入伍时间');
      } else if (formObj.serviceEndTime === '') {
        this.infoToast('请选择退伍时间');
      } else if (formObj.mobile === '') {
        this.infoToast('请填写手机号');
      } else if (formObj.email === '') {
        this.infoToast('请填写邮箱或微信号');
      } else if (formObj.familyAddress === '') {
        this.infoToast('请填写家庭住址');
      } else if (formObj.idCard === '') {
        this.infoToast('请填写身份证号');
      } else if (formObj.retireNumber === '') {
        this.infoToast('请填写退役证编号');
      } else if (formObj.retirePlacementMode === '') {
        this.infoToast('请选择退役安置方式');
      } else if (formObj.placementProvince === '') {
        this.infoToast('请选择安置地');
      } else if (formObj.speciality === '') {
        this.infoToast('请填写本人特长');
      } else if (formObj.trainType === '') {
        this.infoToast('请选择培训类型');
      } else if (formObj.trainProvince === '') {
        this.infoToast('请选择培训地点');
      } else if (formObj.trainMajor === '') {
        this.infoToast('请选择培训专业');
      } else if (formObj.urgentNeedJob === '') {
        this.infoToast('请选择是否需要马上就业');
      } else if (formObj.employmentProvince === '') {
        this.infoToast('请选择就业地点');
      } else if (formObj.expectIndustryList.length < 1) {
        this.infoToast('请选择期望行业');
      } else if (formObj.expectSalaryRang === '') {
        this.infoToast('请选择期望薪资');
      } else {
        return true;
      }
    },
    // 提示
    infoToast(text) {
      Toast({
        message: text,
        duration: 1800
      });

    },
    clickCancel() {
      this.showMask = false
      this.showTel = false
      this.showId = false
    },
    fixScroll() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        document.getElementById('info_box').scrollTop = this.scrollHeight
      }
    }
  },
  activated() {
    window.addEventListener('scroll', this.handleScroll, true)
    // console.log('信息采集-scrollHeight', this.scrollHeight)
    document.getElementById('info_box').scrollTop = this.scrollHeight
    this.$store.dispatch('hasInfo').then(res => {
      let chooseOption = localStorage.getItem('chooseOption')
      if (chooseOption != '' && chooseOption != null) {
        this.userInfo.expectIndustryList = chooseOption
      }
    })
  },
  deactivated() {
    localStorage.removeItem('chooseOption')
    window.removeEventListener("scroll", this.handleScroll, true)
  }
}
</script>

<style scoped>
.input input {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.info {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background: #f4f4f4;
}
.info_form_block {
  background: #ffffff;
}
.info_title {
  border-bottom: 1px solid #dcdcdc;
  line-height: 1;
  height: 90px;
  display: flex;
  align-items: center;
  margin-top: 12px;
}
.info_title_header {
  font-size: 34px;
  padding: 0 30px;
}
.info_form_choose .block {
  padding: 30px 0;
  margin: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #dcdcdc;
  position: relative;
}
.info_form_block .block:nth-child(2) {
  border-top: none;
}
.info_form_choose .label {
  font-size: 32px;
  padding-left: 18px;
  width: 220px;
}
.ridio_box {
  display: flex;
  justify-content: flex-end;
}
.info_form_choose .mustfill:after {
  content: "*";
  position: absolute;
  left: 0;
  color: #ed4f4c;
  font-size: 40px;
}
.info_form_choose .input,
.info_form_choose input {
  text-align: right;
  font-size: 32px;
  width: 410px;
}
.input label {
  margin-left: 30px;
}
.submit_btn {
  color: #ffffff;
  margin-top: 20px;
  width: 100%;
  height: 80px;
  line-height: 80px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 28px;
  text-align: center;
}
.address_textarea {
  width: 400px;
  height: 130px;
}
.industry_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  line-height: 60px;
  margin: 0 30px;
}
.industry_list .industry_block {
  padding: 0 15px;
  height: 53px;
  line-height: 53px;
  border-radius: 8px;
  font-size: 28px;
  color: #ffffff;
  margin: 10px;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
}
.prompt {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -125px;
  margin-left: -250px;
  width: 500px;
  height: 250px;
  background: #fff;
  border-radius: 10px;
  font-size: 28px;
}
.content_pro {
  padding: 10px;
  font-size: 30px;
}
.content_pro p {
  text-align: center;
  padding: 35px 0;
}
.content_pro .renize {
  font-size: 25px;
  padding: 10px 0;
}
.btnSign {
  height: 90px;
  background: #fff;
  border-radius: 0 0 10px 10px;
  border-top: 1px solid #ccc;
}
.btnSign div::after {
  border-style: none;
}
.cancel,
.sure {
  height: 100%;
  line-height: 95px;
  width: 48%;
  display: inline-block;
  background: #fff;
  font-size: 30px;
  text-align: center;
}
.cancel {
  width: 100%;
}
.sure {
  color: #2c61ad;
}
.disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.7;
}
.check_btn {
  display: flex;
  justify-content: flex-end;
}
</style>
