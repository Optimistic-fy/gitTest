<template>
  <div>
    <div class="header">
      <Button class="btn"
              icon="back"
              @click="goBack"></Button>
      <div class="title">{{title}}哈嗷嗷</div>
    </div>
  </div>
</template>


<script>
import { Button } from 'vant'

export default {
  name: 'Head',
  data() {
    return {
    }
  },
  components: {
    Button
  },
  props: ['title'],
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 750px;
  height: 80px;
  font-size: 34px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.btn {
  position: fixed;
  left: 0;
  margin-left: 20px;
  color: #000;
  background: #fff;
}
.mint-button--default {
  box-shadow: none;
}
</style>
