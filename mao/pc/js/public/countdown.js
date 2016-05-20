!function($,root){
function endDown($el,callback,tplFun){
    if(!$el||$el.attr('endDownInited'))return;
    this.$el=$el;
    this.tpl='';
    var that=this;
    this.callbackFn=callback||function(){};
    this.tplFun=tplFun||function(d,h,m,s){
       return '<em>'+d+'</em>天<em>'+h+'</em>小时<em>'+m+'</em>分<em>'+s+'</em>秒'
    };
    this.endTime=this.$el.attr('endTime');
    this.nowTime=this.$el.attr('nowTime');
    this.$el.attr('endDownInited',1);
    if(!this.$el.length||!this.endTime)return;
    var endtime = new Date(this.endTime);
    var nowtime = this.nowTime?new Date(this.nowTime): (new Date());
    this.TDOA = parseInt((endtime.getTime()-nowtime.getTime())/1000);
    this.showTime();
    this.time= setInterval(function(){
        that.showTime();
    },1000);
};
endDown.prototype.showTime=function (){
    if ( this.TDOA <= 0){
        clearInterval(this.time);
        this.TDOA=0;
        this.callbackFn();
        return;
    }
    function checktime(i){
        if(i < 10){
            i = '0' + i;
        }
        return i;
    }
    var d = parseInt( this.TDOA / 3600 / 24);
    var h = parseInt(( this.TDOA / 3600 ) % 24);
    var m = parseInt(( this.TDOA / 60 ) % 60);
    var s = parseInt( this.TDOA % 60);
    m = checktime(m);
    s = checktime(s);

    this.$el.html(this.tplFun(d,h,m,s));
    this.TDOA--
}
$.fn.endDown=function(callback,tplFun){
    $(this).each(function(){
        new endDown($(this),callback,tplFun);
    })
};
}($,window);
