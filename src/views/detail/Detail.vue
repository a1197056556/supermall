<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probetype="3">
      <detail-swiper :top-images="topImages" id="swiper"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad = "imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" id="param"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo " id="comment"></detail-comment-info>
      <goods-list :goods="recommends" id="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick"></back-top>
    <toast :message="message" :isShow="show"></toast>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop";
  import Toast from "components/common/toast/Toast";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin} from "common/mixin";

  import {mapActions} from 'vuex'

  export default {
      name: "Detail",
      components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        Scroll,
        GoodsList,
        BackTop,
        Toast
      },
      data() {
        return {
          iid: null,
          topImages: [],
          goods: {},
          shop: {},
          detailInfo: {},
          paramInfo: {},
          commentInfo: {},
          recommends: [],
          itemImgListener: null,
          isShowBackTop: true,
          message: '',
          show: false
         }
      },
      created() {
        this.iid = this.$route.params.iid

        getDetail(this.iid).then(res => {
          // console.log(res);
          const data = res.result
          this.topImages = data.itemInfo.topImages

          this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

          this.shop = new Shop(data.shopInfo)

          this.detailInfo = data.detailInfo

          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

          if(data.rate.cRate !==0) {
            this.commentInfo = data.rate.list[0]
          }
        })

        getRecommend().then(res => {
          console.log(res);
          this.recommends = res.data.list
        })
      },
      methods : {
        ...mapActions(['addCart']),
        imageLoad() {
          this.$refs.scroll.refresh()
        },
        titleClick(index) {
          console.log(index);
          switch (index) {
            case 0:
              this.$refs.scroll.scroll.scrollToElement('#swiper', 300)
              break
            case 1:
              this.$refs.scroll.scroll.scrollToElement('#param', 300)
              break
            case 2:
              this.$refs.scroll.scroll.scrollToElement('#comment', 300)
              break
            case 3:
              this.$refs.scroll.scroll.scrollToElement('#recommends', 300)
              break
          }
        },
        contentScroll(position) {
          console.log(position);
          const positionY = -position.y
          this.isShowBackTop = -position.y > 1000
        },
        backClick() {
          this.$refs.scroll.scroll.scrollTo(0, 0, 500)
        },
        addToCart() {
          //获取购物车需要展示信息
          const product = {}
          product.image = this.topImages[0]
          product.title = this.goods.title
          product.desc = this.detailInfo.desc
          product.price = this.goods.realPrice
          product.iid = this.iid


          //将商品添加到购物车
          // this.$store.commit('addCart',product)
          // this.$store.dispatch('addCart',product).then(res => {
          //   console.log(res);
          // })
          this.addCart(product).then(res => {
              this.show = true
              this.message = res
              setTimeout(() => {
                this.show = false
                this.message = ''
              },1500)
              console.log(res);
              console.log(this.message);
            })

            //添加购物车成功
            // this.$toast.show(res,1500)
            // console.log(this.$toast);
        },
      },
      mounted() {
      },
      destroyed() {
        this.$bus.$off('itemImgLoad',this.itemImgListener)
      },
      mixins: [itemListenerMixin]
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
     height: calc(100% - 44px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
