<template>
  <div class="wrap" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import  BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
     this.scroll = new BScroll(this.$refs.wrapper,{
       click: true,
       probeType: this.probeType,
       pullUpLoad: this.pullUpLoad
     })

      this.scroll.on('scroll',position => {
        this.$emit('scroll',position)
      })
      if(this.pullUpLoad) {
        this.scroll.on('pullingUp',() => {
          console.log('上拉加载更多');
          this.finishPullUp()
          this.refresh()
          this.$emit('pullingUp')
        })
      }
     },
    methods: {
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo(x, y, time=100) {
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      }
    }
    }
</script>

<style scoped>

</style>
