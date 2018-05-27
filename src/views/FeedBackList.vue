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
                                <i class="icon IconPeople"></i>
                                <input type="text" tabindex="1" name="loginname" v-model="title" placeholder="反馈标题" data-type="loginname" class="regi_login_input regi_login_input_left">
                            </li>
                            <li class="regi_form_input noMargin">
                                <i class="icon IconPwd"></i>
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
                        <div class="cart-item-head">
                            <ul>
                                <li>反馈名称</li>
                                <li>反馈描述</li>
                                <li>状态</li>
                            </ul>
                        </div>
                        <ul class="cart-item-list">
                            <li v-for="item in cartList">
                                <div class="cart-tab-1">
                                    <div class="cart-item-title">
                                        <div class="item-name">{{item.name}}</div>
                                    </div>
                                </div>
                                <div class="cart-tab-2">
                                    <div class="cart-item-title">
                                        描述描述描述描述描述描述描述描述描述描述描描述描述描述描述描
                                    </div>
                                </div>
                                <div class="cart-tab-3">
                                    <div class="cart-item-title">
                                        未回复
                                    </div>
                                </div>
                            </li>
                        </ul>
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
        computed: {
            checkAllFlag() {
                return this.checkedCount == this.cartList.length;
            },
            checkedCount() {
                var i = 0;
                this.cartList.forEach(item => {
                    if (item.checked == "1") i++;
                });
                return i;
            },
            totalPrice() {
                var money = 0;
                this.cartList.forEach(item => {
                    if (item.checked == "1")
                        money += parseFloat(item.price) * parseInt(item.quantity);
                });
                return money;
            }
        },
        methods: {
            init() {
                this.$axios
                    .get("/buyer/cart/list")
                    .then(result => {
                        let res = result.data;
                        if (res.code == "0") {
                            this.cartList = res.data;
                        } else {
                            this.cartList = [];
                        }
                    })
                    .catch(function (error) {
                        console.log("error init." + error);
                    });
            },
            submit() { },
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
                    .catch(function (error) {
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
                    .catch(function (error) {
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
                    .catch(function (error) {
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