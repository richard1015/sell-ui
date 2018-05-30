<template>
    <div>
        <!-- 反馈信息 -->
        <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':modalFlag}">
            <div class="md-modal-inner">
                <div class="md-top">
                    <div class="md-title">反馈信息</div>
                    <button class="md-close" @click="modalFlag=false">关闭</button>
                </div>
                <div class="md-content">
                    <div class="confirm-tips">
                        <div class="error-wrap">
                            <span class="error error-show" v-show="errorTip">反馈失败</span>
                        </div>
                        <ul>
                            <li class="regi_form_input">
                                <!-- <i class="icon IconPeople"></i> -->
                                <input type="text" tabindex="1" name="loginname" v-model="title" placeholder="反馈标题" data-type="loginname" class="regi_login_input regi_login_input_left">
                            </li>
                            <li class="regi_form_input noMargin">
                                <!-- <i class="icon IconPwd"></i> -->
                                <input type="text" tabindex="2" name="password" v-model="content" placeholder="反馈描述" class="regi_login_input regi_login_input_left login-input-no input_text"
                                    @keyup.enter="login">
                            </li>
                        </ul>
                    </div>
                    <div class="login-wrap">
                        <a href="javascript:;" class="btn-login" @click="submit">提交</a>
                    </div>
                </div>

            </div>
        </div>
        <div class="md-overlay" v-if="modalFlag" @click="modalFlag=false;"></div>

        <nav-header></nav-header>
        <nav-bread>
            <span slot="bread">建议反馈</span>
        </nav-bread>
        <div class="container">
            <div class="cart">
                <div class="page-title-normal">
                    <h2 class="page-title-h2">
                        <span>我的建议反馈</span>
                    </h2>
                </div>
                <div class="item-list-wrap">
                    <div class="cart-item">
                        <div class="cart-item-head">
                            <a class="button button-primary button-small" @click="modalFlag=true;">添加反馈</a>
                        </div>

 <table style="width:100%">
              <thead>
                <td>问题id</td>
                <td>反馈名称</td>
                <td>反馈描述</td>
                <td>状态</td>
                <td>回复内容</td>
                <td>创建时间</td>
                <td>回复时间</td>
              </thead>
              <tbody>
                <tr v-for="item in cartList" :key="item.orderId">
                  <td>{{item.buyerId}}</td>
                  <td>{{item.title}}</td>
                  <td><textarea name="" id="" cols="30" rows="3">{{item.content}}</textarea></td>
                  <td>{{item.status==0?"等待回复":"已回复"}}</td>
                  <td><textarea name="" id="" cols="30" rows="3">{{item.reply}}</textarea></td>
                  <td>{{item.createTime}}</td>
                  <td>{{item.updateTime}}</td>
                </tr>
              </tbody>
            </table>
                    </div>
                </div>
            </div>
        </div>
        <modal :mdShow="modalConfirm" @close="closeModal">
            <p slot="message">您确认要删除此条数据吗？</p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="delCart">确认</a>
                <a class="btn btn--m" href="javascript:;" @click="modalConfirm=false">关闭</a>
            </div>
        </modal>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import Modal from "./../components/Modal";

export default {
  data() {
    return {
      cartList: [],
      modalConfirm: false,
      delItem: "",
      modalFlag: false,
      errorTip: false,
      title: "",
      content: ""
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$axios
        .post("/buyer/question/findAllByBuyerId", {
          buyerId: this.getCookie("userId")
        })
        .then(result => {
          let res = result.data;
          if (res.code == "0") {
            this.cartList = res.data;
          } else {
            this.cartList = [];
          }
        })
        .catch(function(error) {
          console.log("error init." + error);
        });
    },
    getCookie(name) {
      name = name + "=";
      var start = document.cookie.indexOf(name),
        value = null;
      if (start > -1) {
        var end = document.cookie.indexOf(";", start);
        if (end == -1) {
          end = document.cookie.length;
        }
        value = document.cookie.substring(start + name.length, end);
      }
      return value;
    },
    submit() {
      var params = {
        buyerId: this.getCookie("userId"),
        title: this.title,
        content: this.content
      };
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          if (!params[key] && key != "isDefault") {
            return alert("请完善基本信息必填项");
          }
        }
      }
      this.$axios
        .post("/buyer/question/insert", params)
        .then(result => {
          var res = result.data;
          if (res.code == "0") {
            alert("添加成功！");
            this.modalFlag = false;
            this.title = "";
            this.content = "";
            this.init();
          } else {
            alert("添加失败！");
          }
        })
        .catch(function(error) {
          console.log("error init." + error);
        });
    },
    closeModal() {
      this.modalConfirm = false;
    },
    delCartConfirm(item) {
      this.modalConfirm = true;
      this.delItem = item;
    },
    editCart(flag, item) {
      if (flag == "add") {
        item.quantity++;
      } else if (flag == "minu") {
        if (item.quantity <= 1) {
          return;
        }
        item.quantity--;
      } else {
        item.checked = item.checked == "1" ? "0" : "1";
      }
      var param = {
        productId: item.id,
        quantity: item.quantity,
        checked: item.checked
      };
      this.$axios
        .get("/buyer/cart/edit", { params: param })
        .then(result => {
          let res = result.data;
          if (res.code == "0") {
            let num = 0;
            if (flag == "add") {
              num = 1;
            } else if (flag == "minu") {
              num = -1;
            }
            this.$store.commit("updateCartCount", num);
          } else {
          }
        })
        .catch(function(error) {
          console.log("error init." + error);
        });
    },
    delCart() {
      var param = {
        productId: this.delItem.id
      };
      this.$axios
        .get("/buyer/cart/del", { params: param })
        .then(result => {
          let res = result.data;
          if (res.code == "0") {
            this.modalConfirm = false;
            this.init();
            this.$store.commit("updateCartCount", -this.delItem.quantity);
          } else {
          }
        })
        .catch(function(error) {
          console.log("error init." + error);
        });
    },
    toggleCheckAll() {
      var flag = !this.checkAllFlag;
      this.cartList.forEach(item => {
        item.checked = flag ? "1" : "0";
      });
      var param = {
        checkAll: flag
      };
      this.$axios
        .get("/buyer/cart/edit_check_all", { params: param })
        .then(result => {
          let res = result.data;
          if (res.code == "0") {
          } else {
          }
        })
        .catch(function(error) {
          console.log("error init." + error);
        });
    },
    checkOut() {
      if (this.checkedCount > 0) {
        this.$router.push({
          path: "/address"
        });
      }
    }
  }
};
</script>

<style>
.input-sub,
.input-add {
  min-width: 40px;
  height: 100%;
  border: 0;
  color: #605f5f;
  text-align: center;
  font-size: 16px;
  overflow: hidden;
  display: inline-block;
  background: #f0f0f0;
}

.item-quantity .select-self-area {
  background: none;
  border: 1px solid #f0f0f0;
}

.item-quantity .select-self-area .select-ipt {
  display: inline-block;
  padding: 0 3px;
  width: 30px;
  min-width: 30px;
  text-align: center;
}
</style>