<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">GoodsList</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <!--<a href="javascript:void(0)" class="default cur" @click="sortGoodsDef">Default</a>-->
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
              <use xlink:href="#icon-arrow-short">
                <svg id="icon-arrow-short" viewBox="0 0 25 32" width="100%" height="100%">
                  <title>arrow-short</title>
                  <path
                    d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z"
                    class="path1"></path>
                </svg>
              </use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Category:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter(-1)"
                     v-bind:class="{'cur':priceChecked==-1}">All</a></dd>
              <dd v-for="price in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(price.type)"
                   v-bind:class="{'cur':priceChecked==price.type}">{{price.name}}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="item.icon" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.name}}</div>
                    <div class="price">{{item.price}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.id)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">请先登录，否则无法加入到购物车中！</p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          <svg id="icon-status-ok" viewBox="0 0 32 32" width="100%" height="100%"><title>status-ok</title> <path d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z" class="path1"></path> <path d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z" class="path2"></path>
            <title>status-ok</title>
            <path d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z" class="path1"></path>
            <path d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z" class="path2"></path>
          </svg>
        </svg>
        <span>加入购物车成功！</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'
  import Modal from './../components/Modal'

  export default {
    data() {
      return {
        goodsList: [],
        priceFilter: [],
        priceChecked: -1,
        filterBy: false,
        overLayFlag: false,
        busy: true,
        sortFlag: true,//代表升序
        page: 1,
        size: 8,
        loading: false,
        mdShow: false,
        mdShowCart: false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    mounted: function () {
      this.getGoodsList();
      this.getPriceFilterList();
    },
    methods: {
      getPriceFilterList() {
        this.$axios.get("/buyer/category/list").then((result) => {
          var res = result.data;
          if (res.code == "0") {
            this.priceFilter = res.data;
          } else {
            this.priceFilter = [];
          }
        }).catch(function (error) {
          console.log("error init." + error)
        });
      },
      getGoodsList(flag) {
        this.loading = true;
        var param = {
          categoryType: this.priceChecked,
          page: this.page,
          size: this.size,
          sort: this.sortFlag ? 1 : -1
        }
        this.$axios.get("/buyer/product/list", {
          params: param
        }).then((result) => {
          this.loading = false;
          var res = result.data;
          if (res.code == "0") {
            var tempGoodslist = [];
            if (flag) {
              tempGoodslist = res.data
              this.goodsList = this.goodsList.concat(tempGoodslist);
              if (tempGoodslist == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              tempGoodslist = res.data
              this.goodsList = tempGoodslist;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        }).catch(function (error) {
          console.log("error init." + error)
        });
      },
      showFilterPop() {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      setPriceFilter(type) {
        this.priceChecked = type;
        this.closePop();
        this.page = 1;
        this.getGoodsList();
      },
      closePop() {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      sortGoodsDef() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      addCart(productId) {
        var param = {
          productId: productId,
        }
        this.$axios.get("/buyer/cart/add", {params: param}).then((result) => {
          var res = result.data;
          if (res.code == "0") {
            this.mdShowCart = true;
          } else {
            this.mdShow = true;
          }
        }).catch(function (error) {
          console.log("error init." + error);
        });
      },
      closeModal() {
        this.mdShow = false;
        this.mdShowCart = false;
      }

    }
  }
</script>

<style>
  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .sort-up {
    transform: rotate(180deg);
    transition: all .3s ease-out;
  }

  .icon-arrow-short {
    width: 11px;
    height: 11px;
    transition: all .3s ease-out;
  }
</style>
