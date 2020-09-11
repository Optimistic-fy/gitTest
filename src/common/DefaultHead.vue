<template>
  <div class="header">
    <div class="title">{{title}}</div>
  </div>
</template>

<script>
export default {
  // name: 'head',
  props: ['title'],
  components: {

  },
  data() {
    return {
    }
  },
  mounted() {

  },
  computed: {

  },
  methods: {

  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 80px;
  background: #fff;
  color: #000;
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
