<template>
  <div>
    <div class="choose-job-content">
      <div class="choose_label_list_outside">
        <div class="title">最少选择1项行业，最多选择3项行业</div>
        <div class="choose_label_list">
          <div class="choose_label btn_gradient_color"
               v-for="(item,index) in chooseList"
               :key="index">
            {{item}}
            <van-icon name="cross"
                      class="icon"
                      color="#FFFFFF"
                      type="closeempty"
                      @click="closeLabel(index, item)" />
          </div>
        </div>
      </div>
      <div class="industry_list">
        <div class="block"
             v-for="(item, index) in list"
             :key="index">

          <div class="title">{{item.name}}</div>
          <div class="label_list">
            <div class="label"
                 v-for="(itemSencond, index2) in item.subList"
                 :key="index2"
                 :class="itemSencond.choose ? 'label_active btn_gradient_color' : ''"
                 @click="chooseIndustry(itemSencond.name, index, index2)">{{itemSencond.name}}</div>
          </div>

        </div>
      </div>
    </div>
    <div class="btn save btn_gradient_color"
         @click="save">保存</div>
  </div>
</template>

<script>
import { Icon, Toast } from 'vant'
import { requireShare } from '../utils/share.js'

export default {
  components: { Icon },
  data () {
    return {
      list: [],
      chooseList: []
    }
  },
  mounted () {
    requireShare();
    let chooseOption = this.$route.query.chooseOption
    if (chooseOption) {
      this.chooseList = chooseOption.split(',')
    }
    this.getList()

  },
  methods: {
    // 保存
    save () {
      if(this.chooseList < 1){
        Toast({
          message: '至少选择1项',
          duration: 2000
        });
      }else{
        localStorage.setItem('chooseOption', this.chooseList)
        this.$router.back()
      }
      
    },
    // 选择行业
    chooseIndustry (name, index, index2) {
      let vm = this
      if (vm.chooseList.length >= 3) {
        Toast({
          message: '最多添加3项',
          duration: 2000
        });
        return;
      }
      if (vm.chooseList.includes(name)) {
        Toast({
          message: '您已经添加该项',
          duration: 2000
        });
      } else {
        vm.chooseList.push(name)
        vm.list[index].subList[index2].choose = true
      }
    },

    // 删除标签
    closeLabel (index, name) {
      let vm = this
      for (let i = 0; i < vm.list.length; i++) {
        for (let j = 0; j < vm.list[i].subList.length; j++) {
          if (vm.chooseList[index] == vm.list[i].subList[j].name) {
            vm.list[i].subList[j].choose = false
          }
        }
      }
      this.chooseList.splice(index, 1)
    },

    // 获取列表
    getList () {
      let vm = this
      vm.$get(`${vm.$global.PREFIX}/category/industry`).then(res => {
        if (res.data.root) {
          vm.list = res.data.root
          for (let i = 0; i < vm.list.length; i++) {
            for (let j = 0; j < vm.list[i].subList.length; j++) {
              vm.list[i].subList[j].choose = false
              for (let t = 0; t < vm.chooseList.length; t++) {
                if (vm.list[i].subList[j].name === vm.chooseList[t]) {
                  vm.list[i].subList[j].choose = true
                }
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style>
.choose-job-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 100px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.industry_list .block {
  padding: 20px 30px 30px 30px;
  border-top: 1px #dcdcdc solid;
  line-height: 60px;
}
.industry_list .block .title {
  font-weight: 400;
  color: #333333;
  font-size: 30px;
}
.label_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  line-height: 60px;
}
.label_list .label {
  padding: 0 15px;
  height: 53px;
  line-height: 53px;
  border-radius: 8px;
  font-size: 28px;
  background: #f4f4f4;
  margin: 10px;
  text-align: center;
}
.choose_label_list_outside {
  margin: 0 30px;
}
.choose_label_list_outside .title {
  line-height: 80px;
  font-size: 32px;
  font-weight: 400;
}
.choose_label_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  line-height: 60px;
}
.choose_label_list .choose_label {
  padding: 0 60px 0 15px;
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
.choose_label_list .choose_label .icon {
  position: absolute;
  right: 15px;
  font-size: 30px;
}
.save {
  height: 80px;
  line-height: 80px;
  color: #ffffff;
  margin-top: 20px;
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 10px;
  border-radius: 10px;
  font-size: 30px;
  text-align: center;
}
.label_list .label_active {
  color: #ffffff;
}
</style>