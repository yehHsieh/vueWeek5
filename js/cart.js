// import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-bundler.min.js';
const { createApp } = Vue;

const apiUrl = 'http://vue3-course-api.hexschool.io';
const apiPath = 'practiceapi';

const productModal = {
    data () {
        return{
            tempProduct:{},
        };
    },
    template:'#userProductModal',
}

const app = {
    data(){
        return{
            products:[],
        }
    },

    methods:{
        getProducts(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
            .then(res=>{
                console.log('產品列表:',res.data.products);
                this.products = res.data.products;
            })
        }
    },

    components:{
        productModal,
    },

    mounted(){
        this.getProducts();
    }
};

createApp(app)
    .mount('#app');
