<template>
  <div class="toast">
    <div v-show="isShow">{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props: {
      message: {
        type: String,
        default: ''
      },
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return  {
        message: '',
        isShow: false
      }
    },
    methods: {
      // show(message,duration=2000) {
      //   this.isShow = true
      //   this.message = message
      //
      //   setTimeout(() => {
      //     this.show = false
      //     this.message = ''
      //   },duration)
      // }
    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    top:50%;
    left: 50%;
    color: #ffffff;
    transform: translate(-50%,-50%);
    padding: 10px;
    background-color: rgba(0,0,0,.4);
    z-index: 99;
  }
</style>
