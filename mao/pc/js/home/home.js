var $banWrap=$('.ban-wrap'),
    len=$('.slide-img li').length,
    $banner=$('.banner'),
    autoTimer=null,
    $subnumLi=$('.subnum li'),
    $listLi=$('.slide-img li'),
    autoTimer=null;
var app={
    init:function(){
        this.bindEvent();
        this.step=0;
    },
    bindEvent:function(){
        var that=this;
        $(".more-pop,.subCategory").hover(function () {
            clearTimeout(that.hideTimer);

            $(".subCategory").show();
        }, function() {
            that.hideTimer = setTimeout(function () {

                $(".subCategory").hide();
            }, 300);
        });
        $banner.hover(function () {
            clearTimeout(autoTimer);
            $(this).find('.prev, .next').fadeIn();
        },function () {
            $(this).find('.prev, .next').fadeOut();
            clearTimeout(autoTimer);
            autoTimer = window.setInterval(function(){
                that.playRight();
            }, 5000)
        });
        $subnumLi.click(function(){
            var _this=$(this);
            that.slide($(this).index(),_this);
        });
        clearTimeout(autoTimer);
        autoTimer = window.setInterval(function(){that.playRight();}, 5000);
        $banner.find('.next').on('click',function(){

            that.playRight();
            return false;
        });
        $banner.find('.prev').on('click',function(){
            that.playLeft();
            return false;
        });
    },
    slide:function(index,_this){
        var that=this;
        //that.loadImg(index);
        _this.addClass('active').siblings().removeClass('active');
        $listLi.stop(false,true).eq(index).animate({opacity:'1',zIndex:'1'},1000).siblings().animate({opacity:'0',zIndex:'0'},1000);
        clearTimeout(autoTimer);
        this.step = index;
        return false;
    },
    playRight:function(){
        this.step++;
        if(this.step>=len){
            this.step=0
        }
        $listLi.stop(false,true).eq(this.step).animate({opacity:'1',zIndex:'1'},1000).siblings().animate({opacity:'0',zIndex:'0'},1000);
        $subnumLi.eq(this.step).addClass('active').siblings().removeClass('active');

        return false;
    },
    playLeft:function(){
        this.step--;
        if(this.step<=-1){
            this.step=len-1;
        }
        $listLi.stop(false,true).eq(this.step).animate({opacity:'1',zIndex:'1'},1000)
            .siblings().animate({opacity:'0',zIndex:'0'},1000);
        $subnumLi.eq(this.step).addClass('active').siblings().removeClass('active');

        return false;
    },
    loadImg:function(o){
        var $a=$('.slide-list li a');
        var oImg=$a.eq(o).attr('data-src');
        if($a.eq(o).attr('hasload')) return;
        $a.eq(o).css("background-image",'url('+oImg+')').attr('hasload','1')
    }
}