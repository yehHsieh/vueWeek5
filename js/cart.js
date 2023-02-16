// import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-bundler.min.js';
const { createApp } = Vue;

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'practiceapi';

const productModal = {
    props: ['id', 'addToCart', 'openModal'],
    data() {
        return {
            tempProduct: {},
            modal: {},
            qty: 1,
            // loadingModal:""
        };
    },

    template: '#userProductModal',
    watch: {
        id() {
            console.log('productModal:', this.id);
            if (this.id) {
                // this.loadingModal = this.id;
                axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
                    .then(res => {
                        console.log('單一產品:', res.data.product);
                        this.tempProduct = res.data.product;
                        this.modal.show();
                        // loadingModal = "";
                    })
            }
        }
    },

    methods: {
        hide() {
            this.modal.hide();
        }
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);

        //監聽modal關閉
        this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
            console.log("Close");
            this.openModal('');
        })
    }
};


const app = Vue.createApp({
    data() {
        return {
            products: [],
            productId: '',
            cart: {},
            loadingItem: '',
            user:{},
        }
    },

    methods: {
        getProducts(id) {
            this.loadingItem = id;
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
                .then(res => {
                    console.log('產品列表:', res.data.products);
                    this.products = res.data.products;
                    this.loadingItem = "";
                })
        },
        openModal(id) {
            this.productId = id;
            console.log("外層帶入productId:", id)
            this.loadingItem = id;
        },
        addToCart(product_id, qty = 1) {
            const data = {
                product_id,
                qty,
            }
            this.loadingItem = product_id;
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
                .then(res => {
                    console.log('加入購物車:', res.data);
                    this.$refs.productModal.hide();
                    this.getCarts();
                    this.loadingItem = "";
                })
        },
        getCarts() {
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
                .then(res => {
                    console.log('購物車:', res.data);
                    this.cart = res.data.data;
                })
        },
        updateCartItem(item) {//購物車id和產品id
            const data = {
                product_id: item.product.id,
                qty: item.qty,
            }
            console.log(data, item.id)
            this.loadingItem = item.id;
            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, { data })
                .then(res => {
                    console.log('更新購物車:', res.data);
                    this.getCarts();
                    this.loadingItem = "";
                })
        },
        deleteItem(item) {
            this.loadingItem = item.id;
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
                .then(res => {
                    console.log('刪除購物車:', res.data);
                    this.getCarts();
                    this.loadingItem = "";
                })
        }
    },

    components: {
        productModal,
    },

    mounted() {
        this.getProducts();
        this.getCarts();
        console.log(VueLoading)
    }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount("#app")
