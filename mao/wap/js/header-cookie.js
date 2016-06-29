var header={
    init:function(){
        this.setCityCookie();
    },
    setCityCookie:function(){
        if(!window.emao['mall_cityId'])return;
        $.cookie('mall_cityId', window.emao['mall_cityId'], { expires: 1, path: '/' ,domain: 'emao.com'});
    }
};
