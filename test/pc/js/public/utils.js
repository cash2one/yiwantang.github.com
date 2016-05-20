/**
 * Created by xiaochao on 2015/12/3.
 */
var utils= {
    getLoginUrl: function (url) {
        return 'http://i.emao.com/?act=login&callbackUrl=' + encodeURIComponent(url || location.href);
    },
    checkIfLogin: function (successCallback, noLoginCallback) {
        var that = this;
        noLoginCallback = noLoginCallback || function () {
            location.href = that.getLoginUrl();
        };
        if (!$.cookie("EMUSS")) {
            noLoginCallback();
            return
        };
        $.ajax({
            url: "http://mall.emao.com/?c=common/islogin&a=test",
            dataType: 'jsonp'
        }).then(function (json) {
            if (json.code == 9999) {//未登录
                noLoginCallback(json);
                return;
            }
            successCallback && successCallback(json);
        });
    }
};
