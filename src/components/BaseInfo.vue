<template>
  <div>
    <div class="info_form">
      <div class="block">
        <div class="label mustfill">姓名</div>
        <div class="input">
          <input type="text" v-model="baseInfo.actualName" placeholder="请填写姓名" />
        </div>
      </div>

      <div class="block">
        <div class="label mustfill">性别</div>
        <div class="input">
          <van-radio-group v-model="baseInfo.sex">
            <van-radio name="0">男</van-radio>
            <van-radio name="1">女</van-radio>
          </van-radio-group>
        </div>
      </div>

      <div class="block">
        <div class="label mustfill">手机号码</div>
        <div class="input">{{baseInfo.mobileText}}</div>
      </div>
      <div class="block">
        <div class="label mustfill">出生年月</div>
        <div class="input">
          <div class="uni-list-cell-db">
            <div color="#ed4f4c" mode="date" fields="month" @click="pickTimeChoose('birthday')">
              <div v-if="baseInfo.birthday" class="uni-input">{{baseInfo.birthday}}</div>
              <div v-else class="uni-input" :style="{color: baseInfo.birthday ? '' : '#888888'} ">请选择</div>
            </div>
          </div>
        </div>
      </div>

      <div class="block" data-name="nowAddressProvince,nowAddressCity" @click="pickCityChoose('two', 'nowaddress')">
        <div class="label mustfill">现居住地</div>
        <div class="input" :style="{color: (baseInfo.nowAddressProvince && baseInfo.nowAddressCity) ? '' : '#888888' }">
          {{(baseInfo.nowAddressProvince && baseInfo.nowAddressCity) ? (baseInfo.nowAddressProvince + ',' + baseInfo.nowAddressCity) : '请选择'}}</div>
      </div>

      <div class="block" data-name="political" :data-value="politiText" @click="pickChoose('politiText','political')">
        <div class="label mustfill">政治面貌</div>
        <div class="input" :style="{color: baseInfo.politicalTroubleText ? '' : '#888888'} ">{{baseInfo.politicalTroubleText || '请选择'}}</div>
      </div>

      <div class="block" data-name="health" :data-value="healthyText" @click="pickChoose('healthyText','health')">
        <div class="label mustfill">健康情况</div>
        <div class="input" :style="{color: baseInfo.healthText ? '' : '#888888' }">{{baseInfo.healthText || '请选择'}}</div>
      </div>

      <div class="block" data-name="militaryPosition,services" @click="pickSolder">
        <div class="label mustfill">人员类别</div>
        <div class="input" :style="{color: (baseInfo.militaryPosition && baseInfo.services) ? '' : '#888888' }">{{(baseInfo.militaryPosition && baseInfo.services) ? (baseInfo.militaryPosition + ',' + baseInfo.services) : '请选择'}}</div>
      </div>

      <div class="block">
        <div class="label mustfill">服役时间</div>
        <div class="input">
          <div class="input_box_r">
            <div class="input_time" mode="date" fields="month" @click="pickTimeChoose('serviceBeginTime')">
              <div v-if="baseInfo.serviceBeginTime" class="uni-input">{{baseInfo.serviceBeginTime}}</div>
              <div v-else class="uni-input" :style="{color: baseInfo.serviceBeginTime ? '' : '#888888'} ">开始时间</div>
            </div>
            <span class="txt">至</span>
            <div class="input_time" mode="date" fields="month" @click="pickTimeChoose('serviceEndTime')">
              <div v-if="baseInfo.serviceEndTime" class="uni-input">{{baseInfo.serviceEndTime}}</div>
              <div v-else class="uni-input" :style="{color: baseInfo.serviceEndTime ? '' : '#888888'} ">结束时间</div>
            </div>
          </div>
        </div>
      </div>

      <div class="save-info default_back_color" :style="{opacity: baseInfo.actualName == ''|| baseInfo.sex == ''|| baseInfo.mobileText == '' || baseInfo.birthday == '' || baseInfo.healthKey == '' || baseInfo.militaryPosition == ''
				|| baseInfo.services == '' || baseInfo.politicalTroubleKey == '' || baseInfo.nowAddressCity == '' || baseInfo.nowAddressProvince == '' || baseInfo.serviceBeginTime == '' || baseInfo.serviceEndTime == '' ? 0.6 : 1,}"
        @click="formSubmit">保存</div>
    </div>

    <!-- 时间选择pick -->
    <van-popup v-model="showselectTime" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker v-model="currentDate" type="year-month" @cancel="cancelTime" @confirm="confirmTime" :min-date="minDate" :max-date="maxDate" />
    </van-popup>
    <!-- 地区选择pick -->
    <van-popup v-model="showProvince" position="bottom" :style="{ height: '40%' }">
      <van-area :area-list="cityList" :columns-num="2" @cancel="onCancel" @confirm="onConfirm" />
    </van-popup>
    <!-- 类型选择pick -->
    <van-popup v-model="showselectType" position="bottom" :style="{ height: '40%' }">
      <van-picker show-toolbar :columns="selectType" @cancel="onCancel" @confirm="onConfirm" />
    </van-popup>
    <!-- 人员类别 -->
    <van-popup v-model="showSolder" position="bottom" :style="{ height: '40%' }">
      <van-picker show-toolbar :columns="typeText" @cancel="cancelSolder" @confirm="confirmSolder" />
    </van-popup>

  </div>
