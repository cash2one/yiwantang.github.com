/**
 * Created by xiaochao on 2015/12/3.
 */
 



var header={
    init:function(opts){
        var that=this;
        opts=opts||{};
        this.mall_cityId=opts.cityId;
        $('.reg-link,.login-link,.logout-link').each(function(){
            var url='http://i.emao.com/?act='+$(this).attr('act')+'&callbackUrl='+encodeURIComponent(location.href);
            $(this).attr('href',url);
        });
        utils.checkIfLogin(function(json){
            that.updataLogin(json);
        },function(){});
        this.bindEvent();
        this.setCityCookie();
    },
    updataLogin:function(json){
        var $el= $('.ul-hasLogin');
        if(json.code!=9999){
            $('.ul-noLogin').hide();
            $el.find('.avatar img').attr('src',json.data.avatar);
            $el.find('.logined').html(json.data.nickname);
            $el.show();
        }
    },
    setCityCookie:function(){
        if($.cookie('mall_cityId')||!this.mall_cityId)return;
        $.cookie('mall_cityId', this.mall_cityId, { expires: 1, path: '/' });
    },
    bindEvent:function(){
        var that = this;
        var timer=null;
        $('.adress-put').hover(function(){
            clearTimeout(timer);
            $(".adre-tips").show();
        },function(){
            timer=setTimeout(function(){
                $(".adre-tips").hide();
            },300)
        });

    }
};
