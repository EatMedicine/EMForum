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
            IsSignError: false,
            SignErrorMsg: ""
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
                //alert(this.SignUpData.username + "|" + this.SignUpData.password + "|" + this.SignUpData.email);
                var bool = this.IsEmail(this.SignUpData.email);
                if (!bool) {
                    alert(this.Lang.ErrorMsg.EmailFormatError);
                    return false;
                }
                if (this.SignUpData.username === "" ||
                    this.SignUpData.password === "" ||
                    this.SignUpData.email === "") {
                    this.SignErrorMsg = this.Lang.ErrorMsg.SignUpInfoMiss;
                    this.IsSignError = true;
                    return false;
                }
                var data = {
                    username: this.SignUpData.username
                };
                this.$http.post('/haveuser', data, { emulateJSON: true }).then(function (res) {
                    if (res.body.status === false) {
                        this.SignErrorMsg = this.Lang.ErrorMsg.UsernameExist;
                        this.IsSignError = true;
                        this.isExist = false;
                        return;
                    }
                    data = {
                        username: this.SignUpData.username,
                        password: this.SignUpData.password,
                        email: this.SignUpData.email
                    };
                    this.$http.post('/signup', data, { emulateJSON: true }).then(function (res) {
                        if (res.body.status === 3) {
                            alert(this.Lang.ErrorMsg.SignUpSuccess);
                        }
                        else {
                            alert(this.Lang.ErrorMsg.SignUpFail);
                        }
                    });
                    //清空
                    this.SignUpData.username = "";
                    this.SignUpData.password = "";
                    this.SignUpData.email = "";
                    this.IsMask = false;
                    this.IsSign = false;
                    return true;
                });

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
                if (!val) return 'MISS_LANG';
                return val;
            }
        }

    });
    vm.getWebData();
    vm.getLangData();
    vm.getAreaInfo();
};