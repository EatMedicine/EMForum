window.onload = function () {
    var vm = new Vue({
        el: '#app',
        data: {
            WebsiteName: "",
            IsShadow: false,
            Lang: {},
            AreaInfo: {},
            IsSortMenuDis: false,
            LoginStatus: false,
            IsMask: false,
            IsSign: false,
            IsLogin: false,
            SignUpData: {
                "username": "",
                "password": "",
                "email": ""
            },
            IsSignError: false
        },
        methods: {
            getWebData: function () {
                this.$http.get('/data/config.json').then(function (res) {
                    this.WebsiteName = res.body.WebsiteName;
                    document.title = res.body.WebsiteName;
                }, function () { });
            },
            getLangData: function () {
                this.$http.get('/data/lang.json').then(function (res) {
                    this.Lang = res.body;
                }, function () { });
            },
            getAreaInfo: function () {
                this.$http.get('/areainfo').then(function (res) {
                    this.AreaInfo = res.body;
                }, function (err) { alert(err); });
            },
            getColor: function (areaInfo) {
                return 'rgb(' + areaInfo.R + ',' + areaInfo.G + ',' + areaInfo.B + ')';
            },
            signUp: function () {
                alert(this.SignUpData.username + "|" + this.SignUpData.password + "|" + this.SignUpData.email);
                var bool = this.IsEmail(this.SignUpData.email);
                if (!bool) {
                    alert("邮箱格式出错");
                    return false;
                }
                if (this.SignUpData.username === "" ||
                    this.SignUpData.password === "" ||
                    this.SignUpData.email === "") {
                    this.IsSignError = true;
                    return false;
                }
                var data = {
                    username: this.SignUpData.username,
                    password: this.SignUpData.password,
                    email: this.SignUpData.email
                };
                this.$http.post('/signup', data, { emulateJSON: true }).then(function (res) {
                    console.log(res.body);
                });
                return true;
            },
            IsEmail: function (email) {
                var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                return reg.test(email);
            }

        },
        computed: {
        },
        filters: {
            LangCheck: function (val) {
                if (!val) return 'MISSLANG';
                return val;
            }
        }

    });
    vm.getWebData();
    vm.getLangData();
    vm.getAreaInfo();
};