</template>

<script>
import { Popup, Area, RadioGroup, Radio, Toast, Picker } from "vant";
import { formatTime } from "../utils/index";
import { telStart } from "../utils/public";
import { requireShare } from "../utils/share.js";

const solList = ["陆军", "海军", "空军", "火箭军", "战略支援部队", "武警部队"];
const solder = {
  士兵: solList,
  士官: solList,
  军官: solList
};

export default {
  components: {
    Radio,
    Popup,
    Area,
    RadioGroup,
    Toast,
    Picker
  },
  data() {
    return {
      baseInfo: {
        accountAddressCity: "",
        accountAddressProvince: "",
        actualName: "", //姓名
        age: 0,
        avatar: "",
        birthday: "", //生日
        health: "",
        healthText: "", //健康状况
        honorList: null,
        military: null,
        militaryPosition: "", //人员类别（军种）
        mobileText: "", //手机号
        nickname: "",
        nowAddress: "",
        nowAddressCity: "", //现居住市
        nowAddressProvince: "", //现居住省
        openId: "",
        personalType: "",
        politicalStatus: "",
        politicalTrouble: "",
        politicalTroubleKey: "", //政治面貌
        politicalTroubleText: "",
        serviceBeginTime: "", //服务开始时间
        serviceEndTime: "", //服务结束时间
        serviceYears: "",
        services: "", //人员类别（军级）
        sex: "0", //性别
        sexText: "",
        snowflakeId: "",
        troopExperience: "",
        userSnowflakeId: ""
      },
      defaultCity: '请选择',
      healthyText: ["健康", "军残证9", "军残证8", "军残证7", "军残证6", "军残证5", "军残证1--4"],
      healthyValue: ["healthy", "army_remnant_card_9", "army_remnant_card_8", "army_remnant_card_7", "army_remnant_card_6", "army_remnant_card_5", "army_remnant_card_1_4"],
      politiText: ["党员", "团员", "群众", "无党派人士"],
      politiValue: ["party_member", "league_member", "people", "non"],
      typeText: [
        {
          values: Object.keys(solder),
          className: "column1"
        },
        {
          values: solder["士兵"],
          className: "column2",
          defaultIndex: 0
        }
      ],
      provinceName: [],
      provinceIndex: 0,
      cityName: [],
      cityList: {},
      canPost: true,
      // dataPost: true,

      currentDate: new Date(),
      minDate: new Date(1965, 0, 1),
      maxDate: new Date(2125, 10, 1),
      showselectTime: false,
      timeType: "",
      showProvince: false,
      num: 3,
      valdetail: "",
      selectType: [],
      showselectType: false,
      showSolder: false
    };
  },
  mounted() {
    requireShare();
    this.$nextTick(() => {
      if (localStorage.getItem("mobile")) {
        let call = localStorage.getItem("mobile");
        this.baseInfo.mobileText = telStart(call);
      }
    });
    this.getBaseInfo();
    this.getArea();
  },
  methods: {
    //获取行政区三级联动数据
    getArea() {
      let vm = this;
      let randomnum = new Date().getTime();
      vm.$get(`${vm.$global.PREFIX}/area/tree?` + randomnum).then(res => {
        if (res.data.root) {
          vm.cityList = res.data.root;
        }
      })
    },
    pickSolder() {
      this.showSolder = true;
    },
    cancelSolder() {
      this.showSolder = false;
    },
    confirmSolder(val) {
      this.baseInfo.militaryPosition = val[0];
      this.baseInfo.services = val[1];
      this.showSolder = false;
    },
    onChange(picker, values) {
      picker.setColumnValues(1, citys[values[0]]);
    },
    getBaseInfo() {
      let vm = this;
      this.$get(`${vm.$global.PREFIX}/basic/info`)
        .then(res => {
          if (res.data.code === 200 && res.data.root) {
            vm.baseInfo = res.data.root;
            vm.baseInfo.sex = res.data.root.sex === 0 ? "0" : "1";
            if (vm.baseInfo.militaryPosition) {
              vm.defaultCity = "";
            } else if (vm.baseInfo.militaryPosition) {
              vm.defaultIndex = "";
            }
            vm.date = vm.baseInfo.birthday.replace("年", "-").replace("月", "");
            vm.startTime = vm.baseInfo.serviceBeginTime.substring(0, 7);
            vm.endTime = vm.baseInfo.serviceEndTime.substring(0, 7);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 时间选择
    pickTimeChoose(timeType) {
      this.showselectTime = true;
      this.timeType = timeType;
    },
    //类型选择
    pickChoose(val, valdetail) {
      this.showselectType = true;
      this.valdetail = valdetail;

      if (val === "politiText") {
        this.selectType = this.politiText;
      } else if (val === "healthyText") {
        this.selectType = this.healthyText;
      }
    },
    //省市选择
    pickCityChoose(val, valdetail) {
      this.showProvince = true;
      if (val === "three") {
        this.num = 3;
      } else {
        this.num = 2;
      }
      this.valdetail = valdetail;
    },

    // picker点击取消
    cancelTime() {
      this.showselectTime = false;
    },
    onCancel() {
      this.showProvince = false;
      this.showselectType = false;
    },

    // picker点击确定
    confirmTime(val) {
      this.showselectTime = false;
      let time = formatTime(this.currentDate, "line");

      if (this.timeType === "birthday") {
        this.baseInfo.birthday = time.slice(0, 7);
      } else if (this.timeType === "serviceBeginTime") {
        this.baseInfo.serviceBeginTime = time.slice(0, 7);
      } else if (this.timeType === "serviceEndTime") {
        this.baseInfo.serviceEndTime = time.slice(0, 7);
      }
    },
    onConfirm(val) {
      this.defaultCity = ''
      this.showProvince = false
      this.showselectType = false
      if (this.valdetail == 'nowaddress') {
        this.baseInfo.nowAddressProvince = val[0].name;
        this.baseInfo.nowAddressCity = val[1].name;
        // this.baseInfo.nowAddress = val[1].id
      } else if (this.valdetail === 'health') {
        let index = this.healthyText.indexOf(val)
        this.baseInfo.healthKey = this.healthyValue[index]
        this.baseInfo.healthText = val
      } else if (this.valdetail === 'political') {
        let index = this.politiText.indexOf(val)
        this.baseInfo.politicalTroubleKey = this.politiValue[index]
        this.baseInfo.politicalTroubleText = val
      }
    },
    formSubmit(e) {
      let vm = this;
      let flag = true;
      if (
        flag &&
        (vm.baseInfo.actualName === null ||
          vm.baseInfo.actualName === undefined ||
          vm.baseInfo.actualName === "")
      ) {
        Toast("请填写姓名");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.sex === null ||
          vm.baseInfo.sex === undefined ||
          vm.baseInfo.sex === "")
      ) {
        Toast("请选择性别");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.mobileText === null ||
          vm.baseInfo.mobileText === undefined ||
          vm.baseInfo.mobileText === "")
      ) {
        Toast("请填写手机号");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.birthday === null ||
          vm.baseInfo.birthday === undefined ||
          vm.baseInfo.birthday === "")
      ) {
        Toast("请选择出生年月");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.nowAddressCity === null ||
          vm.baseInfo.nowAddressCity === undefined ||
          vm.baseInfo.nowAddressCity === "") &&
        (vm.baseInfo.nowAddressProvince === null ||
          vm.baseInfo.nowAddressProvince === undefined ||
          vm.baseInfo.nowAddressProvince === "")
      ) {
        Toast("请选择现居住地");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.politicalTroubleKey === null ||
          vm.baseInfo.politicalTroubleKey === undefined ||
          vm.baseInfo.politicalTroubleKey === "")
      ) {
        Toast("请选择政治面貌");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.healthKey === null ||
          vm.baseInfo.healthKey === undefined ||
          vm.baseInfo.healthKey === "")
      ) {
        Toast("请选择健康状况");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.services === null ||
          vm.baseInfo.services === undefined ||
          vm.baseInfo.services === "") &&
        (vm.baseInfo.militaryPosition === null ||
          vm.baseInfo.militaryPosition === undefined ||
          vm.baseInfo.militaryPosition === "")
      ) {
        Toast("请选择人员类别");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.serviceBeginTime === null ||
          vm.baseInfo.serviceBeginTime === undefined ||
          vm.baseInfo.serviceBeginTime === "")
      ) {
        Toast("请选择服役开始时间");
        flag = false;
      }
      if (
        flag &&
        (vm.baseInfo.serviceEndTime === null ||
          vm.baseInfo.serviceEndTime === undefined ||
          vm.baseInfo.serviceEndTime === "")
      ) {
        Toast("请选择服役结束时间");
        flag = false;
      }
      if (flag && vm.canPost) {
        vm.canPost = false;
        if (vm.baseInfo.sex === "0") {
          vm.baseInfo.sexText = "男";
        } else {
          vm.baseInfo.sexText = "女";
        }
        vm.baseInfo.sex = Number(vm.baseInfo.sex);

        vm.$post(`${vm.$global.PREFIX}/basic/edit`, vm.baseInfo).then(res => {
          if (res.data.code === 200 && res.data.root) {
            Toast.success("保存成功");
            vm.canPost = true;
            setTimeout(() => {
              vm.$router.back();
            }, 500);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.save-info {
  display: block;
  color: #ffffff;
  width: 80%;
  height: 80px;
  line-height: 80px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 28px;
  text-align: center;
  margin: 50px auto;
}
.input_box_r {
  display: flex;
}
.input_time {
  padding-left: 40px;
}
.txt {
  padding-left: 40px;
  height: 90upx;
  line-height: 90upx;
  text-align: center;
}
.info_form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.info_form .block {
  padding: 30px 0;
  margin: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
  position: relative;
}
.info_form .label {
  font-size: 32px;
  padding-left: 18px;
}
.info_form .mustfill:after {
  content: "*";
  position: absolute;
  left: 0;
  font-size: 40px;
  color: #ed4f4c;
}
.info_form .input,
.info_form input {
  text-align: right;
  font-size: 32px;
}
.input label {
  margin-left: 30px;
}
.disable {
  pointer-events: none;
  opacity: 0.6;
}
</style>