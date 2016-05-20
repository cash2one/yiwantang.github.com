;(function(){
    function isEmaoHost(url){
        if(url.indexOf("http://mall.emao.com")==0){
            return true;
        }
        if(url.indexOf("http://mall.m.emao.com")==0){
            return true;
        }
        if(url.indexOf("http://i.m.emao.com/register")>-1){
            return true;
        }
        if(url.indexOf("http://i.m.emao.com/login")>-1){
            return true;
        }
        if(url.indexOf("http://passport.emao.com")>-1){
            return true;
        }
        return false;
    }
    function isPassportHost(url){
        if(url.indexOf("http://passport.emao.com")>-1){
            return true;
        }
        if(url.indexOf("http://i.m.emao.com")>-1){
            return true;
        }
    }
    function getReferrer(){
        var referrer = document.referrer||'';
        return getSearch('mall')||getSearch('utm_source')||getSearch('mall_from')||referrer;
    }
    function getSearch(key,url){
        var reg=new RegExp(key+"=([^&=?]+)");
        url=url||location.href;
        var matchList=url.match(reg);
        return matchList?decodeURIComponent(matchList[1]):null;
    }
    var ref=getReferrer();
    if(isEmaoHost(ref))return;
    $.cookie('mall_source',ref,{path:'/',domain: 'emao.com',expires: 7});
})();
