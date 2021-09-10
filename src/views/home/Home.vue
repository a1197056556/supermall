<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   ref="tabControl2"
                   @tabClick="tabClick"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop" :class="{fixed: isTabFixed}"></back-top>

  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from  'components/common/nav-bar/NavBar'
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";


  import {
    getHomeMultidata,
    getHomeGoods
  } from "network/home";



  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends:[],
        goods: {
          'pop' : {page: 0,list: []},
          'new' : {page: 0,list: []},
          'sell' : {page: 0,list: []}
        },
        currentType: 'pop',
        isShowBackTop: true,
        tabOffsetTop: 0,
        isTabFixed: false,
        itemImgListener: null
      }
    },
    created() {
      this.getHomeMultidata();
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      const refresh = this.debounce(this.$refs.scroll.refresh,500)
      this.itemImgListener = () => {
        refresh()
      }
      this.$bus.$on('itemImgLoad',this.itemImgListener)
    },
    methods: {
      debounce(func,delay) {
        let timer =null
        return function (...args) {
          if(timer) clearTimeout(timer)
          timer = setTimeout(() => {
            func.apply(this,args)
          })
        }
      },
      // 事件监听相关方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      // 网络请求相关方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners =res.data.banner.list;
          this.recommends =res.data.recommend.list;
      })
    },
      getHomeGoods(type){
        const page =this.goods[type].page+1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
        })
      },
      backClick() {
        this.$refs.scroll.scroll.scrollTo(0,0,500)
      },
      contentScroll(position) {
        this.isShowBackTop = (-position.y) >  1000

        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        // this.$refs.scroll.scroll.refresh()

      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    deactivated() {
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.tab-control {*/
  /*  position: sticky;*/
  /*  top:44px;*/
  /*  z-index: 999;*/
  /*}*/

  .content {
    /*height: calc(100% - 93px);*/
    /*height: 300px;*/
    overflow: hidden;
    /*margin-top: 51px;*/
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }


  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
