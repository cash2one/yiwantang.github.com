//__inline('./log/ga.js');
//var base=require('common:widget/ui/base/base.js');

var gotop={
    init:function(){
        var that=this;
        this.$el=$('.rightBar');
        this.$gotop=$('#gotop');
        this.$online=$('.ask-online');
        this.$win=$(window);
        this.elHeight=this.$el.height();
        this.minTop=520;
        this.updata();
        this.bindEvent();
        BizQQWPA&&BizQQWPA.addCustom({aty: '0', a: '0', nameAccount: 4008903881, selector: this.$online[0].id});
        //this.$online.length&&this.getLoginAskLink(function(link){
        //    that.$online.attr('href',link);
        //});


    },
    bindEvent:function(){
        var that=this,timer;
        this.$win.scroll(function(){
            clearTimeout(timer);
            timer=setTimeout(function(){
                that.updata();
            },10)
        });
        this.$win.resize(function(){
            that.updata();
        });
        this.$gotop.click(function(){
            $('html,body').animate({
                scrollTop:0
            },500,function(){
                that.updata();
            })
            //$('html,body').animatePromise({
            //    scrollTop:0
            //},500).then(that.updata.bind(that));
        }); //this.$online.click(ga5.bind(log));

    },
    getLoginAskLink:function(successCallback,noLoginCallback){
        var that=this;
        noLoginCallback=noLoginCallback||function(){
        };
        if(!$.cookie("EMUSS")){
            noLoginCallback();
            return
        };
        $.ajax({
            url:"http://mall.api.emao.com/newcar/public/?c=service&a=onlineTalkUrl&client=1",
            dataType:'jsonp'
        }).then(function(json){
            if (json&&json.data&&json.data.link) {
                successCallback(json.data.link);
                return;
            }
            noLoginCallback(json);
        });

    },
    updata:function(){
        var scrollTop= this.$win.scrollTop();
        scrollTop>0? this.$gotop.show():this.$gotop.hide();
        $('body').hasClass('actCls')&&this.updataBottom();
    },
    updataBottom:function(){
        var scrollTop= this.$win.scrollTop();
        var winHeight=this.$win.height();
        if(this.elHeight+this.minTop>scrollTop+winHeight){
            this.$el.css('bottom',-222);
        }else{
            this.$el.css('bottom',10);
        }

    },
    show:function(){
        this.$el.show();
    },
    hide:function(){
        this.$el.hide();
    }
}
