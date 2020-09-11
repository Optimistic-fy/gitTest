<template>
  <div>
    <div class="info_form">
      <div class="block">
        <div class="label mustfill">学校</div>
        <div class="input"><input type="text"
                 v-model="eduInfo.schoolName"
                 placeholder="请填写" /></div>
      </div>

      <div class="block"
           data-name="diploma"
           :data-value="educationList"
           @click="pickChoose('educationList','diploma')">
        <div class="label mustfill">学历</div>
        <div class="input"
             :style="{color: eduInfo.education ? '' : '#888888'} ">{{eduInfo.education || '请选择'}}</div>
      </div>

      <div class="block">
        <div class="label mustfill">在校时间</div>
        <div class="input">
          <div class="input_box_r">
            <div class="input_time"
                 mode="date"
                 fields="month"
                 @click="pickTimeChoose('startTime')">
              <div v-if="eduInfo.beginTime"
                   class="uni-input">{{eduInfo.beginTime}}</div>
              <div v-else
                   class="uni-input"
                   :style="{color: eduInfo.beginTime ? '' : '#888888'} ">开始时间</div>
            </div>
            <span class="txt">至</span>
            <div class="input_time"
                 mode="date"
                 fields="month"
                 @click="pickTimeChoose('endTime')">
              <div v-if="eduInfo.endTime"
                   class="uni-input">{{eduInfo.endTime}}</div>
              <div v-else
                   class="uni-input"
                   :style="{color: eduInfo.endTime ? '' : '#888888'} ">结束时间</div>
            </div>
          </div>
        </div>
      </div>
      <div class="notes">注：请填写最高学历</div>

      <div class="save_info">
        <div class="btn default_back_color"
             @click="saveInfo">保 存</div>
      </div>
    </div>
    <!-- 时间选择pick -->
    <van-popup v-model="showselectTime"
               position="bottom"
               :style="{ height: '40%' }">
      <van-datetime-picker v-model="currentDate"
                           type="year-month"
                           @cancel="onCancel"
                           @confirm="onConfirm"
                           :min-date="minDate"
                           :max-date="maxDate" />
    </van-popup>
    <!-- 类型选择pick -->
    <van-popup v-model="showselectType"
               position="bottom"
               :style="{ height: '40%' }">
      <van-picker show-toolbar
                  :columns="selectType"
                  @cancel="onCancel"
                  @confirm="onConfirm" />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { formatTime } from '../utils/index'
import { requireShare } from '../utils/share.js'

export default {
  components: { Toast },
  data () {
    return {
      eduInfo: {
        beginTime: "",
        endTime: "",
        education: "",
        schoolName: ""
      },
      educationList: ['初中', '高中', '中技', '中专', '大专', '本科', '硕士', '博士'],
      backFlag: true,
      currentDate: new Date(),
      showselectTime: false,
      timeType: '',
      selectType: [],
      showselectType: false,
      minDate: new Date(1965, 0, 1),
      maxDate: new Date(2125, 10, 1),
    }
  },
  mounted () {
    requireShare();
    this.getInfo()
  },
  methods: {
    // 时间选择
    pickTimeChoose (timeType) {
      this.showselectTime = true
      this.timeType = timeType
    },
    //类型选择
    pickChoose (val, valdetail) {
      this.showselectType = true
      this.valdetail = valdetail

      if (val === "educationList") {
        this.selectType = this.educationList
      }
    },
    // picker点击取消
    onCancel () {
      this.showselectTime = false
      this.showselectType = false
    },
    // picker点击确定
    onConfirm (val) {
      this.showselectTime = false
      this.showselectType = false
      let time = formatTime(this.currentDate, 'line')

      if (this.timeType === 'startTime') {
        this.eduInfo.beginTime = time.slice(0, 7)
      } else if (this.timeType === 'endTime') {
        this.eduInfo.endTime = time.slice(0, 7)
      } else if (this.valdetail === 'diploma') {
        this.eduInfo.education = val
      }
    },
    getInfo () {
      let vm = this
      vm.$get(`${vm.$global.PREFIX}/edu/info`).then(res => {
        if (res.data.root) {
          let root = res.data.root
          root.beginTime = root.beginTime.substr(0, 7)
          root.endTime = root.endTime.substr(0, 7)
          vm.eduInfo = root
        }
      }).catch(err => {
        console.log(err)
      })
    },
    saveInfo () {
      let vm = this
      let eduInfo = Object.assign({}, this.eduInfo)
      eduInfo.beginTime = eduInfo.beginTime.length == 7 ? eduInfo.beginTime + '-00' : eduInfo.beginTime
      eduInfo.endTime = eduInfo.endTime.length == 7 ? eduInfo.endTime + '-00' : eduInfo.endTime,
        this.$post(`${vm.$global.PREFIX}/edu/save`, eduInfo).then(res => {
          if (res.data.root) {
            vm.showToast('保存成功', 'success')
            vm.backFlag = false
            setTimeout(function () {
              vm.$router.back()
            }, 1000)
          } else {
            vm.showToast(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    showToast (text, icon) {
      Toast({ message: text, icon: icon || 'none' })
    }
  },
  beforeDestroy () {
    if (this.backFlag) {
      // this._dataStat.accessRecord('back', '军役直聘小程序-工作经历页面-退出')
    }
  }
}
</script>

<style>
.info_form {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* overflow: auto; */
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
.input_box_r {
  display: flex;
}
.input_time {
  padding-left: 40px;
}
.txt {
  padding-left: 40px;
  text-align: center;
}
.save_info {
  padding: 0 40px;
}
.notes {
  padding: 0 40px;
  line-height: 80px;
  color: #999999;
}
.save_info .btn {
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #ffffff;
  border-radius: 10px;
  font-size: 35px;
}
</style>