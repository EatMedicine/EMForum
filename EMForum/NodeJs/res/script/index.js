window.onload = function () {
    var vm = new Vue({
        el: '#app',
        data: {
            WebsiteName: "",
            IsShadow: false,
            Lang: {},
            AreaInfo: {}
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
                this.$http.get('http://localhost:14832/api/getallareainfo').then(function (res) {
                    this.AreaInfo = res.body;
                }, function (err) { alert(err); });
            },
            getColor: function (areaInfo) {
                return 'rgb(' + areaInfo.R + ',' + areaInfo.G + ',' + areaInfo.B + ')';
            }

        },
        filters: {
            LangCheck: function (val) {
                if (!val) return 'MISSLANG';
                return val;
            }
        },

    });
    vm.getWebData();
    vm.getLangData();
    //vm.getAreaInfo();
};