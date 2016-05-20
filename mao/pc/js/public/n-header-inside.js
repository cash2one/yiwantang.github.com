/*头部的，登录逻辑，部分代码拷贝之前，再拼接成本次的*/
window.onLoginOk = null;
window.userLoginInfo = {};
var loginBar = $('#user_bar_login');
var nowPageUrl = window.location.href;
function setLoginBar(){
    if (loginBar.length < 1) {
        return;
    }
    if (window.userLoginInfo['url']) {
        loginBar.html(
            '<div class="head-set-my">'
            + '<div class="head-set-name"><a href="'+ window.userLoginInfo['url'] +'">欢迎您，'+ window.userLoginInfo['nickname'] +'</a></div>'
            + '<div class="head-set-message" id="slide2"><p><i class="set-message-icon"></i></p>'
            + '<em class="head-set-point" id="all_notice"></em>'
            + '<ul class="slideCon">'
            + '<li id="notice_num"><a href="'+ window.URL.iUrl +'/homecp/message/notice/read/1"><span>消息</span><em></em></a></li>'
            + '<li id="atme_num"><a href="'+ window.URL.iUrl +'/homecp/message/user/read/1"><span>@我</span><em></em></a></li>'
            + '<li id="comment_num"><a href="'+ window.URL.iUrl +'/homecp/message/sys/read/1"><span>评论</span><em></em></a></li>'
            + '<li id="follow_num"><a href="'+ window.URL.iUrl+ "/" +window.userLoginInfo['id']+'/friend/list_1_1.html"><span>粉丝</span><em></em></a></li>'
            + '</ul>'
            + '</div>'
            + '<div class="head-set-handle" id="slide3">'
            + '<p><i class="set-handle-icon"></i></p>'
            + '<ul class="slideCon">'
            + '<li><a href="'+ window.URL.iUrl +'/homecp/user/userinfo/">账号设置</a></li>'
            + '<li><a href="'+ window.URL.iUrl +'/homecp/user/catverify/check/">猫友认证</a></li>'
            + '<li><a href="'+ window.URL.iUrl +'?callbackUrl='+nowPageUrl+'&act=logout">退出登录</a></li>'
            + '</ul>'
            + '</div>'
            + '</div>'
        );
        /*我的信息下拉*/
        var slide2 = new Nslide("slide2","head-set-messageCur");

        /*我的设置下拉*/
        var slide3 = new Nslide("slide3","head-set-handleCur");
    }
}

function notLogin(){
    loginBar.html(
        '<div class="head-set-link">'
        +'<a href="'+ window.URL.iUrl +'?callbackUrl='+nowPageUrl+'&act=login#login_wrap" class="head-set-login" title="登录">登录</a>'
        +'<a href="'+ window.URL.iUrl +'?act=register&callbackUrl='+nowPageUrl+'#login_wrap" class="head-set-register" title="注册">注册</a>'
        +'</div>'
    );
}


$(function(){
    if (loginBar.length < 1 || getCookie("EMUSS") == null) {
        notLogin();
        if(typeof window.onLoginOk == 'function') {
            window.onLoginOk({'id':0});
        }
        return false;
    }
    $.ajax({
        type: "GET",
        url: window.URL.iUrl +"/passport/logininfo",
        dataType: "jsonp",
        jsonp: "cb",
        success: function(result){
            if(result['code'] == 0 && result['data'])
            {
                window.userLoginInfo = result['data'];
                setLoginBar();

            }else {
                notLogin();
            }
            if(typeof window.onLoginOk == 'function') {
                window.onLoginOk(result['data']);
            }
        }
    });
});
//通用读取cookie
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function check_msg() {
    $.ajax({
        type: "GET",
        url: window.URL.iUrl + "/message/unreadnum",
        dataType: "jsonp",
        jsonp: "cb",
        success: function(data) {
            if (data) {
                var notice_num = data['data'][1];
                var atme_num = data['data'][2];
                var comment_num = data['data'][3];
                var follow_num = data['data'][4];
                var all_notice = notice_num + atme_num + comment_num + follow_num;
                var ntimer = null;
                clearTimeout(ntimer);
                if (notice_num == 0) {
                    notice_num = "";
                }
                if (atme_num == 0) {
                    atme_num = "";
                }
                if (comment_num == 0) {
                    comment_num = "";
                }
                if (follow_num == 0) {
                    follow_num = "";
                }

                ntimer = setTimeout(function(){
                    $('#notice_num').find('em').text(notice_num);
                    $('#atme_num').find('em').text(atme_num);
                    $('#comment_num').find('em').text(comment_num);
                    $('#follow_num').find('em').text(follow_num);
                    if (all_notice > 0) {
                        $('#all_notice').show();
                    } else {
                        $('#all_notice').hide();
                    }
                },50);
            }
        }
    });
}

if (getCookie('EMUSS')) {
    $(document).ready(function() {
        check_msg();
    });
}

