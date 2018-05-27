<template>
  <div>
    <nav-header></nav-header>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>配送</span>订单</li>
          <li class="cur"><span>提交</span>订单</li>
          <li class="cur"><span>支付</span>订单</li>
          <li class="cur"><span>确认</span>订单</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>恭喜您！<br>您的订单提交成功！</h3>
          <p>
            <span>订单编号：{{orderId}}</span>
            <span>订单总价：{{orderTotal | currency('￥')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m "
                           to="/cart">购物车
              </router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m "
                           to="/">商品列表
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from './../components/NavHeader'
  import NavFooter from './../components/NavFooter'
  import NavBread from './../components/NavBread'

  export default {
    data() {
      return {
        orderId: '',
        orderTotal: 0
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted() {
      this.orderId = this.$route.query.orderId;
      this.orderTotal = this.$route.query.orderAmount;
    }
  }
</script>
