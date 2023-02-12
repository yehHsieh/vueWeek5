const { createApp } = Vue;


const app = {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
        }
    },

    methods: {
        login() {
            const url = "https://vue3-course-api.hexschool.io/v2";
            const path = "practiceapi";
            const user = {
                username,
                password
            };
            axios.post(`${url}/admin/signin`, this.user)
                .then((res) => {
                    const { token, expired } = res.data;
                    document.cookie = `hexSchool = ${token};
                    expires = ${expired}`
                    window.location = './cart.html';
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    },

    mounted() {
        console.log("init");
    }
}

createApp(app)
    .mount('#app');