/*内页的搜索框焦点，城市站定位*/
$(function(){
    /*搜索框焦点*/
    $(".n-search-text").on({
        "focus":function(){
            $(this).val("");
            $(this).parent().parent().addClass("n-search-hover")
        },
        "blur":function(){
            var textValue = $.trim($(this).val());
            if(!textValue){
                $(this).val($(this).attr("data-default"));
                $(this).removeAttr("style");
            }
            $(this).parent().parent().removeClass("n-search-hover")
        }
    })

    /*保存城市默认值*/
    var defaultCity = {};
    /*城市拼音 拼接URL*/
    var cityPingying = [];
    /*保存cookie值*/
    var cityCookie = {};

    /*注册热门城市点击*/
    $(".city-location").on({
        "click":function(){
            cityCookie.cityID = $(this).attr("data-id");
            cityCookie.area = $(this).text();
            cityCookie.pinYin = $(this).attr("data-pinyin");
            cityCookie.url = $(this).attr("href");
            $("body").trigger("changeCity",cityCookie);
            $(".city-location-box").css({"display":"none"})
            return false;
        }
    },".city-location-list a");

    /*获取开通城市列表 有的页面域名后面未加上/这里加上*/
    if($(".city-location").length>0){
        $.ajax({
            type: "GET",
            url:window.URL.dealerUrl + "/index.php?c=api&m=getHotCity",
            dataType:"jsonp",
            jsonp:"callback",
            success:function(data){
                var cityArr = [];
                var code = data.code;
                var html = '<div class="city-location-box slideCon">'
                    + '<ul class="city-location-list">';
                if(!code){
                    $.each(data.data,function(){
                        html +=  '<li><a data-pinYin = "'+ this.pinyin + '"data-id="'+ this.cityId +'" target="_blank" href="' + this.url + '">' + this.cityName + '</a></li>';
                        cityArr.push({"cityId":this.cityId,"cityName":this.cityName,"url":this.url})
                        /*设置默认值*/
                        if(this.cityId == 1){
                            defaultCity.cityId = this.cityId;
                            defaultCity.cityName = this.cityName;
                            defaultCity.url = this.url;
                            defaultCity.pinYin = this.pinyin;
                        }
                        cityPingying.push(this.pinyin)
                    })
                }
                html += "</ul></div>";
                $(".city-location").append(html);
                var slide1 = new Nslide("slide1","city-location-cur");
                locationPosition(cityArr,defaultCity);
            },
            error:function(){
                console.log("获取城市失败");
            }
        });

    }

    /*城市站定位*/
    function locationPosition(cityArr,defaultCity){
        var $obj = $("#location-city");
        if(!$.cookie("homePageCityId")){
            $.getJSON('http://loc.emao.com/getareabyip?cb=?',{},
                function(data,status){
                    if(status == 'success'){
                        var thisCityId = data.data.cityID;
                        var flag = false;
                        var index;
                        var cityData = {};
                        for(var i = 0 ; i < cityArr.length ; i++){
                            if(cityArr[i].cityId == thisCityId){
                                flag = true;
                                index = i;
                                break;
                            }
                        }
                        if(flag){
                            cityCookie.cityID = data.data.cityID;
                            cityCookie.area = data.data.area;
                            cityCookie.pinYin = data.data.pinYin;
                            cityCookie.url = cityArr[index].url;
                        }else{
                            cityCookie.cityID = defaultCity.cityID;
                            cityCookie.area = defaultCity.area;
                            cityCookie.pinYin = defaultCity.pinYin;
                            cityCookie.url = defaultCity.url;
                        }
                        $("body").trigger("changeCity",cityCookie);
                    }
                }
            );
        }else{
            cityCookie.cityID = $.cookie("homePageCityId");
            cityCookie.area = $.cookie("homePageCityName");
            cityCookie.pinYin = $.cookie("homePageCityPinYin");
            cityCookie.url = $.cookie("city_URL");
            $("body").trigger("changeCity",cityCookie);
        }
    }
})

/*修改cookie*/
$("body").on("changeCity",function(event,data){
    $.cookie('homePageCityId',data.cityID,{expires:1,path:'/',domain: 'emao.com'});//城市ID
    $.cookie('homePageCityName',data.area,{expires:1,path:'/',domain: 'emao.com'});//城市名称
    $.cookie('homePageCityPinYin',data.pinYin,{expires:1,path:'/',domain: 'emao.com'});//城市对应的拼音
    $.cookie('city_id',data.cityID,{expires:1,path:'/',domain: 'emao.com'});//城市ID
    $.cookie('city_name',data.area,{expires:1,path:'/',domain: 'emao.com'});//城市名称
    $.cookie('city_pinYin',data.pinYin,{expires:1,path:'/',domain: 'emao.com'});//城市对应的拼音
    $.cookie('city_URL',data.url,{expires:1,path:'/',domain: 'emao.com'});//城市对应的拼音
});

/*城市切换*/
$("body").on("changeCity",function(event,data){
    var $cityObj = $("#location-city");
    $cityObj.text(data.area);
    $cityObj.attr("href",data.url);
});

/*修改url*/
$("body").on("changeCity",function(event,data){
    var homePageCityPinYin = $.cookie("homePageCityPinYin");
    if(!homePageCityPinYin||homePageCityPinYin==null||homePageCityPinYin=='') {
        $('#newCarMall').attr('href',window.URL.mallUrl);

    }else{
        $('#newCarMall').attr('href',window.URL.mallUrl+'/city/'+data.pinYin+'/');

    }
});

/**
 * 函数说明:用来做鼠标经过以及退出的特效
 * id:需要初始化的下拉容器id值
 * style:特效需要添加的样式class
 */
function Nslide(id,style){
    this.slidebox = $("#" + id);
    this.slideBoxCon = this.slidebox.find(".slideCon");
    this.addName = style;
    this.init();
}

Nslide.prototype.init=function(){
    var that = this;
    this.slidebox.on({
        "mouseenter":function(){
            that.enter(that,$(this));
        },
        "mouseleave":function(){
            that.leave(that,$(this));
        }
    })
}

Nslide.prototype.enter = function(obj,$obj){
    obj.slideBoxCon.css({
        "display":"block"
    })
    $obj.addClass(obj.addName);
}

Nslide.prototype.leave = function(obj,$obj){
    obj.slideBoxCon.css({
        "display":"none"
    })
    $obj.removeClass(obj.addName);
}


